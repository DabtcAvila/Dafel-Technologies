/**
 * DAFEL BANDA AUDIO-REACTIVE ENGINE
 * 
 * Advanced audio analysis and reactive animation system for the Dafel banda SVG.
 * Integrates Web Audio API for real-time audio visualization and synchronized animations.
 * 
 * Features:
 * - Real-time audio analysis (FFT, waveform, frequency bands)
 * - Audio-reactive animations for each layer
 * - Beat detection and rhythm synchronization
 * - Microphone input support
 * - Audio file playback with visualization
 * - Customizable frequency ranges and sensitivity
 * - Visual EQ and spectrum analyzer
 * 
 * @version 1.0.0
 * @author Dafel Technologies
 */

class DafelAudioEngine {
    constructor(svgSelector = '.dafel-banda-animatable', config = {}) {
        this.svg = document.querySelector(svgSelector);
        this.config = {
            fftSize: 2048,
            smoothingTimeConstant: 0.8,
            minDecibels: -90,
            maxDecibels: -10,
            frequencyBands: 8,
            beatThreshold: 0.3,
            sensitivity: 1.0,
            autoGain: true,
            visualMode: 'frequency', // 'frequency', 'waveform', 'bands'
            ...config
        };

        // Audio context and nodes
        this.audioContext = null;
        this.analyser = null;
        this.source = null;
        this.gainNode = null;
        this.compressor = null;
        
        // Audio data arrays
        this.frequencyData = null;
        this.waveformData = null;
        this.frequencyBands = [];
        this.previousBands = [];
        
        // Animation state
        this.isAnalyzing = false;
        this.animationFrame = null;
        this.layers = [];
        this.beatDetector = new BeatDetector(this.config);
        
        // Audio sources
        this.audioElement = null;
        this.mediaStream = null;
        this.isUsingMicrophone = false;

        if (!this.svg) {
            console.error('DafelAudioEngine: SVG element not found');
            return;
        }

        this.init();
    }

    /**
     * Initialize the audio engine
     */
    async init() {
        try {
            await this.setupAudioContext();
            this.setupLayers();
            this.setupFrequencyBands();
            
            console.log('DafelAudioEngine: Initialized');
        } catch (error) {
            console.error('DafelAudioEngine: Initialization failed', error);
        }
    }

    /**
     * Setup Web Audio Context
     */
    async setupAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.config.fftSize;
            this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant;
            this.analyser.minDecibels = this.config.minDecibels;
            this.analyser.maxDecibels = this.config.maxDecibels;
            
            // Create gain node for volume control
            this.gainNode = this.audioContext.createGain();
            
            // Create compressor for dynamic range control
            this.compressor = this.audioContext.createDynamicsCompressor();
            this.compressor.threshold.setValueAtTime(-50, this.audioContext.currentTime);
            this.compressor.knee.setValueAtTime(40, this.audioContext.currentTime);
            this.compressor.ratio.setValueAtTime(12, this.audioContext.currentTime);
            this.compressor.attack.setValueAtTime(0, this.audioContext.currentTime);
            this.compressor.release.setValueAtTime(0.25, this.audioContext.currentTime);
            
            // Initialize data arrays
            const bufferLength = this.analyser.frequencyBinCount;
            this.frequencyData = new Uint8Array(bufferLength);
            this.waveformData = new Uint8Array(bufferLength);
            
