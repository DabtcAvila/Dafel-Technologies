/**
 * DAFEL BANDA MORPHING ENGINE
 * 
 * Advanced shape morphing and path interpolation system for the Dafel banda SVG.
 * Enables smooth transitions between different band configurations and patterns.
 * 
 * Features:
 * - SVG path morphing with interpolation
 * - Shape transition animations
 * - Pattern generation and morphing
 * - Curve transformation
 * - Adaptive path optimization
 * - Smooth gradient transitions
 * 
 * @version 1.0.0
 * @author Dafel Technologies
 */

class DafelMorphEngine {
    constructor(svgSelector = '.dafel-banda-animatable', config = {}) {
        this.svg = document.querySelector(svgSelector);
        this.config = {
            morphDuration: 2000,
            easing: 'easeInOutCubic',
            precision: 100,
            autoOptimize: true,
            morphOnHover: false,
            smoothing: 0.5,
            ...config
        };

        // Morphing state
        this.morphTargets = new Map();
        this.originalPaths = new Map();
        this.activeMorphs = new Set();
        this.pathParser = new SVGPathParser();
        this.interpolator = new PathInterpolator();

        if (!this.svg) {
            console.error('DafelMorphEngine: SVG element not found');
            return;
        }

        this.init();
    }

    /**
     * Initialize the morphing engine
     */
    init() {
        this.storePaths();
        this.generateMorphTargets();
        this.setupEventListeners();
        
        console.log('DafelMorphEngine: Initialized with', this.originalPaths.size, 'paths');
    }

    /**
     * Store all original paths
     */
    storePaths() {
        const paths = this.svg.querySelectorAll('path[id]');
        
        paths.forEach(path => {
            const id = path.id;
            const d = path.getAttribute('d');
            
            if (d) {
                this.originalPaths.set(id, {
                    element: path,
                    originalPath: d,
                    parsedPath: this.pathParser.parse(d),
                    bounds: this.getPathBounds(d)
                });
            }
        });
    }

    /**
     * Generate various morph targets for each path
     */
    generateMorphTargets() {
        this.originalPaths.forEach((pathData, id) => {
            const targets = {
                wave: this.generateWaveVariant(pathData),
                smooth: this.generateSmoothVariant(pathData),
                angular: this.generateAngularVariant(pathData),
                flowing: this.generateFlowingVariant(pathData),
                compressed: this.generateCompressedVariant(pathData),
                expanded: this.generateExpandedVariant(pathData),
                spiral: this.generateSpiralVariant(pathData),
                organic: this.generateOrganicVariant(pathData)
            };
            
            this.morphTargets.set(id, targets);
        });
    }

