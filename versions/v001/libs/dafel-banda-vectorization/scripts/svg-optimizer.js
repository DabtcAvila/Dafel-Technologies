/**
 * DAFEL BANDA SVG OPTIMIZATION ENGINE
 * Advanced SVG optimization with 5 levels and performance metrics
 * Created: 2025-10-08
 * Version: 1.0.0
 */

class DafelSvgOptimizer {
    constructor() {
        this.metrics = {};
        this.originalSize = 0;
        this.originalSvg = '';
        this.colorPalette = {
            lightBlue: ['#D0E8F5', '#A8D1E6', '#7DBBDB', '#6FB3D9'],
            mediumBlue: ['#5AAED0', '#3493B8', '#1E7FA4'],
            darkBlue: ['#2B88AA', '#1A6983', '#0E5F7E', '#094A62'],
            green: ['#D5EDB8', '#AAD989', '#7BC77F'],
            teal: ['#5FD4C4', '#3AAFA3', '#1B8F9A']
        };
        this.optimizationLevels = {
            'ultra-light': {
                name: 'Ultra Light',
                description: 'Maximum compression, minimal quality loss',
                decimalPlaces: 0,
                removeComments: true,
                removeMetadata: true,
                simplifyPaths: true,
                mergeGradients: true,
                minifyIds: true,
                removeUnusedDefs: true,
                optimizeFilters: true,
                quantizeColors: true,
                removeViewBox: false,
                targetSize: '3-5KB'
            },
            'light': {
                name: 'Light',
                description: 'Good compression with quality preservation',
                decimalPlaces: 1,
                removeComments: true,
                removeMetadata: true,
                simplifyPaths: true,
                mergeGradients: false,
                minifyIds: true,
                removeUnusedDefs: true,
                optimizeFilters: false,
                quantizeColors: false,
                removeViewBox: false,
                targetSize: '6-8KB'
            },
            'balanced': {
                name: 'Balanced',
                description: 'Optimal balance between size and quality',
                decimalPlaces: 2,
                removeComments: true,
                removeMetadata: false,
                simplifyPaths: false,
                mergeGradients: false,
                minifyIds: false,
                removeUnusedDefs: true,
                optimizeFilters: false,
                quantizeColors: false,
                removeViewBox: false,
                targetSize: '10-15KB'
            },
            'quality': {
                name: 'Quality',
                description: 'High quality with moderate compression',
                decimalPlaces: 3,
                removeComments: false,
                removeMetadata: false,
                simplifyPaths: false,
                mergeGradients: false,
                minifyIds: false,
                removeUnusedDefs: false,
                optimizeFilters: false,
                quantizeColors: false,
                removeViewBox: false,
                targetSize: '20-30KB'
            },
            'maximum': {
                name: 'Maximum Quality',
                description: 'Preserve all details, minimal compression',
                decimalPlaces: 4,
                removeComments: false,
                removeMetadata: false,
                simplifyPaths: false,
                mergeGradients: false,
                minifyIds: false,
                removeUnusedDefs: false,
                optimizeFilters: false,
                quantizeColors: false,
                removeViewBox: false,
                targetSize: '35-50KB'
            }
        };
    }

    /**
     * Load and analyze SVG file
     * @param {string} svgContent - SVG content string
     */
    loadSvg(svgContent) {
        this.originalSvg = svgContent;
        this.originalSize = new Blob([svgContent]).size;
        this.analyzeSvg(svgContent);
        return this;
    }