            console.log('Web Audio Context initialized');
        } catch (error) {
            throw new Error('Failed to create Audio Context: ' + error.message);
        }
    }

    /**
     * Setup layer references for animation
     */
    setupLayers() {
        const layerElements = this.svg.querySelectorAll('[data-layer]');
        
        layerElements.forEach((element, index) => {
            this.layers.push({
                element: element,
                index: index,
                originalOpacity: parseFloat(element.getAttribute('opacity')) || 1.0,
                baseTransform: element.style.transform || '',
                frequencyRange: this.getFrequencyRangeForLayer(index)
            });
        });
    }

    /**
     * Setup frequency bands for analysis
     */
    setupFrequencyBands() {
        const nyquist = this.audioContext.sampleRate / 2;
        const bandSize = nyquist / this.config.frequencyBands;
        
        for (let i = 0; i < this.config.frequencyBands; i++) {
            this.frequencyBands.push({
                min: i * bandSize,
                max: (i + 1) * bandSize,
                value: 0,
                peak: 0,
                average: 0
            });
            this.previousBands.push(0);
        }
    }

    /**
     * Get frequency range for specific layer
     */
    getFrequencyRangeForLayer(layerIndex) {
        const totalLayers = this.layers.length || 7;
        const bandIndex = Math.floor((layerIndex / totalLayers) * this.config.frequencyBands);
        
        return {
            bandIndex: bandIndex,
            minFreq: this.frequencyBands[bandIndex]?.min || 0,
            maxFreq: this.frequencyBands[bandIndex]?.max || 1000
        };
    }

    /**
     * Start microphone input
     */
    async startMicrophone() {
        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            const constraints = {
                audio: {
                    echoCancellation: false,
                    noiseSuppression: false,
                    autoGainControl: this.config.autoGain
                }
            };

            this.mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
            
            // Connect audio graph
            this.source
                .connect(this.compressor)
                .connect(this.gainNode)
                .connect(this.analyser);
            
            this.isUsingMicrophone = true;
            this.startAnalysis();
            
            console.log('Microphone input started');
        } catch (error) {
            throw new Error('Failed to access microphone: ' + error.message);
        }
    }

    /**
     * Load and play audio file
     */
    async loadAudioFile(file) {
        try {
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }

            // Create audio element
            this.audioElement = new Audio();
            this.audioElement.src = URL.createObjectURL(file);
            this.audioElement.loop = true;
            
            // Create source from audio element
            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            
            // Connect audio graph
            this.source
                .connect(this.compressor)
                .connect(this.gainNode)
                .connect(this.analyser)
                .connect(this.audioContext.destination);
            
            this.isUsingMicrophone = false;
            
            // Auto-play when ready
            this.audioElement.addEventListener('canplaythrough', () => {
                this.audioElement.play();
                this.startAnalysis();
            });
            
            console.log('Audio file loaded');
        } catch (error) {
            throw new Error('Failed to load audio file: ' + error.message);
        }
    }

    /**
     * Start audio analysis and animation
     */
    startAnalysis() {
        if (this.isAnalyzing) return;
        
        this.isAnalyzing = true;
        this.analyze();
        
        console.log('Audio analysis started');
    }

    /**
     * Stop audio analysis
     */
    stopAnalysis() {
        this.isAnalyzing = false;
        
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
        
        // Reset layer styles
        this.layers.forEach(layer => {
            layer.element.style.transform = layer.baseTransform;
            layer.element.style.opacity = layer.originalOpacity;
        });
        
        console.log('Audio analysis stopped');
    }

    /**
     * Main analysis loop
     */
    analyze() {
        if (!this.isAnalyzing) return;

        // Get audio data
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.analyser.getByteTimeDomainData(this.waveformData);
        
        // Update frequency bands
        this.updateFrequencyBands();
        
        // Detect beats
        this.beatDetector.update(this.frequencyBands);
        
        // Update animations based on current visual mode
        switch (this.config.visualMode) {
            case 'frequency':
                this.updateFrequencyAnimations();
                break;
            case 'waveform':
                this.updateWaveformAnimations();
                break;
            case 'bands':
                this.updateBandAnimations();
                break;
        }
        
        // Update beat-responsive animations
        if (this.beatDetector.isBeat()) {
            this.triggerBeatAnimation();
        }
        
        this.animationFrame = requestAnimationFrame(() => this.analyze());
    }

    /**
     * Update frequency band values
     */
    updateFrequencyBands() {
        const binCount = this.frequencyData.length;
        const nyquist = this.audioContext.sampleRate / 2;
        
        this.frequencyBands.forEach((band, index) => {
            const startBin = Math.floor((band.min / nyquist) * binCount);
            const endBin = Math.floor((band.max / nyquist) * binCount);
            
            let sum = 0;
            let peak = 0;
            
            for (let bin = startBin; bin <= endBin; bin++) {
                const value = this.frequencyData[bin] / 255;
                sum += value;
                peak = Math.max(peak, value);
            }
            
            band.value = sum / (endBin - startBin + 1);
            band.peak = peak;
            band.average = band.average * 0.9 + band.value * 0.1; // Smoothing
        });
    }

    /**
     * Update animations based on frequency data
     */
    updateFrequencyAnimations() {
        this.layers.forEach((layer, index) => {
            const freqRange = layer.frequencyRange;
            const band = this.frequencyBands[freqRange.bandIndex];
            
            if (!band) return;
            
            const intensity = band.value * this.config.sensitivity;
            const peak = band.peak * this.config.sensitivity;
            
            // Transform based on frequency intensity
            const scale = 1 + intensity * 0.3;
            const translateY = intensity * -50;
            const opacity = layer.originalOpacity + peak * 0.3;
            
            // Apply transformations
            layer.element.style.transform = `${layer.baseTransform} 
                scale(${scale}) 
                translateY(${translateY}px)`;
            layer.element.style.opacity = Math.min(opacity, 1);
            
            // Add frequency-specific effects
            if (intensity > 0.7) {
                layer.element.style.filter = `brightness(${1 + intensity * 0.5})`;
            } else {
                layer.element.style.filter = '';
            }
        });
    }

    /**
     * Update animations based on waveform data
     */
    updateWaveformAnimations() {
        // Calculate RMS and peak from waveform
        let rms = 0;
        let peak = 0;
        
        for (let i = 0; i < this.waveformData.length; i++) {
            const sample = (this.waveformData[i] - 128) / 128;
            rms += sample * sample;
            peak = Math.max(peak, Math.abs(sample));
        }
        
        rms = Math.sqrt(rms / this.waveformData.length);
        
        this.layers.forEach((layer, index) => {
            const layerIntensity = rms * this.config.sensitivity;
            const layerPeak = peak * this.config.sensitivity;
            
            // Create wave-like motion
            const waveOffset = Math.sin(Date.now() * 0.01 + index * 0.5) * layerIntensity * 30;
            const scale = 1 + layerPeak * 0.2;
            
            layer.element.style.transform = `${layer.baseTransform} 
                translateX(${waveOffset}px) 
                scale(${scale})`;
            layer.element.style.opacity = layer.originalOpacity + layerIntensity * 0.4;
        });
    }

    /**
     * Update animations based on frequency bands
     */
    updateBandAnimations() {
        this.layers.forEach((layer, index) => {
            const bandIndex = index % this.frequencyBands.length;
            const band = this.frequencyBands[bandIndex];
            const intensity = band.value * this.config.sensitivity;
            
            // Each layer responds to different frequency band
            const rotation = intensity * 10 * (index % 2 === 0 ? 1 : -1);
            const scale = 1 + intensity * 0.4;
            const skew = intensity * 5;
            
            layer.element.style.transform = `${layer.baseTransform} 
                rotate(${rotation}deg) 
                scale(${scale}) 
                skewX(${skew}deg)`;
            layer.element.style.opacity = layer.originalOpacity + intensity * 0.5;
        });
    }

    /**
     * Trigger beat-responsive animation
     */
    triggerBeatAnimation() {
        const beatIntensity = this.beatDetector.getIntensity();
        
        this.layers.forEach((layer, index) => {
            // Flash effect on beat
            const flashOpacity = layer.originalOpacity + beatIntensity * 0.6;
            const pulseSacle = 1 + beatIntensity * 0.3;
            
            layer.element.style.opacity = Math.min(flashOpacity, 1);
            layer.element.style.transform = `${layer.baseTransform} scale(${pulseSacle})`;
            
            // Create particle burst on strong beats
            if (beatIntensity > 0.8) {
                this.createBeatParticles(layer.element, beatIntensity);
            }
            
            // Reset after beat animation
            setTimeout(() => {
                layer.element.style.opacity = layer.originalOpacity;
                layer.element.style.transform = layer.baseTransform;
            }, 100);
        });
    }

    /**
     * Create particle effects on beats
     */
    createBeatParticles(layerElement, intensity) {
        const bbox = layerElement.getBBox();
        const particleCount = Math.floor(intensity * 10);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            particle.setAttribute('r', 2 + intensity * 3);
            particle.setAttribute('fill', '#FFFFFF');
            particle.setAttribute('opacity', intensity);
            
            const x = bbox.x + Math.random() * bbox.width;
            const y = bbox.y + Math.random() * bbox.height;
            
            particle.setAttribute('cx', x);
            particle.setAttribute('cy', y);
            
            this.svg.appendChild(particle);
            
            // Animate particle
            const animationDuration = 500;
            const startTime = performance.now();
            
            const animateParticle = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = elapsed / animationDuration;
                
                if (progress >= 1) {
                    this.svg.removeChild(particle);
                    return;
                }
                
                const scale = 1 - progress;
                const opacity = intensity * (1 - progress);
                const offsetY = -progress * 50;
                
                particle.setAttribute('opacity', opacity);
                particle.setAttribute('transform', `translate(0, ${offsetY}) scale(${scale})`);
                
                requestAnimationFrame(animateParticle);
            };
            
            requestAnimationFrame(animateParticle);
        }
    }

    /**
     * Get current audio data for external use
     */
    getAudioData() {
        return {
            frequencyData: Array.from(this.frequencyData),
            waveformData: Array.from(this.waveformData),
            frequencyBands: this.frequencyBands.map(band => ({...band})),
            isBeat: this.beatDetector.isBeat(),
            beatIntensity: this.beatDetector.getIntensity(),
            volume: this.getVolume()
        };
    }

    /**
     * Get current volume level
     */
    getVolume() {
        let sum = 0;
        for (let i = 0; i < this.frequencyData.length; i++) {
            sum += this.frequencyData[i];
        }
        return sum / (this.frequencyData.length * 255);
    }

    /**
     * Set visualization mode
     */
    setVisualMode(mode) {
        if (['frequency', 'waveform', 'bands'].includes(mode)) {
            this.config.visualMode = mode;
            console.log('Visual mode set to:', mode);
        } else {
            console.warn('Invalid visual mode:', mode);
        }
    }

    /**
     * Set sensitivity
     */
    setSensitivity(sensitivity) {
        this.config.sensitivity = Math.max(0.1, Math.min(5.0, sensitivity));
        console.log('Sensitivity set to:', this.config.sensitivity);
    }

    /**
     * Set gain
     */
    setGain(gain) {
        if (this.gainNode) {
            this.gainNode.gain.setValueAtTime(gain, this.audioContext.currentTime);
        }
    }

    /**
     * Stop all audio and clean up
     */
    stop() {
        this.stopAnalysis();
        
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement = null;
        }
        
        if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(track => track.stop());
            this.mediaStream = null;
        }
        
        if (this.source) {
            this.source.disconnect();
            this.source = null;
        }
        
        this.isUsingMicrophone = false;
        
        console.log('Audio engine stopped');
    }

    /**
     * Destroy the audio engine
     */
    destroy() {
        this.stop();
        
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        
        this.layers = [];
        this.frequencyBands = [];
        this.previousBands = [];
        
        console.log('DafelAudioEngine: Destroyed');
    }
}

