/**
 * DAFEL BANDA ANIMATION ORCHESTRATOR
 * Advanced animation system for coordinating multiple effects simultaneously
 * Created: 2025-10-08
 * Version: 1.0.0
 */

class DafelAnimationOrchestrator {
    constructor() {
        this.animations = new Map();
        this.timelines = new Map();
        this.activeAnimations = new Set();
        this.globalSettings = {
            duration: 1000,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            fps: 60,
            autoplay: false,
            loop: false,
            direction: 'normal'
        };
        this.performance = {
            frameCount: 0,
            startTime: 0,
            lastFrameTime: 0,
            fps: 0,
            droppedFrames: 0
        };
        this.presets = this.initializePresets();
    }

    /**
     * Initialize animation presets
     */
    initializePresets() {
        return {
            // Basic animations
            wave: {
                name: 'Wave Motion',
                type: 'transform',
                keyframes: [
                    { offset: 0, transform: 'translateY(0px)' },
                    { offset: 0.25, transform: 'translateY(-8px)' },
                    { offset: 0.5, transform: 'translateY(0px)' },
                    { offset: 0.75, transform: 'translateY(-4px)' },
                    { offset: 1, transform: 'translateY(0px)' }
                ],
                duration: 3000,
                easing: 'ease-in-out',
                loop: true
            },
            pulse: {
                name: 'Pulse Effect',
                type: 'opacity',
                keyframes: [
                    { offset: 0, opacity: 0.7, transform: 'scale(1)' },
                    { offset: 0.5, opacity: 1, transform: 'scale(1.05)' },
                    { offset: 1, opacity: 0.7, transform: 'scale(1)' }
                ],
                duration: 2000,
                easing: 'ease-in-out',
                loop: true
            },
            morph: {
                name: 'Path Morphing',
                type: 'path',
                keyframes: [
                    { offset: 0, d: 'original' },
                    { offset: 0.5, d: 'morphed' },
                    { offset: 1, d: 'original' }
                ],
                duration: 4000,
                easing: 'ease-in-out',
                loop: true
            },
            stagger: {
                name: 'Stagger In',
                type: 'stagger',
                keyframes: [
                    { offset: 0, opacity: 0, transform: 'translateY(20px)' },
                    { offset: 1, opacity: 1, transform: 'translateY(0px)' }
                ],
                duration: 800,
                staggerDelay: 150,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            },
            shimmer: {
                name: 'Grid Shimmer',
                type: 'gradient',
                keyframes: [
                    { offset: 0, gradientTransform: 'translateX(-100%)' },
                    { offset: 1, gradientTransform: 'translateX(100%)' }
                ],
                duration: 2500,
                easing: 'ease-in-out',
                loop: true
            },
            parallax: {
                name: 'Parallax Layers',
                type: 'scroll',
                layers: [
                    { selector: '.layer-1', speed: 0.5, direction: 'y' },
                    { selector: '.layer-2', speed: 0.8, direction: 'y' },
                    { selector: '.layer-3', speed: 1.2, direction: 'y' }
                ]
            },
            // Composite animations
            waveAndPulse: {
                name: 'Wave + Pulse Combo',
                type: 'composite',
                animations: ['wave', 'pulse'],
                timing: 'simultaneous'
            },
            morphAndShimmer: {
                name: 'Morph + Shimmer Combo',
                type: 'composite',
                animations: ['morph', 'shimmer'],
                timing: 'sequential',
                gap: 500
            },
            fullSequence: {
                name: 'Complete Animation Sequence',
                type: 'sequence',
                steps: [
                    { animation: 'stagger', delay: 0 },
                    { animation: 'wave', delay: 800 },
                    { animation: 'pulse', delay: 1200 },
                    { animation: 'shimmer', delay: 2000 }
                ],
                loop: true,
                loopDelay: 3000
            }
        };
    }