    /**
     * Analyze SVG structure and content
     * @param {string} svgContent - SVG content
     */
    analyzeSvg(svgContent) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svgContent, 'image/svg+xml');
        const svg = doc.documentElement;

        this.metrics.original = {
            size: this.originalSize,
            elements: svg.querySelectorAll('*').length,
            paths: svg.querySelectorAll('path').length,
            gradients: svg.querySelectorAll('linearGradient, radialGradient').length,
            patterns: svg.querySelectorAll('pattern').length,
            filters: svg.querySelectorAll('filter').length,
            groups: svg.querySelectorAll('g').length,
            defs: svg.querySelectorAll('defs > *').length,
            viewBox: svg.getAttribute('viewBox'),
            dimensions: {
                width: svg.getAttribute('width'),
                height: svg.getAttribute('height')
            }
        };

        // Analyze path complexity
        const paths = svg.querySelectorAll('path');
        let totalPathLength = 0;
        paths.forEach(path => {
            totalPathLength += path.getAttribute('d').length;
        });
        this.metrics.original.avgPathComplexity = totalPathLength / paths.length;

        return this.metrics.original;
    }

    /**
     * Optimize SVG to specified level
     * @param {string} level - Optimization level key
     * @param {Object} customOptions - Custom optimization options
     */
    optimize(level = 'balanced', customOptions = {}) {
        if (!this.optimizationLevels[level]) {
            throw new Error(`Invalid optimization level: ${level}`);
        }

        const options = { ...this.optimizationLevels[level], ...customOptions };
        let optimizedSvg = this.originalSvg;

        // Apply optimizations in order
        optimizedSvg = this.removeComments(optimizedSvg, options);
        optimizedSvg = this.removeMetadata(optimizedSvg, options);
        optimizedSvg = this.optimizePaths(optimizedSvg, options);
        optimizedSvg = this.optimizeGradients(optimizedSvg, options);
        optimizedSvg = this.optimizeIds(optimizedSvg, options);
        optimizedSvg = this.removeUnusedDefs(optimizedSvg, options);
        optimizedSvg = this.optimizeFilters(optimizedSvg, options);
        optimizedSvg = this.quantizeColors(optimizedSvg, options);
        optimizedSvg = this.minifyAttributes(optimizedSvg, options);
        optimizedSvg = this.formatOutput(optimizedSvg, options);

        // Generate metrics
        const optimizedSize = new Blob([optimizedSvg]).size;
        const compression = ((this.originalSize - optimizedSize) / this.originalSize * 100).toFixed(1);

        this.metrics[level] = {
            level: options.name,
            size: optimizedSize,
            compression: `${compression}%`,
            compressionRatio: (this.originalSize / optimizedSize).toFixed(2),
            targetAchieved: this.isTargetAchieved(optimizedSize, options.targetSize),
            performance: this.calculatePerformanceScore(optimizedSvg),
            qualityScore: this.calculateQualityScore(optimizedSvg, options)
        };

        return {
            svg: optimizedSvg,
            metrics: this.metrics[level],
            options: options
        };
    }

    /**
     * Remove comments from SVG
     */
    removeComments(svg, options) {
        if (!options.removeComments) return svg;
        return svg.replace(/<!--[\s\S]*?-->/g, '');
    }

    /**
     * Remove metadata and non-essential attributes
     */
    removeMetadata(svg, options) {
        if (!options.removeMetadata) return svg;
        
        // Remove XML declaration and DOCTYPE
        svg = svg.replace(/<\?xml[^>]*\?>/g, '');
        svg = svg.replace(/<!DOCTYPE[^>]*>/g, '');
        
        // Remove metadata attributes
        svg = svg.replace(/\s*(xmlns:xlink|version|id="[^"]*")\s*=\s*"[^"]*"/g, '');
        
        return svg.trim();
    }

    /**
     * Optimize path data
     */
    optimizePaths(svg, options) {
        if (!options.simplifyPaths) return svg;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const paths = doc.querySelectorAll('path');

        paths.forEach(path => {
            let d = path.getAttribute('d');
            
            // Round coordinates to specified decimal places
            d = this.roundPathCoordinates(d, options.decimalPlaces);
            
            // Remove redundant commands
            d = this.simplifyPathCommands(d);
            
            path.setAttribute('d', d);
        });

        return new XMLSerializer().serializeToString(doc);
    }

    /**
     * Round path coordinates
     */
    roundPathCoordinates(pathData, decimalPlaces) {
        return pathData.replace(/[\d.-]+/g, (match) => {
            const num = parseFloat(match);
            return isNaN(num) ? match : num.toFixed(decimalPlaces);
        });
    }

    /**
     * Simplify path commands
     */
    simplifyPathCommands(pathData) {
        // Remove unnecessary spaces and normalize
        pathData = pathData.replace(/\s+/g, ' ');
        pathData = pathData.replace(/,\s*/g, ',');
        pathData = pathData.replace(/\s*,/g, ',');
        
        // Simplify repeated commands
        pathData = pathData.replace(/([MLHVCSQTAZ])\s*\1+/gi, '$1');
        
        return pathData.trim();
    }

    /**
     * Optimize gradients
     */
    optimizeGradients(svg, options) {
        if (!options.mergeGradients) return svg;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const gradients = doc.querySelectorAll('linearGradient, radialGradient');
        
        // Find and merge identical gradients
        const gradientMap = new Map();
        
        gradients.forEach(gradient => {
            const signature = this.getGradientSignature(gradient);
            if (gradientMap.has(signature)) {
                // Replace references to this gradient with the first one
                const originalId = gradient.getAttribute('id');
                const replacementId = gradientMap.get(signature);
                
                // Update all references
                const references = doc.querySelectorAll(`[fill="url(#${originalId})"], [stroke="url(#${originalId})"]`);
                references.forEach(ref => {
                    if (ref.getAttribute('fill') === `url(#${originalId})`) {
                        ref.setAttribute('fill', `url(#${replacementId})`);
                    }
                    if (ref.getAttribute('stroke') === `url(#${originalId})`) {
                        ref.setAttribute('stroke', `url(#${replacementId})`);
                    }
                });
                
                // Remove the duplicate gradient
                gradient.remove();
            } else {
                gradientMap.set(signature, gradient.getAttribute('id'));
            }
        });

        return new XMLSerializer().serializeToString(doc);
    }

    /**
     * Get gradient signature for comparison
     */
    getGradientSignature(gradient) {
        const stops = Array.from(gradient.querySelectorAll('stop'));
        const stopData = stops.map(stop => 
            `${stop.getAttribute('offset')}:${stop.getAttribute('stop-color')}`
        ).join('|');
        
        const type = gradient.tagName;
        const x1 = gradient.getAttribute('x1') || '';
        const y1 = gradient.getAttribute('y1') || '';
        const x2 = gradient.getAttribute('x2') || '';
        const y2 = gradient.getAttribute('y2') || '';
        const cx = gradient.getAttribute('cx') || '';
        const cy = gradient.getAttribute('cy') || '';
        const r = gradient.getAttribute('r') || '';
        
        return `${type}:${x1},${y1},${x2},${y2},${cx},${cy},${r}:${stopData}`;
    }

    /**
     * Optimize IDs
     */
    optimizeIds(svg, options) {
        if (!options.minifyIds) return svg;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const elementsWithId = doc.querySelectorAll('[id]');
        
        let idCounter = 1;
        const idMap = new Map();

        elementsWithId.forEach(element => {
            const oldId = element.getAttribute('id');
            const newId = `a${idCounter++}`;
            idMap.set(oldId, newId);
            element.setAttribute('id', newId);
        });

        // Update all references
        idMap.forEach((newId, oldId) => {
            const serialized = new XMLSerializer().serializeToString(doc);
            svg = serialized.replace(new RegExp(`url\\(#${oldId}\\)`, 'g'), `url(#${newId})`);
        });

        return svg;
    }

    /**
     * Remove unused definitions
     */
    removeUnusedDefs(svg, options) {
        if (!options.removeUnusedDefs) return svg;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const defs = doc.querySelectorAll('defs > *[id]');
        
        defs.forEach(def => {
            const id = def.getAttribute('id');
            const references = doc.querySelectorAll(`[fill="url(#${id})"], [stroke="url(#${id})"], [filter="url(#${id})"]`);
            
            if (references.length === 0) {
                def.remove();
            }
        });

        return new XMLSerializer().serializeToString(doc);
    }

    /**
     * Optimize filters
     */
    optimizeFilters(svg, options) {
        if (!options.optimizeFilters) return svg;

        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        const filters = doc.querySelectorAll('filter');
        
        filters.forEach(filter => {
            // Simplify filter effects for better performance
            const gaussianBlurs = filter.querySelectorAll('feGaussianBlur');
            gaussianBlurs.forEach(blur => {
                const stdDev = parseFloat(blur.getAttribute('stdDeviation'));
                if (stdDev < 0.5) {
                    blur.remove();
                }
            });
        });

        return new XMLSerializer().serializeToString(doc);
    }

    /**
     * Quantize colors to reduce palette
     */
    quantizeColors(svg, options) {
        if (!options.quantizeColors) return svg;

        // Define color quantization mapping
        const colorMap = new Map();
        
        // Map similar colors to the same value
        Object.values(this.colorPalette).flat().forEach(color => {
            colorMap.set(color.toLowerCase(), color);
        });

        // Apply color quantization
        return svg.replace(/#[0-9a-fA-F]{6}/g, (match) => {
            const color = match.toLowerCase();
            return colorMap.get(color) || match;
        });
    }

    /**
     * Minify attributes
     */
    minifyAttributes(svg, options) {
        // Remove default values
        svg = svg.replace(/\s+fill-rule="nonzero"/g, '');
        svg = svg.replace(/\s+stroke-width="1"/g, '');
        svg = svg.replace(/\s+opacity="1"/g, '');
        
        // Minify numeric values
        svg = svg.replace(/="([0-9]*\.?[0-9]+)"/g, (match, num) => {
            const rounded = parseFloat(num).toFixed(options.decimalPlaces);
            return `="${rounded}"`;
        });

        return svg;
    }

    /**
     * Format final output
     */
    formatOutput(svg, options) {
        // Remove extra whitespace
        svg = svg.replace(/>\s+</g, '><');
        svg = svg.replace(/\s+/g, ' ');
        svg = svg.trim();

        return svg;
    }

    /**
     * Check if target size is achieved
     */
    isTargetAchieved(size, targetRange) {
        const [min, max] = targetRange.split('-').map(s => {
            const num = parseFloat(s);
            const unit = s.slice(-2);
            return unit === 'KB' ? num * 1024 : num;
        });

        return size >= min && size <= max;
    }

    /**
     * Calculate performance score
     */
    calculatePerformanceScore(svg) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(svg, 'image/svg+xml');
        
        let score = 100;
        
        // Deduct points for complex elements
        const paths = doc.querySelectorAll('path').length;
        const gradients = doc.querySelectorAll('linearGradient, radialGradient').length;
        const filters = doc.querySelectorAll('filter').length;
        const groups = doc.querySelectorAll('g').length;
        
        score -= paths * 2;
        score -= gradients * 3;
        score -= filters * 5;
        score -= groups * 1;
        
        return Math.max(score, 0);
    }

    /**
     * Calculate quality score
     */
    calculateQualityScore(svg, options) {
        let score = 100;
        
        // Deduct points based on optimization level
        if (options.removeComments) score -= 5;
        if (options.removeMetadata) score -= 10;
        if (options.simplifyPaths) score -= 15;
        if (options.mergeGradients) score -= 10;
        if (options.minifyIds) score -= 5;
        if (options.quantizeColors) score -= 20;
        
        return Math.max(score, 0);
    }

    /**
     * Generate responsive breakpoint versions
     * @param {string} svg - Optimized SVG
     * @param {Array} breakpoints - Array of breakpoint objects
     */
    generateResponsiveVersions(svg, breakpoints = [
        { name: 'mobile', width: 375, height: 211 },
        { name: 'tablet', width: 768, height: 432 },
        { name: 'desktop', width: 1280, height: 720 },
        { name: 'large', width: 1920, height: 1080 }
    ]) {
        const versions = {};
        
        breakpoints.forEach(bp => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(svg, 'image/svg+xml');
            const svgEl = doc.documentElement;
            
            // Update dimensions
            svgEl.setAttribute('width', bp.width);
            svgEl.setAttribute('height', bp.height);
            svgEl.setAttribute('viewBox', `0 0 ${bp.width} ${bp.height}`);
            
            // Adjust internal scaling if needed
            const serialized = new XMLSerializer().serializeToString(doc);
            versions[bp.name] = {
                svg: serialized,
                size: new Blob([serialized]).size,
                dimensions: { width: bp.width, height: bp.height }
            };
        });
        
        return versions;
    }

    /**
     * Get all optimization results
     */
    getAllOptimizations() {
        const results = {};
        
        Object.keys(this.optimizationLevels).forEach(level => {
            results[level] = this.optimize(level);
        });
        
        return results;
    }

    /**
     * Export metrics as JSON
     */
    exportMetrics() {
        return {
            timestamp: new Date().toISOString(),
            originalSize: this.originalSize,
            metrics: this.metrics,
            summary: this.generateSummary()
        };
    }

    /**
     * Generate summary report
     */
    generateSummary() {
        const levels = Object.keys(this.metrics).filter(k => k !== 'original');
        
        return {
            bestCompression: levels.reduce((best, level) => 
                this.metrics[level].compression > this.metrics[best].compression ? level : best
            ),
            bestPerformance: levels.reduce((best, level) => 
                this.metrics[level].performance > this.metrics[best].performance ? level : best
            ),
            bestQuality: levels.reduce((best, level) => 
                this.metrics[level].qualityScore > this.metrics[best].qualityScore ? level : best
            ),
            recommended: 'balanced' // Default recommendation
        };
    }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DafelSvgOptimizer;
} else {
    window.DafelSvgOptimizer = DafelSvgOptimizer;
}