/**
 * Beat Detection Class
 */
class BeatDetector {
    constructor(config) {
        this.config = config;
        this.history = [];
        this.maxHistory = 44; // About 1 second at 44fps
        this.threshold = config.beatThreshold;
        this.lastBeatTime = 0;
        this.minBeatInterval = 100; // Minimum 100ms between beats
        this.currentBeat = false;
        this.beatIntensity = 0;
    }

    update(frequencyBands) {
        // Calculate energy in low frequencies (bass)
        const bassEnergy = frequencyBands.slice(0, 3).reduce((sum, band) => sum + band.value, 0) / 3;
        
        // Add to history
        this.history.push(bassEnergy);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }
        
        // Calculate average energy
        const avgEnergy = this.history.reduce((sum, val) => sum + val, 0) / this.history.length;
        
        // Detect beat
        const now = performance.now();
        const timeSinceLastBeat = now - this.lastBeatTime;
        
        if (bassEnergy > avgEnergy * (1 + this.threshold) && 
            timeSinceLastBeat > this.minBeatInterval) {
            
            this.currentBeat = true;
            this.beatIntensity = (bassEnergy - avgEnergy) / avgEnergy;
            this.lastBeatTime = now;
            
            // Reset beat flag after short time
            setTimeout(() => {
                this.currentBeat = false;
            }, 50);
        }
    }

    isBeat() {
        return this.currentBeat;
    }

    getIntensity() {
        return Math.min(this.beatIntensity, 1.0);
    }

    setThreshold(threshold) {
        this.threshold = Math.max(0.1, Math.min(2.0, threshold));
    }
}