    /**
     * Register a new animation
     * @param {string} name - Animation name
     * @param {Object} config - Animation configuration
     */
    registerAnimation(name, config) {
        this.animations.set(name, {
            ...config,
            id: this.generateId(),
            registered: Date.now()
        });
        return this;
    }

    /**
     * Create a timeline for coordinating multiple animations
     * @param {string} name - Timeline name
     * @param {Array} sequence - Array of animation steps
     */
    createTimeline(name, sequence) {
        const timeline = {
            id: this.generateId(),
            name,
            sequence,
            duration: 0,
            created: Date.now(),
            status: 'ready'
        };

        // Calculate total duration
        let maxEnd = 0;
        sequence.forEach(step => {
            const animationDuration = step.duration || this.globalSettings.duration;
            const stepEnd = (step.delay || 0) + animationDuration;
            if (stepEnd > maxEnd) maxEnd = stepEnd;
        });
        timeline.duration = maxEnd;

        this.timelines.set(name, timeline);
        return timeline;
    }

    /**
     * Apply animation to SVG element(s)
     * @param {string|Element|NodeList} target - Target element(s)
     * @param {string|Object} animation - Animation name or config
     * @param {Object} options - Additional options
     */
    animate(target, animation, options = {}) {
        const targets = this.normalizeTargets(target);
        const animConfig = typeof animation === 'string' 
            ? this.presets[animation] || this.animations.get(animation)
            : animation;

        if (!animConfig) {
            throw new Error(`Animation not found: ${animation}`);
        }

        const finalConfig = { ...animConfig, ...options };
        const animationId = this.generateId();

        // Handle different animation types
        switch (animConfig.type) {
            case 'composite':
                return this.animateComposite(targets, animConfig, finalConfig, animationId);
            case 'sequence':
                return this.animateSequence(targets, animConfig, finalConfig, animationId);
            case 'stagger':
                return this.animateStagger(targets, animConfig, finalConfig, animationId);
            case 'scroll':
                return this.setupScrollAnimation(targets, animConfig, finalConfig, animationId);
            default:
                return this.animateBasic(targets, animConfig, finalConfig, animationId);
        }
    }

    /**
     * Animate basic single animation
     */
    animateBasic(targets, config, options, animationId) {
        const animations = [];

        targets.forEach((target, index) => {
            const animation = this.createWebAnimation(target, config, options, index);
            animations.push(animation);
            this.activeAnimations.add({
                id: animationId,
                element: target,
                animation,
                config,
                startTime: Date.now()
            });
        });

        return {
            id: animationId,
            animations,
            play: () => animations.forEach(anim => anim.play()),
            pause: () => animations.forEach(anim => anim.pause()),
            cancel: () => animations.forEach(anim => anim.cancel()),
            finish: () => animations.forEach(anim => anim.finish())
        };
    }

    /**
     * Animate composite (multiple simultaneous animations)
     */
    animateComposite(targets, config, options, animationId) {
        const compositeAnimations = [];

        config.animations.forEach(animName => {
            const subConfig = this.presets[animName] || this.animations.get(animName);
            if (subConfig) {
                const anim = this.animateBasic(targets, subConfig, options, `${animationId}_${animName}`);
                compositeAnimations.push(anim);
            }
        });

        return {
            id: animationId,
            type: 'composite',
            animations: compositeAnimations,
            play: () => compositeAnimations.forEach(anim => anim.play()),
            pause: () => compositeAnimations.forEach(anim => anim.pause()),
            cancel: () => compositeAnimations.forEach(anim => anim.cancel()),
            finish: () => compositeAnimations.forEach(anim => anim.finish())
        };
    }