    /**
     * Generate wave variant
     */
    generateWaveVariant(pathData) {
        const parsed = pathData.parsedPath;
        const waveAmplitude = 30;
        const waveFrequency = 0.003;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const wave = Math.sin(point.x * waveFrequency + index * 0.1) * waveAmplitude;
            return {
                x: point.x,
                y: point.y + wave * Math.sin((index / totalPoints) * Math.PI)
            };
        });
    }

    /**
     * Generate smooth variant
     */
    generateSmoothVariant(pathData) {
        const parsed = pathData.parsedPath;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const smoothFactor = 0.8;
            const centerY = pathData.bounds.y + pathData.bounds.height / 2;
            
            return {
                x: point.x,
                y: point.y + (centerY - point.y) * (1 - smoothFactor)
            };
        });
    }

    /**
     * Generate angular variant
     */
    generateAngularVariant(pathData) {
        const parsed = pathData.parsedPath;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const segments = 8;
            const segment = Math.floor((index / totalPoints) * segments);
            const segmentProgress = ((index / totalPoints) * segments) % 1;
            
            const angularOffset = segmentProgress < 0.5 ? 
                Math.pow(segmentProgress * 2, 2) * 20 : 
                Math.pow((1 - segmentProgress) * 2, 2) * 20;
            
            return {
                x: point.x,
                y: point.y + (segment % 2 === 0 ? angularOffset : -angularOffset)
            };
        });
    }

    /**
     * Generate flowing variant
     */
    generateFlowingVariant(pathData) {
        const parsed = pathData.parsedPath;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const flow = Math.sin((index / totalPoints) * Math.PI * 3) * 40;
            const verticalFlow = Math.cos((index / totalPoints) * Math.PI * 2) * 15;
            
            return {
                x: point.x + flow * 0.3,
                y: point.y + verticalFlow
            };
        });
    }

    /**
     * Generate compressed variant
     */
    generateCompressedVariant(pathData) {
        const parsed = pathData.parsedPath;
        const compressionFactor = 0.6;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const centerY = pathData.bounds.y + pathData.bounds.height / 2;
            
            return {
                x: point.x,
                y: centerY + (point.y - centerY) * compressionFactor
            };
        });
    }

    /**
     * Generate expanded variant
     */
    generateExpandedVariant(pathData) {
        const parsed = pathData.parsedPath;
        const expansionFactor = 1.4;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const centerY = pathData.bounds.y + pathData.bounds.height / 2;
            
            return {
                x: point.x,
                y: centerY + (point.y - centerY) * expansionFactor
            };
        });
    }

    /**
     * Generate spiral variant
     */
    generateSpiralVariant(pathData) {
        const parsed = pathData.parsedPath;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const spiralTightness = 0.002;
            const spiralAmplitude = 25;
            const angle = point.x * spiralTightness;
            
            return {
                x: point.x + Math.cos(angle) * spiralAmplitude * (index / totalPoints),
                y: point.y + Math.sin(angle) * spiralAmplitude * (index / totalPoints)
            };
        });
    }

    /**
     * Generate organic variant
     */
    generateOrganicVariant(pathData) {
        const parsed = pathData.parsedPath;
        
        return this.transformPath(parsed, (point, index, totalPoints) => {
            const noise1 = this.perlinNoise(point.x * 0.01, index * 0.05) * 30;
            const noise2 = this.perlinNoise(point.x * 0.005, index * 0.02) * 15;
            
            return {
                x: point.x + noise2,
                y: point.y + noise1
            };
        });
    }

    /**
     * Transform path with a function
     */
    transformPath(parsedPath, transformFunction) {
        const points = this.pathParser.getPoints(parsedPath);
        const transformedPoints = points.map((point, index) => 
            transformFunction(point, index, points.length)
        );
        
        return this.pathParser.pointsToPath(transformedPoints);
    }

    /**
     * Morph to a specific variant
     */
    morphTo(pathId, variant, duration = null) {
        const pathData = this.originalPaths.get(pathId);
        const targets = this.morphTargets.get(pathId);
        
        if (!pathData || !targets || !targets[variant]) {
            console.error('DafelMorphEngine: Invalid path or variant', pathId, variant);
            return Promise.reject('Invalid parameters');
        }

        const actualDuration = duration || this.config.morphDuration;
        const targetPath = targets[variant];
        
        return this.animatePath(pathData.element, targetPath, actualDuration);
    }

    /**
     * Morph back to original
     */
    morphToOriginal(pathId, duration = null) {
        const pathData = this.originalPaths.get(pathId);
        
        if (!pathData) {
            console.error('DafelMorphEngine: Path not found', pathId);
            return Promise.reject('Path not found');
        }

        const actualDuration = duration || this.config.morphDuration;
        
        return this.animatePath(pathData.element, pathData.originalPath, actualDuration);
    }

    /**
     * Animate path transformation
     */
    animatePath(element, targetPath, duration) {
        return new Promise((resolve) => {
            const startPath = element.getAttribute('d');
            const startTime = performance.now();
            
            // Parse both paths for interpolation
            const startParsed = this.pathParser.parse(startPath);
            const targetParsed = this.pathParser.parse(targetPath);
            
            // Normalize paths for smooth interpolation
            const normalizedPaths = this.interpolator.normalizePaths(startParsed, targetParsed);
            
            const animate = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                const easedProgress = this.easing[this.config.easing](progress);
                
                // Interpolate between start and target
                const interpolatedPath = this.interpolator.interpolate(
                    normalizedPaths.start,
                    normalizedPaths.target,
                    easedProgress
                );
                
                // Convert back to SVG path string
                const pathString = this.pathParser.pathToString(interpolatedPath);
                element.setAttribute('d', pathString);
                
                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    resolve();
                }
            };
            
            requestAnimationFrame(animate);
        });
    }

    /**
     * Morph all paths simultaneously
     */
    morphAll(variant, duration = null) {
        const promises = [];
        
        this.originalPaths.forEach((pathData, pathId) => {
            promises.push(this.morphTo(pathId, variant, duration));
        });
        
        return Promise.all(promises);
    }

    /**
     * Create morphing sequence
     */
    morphSequence(sequence, delay = 500) {
        return sequence.reduce((promise, step) => {
            return promise.then(() => {
                const { variant, duration, paths } = step;
                
                if (paths) {
                    // Morph specific paths
                    const morphPromises = paths.map(pathId => 
                        this.morphTo(pathId, variant, duration)
                    );
                    return Promise.all(morphPromises);
                } else {
                    // Morph all paths
                    return this.morphAll(variant, duration);
                }
            }).then(() => {
                return new Promise(resolve => setTimeout(resolve, delay));
            });
        }, Promise.resolve());
    }

    /**
     * Create breathing effect
     */
    startBreathing(intensity = 0.2, speed = 2000) {
        const breathe = () => {
            this.morphAll('compressed', speed / 2)
                .then(() => this.morphAll('expanded', speed / 2))
                .then(() => {
                    if (this.activeMorphs.has('breathing')) {
                        setTimeout(breathe, 100);
                    }
                });
        };
        
        this.activeMorphs.add('breathing');
        breathe();
    }

    /**
     * Stop breathing effect
     */
    stopBreathing() {
        this.activeMorphs.delete('breathing');
        return this.morphToOriginalAll();
    }

    /**
     * Create wave animation
     */
    startWaveAnimation(speed = 3000) {
        const variants = ['wave', 'smooth', 'flowing', 'organic'];
        let currentIndex = 0;
        
        const cycle = () => {
            if (!this.activeMorphs.has('wave')) return;
            
            this.morphAll(variants[currentIndex], speed / 4).then(() => {
                currentIndex = (currentIndex + 1) % variants.length;
                setTimeout(cycle, speed / 4);
            });
        };
        
        this.activeMorphs.add('wave');
        cycle();
    }

    /**
     * Stop wave animation
     */
    stopWaveAnimation() {
        this.activeMorphs.delete('wave');
        return this.morphToOriginalAll();
    }

    /**
     * Morph all paths to original
     */
    morphToOriginalAll(duration = null) {
        const promises = [];
        
        this.originalPaths.forEach((pathData, pathId) => {
            promises.push(this.morphToOriginal(pathId, duration));
        });
        
        return Promise.all(promises);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        if (this.config.morphOnHover) {
            this.originalPaths.forEach((pathData, pathId) => {
                pathData.element.addEventListener('mouseenter', () => {
                    this.morphTo(pathId, 'wave');
                });
                
                pathData.element.addEventListener('mouseleave', () => {
                    this.morphToOriginal(pathId);
                });
            });
        }
    }

    /**
     * Get path bounds
     */
    getPathBounds(pathString) {
        const tempPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        tempPath.setAttribute('d', pathString);
        
        const tempSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        tempSvg.appendChild(tempPath);
        document.body.appendChild(tempSvg);
        
        const bounds = tempPath.getBBox();
        document.body.removeChild(tempSvg);
        
        return bounds;
    }

    /**
     * Simple perlin noise implementation
     */
    perlinNoise(x, y) {
        // Simplified noise function for organic shapes
        return Math.sin(x * 12.9898 + y * 78.233) * 43758.5453 % 1;
    }

    /**
     * Easing functions
     */
    easing = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInElastic: t => Math.sin(13 * Math.PI / 2 * t) * Math.pow(2, 10 * (t - 1)),
        easeOutElastic: t => Math.sin(-13 * Math.PI / 2 * (t + 1)) * Math.pow(2, -10 * t) + 1,
        easeInBack: t => t * t * (2.7 * t - 1.7),
        easeOutBack: t => (--t) * t * (2.7 * t + 1.7) + 1
    };

    /**
     * Destroy the morphing engine
     */
    destroy() {
        // Stop all active morphs
        this.activeMorphs.clear();
        
        // Reset all paths to original
        this.morphToOriginalAll(0);
        
        // Clear data
        this.originalPaths.clear();
        this.morphTargets.clear();
        
        console.log('DafelMorphEngine: Destroyed');
    }
}