/**
 * Audio Visualizer UI Component
 */
class AudioVisualizerUI {
    constructor(container, audioEngine) {
        this.container = container;
        this.audioEngine = audioEngine;
        this.canvas = null;
        this.ctx = null;
        this.isVisible = false;
        
        this.createUI();
    }

    createUI() {
        // Create canvas for visualization
        this.canvas = document.createElement('canvas');
        this.canvas.width = 400;
        this.canvas.height = 200;
        this.canvas.style.border = '1px solid #333';
        this.canvas.style.background = '#000';
        this.ctx = this.canvas.getContext('2d');
        
        // Create controls
        const controls = document.createElement('div');
        controls.innerHTML = `
            <div style="margin: 10px 0;">
                <button id="startMic">Start Microphone</button>
                <button id="stopAudio">Stop Audio</button>
                <input type="file" id="audioFile" accept="audio/*">
            </div>
            <div style="margin: 10px 0;">
                <label>Mode: 
                    <select id="visualMode">
                        <option value="frequency">Frequency</option>
                        <option value="waveform">Waveform</option>
                        <option value="bands">Bands</option>
                    </select>
                </label>
                <label style="margin-left: 10px;">Sensitivity: 
                    <input type="range" id="sensitivity" min="0.1" max="3" step="0.1" value="1">
                </label>
            </div>
        `;
        
        this.container.appendChild(controls);
        this.container.appendChild(this.canvas);
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        const startMic = this.container.querySelector('#startMic');
        const stopAudio = this.container.querySelector('#stopAudio');
        const audioFile = this.container.querySelector('#audioFile');
        const visualMode = this.container.querySelector('#visualMode');
        const sensitivity = this.container.querySelector('#sensitivity');
        
        startMic.addEventListener('click', () => {
            this.audioEngine.startMicrophone().catch(console.error);
            this.startVisualization();
        });
        
        stopAudio.addEventListener('click', () => {
            this.audioEngine.stop();
            this.stopVisualization();
        });
        
        audioFile.addEventListener('change', (e) => {
            if (e.target.files[0]) {
                this.audioEngine.loadAudioFile(e.target.files[0]).catch(console.error);
                this.startVisualization();
            }
        });
        
        visualMode.addEventListener('change', (e) => {
            this.audioEngine.setVisualMode(e.target.value);
        });
        
        sensitivity.addEventListener('input', (e) => {
            this.audioEngine.setSensitivity(parseFloat(e.target.value));
        });
    }

    startVisualization() {
        this.isVisible = true;
        this.draw();
    }

    stopVisualization() {
        this.isVisible = false;
    }

    draw() {
        if (!this.isVisible) return;
        
        const audioData = this.audioEngine.getAudioData();
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw frequency bands
        const bandWidth = this.canvas.width / audioData.frequencyBands.length;
        
        audioData.frequencyBands.forEach((band, index) => {
            const x = index * bandWidth;
            const height = band.value * this.canvas.height;
            
            this.ctx.fillStyle = `hsl(${index * 45}, 70%, 50%)`;
            this.ctx.fillRect(x, this.canvas.height - height, bandWidth - 2, height);
        });
        
        // Draw beat indicator
        if (audioData.isBeat) {
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.fillRect(0, 0, this.canvas.width, 10);
        }
        
        requestAnimationFrame(() => this.draw());
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DafelAudioEngine, BeatDetector, AudioVisualizerUI };
}