    /**
     * Animate sequence (multiple sequential animations)
     */
    animateSequence(targets, config, options, animationId) {
        const sequencePromises = [];
        let totalDelay = 0;

        config.steps.forEach((step, index) => {
            const stepDelay = step.delay || 0;
            const animConfig = this.presets[step.animation] || this.animations.get(step.animation);
            
            if (animConfig) {
                setTimeout(() => {
                    const anim = this.animateBasic(targets, animConfig, options, `${animationId}_step_${index}`);
                    anim.play();
                }, totalDelay + stepDelay);
                
                totalDelay += stepDelay + (animConfig.duration || this.globalSettings.duration);
            }
        });

        return {
            id: animationId,
            type: 'sequence',
            totalDuration: totalDelay
        };
    }

    /**
     * Animate with stagger effect
     */
    animateStagger(targets, config, options, animationId) {
        const animations = [];
        const staggerDelay = config.staggerDelay || 100;

        targets.forEach((target, index) => {
            const delay = index * staggerDelay;
            const animation = this.createWebAnimation(target, config, { ...options, delay }, index);
            animations.push(animation);
            
            setTimeout(() => animation.play(), delay);
        });

        return {
            id: animationId,
            type: 'stagger',
            animations,
            cancel: () => animations.forEach(anim => anim.cancel())
        };
    }

