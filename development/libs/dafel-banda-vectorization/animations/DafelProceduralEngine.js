/**
 * DAFEL BANDA PROCEDURAL GENERATION ENGINE
 * 
 * Advanced procedural generation system for creating infinite variations
 * of the Dafel banda pattern with mathematical algorithms and noise functions.
 * 
 * Features:
 * - Procedural band pattern generation
 * - Noise-based organic variations
 * - Fractal geometry integration
 * - Color palette generation
 * - Pattern evolution algorithms
 * - Seed-based reproducible results
 * 
 * @version 1.0.0
 * @author Dafel Technologies
 */

class DafelProceduralEngine {
    constructor(svgSelector = '.dafel-banda-animatable', config = {}) {
        this.svg = document.querySelector(svgSelector);
        this.config = {
            seed: Date.now(),
            layers: 7,
            width: 1280,
            height: 720,
            complexity: 0.5,
            organicness: 0.3,
            symmetry: 0.7,
            colorHarmony: 0.8,
            patternEvolution: true,
            fractalDepth: 3,
            noiseScale: 0.01,
            ...config
        };

        // Generation state
        this.currentSeed = this.config.seed;
        this.rng = new SeededRandom(this.currentSeed);
        this.noise = new SimplexNoise(this.currentSeed);
        this.colorGenerator = new ProceduralColorGenerator(this.config);
        this.patternHistory = [];
        this.generationCount = 0;

        // Pattern templates
        this.templates = {
            wave: this.createWaveTemplate.bind(this),
            organic: this.createOrganicTemplate.bind(this),
            geometric: this.createGeometricTemplate.bind(this),
            fractal: this.createFractalTemplate.bind(this),
            flowing: this.createFlowingTemplate.bind(this),
            crystalline: this.createCrystallineTemplate.bind(this),
            neural: this.createNeuralTemplate.bind(this),
            cosmic: this.createCosmicTemplate.bind(this)
        };

        if (!this.svg) {
            console.error('DafelProceduralEngine: SVG element not found');
            return;
        }

        this.init();
    }

    /**
     * Initialize the procedural engine
     */
    init() {
        this.setupCanvas();
        this.generateInitialPattern();
        
        console.log('DafelProceduralEngine: Initialized with seed', this.currentSeed);
    }

    /**
     * Setup the generation canvas
     */
    setupCanvas() {
        // Clear existing paths except original structure
        const existingPaths = this.svg.querySelectorAll('path[id^="path-layer-"]');
        existingPaths.forEach(path => {
            path.setAttribute('data-original', path.getAttribute('d'));
        });
    }

    /**
     * Generate initial pattern
     */
    generateInitialPattern() {
        const pattern = this.generatePattern('wave');
        this.applyPattern(pattern);
        this.patternHistory.push({
            seed: this.currentSeed,
            type: 'wave',
            pattern: pattern,
            timestamp: Date.now()
        });
    }

    /**
     * Generate a new pattern with specified type
     */
    generatePattern(type = 'random') {
        this.generationCount++;
        
        if (type === 'random') {
            const types = Object.keys(this.templates);
            type = types[Math.floor(this.rng.next() * types.length)];
        }

        if (!this.templates[type]) {
            console.warn('DafelProceduralEngine: Unknown pattern type', type);
            type = 'wave';
        }

        console.log('Generating pattern:', type, 'with seed:', this.currentSeed);
        return this.templates[type]();
    }