/**
 * SVG Path Parser Class
 */
class SVGPathParser {
    constructor() {
        this.commandPattern = /[MmLlHhVvCcSsQqTtAaZz]/g;
        this.numberPattern = /-?\d*\.?\d+/g;
    }

    parse(pathString) {
        const commands = [];
        const commandMatches = pathString.match(this.commandPattern) || [];
        
        let currentPos = 0;
        
        commandMatches.forEach(command => {
            const commandIndex = pathString.indexOf(command, currentPos);
            const nextCommandIndex = pathString.indexOf(
                commandMatches[commandMatches.indexOf(command) + 1] || '',
                commandIndex + 1
            );
            
            const commandSection = nextCommandIndex > -1 ? 
                pathString.slice(commandIndex, nextCommandIndex) :
                pathString.slice(commandIndex);
            
            const numbers = commandSection.match(this.numberPattern) || [];
            const params = numbers.slice(1).map(Number); // Skip the command letter
            
            commands.push({
                command: command,
                params: params
            });
            
            currentPos = commandIndex + 1;
        });
        
        return commands;
    }

    getPoints(parsedPath) {
        const points = [];
        let currentX = 0;
        let currentY = 0;
        
        parsedPath.forEach(cmd => {
            switch (cmd.command.toLowerCase()) {
                case 'm':
                    if (cmd.command === 'M') {
                        currentX = cmd.params[0];
                        currentY = cmd.params[1];
                    } else {
                        currentX += cmd.params[0];
                        currentY += cmd.params[1];
                    }
                    points.push({ x: currentX, y: currentY });
                    break;
                    
                case 'l':
                    if (cmd.command === 'L') {
                        currentX = cmd.params[0];
                        currentY = cmd.params[1];
                    } else {
                        currentX += cmd.params[0];
                        currentY += cmd.params[1];
                    }
                    points.push({ x: currentX, y: currentY });
                    break;
                    
                case 'q':
                    // Quadratic bezier
                    if (cmd.command === 'Q') {
                        currentX = cmd.params[2];
                        currentY = cmd.params[3];
                    } else {
                        currentX += cmd.params[2];
                        currentY += cmd.params[3];
                    }
                    points.push({ x: currentX, y: currentY });
                    break;
                    
                case 'c':
                    // Cubic bezier
                    if (cmd.command === 'C') {
                        currentX = cmd.params[4];
                        currentY = cmd.params[5];
                    } else {
                        currentX += cmd.params[4];
                        currentY += cmd.params[5];
                    }
                    points.push({ x: currentX, y: currentY });
                    break;
            }
        });
        
        return points;
    }