    /**
     * Setup scroll-based animation
     */
    setupScrollAnimation(targets, config, options, animationId) {
        const scrollHandler = (event) => {
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);
            
            config.layers.forEach(layer => {
                const elements = document.querySelectorAll(layer.selector);
                const offset = scrollPercent * layer.speed * 100;
                
                elements.forEach(el => {
                    if (layer.direction === 'y') {
                        el.style.transform = `translateY(${offset}px)`;
                    } else {
                        el.style.transform = `translateX(${offset}px)`;
                    }
                });
            });
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });
        
        return {
            id: animationId,
            type: 'scroll',
            destroy: () => window.removeEventListener('scroll', scrollHandler)
        };
    }

    /**
     * Create Web Animation API animation
     */
    createWebAnimation(target, config, options, index) {
        const keyframes = this.processKeyframes(config.keyframes, target, config);
        const animationOptions = {
            duration: options.duration || config.duration || this.globalSettings.duration,
            easing: options.easing || config.easing || this.globalSettings.easing,
            fill: 'forwards',
            iterations: config.loop ? Infinity : 1,
            direction: options.direction || config.direction || this.globalSettings.direction,
            delay: options.delay || 0
        };

        const animation = target.animate(keyframes, animationOptions);
        
        // Performance monitoring
        animation.addEventListener('finish', () => {
            this.performance.frameCount++;
        });

        return animation;
    }

    /**
     * Process keyframes for different animation types
     */
    processKeyframes(keyframes, target, config) {
        if (config.type === 'path') {
            return this.processPathKeyframes(keyframes, target);
        } else if (config.type === 'gradient') {
            return this.processGradientKeyframes(keyframes, target);
        }
        
        return keyframes;
    }

    /**
     * Process path morphing keyframes
     */
    processPathKeyframes(keyframes, target) {
        const originalPath = target.getAttribute('d');
        
        return keyframes.map(frame => {
            if (frame.d === 'original') {
                return { ...frame, d: originalPath };
            } else if (frame.d === 'morphed') {
                // Generate morphed path (simplified example)
                return { ...frame, d: this.generateMorphedPath(originalPath) };
            }
            return frame;
        });
    }

    /**
     * Process gradient animation keyframes
     */
    processGradientKeyframes(keyframes, target) {
        // Find associated gradients
        const fill = target.getAttribute('fill');
        if (fill && fill.includes('url(#')) {
            const gradientId = fill.match(/url\(#([^)]+)\)/)[1];
            const gradient = document.getElementById(gradientId);
            
            if (gradient) {
                // Animate gradient transform
                return keyframes.map(frame => ({
                    ...frame,
                    gradientTransform: frame.gradientTransform
                }));
            }
        }
        
        return keyframes;
    }

    /**
     * Generate morphed path (simplified implementation)
     */
    generateMorphedPath(originalPath) {
        // This is a simplified example - real morphing would require path interpolation
        return originalPath.replace(/(\d+)/g, (match) => {
            const num = parseInt(match);
            const variation = (Math.random() - 0.5) * 20; // ±10px variation
            return Math.max(0, num + variation).toFixed(0);
        });
    }

    /**
     * Normalize targets to array of elements
     */
    normalizeTargets(target) {
        if (typeof target === 'string') {
            return Array.from(document.querySelectorAll(target));
        } else if (target instanceof Element) {
            return [target];
        } else if (target instanceof NodeList || Array.isArray(target)) {
            return Array.from(target);
        }
        return [];
    }

    /**
     * Play timeline
     * @param {string} timelineName - Timeline to play
     */
    playTimeline(timelineName) {
        const timeline = this.timelines.get(timelineName);
        if (!timeline) {
            throw new Error(`Timeline not found: ${timelineName}`);
        }

        timeline.status = 'playing';
        timeline.startTime = Date.now();

        timeline.sequence.forEach(step => {
            setTimeout(() => {
                this.animate(step.target, step.animation, step.options);
            }, step.delay || 0);
        });

        // Update status when complete
        setTimeout(() => {
            timeline.status = 'completed';
        }, timeline.duration);

        return timeline;
    }

    /**
     * Stop all animations
     */
    stopAll() {
        this.activeAnimations.forEach(({ animation }) => {
            animation.cancel();
        });
        this.activeAnimations.clear();
    }

    /**
     * Pause all animations
     */
    pauseAll() {
        this.activeAnimations.forEach(({ animation }) => {
            animation.pause();
        });
    }

    /**
     * Resume all animations
     */
    resumeAll() {
        this.activeAnimations.forEach(({ animation }) => {
            animation.play();
        });
    }

    /**
     * Get performance metrics
     */
    getPerformanceMetrics() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.performance.startTime;
        
        if (elapsed > 0) {
            this.performance.fps = (this.performance.frameCount / elapsed) * 1000;
        }

        return {
            ...this.performance,
            activeAnimations: this.activeAnimations.size,
            uptime: elapsed
        };
    }

    /**
     * Create animation preset config
     * @param {string} name - Preset name
     * @param {Object} config - Animation configuration
     */
    createPreset(name, config) {
        this.presets[name] = {
            ...config,
            created: Date.now(),
            custom: true
        };
        return this.presets[name];
    }

    /**
     * Export animation as JSON config
     * @param {string} name - Animation name
     */
    exportAnimationConfig(name) {
        const animation = this.presets[name] || this.animations.get(name);
        if (!animation) {
            throw new Error(`Animation not found: ${name}`);
        }

        return {
            name,
            config: animation,
            timestamp: new Date().toISOString(),
            version: '1.0.0'
        };
    }

    /**
     * Import animation from JSON config
     * @param {Object} configData - Animation configuration data
     */
    importAnimationConfig(configData) {
        if (!configData.name || !configData.config) {
            throw new Error('Invalid animation configuration');
        }

        this.registerAnimation(configData.name, configData.config);
        return configData.name;
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Start performance monitoring
     */
    startPerformanceMonitoring() {
        this.performance.startTime = Date.now();
        this.performance.frameCount = 0;
        
        const monitor = () => {
            const currentTime = Date.now();
            const deltaTime = currentTime - this.performance.lastFrameTime;
            
            if (deltaTime < 16.67) { // 60fps threshold
                this.performance.droppedFrames++;
            }
            
            this.performance.lastFrameTime = currentTime;
            
            if (this.activeAnimations.size > 0) {
                requestAnimationFrame(monitor);
            }
        };
        
        requestAnimationFrame(monitor);
    }

    /**
     * Get available presets
     */
    getPresets() {
        return Object.keys(this.presets);
    }

    /**
     * Get preset configuration
     * @param {string} name - Preset name
     */
    getPresetConfig(name) {
        return this.presets[name];
    }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DafelAnimationOrchestrator;
} else {
    window.DafelAnimationOrchestrator = DafelAnimationOrchestrator;
}