    /**
     * Create wave-based template
     */
    createWaveTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateWaveLayer(i);
            layers.push(layer);
        }

        return {
            type: 'wave',
            layers: layers,
            colors: this.colorGenerator.generatePalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                organicness: this.config.organicness,
                symmetry: this.config.symmetry
            }
        };
    }

    /**
     * Generate individual wave layer
     */
    generateWaveLayer(layerIndex) {
        const baseY = 200 + layerIndex * 60;
        const amplitude = 20 + this.rng.next() * 40;
        const frequency = 0.003 + this.rng.next() * 0.007;
        const phase = this.rng.next() * Math.PI * 2;
        const complexity = this.config.complexity;
        
        const points = [];
        const step = 20;
        
        // Generate top curve
        for (let x = 60; x <= 1200; x += step) {
            const baseWave = Math.sin(x * frequency + phase) * amplitude;
            const harmonic1 = Math.sin(x * frequency * 2 + phase) * amplitude * 0.3;
            const harmonic2 = Math.sin(x * frequency * 0.5 + phase) * amplitude * 0.2;
            const noiseValue = this.noise.noise2D(x * this.config.noiseScale, layerIndex) * 15;
            
            const y = baseY + baseWave + harmonic1 * complexity + harmonic2 * complexity + noiseValue * this.config.organicness;
            points.push({ x, y });
        }
        
        // Generate bottom curve (mirrored with variation)
        const bottomPoints = [];
        const thickness = 80 + this.rng.next() * 40;
        
        for (let i = points.length - 1; i >= 0; i--) {
            const topPoint = points[i];
            const variation = this.noise.noise2D(topPoint.x * this.config.noiseScale * 2, layerIndex + 100) * 10;
            bottomPoints.push({
                x: topPoint.x,
                y: topPoint.y + thickness + variation
            });
        }
        
        // Combine into closed path
        const allPoints = [...points, ...bottomPoints];
        
        return {
            points: allPoints,
            path: this.pointsToPath(allPoints),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Create organic template
     */
    createOrganicTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateOrganicLayer(i);
            layers.push(layer);
        }

        return {
            type: 'organic',
            layers: layers,
            colors: this.colorGenerator.generateOrganicPalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                organicness: this.config.organicness
            }
        };
    }

    /**
     * Generate organic layer using multiple noise functions
     */
    generateOrganicLayer(layerIndex) {
        const baseY = 180 + layerIndex * 70;
        const points = [];
        const step = 15;
        
        for (let x = 60; x <= 1200; x += step) {
            // Multiple octaves of noise for organic feel
            const noise1 = this.noise.noise2D(x * 0.005, layerIndex * 0.1) * 50;
            const noise2 = this.noise.noise2D(x * 0.02, layerIndex * 0.3) * 20;
            const noise3 = this.noise.noise2D(x * 0.1, layerIndex * 0.5) * 8;
            
            // Growth simulation
            const growth = Math.sin((x / 1200) * Math.PI) * 30;
            
            const y = baseY + noise1 + noise2 + noise3 + growth;
            points.push({ x, y });
        }
        
        // Create organic bottom curve
        const bottomPoints = [];
        const organicThickness = 60 + Math.sin(layerIndex * 0.5) * 30;
        
        for (let i = points.length - 1; i >= 0; i--) {
            const topPoint = points[i];
            const organicVariation = this.noise.noise2D(topPoint.x * 0.01, layerIndex + 50) * 20;
            bottomPoints.push({
                x: topPoint.x,
                y: topPoint.y + organicThickness + organicVariation
            });
        }
        
        return {
            points: [...points, ...bottomPoints],
            path: this.pointsToPath([...points, ...bottomPoints]),
            thickness: organicThickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Create geometric template
     */
    createGeometricTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateGeometricLayer(i);
            layers.push(layer);
        }

        return {
            type: 'geometric',
            layers: layers,
            colors: this.colorGenerator.generateGeometricPalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                symmetry: this.config.symmetry
            }
        };
    }

    /**
     * Generate geometric layer with mathematical precision
     */
    generateGeometricLayer(layerIndex) {
        const baseY = 200 + layerIndex * 50;
        const points = [];
        const segments = 8 + Math.floor(this.rng.next() * 8);
        
        for (let i = 0; i <= segments; i++) {
            const x = 60 + (i / segments) * 1140;
            const segmentPhase = (i / segments) * Math.PI * 2;
            
            // Geometric wave with precise mathematical functions
            const geometric = Math.sin(segmentPhase * 3) * 30 + Math.cos(segmentPhase * 2) * 15;
            const precision = Math.floor(geometric / 5) * 5; // Quantize for geometric feel
            
            const y = baseY + precision;
            points.push({ x, y });
        }
        
        // Create geometric bottom
        const thickness = 70;
        const bottomPoints = [];
        
        for (let i = points.length - 1; i >= 0; i--) {
            bottomPoints.push({
                x: points[i].x,
                y: points[i].y + thickness
            });
        }
        
        return {
            points: [...points, ...bottomPoints],
            path: this.pointsToPath([...points, ...bottomPoints]),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Create fractal template
     */
    createFractalTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateFractalLayer(i);
            layers.push(layer);
        }

        return {
            type: 'fractal',
            layers: layers,
            colors: this.colorGenerator.generateFractalPalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                fractalDepth: this.config.fractalDepth
            }
        };
    }

    /**
     * Generate fractal layer using recursive subdivision
     */
    generateFractalLayer(layerIndex) {
        const baseY = 180 + layerIndex * 60;
        const startPoints = [
            { x: 60, y: baseY },
            { x: 640, y: baseY + 30 },
            { x: 1200, y: baseY }
        ];
        
        // Apply fractal subdivision
        const fractalPoints = this.fractalSubdivision(startPoints, this.config.fractalDepth);
        
        // Create bottom curve
        const thickness = 80;
        const bottomPoints = [];
        
        for (let i = fractalPoints.length - 1; i >= 0; i--) {
            bottomPoints.push({
                x: fractalPoints[i].x,
                y: fractalPoints[i].y + thickness
            });
        }
        
        return {
            points: [...fractalPoints, ...bottomPoints],
            path: this.pointsToPath([...fractalPoints, ...bottomPoints]),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Fractal subdivision algorithm
     */
    fractalSubdivision(points, depth) {
        if (depth <= 0) return points;
        
        const subdivided = [];
        
        for (let i = 0; i < points.length - 1; i++) {
            subdivided.push(points[i]);
            
            // Create midpoint with fractal displacement
            const midX = (points[i].x + points[i + 1].x) / 2;
            const midY = (points[i].y + points[i + 1].y) / 2;
            const displacement = (this.rng.next() - 0.5) * 40 / Math.pow(2, depth);
            
            subdivided.push({
                x: midX,
                y: midY + displacement
            });
        }
        
        subdivided.push(points[points.length - 1]);
        
        return this.fractalSubdivision(subdivided, depth - 1);
    }

    /**
     * Create flowing template
     */
    createFlowingTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateFlowingLayer(i);
            layers.push(layer);
        }

        return {
            type: 'flowing',
            layers: layers,
            colors: this.colorGenerator.generateFlowingPalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                organicness: this.config.organicness
            }
        };
    }

    /**
     * Generate flowing layer with smooth curves
     */
    generateFlowingLayer(layerIndex) {
        const baseY = 200 + layerIndex * 55;
        const points = [];
        const step = 25;
        
        // Create flowing motion using sin/cos combinations
        for (let x = 60; x <= 1200; x += step) {
            const flow1 = Math.sin((x / 200) + layerIndex) * 35;
            const flow2 = Math.cos((x / 150) + layerIndex * 0.5) * 20;
            const flow3 = Math.sin((x / 80) + layerIndex * 1.5) * 10;
            
            const y = baseY + flow1 + flow2 + flow3;
            points.push({ x, y });
        }
        
        // Smooth the curves using cubic interpolation
        const smoothedPoints = this.smoothCurve(points);
        
        // Create flowing bottom
        const thickness = 75 + Math.sin(layerIndex) * 15;
        const bottomPoints = [];
        
        for (let i = smoothedPoints.length - 1; i >= 0; i--) {
            bottomPoints.push({
                x: smoothedPoints[i].x,
                y: smoothedPoints[i].y + thickness
            });
        }
        
        return {
            points: [...smoothedPoints, ...bottomPoints],
            path: this.pointsToPath([...smoothedPoints, ...bottomPoints]),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Create crystalline template
     */
    createCrystallineTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateCrystallineLayer(i);
            layers.push(layer);
        }

        return {
            type: 'crystalline',
            layers: layers,
            colors: this.colorGenerator.generateCrystallinePalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                symmetry: this.config.symmetry
            }
        };
    }

    /**
     * Generate crystalline layer with angular structures
     */
    generateCrystallineLayer(layerIndex) {
        const baseY = 190 + layerIndex * 65;
        const points = [];
        const crystals = 6 + Math.floor(this.rng.next() * 4);
        
        for (let i = 0; i <= crystals; i++) {
            const x = 60 + (i / crystals) * 1140;
            
            // Create crystalline facets
            const facetAngle = (i / crystals) * Math.PI * 2;
            const facetHeight = 20 + Math.abs(Math.sin(facetAngle * 3)) * 40;
            
            const y = baseY + facetHeight;
            points.push({ x, y });
        }
        
        // Add crystal vertices between main points
        const crystallinePoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            crystallinePoints.push(points[i]);
            
            // Add vertex point
            const midX = (points[i].x + points[i + 1].x) / 2;
            const vertexHeight = this.rng.next() * 25;
            crystallinePoints.push({
                x: midX,
                y: points[i].y - vertexHeight
            });
        }
        crystallinePoints.push(points[points.length - 1]);
        
        // Create angular bottom
        const thickness = 60;
        const bottomPoints = [];
        
        for (let i = crystallinePoints.length - 1; i >= 0; i--) {
            bottomPoints.push({
                x: crystallinePoints[i].x,
                y: crystallinePoints[i].y + thickness
            });
        }
        
        return {
            points: [...crystallinePoints, ...bottomPoints],
            path: this.pointsToPath([...crystallinePoints, ...bottomPoints]),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Create neural template
     */
    createNeuralTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateNeuralLayer(i);
            layers.push(layer);
        }

        return {
            type: 'neural',
            layers: layers,
            colors: this.colorGenerator.generateNeuralPalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                organicness: this.config.organicness
            }
        };
    }

    /**
     * Generate neural network-inspired layer
     */
    generateNeuralLayer(layerIndex) {
        const baseY = 200 + layerIndex * 60;
        const points = [];
        const neurons = 10 + Math.floor(this.rng.next() * 10);
        
        // Create neural connections
        for (let i = 0; i <= neurons; i++) {
            const x = 60 + (i / neurons) * 1140;
            
            // Neural activation function (sigmoid-like)
            const activation = 1 / (1 + Math.exp(-((i / neurons) - 0.5) * 10));
            const neuralNoise = this.noise.noise2D(x * 0.01, layerIndex) * 20;
            
            const y = baseY + activation * 50 + neuralNoise;
            points.push({ x, y });
        }
        
        // Add synaptic connections (small bumps)
        const neuralPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            neuralPoints.push(points[i]);
            
            // Random synaptic activity
            if (this.rng.next() > 0.6) {
                const synapseX = points[i].x + (points[i + 1].x - points[i].x) * this.rng.next();
                const synapseY = points[i].y + (this.rng.next() - 0.5) * 15;
                neuralPoints.push({ x: synapseX, y: synapseY });
            }
        }
        neuralPoints.push(points[points.length - 1]);
        
        // Create bottom curve
        const thickness = 70;
        const bottomPoints = [];
        
        for (let i = neuralPoints.length - 1; i >= 0; i--) {
            bottomPoints.push({
                x: neuralPoints[i].x,
                y: neuralPoints[i].y + thickness
            });
        }
        
        return {
            points: [...neuralPoints, ...bottomPoints],
            path: this.pointsToPath([...neuralPoints, ...bottomPoints]),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Create cosmic template
     */
    createCosmicTemplate() {
        const layers = [];
        
        for (let i = 0; i < this.config.layers; i++) {
            const layer = this.generateCosmicLayer(i);
            layers.push(layer);
        }

        return {
            type: 'cosmic',
            layers: layers,
            colors: this.colorGenerator.generateCosmicPalette(this.config.layers),
            metadata: {
                complexity: this.config.complexity,
                organicness: this.config.organicness
            }
        };
    }

    /**
     * Generate cosmic/space-inspired layer
     */
    generateCosmicLayer(layerIndex) {
        const baseY = 180 + layerIndex * 70;
        const points = [];
        const step = 20;
        
        // Create cosmic waves using astronomical functions
        for (let x = 60; x <= 1200; x += step) {
            const stellar = Math.sin(x * 0.01 + layerIndex) * 30;
            const galactic = Math.cos(x * 0.005 + layerIndex * 2) * 20;
            const quantum = this.noise.noise2D(x * 0.02, layerIndex * 0.5) * 15;
            
            // Cosmic void effect
            const voidDisturbance = Math.sin(x * 0.002) * Math.cos(layerIndex) * 25;
            
            const y = baseY + stellar + galactic + quantum + voidDisturbance;
            points.push({ x, y });
        }
        
        // Add cosmic anomalies (random spikes)
        const cosmicPoints = [];
        for (let i = 0; i < points.length - 1; i++) {
            cosmicPoints.push(points[i]);
            
            // Random cosmic events
            if (this.rng.next() > 0.8) {
                const anomalyX = points[i].x + (points[i + 1].x - points[i].x) * this.rng.next();
                const anomalyY = points[i].y + (this.rng.next() - 0.5) * 40;
                cosmicPoints.push({ x: anomalyX, y: anomalyY });
            }
        }
        cosmicPoints.push(points[points.length - 1]);
        
        // Create cosmic bottom
        const thickness = 80 + Math.sin(layerIndex * 0.7) * 20;
        const bottomPoints = [];
        
        for (let i = cosmicPoints.length - 1; i >= 0; i--) {
            const cosmicVariation = this.noise.noise2D(cosmicPoints[i].x * 0.01, layerIndex + 100) * 15;
            bottomPoints.push({
                x: cosmicPoints[i].x,
                y: cosmicPoints[i].y + thickness + cosmicVariation
            });
        }
        
        return {
            points: [...cosmicPoints, ...bottomPoints],
            path: this.pointsToPath([...cosmicPoints, ...bottomPoints]),
            thickness: thickness,
            layerIndex: layerIndex
        };
    }

    /**
     * Apply generated pattern to SVG
     */
    applyPattern(pattern) {
        pattern.layers.forEach((layer, index) => {
            const pathElement = this.svg.querySelector(`#path-layer-${index + 1}`);
            if (pathElement) {
                pathElement.setAttribute('d', layer.path);
                
                // Apply generated colors if available
                if (pattern.colors && pattern.colors[index]) {
                    const gradient = this.createGradient(pattern.colors[index], index);
                    pathElement.setAttribute('fill', `url(#${gradient.id})`);
                }
            }
        });
    }

    /**
     * Create gradient from color data
     */
    createGradient(colorData, index) {
        const defs = this.svg.querySelector('defs');
        const gradientId = `proc-gradient-${index}-${this.generationCount}`;
        
        const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        gradient.setAttribute('id', gradientId);
        gradient.setAttribute('x1', '0%');
        gradient.setAttribute('y1', '0%');
        gradient.setAttribute('x2', '100%');
        gradient.setAttribute('y2', '100%');
        
        colorData.stops.forEach((stop, stopIndex) => {
            const stopElement = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
            stopElement.setAttribute('offset', `${stop.offset}%`);
            stopElement.setAttribute('stop-color', stop.color);
            gradient.appendChild(stopElement);
        });
        
        defs.appendChild(gradient);
        
        return { id: gradientId, element: gradient };
    }

    /**
     * Convert points to SVG path string
     */
    pointsToPath(points) {
        if (points.length === 0) return '';
        
        let path = `M${points[0].x},${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            // Use smooth curves for better visual quality
            if (i % 2 === 1 && i + 1 < points.length) {
                const cp = points[i];
                const ep = points[i + 1];
                path += `Q${cp.x},${cp.y} ${ep.x},${ep.y}`;
                i++; // Skip next point
            } else {
                path += `L${points[i].x},${points[i].y}`;
            }
        }
        
        path += 'Z';
        return path;
    }

    /**
     * Smooth curve using simple interpolation
     */
    smoothCurve(points) {
        if (points.length < 3) return points;
        
        const smoothed = [points[0]];
        
        for (let i = 1; i < points.length - 1; i++) {
            const prev = points[i - 1];
            const current = points[i];
            const next = points[i + 1];
            
            const smoothedPoint = {
                x: current.x,
                y: (prev.y + current.y * 2 + next.y) / 4
            };
            
            smoothed.push(smoothedPoint);
        }
        
        smoothed.push(points[points.length - 1]);
        return smoothed;
    }

    /**
     * Generate new pattern with evolution
     */
    evolvePattern() {
        // Create new seed based on previous patterns
        this.currentSeed = this.evolveGenetic();
        this.rng = new SeededRandom(this.currentSeed);
        this.noise = new SimplexNoise(this.currentSeed);
        
        // Generate evolved pattern
        const pattern = this.generatePattern();
        this.applyPattern(pattern);
        
        // Store in history
        this.patternHistory.push({
            seed: this.currentSeed,
            type: pattern.type,
            pattern: pattern,
            timestamp: Date.now()
        });
        
        // Limit history size
        if (this.patternHistory.length > 50) {
            this.patternHistory.shift();
        }
        
        return pattern;
    }

    /**
     * Genetic algorithm for pattern evolution
     */
    evolveGenetic() {
        if (this.patternHistory.length < 2) {
            return Date.now(); // Random mutation
        }
        
        // Select best patterns (simplified fitness)
        const parents = this.patternHistory.slice(-2);
        
        // Crossover seeds
        const parent1Seed = parents[0].seed;
        const parent2Seed = parents[1].seed;
        
        // Simple crossover: combine bits
        const childSeed = (parent1Seed & 0xFFFF0000) | (parent2Seed & 0x0000FFFF);
        
        // Mutation: flip some bits
        const mutationRate = 0.1;
        let mutatedSeed = childSeed;
        
        for (let i = 0; i < 32; i++) {
            if (Math.random() < mutationRate) {
                mutatedSeed ^= (1 << i);
            }
        }
        
        return mutatedSeed;
    }

    /**
     * Reset to original pattern
     */
    resetToOriginal() {
        const originalPaths = this.svg.querySelectorAll('path[data-original]');
        originalPaths.forEach(path => {
            const original = path.getAttribute('data-original');
            if (original) {
                path.setAttribute('d', original);
            }
        });
    }

    /**
     * Get pattern statistics
     */
    getStatistics() {
        return {
            generationCount: this.generationCount,
            currentSeed: this.currentSeed,
            historyLength: this.patternHistory.length,
            config: { ...this.config }
        };
    }

    /**
     * Export current pattern
     */
    exportPattern() {
        const svgData = new XMLSerializer().serializeToString(this.svg);
        return {
            svg: svgData,
            seed: this.currentSeed,
            timestamp: Date.now(),
            statistics: this.getStatistics()
        };
    }

    /**
     * Destroy the procedural engine
     */
    destroy() {
        this.resetToOriginal();
        this.patternHistory = [];
        
        console.log('DafelProceduralEngine: Destroyed');
    }
}

/**
 * Seeded Random Number Generator
 */
class SeededRandom {
    constructor(seed) {
        this.seed = seed;
    }

    next() {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
    }

    nextInt(min, max) {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }
}

/**
 * Simplified Simplex Noise Implementation
 */
class SimplexNoise {
    constructor(seed = 0) {
        this.grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        
        this.p = [];
        for(let i = 0; i < 256; i++) {
            this.p[i] = Math.floor((seed * 9301 + 49297 + i) % 233280 / 233280 * 256);
        }
        
        this.perm = [];
        for(let i = 0; i < 512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    noise2D(xin, yin) {
        const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
        const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
        
        const s = (xin + yin) * F2;
        const i = Math.floor(xin + s);
        const j = Math.floor(yin + s);
        
        const t = (i + j) * G2;
        const X0 = i - t;
        const Y0 = j - t;
        const x0 = xin - X0;
        const y0 = yin - Y0;
        
        let i1, j1;
        if(x0 > y0) {
            i1 = 1; j1 = 0;
        } else {
            i1 = 0; j1 = 1;
        }
        
        const x1 = x0 - i1 + G2;
        const y1 = y0 - j1 + G2;
        const x2 = x0 - 1.0 + 2.0 * G2;
        const y2 = y0 - 1.0 + 2.0 * G2;
        
        const ii = i & 255;
        const jj = j & 255;
        const gi0 = this.perm[ii + this.perm[jj]] % 12;
        const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 12;
        const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 12;
        
        let t0 = 0.5 - x0*x0 - y0*y0;
        let n0 = t0 < 0 ? 0.0 : Math.pow(t0, 4) * this.dot(this.grad3[gi0], x0, y0);
        
        let t1 = 0.5 - x1*x1 - y1*y1;
        let n1 = t1 < 0 ? 0.0 : Math.pow(t1, 4) * this.dot(this.grad3[gi1], x1, y1);
        
        let t2 = 0.5 - x2*x2 - y2*y2;
        let n2 = t2 < 0 ? 0.0 : Math.pow(t2, 4) * this.dot(this.grad3[gi2], x2, y2);
        
        return 70.0 * (n0 + n1 + n2);
    }

    dot(g, x, y) {
        return g[0] * x + g[1] * y;
    }
}

/**
 * Procedural Color Generator
 */
class ProceduralColorGenerator {
    constructor(config) {
        this.config = config;
        this.rng = new SeededRandom(config.seed);
    }

    generatePalette(layerCount) {
        const palette = [];
        const baseHue = this.rng.next() * 360;
        
        for (let i = 0; i < layerCount; i++) {
            const hue = (baseHue + i * 30) % 360;
            const saturation = 40 + this.rng.next() * 40;
            const lightness = 60 + i * 5;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateOrganicPalette(layerCount) {
        const palette = [];
        const earthTones = [120, 80, 40, 20]; // Green to brown spectrum
        
        for (let i = 0; i < layerCount; i++) {
            const baseHue = earthTones[i % earthTones.length];
            const hue = baseHue + (this.rng.next() - 0.5) * 40;
            const saturation = 30 + this.rng.next() * 50;
            const lightness = 50 + i * 6;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateGeometricPalette(layerCount) {
        const palette = [];
        const primaryColors = [240, 0, 120]; // Blue, Red, Magenta
        
        for (let i = 0; i < layerCount; i++) {
            const hue = primaryColors[i % primaryColors.length];
            const saturation = 70 + this.rng.next() * 20;
            const lightness = 45 + i * 8;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateFractalPalette(layerCount) {
        const palette = [];
        const complexHues = [280, 320, 200, 60]; // Purple, Pink, Cyan, Yellow
        
        for (let i = 0; i < layerCount; i++) {
            const hue = complexHues[i % complexHues.length];
            const saturation = 60 + this.rng.next() * 30;
            const lightness = 40 + i * 10;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateFlowingPalette(layerCount) {
        const palette = [];
        const flowHues = [180, 200, 220, 160]; // Cyan to blue spectrum
        
        for (let i = 0; i < layerCount; i++) {
            const hue = flowHues[i % flowHues.length] + this.rng.next() * 20;
            const saturation = 50 + this.rng.next() * 30;
            const lightness = 55 + i * 5;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateCrystallinePalette(layerCount) {
        const palette = [];
        const crystalHues = [300, 270, 330, 240]; // Purple, violet spectrum
        
        for (let i = 0; i < layerCount; i++) {
            const hue = crystalHues[i % crystalHues.length];
            const saturation = 40 + this.rng.next() * 40;
            const lightness = 65 + i * 4;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateNeuralPalette(layerCount) {
        const palette = [];
        const neuralHues = [30, 45, 60, 15]; // Orange to yellow spectrum
        
        for (let i = 0; i < layerCount; i++) {
            const hue = neuralHues[i % neuralHues.length];
            const saturation = 55 + this.rng.next() * 25;
            const lightness = 50 + i * 7;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    generateCosmicPalette(layerCount) {
        const palette = [];
        const cosmicHues = [260, 280, 300, 240]; // Deep space purples
        
        for (let i = 0; i < layerCount; i++) {
            const hue = cosmicHues[i % cosmicHues.length];
            const saturation = 30 + this.rng.next() * 50;
            const lightness = 25 + i * 8;
            
            palette.push(this.createColorStops(hue, saturation, lightness));
        }
        
        return palette;
    }

    createColorStops(hue, saturation, lightness) {
        return {
            stops: [
                {
                    offset: 0,
                    color: `hsl(${hue}, ${saturation + 20}%, ${lightness + 15}%)`
                },
                {
                    offset: 50,
                    color: `hsl(${hue}, ${saturation}%, ${lightness}%)`
                },
                {
                    offset: 100,
                    color: `hsl(${hue}, ${saturation - 10}%, ${lightness - 10}%)`
                }
            ]
        };
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        DafelProceduralEngine, 
        SeededRandom, 
        SimplexNoise, 
        ProceduralColorGenerator 
    };
}