    pointsToPath(points) {
        if (points.length === 0) return '';
        
        let path = `M${points[0].x},${points[0].y}`;
        
        for (let i = 1; i < points.length; i++) {
            if (i % 3 === 1 && i + 2 < points.length) {
                // Create smooth curves using quadratic bezier
                const cp = points[i];
                const ep = points[i + 1];
                path += `Q${cp.x},${cp.y} ${ep.x},${ep.y}`;
                i++; // Skip next point as it's already used
            } else {
                path += `L${points[i].x},${points[i].y}`;
            }
        }
        
        return path;
    }

    pathToString(parsedPath) {
        return parsedPath.map(cmd => 
            cmd.command + cmd.params.join(',')
        ).join('');
    }
}

/**
 * Path Interpolation Class
 */
class PathInterpolator {
    normalizePaths(path1, path2) {
        // Ensure both paths have the same number of commands
        const maxLength = Math.max(path1.length, path2.length);
        
        const normalized1 = this.extendPath(path1, maxLength);
        const normalized2 = this.extendPath(path2, maxLength);
        
        return {
            start: normalized1,
            target: normalized2
        };
    }

    extendPath(path, targetLength) {
        const extended = [...path];
        
        while (extended.length < targetLength) {
            // Duplicate the last command to extend the path
            const lastCommand = extended[extended.length - 1];
            extended.push({
                command: lastCommand.command,
                params: [...lastCommand.params]
            });
        }
        
        return extended;
    }

    interpolate(startPath, targetPath, progress) {
        return startPath.map((startCmd, index) => {
            const targetCmd = targetPath[index];
            
            if (!targetCmd) return startCmd;
            
            const interpolatedParams = startCmd.params.map((startParam, paramIndex) => {
                const targetParam = targetCmd.params[paramIndex] || startParam;
                return startParam + (targetParam - startParam) * progress;
            });
            
            return {
                command: startCmd.command,
                params: interpolatedParams
            };
        });
    }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DafelMorphEngine, SVGPathParser, PathInterpolator };
}