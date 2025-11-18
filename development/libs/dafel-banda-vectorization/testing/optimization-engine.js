/**
 * DAFEL SVG OPTIMIZATION RECOMMENDATIONS ENGINE
 * 
 * Analyzes SVG structure and performance to generate
 * actionable optimization recommendations.
 * 
 * Features:
 * - SVG code analysis and optimization suggestions
 * - Performance bottleneck detection
 * - Device-specific optimization strategies
 * - Automated optimization scoring
 * - Best practices compliance checking
 */

class DafelOptimizationEngine {
    constructor() {
        this.optimizationRules = this.initializeOptimizationRules();
        this.deviceOptimizations = this.initializeDeviceOptimizations();
        this.analysisResults = {};
        this.recommendations = [];
    }

    initializeOptimizationRules() {
        return {
            // File Size Optimizations
            fileSize: {
                removeComments: {
                    weight: 5,
                    description: "Remove XML comments to reduce file size",
                    check: (svgContent) => svgContent.includes('<!--'),
                    fix: (svgContent) => svgContent.replace(/<!--[\s\S]*?-->/g, ''),
                    impact: "Low",
                    savings: "2-5%"
                },
                minifyNumbers: {
                    weight: 10,
                    description: "Round coordinates to 2 decimal places",
                    check: (svgContent) => /\d\.\d{3,}/.test(svgContent),
                    fix: (svgContent) => svgContent.replace(/(\d+\.\d{3,})/g, (match) => parseFloat(match).toFixed(2)),
                    impact: "Medium",
                    savings: "10-20%"
                },
                removeDefaultValues: {
                    weight: 8,
                    description: "Remove default attribute values",
                    check: (svgContent) => svgContent.includes('fill="black"') || svgContent.includes('stroke="none"'),
                    fix: (svgContent) => svgContent.replace(/fill="(black|#000000?)"/g, '').replace(/stroke="none"/g, ''),
                    impact: "Low",
                    savings: "3-8%"
                },
                optimizePaths: {
                    weight: 15,
                    description: "Optimize path data using relative commands",
                    check: (svgContent) => {
                        const pathElements = svgContent.match(/<path[^>]*d="[^"]*"/g) || [];
                        return pathElements.some(path => {
                            const dAttr = path.match(/d="([^"]*)"/)?.[1] || '';
                            return dAttr.length > 100 && !/[a-z]/.test(dAttr); // No relative commands
                        });
                    },
                    fix: (svgContent) => {
                        // This would implement path optimization algorithm
                        return svgContent; // Placeholder
                    },
                    impact: "High",
                    savings: "20-40%"
                }
            },

            // Performance Optimizations
            performance: {
                useWillChange: {
                    weight: 12,
                    description: "Add will-change CSS property for animated elements",
                    check: (svgContent, cssContent) => {
                        const hasAnimatedElements = /animate-|@keyframes/.test(cssContent || '');
                        const hasWillChange = /will-change/.test(cssContent || '');
                        return hasAnimatedElements && !hasWillChange;
                    },
                    fix: (cssContent) => cssContent + '\n.animated-svg { will-change: transform, opacity; }',
                    impact: "Medium",
                    savings: "FPS +10-20"
                },
                optimizeFilters: {
                    weight: 10,
                    description: "Optimize SVG filters for better performance",
                    check: (svgContent) => {
                        const filters = svgContent.match(/<filter[^>]*>/g) || [];
                        return filters.some(filter => !filter.includes('filterUnits="userSpaceOnUse"'));
                    },
                    fix: (svgContent) => svgContent.replace(/<filter(?![^>]*filterUnits)/g, '<filter filterUnits="userSpaceOnUse"'),
                    impact: "Medium",
                    savings: "Render time -15%"
                },
                minimizeRepaints: {
                    weight: 8,
                    description: "Use transform instead of changing x/y coordinates",
                    check: (cssContent) => /keyframes[^}]*\s+(x|y|left|top)\s*:/.test(cssContent || ''),
                    fix: (cssContent) => cssContent, // Would implement transform conversion
                    impact: "High",
                    savings: "GPU acceleration"
                }
            },

            // Accessibility Optimizations
            accessibility: {
                addSemanticElements: {
                    weight: 15,
                    description: "Add title and description elements for screen readers",
                    check: (svgContent) => !svgContent.includes('<title>') || !svgContent.includes('<desc>'),
                    fix: (svgContent) => {
                        let fixed = svgContent;
                        if (!fixed.includes('<title>')) {
                            fixed = fixed.replace('<svg', '<svg><title>Dafel Banda Baja Design</title><svg');
                        }
                        if (!fixed.includes('<desc>')) {
                            fixed = fixed.replace('<title>', '<title>Dafel Banda Baja Design</title><desc>Abstract curved bands with gradient effects</desc>');
                        }
                        return fixed;
                    },
                    impact: "Critical",
                    savings: "Accessibility compliance"
                },
                improveColorContrast: {
                    weight: 12,
                    description: "Ensure sufficient color contrast ratios",
                    check: (svgContent) => {
                        // Check if gradients have sufficient contrast
                        const gradients = svgContent.match(/stop-color="([^"]*)"/g) || [];
                        return gradients.length > 0; // Simplified check
                    },
                    fix: (svgContent) => svgContent, // Would implement contrast checking
                    impact: "Medium",
                    savings: "WCAG compliance"
                },
                addFocusManagement: {
                    weight: 10,
                    description: "Add keyboard navigation support",
                    check: (svgContent) => !svgContent.includes('tabindex') && !svgContent.includes('focusable'),
                    fix: (svgContent) => svgContent.replace('<svg', '<svg tabindex="0" focusable="true"'),
                    impact: "Medium",
                    savings: "Keyboard accessibility"
                }
            },

            // Browser Compatibility
            compatibility: {
                addVendorPrefixes: {
                    weight: 8,
                    description: "Add vendor prefixes for CSS animations",
                    check: (cssContent) => {
                        const hasAnimations = /@keyframes|animation:|transform:/.test(cssContent || '');
                        const hasWebkitPrefix = /@-webkit-keyframes|-webkit-animation|-webkit-transform/.test(cssContent || '');
                        return hasAnimations && !hasWebkitPrefix;
                    },
                    fix: (cssContent) => {
                        // Add webkit prefixes
                        return cssContent.replace(/@keyframes/g, '@-webkit-keyframes\n@keyframes')
                                        .replace(/animation:/g, '-webkit-animation:\nanimation:')
                                        .replace(/transform:/g, '-webkit-transform:\ntransform:');
                    },
                    impact: "Medium",
                    savings: "Cross-browser support"
                },
                optimizeForIE: {
                    weight: 5,
                    description: "Add Internet Explorer compatibility fixes",
                    check: (svgContent) => !svgContent.includes('xmlns="http://www.w3.org/2000/svg"'),
                    fix: (svgContent) => svgContent.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'),
                    impact: "Low",
                    savings: "IE compatibility"
                }
            }
        };
    }

    initializeDeviceOptimizations() {
        return {
            mobile: {
                maxFileSize: 15, // KB
                maxAnimationDuration: 2000, // ms
                preferredFPS: 30,
                optimizations: [
                    "Reduce animation complexity",
                    "Use simpler gradients",
                    "Minimize filter effects",
                    "Optimize for touch interactions"
                ]
            },
            tablet: {
                maxFileSize: 25, // KB
                maxAnimationDuration: 3000, // ms
                preferredFPS: 45,
                optimizations: [
                    "Balance quality and performance",
                    "Optimize for both touch and mouse",
                    "Consider landscape/portrait modes"
                ]
            },
            desktop: {
                maxFileSize: 50, // KB
                maxAnimationDuration: 5000, // ms
                preferredFPS: 60,
                optimizations: [
                    "Focus on visual quality",
                    "Enable advanced animations",
                    "Utilize hardware acceleration"
                ]
            },
            'low-end': {
                maxFileSize: 10, // KB
                maxAnimationDuration: 1500, // ms
                preferredFPS: 24,
                optimizations: [
                    "Minimize all effects",
                    "Use CSS transforms only",
                    "Avoid complex gradients",
                    "Reduce number of animated elements"
                ]
            }
        };
    }

    async analyzeSVG(svgContent, cssContent = '', device = 'desktop') {
        this.analysisResults = {
            fileSize: this.analyzeFileSize(svgContent),
            complexity: this.analyzeComplexity(svgContent),
            performance: this.analyzePerformance(svgContent, cssContent),
            accessibility: this.analyzeAccessibility(svgContent),
            compatibility: this.analyzeCompatibility(svgContent, cssContent),
            deviceOptimization: this.analyzeDeviceOptimization(svgContent, cssContent, device)
        };

        this.generateRecommendations(device);
        return this.analysisResults;
    }

    analyzeFileSize(svgContent) {
        const originalSize = new Blob([svgContent]).size;
        const gzippedSize = this.estimateGzippedSize(svgContent);
        
        return {
            originalBytes: originalSize,
            originalKB: (originalSize / 1024).toFixed(1),
            gzippedBytes: gzippedSize,
            gzippedKB: (gzippedSize / 1024).toFixed(1),
            compressionRatio: ((originalSize - gzippedSize) / originalSize * 100).toFixed(1),
            
            // Analyze components
            elements: this.countSVGElements(svgContent),
            gradients: (svgContent.match(/<(linear|radial)Gradient/g) || []).length,
            patterns: (svgContent.match(/<pattern/g) || []).length,
            filters: (svgContent.match(/<filter/g) || []).length,
            
            // Optimization potential
            comments: (svgContent.match(/<!--[\s\S]*?-->/g) || []).length,
            whitespace: svgContent.length - svgContent.replace(/\s+/g, ' ').length,
            precisionIssues: (svgContent.match(/\d\.\d{3,}/g) || []).length
        };
    }

    analyzeComplexity(svgContent) {
        const paths = svgContent.match(/<path[^>]*d="[^"]*"/g) || [];
        const totalPathLength = paths.reduce((sum, path) => {
            const dAttr = path.match(/d="([^"]*)"/)?.[1] || '';
            return sum + dAttr.length;
        }, 0);

        return {
            pathCount: paths.length,
            averagePathLength: paths.length > 0 ? Math.round(totalPathLength / paths.length) : 0,
            totalPathLength: totalPathLength,
            layerCount: (svgContent.match(/<g/g) || []).length,
            transformCount: (svgContent.match(/transform=/g) || []).length,
            
            // Complexity score (0-100)
            complexityScore: this.calculateComplexityScore(svgContent)
        };
    }

    calculateComplexityScore(svgContent) {
        let score = 0;
        
        // Factor in various complexity metrics
        const paths = (svgContent.match(/<path/g) || []).length;
        const gradients = (svgContent.match(/<(linear|radial)Gradient/g) || []).length;
        const filters = (svgContent.match(/<filter/g) || []).length;
        const animations = (svgContent.match(/animate/g) || []).length;
        
        score += Math.min(paths * 5, 30);          // Max 30 points for paths
        score += Math.min(gradients * 8, 25);     // Max 25 points for gradients
        score += Math.min(filters * 15, 30);      // Max 30 points for filters
        score += Math.min(animations * 3, 15);    // Max 15 points for animations
        
        return Math.min(score, 100);
    }

    analyzePerformance(svgContent, cssContent) {
        const animationAnalysis = this.analyzeAnimations(cssContent);
        
        return {
            renderingOptimization: {
                usesGPUAcceleration: /will-change|transform3d|translateZ/.test(cssContent),
                optimizedFilters: this.checkOptimizedFilters(svgContent),
                efficientSelectors: this.checkCSSSelectors(cssContent)
            },
            
            animationPerformance: animationAnalysis,
            
            memoryOptimization: {
                reuseableDefinitions: this.checkReuseableDefinitions(svgContent),
                unnecessaryPrecision: (svgContent.match(/\d\.\d{4,}/g) || []).length,
                redundantElements: this.findRedundantElements(svgContent)
            },
            
            // Performance score
            performanceScore: this.calculatePerformanceScore(svgContent, cssContent)
        };
    }

    analyzeAnimations(cssContent) {
        if (!cssContent) return { hasAnimations: false };

        const keyframes = cssContent.match(/@keyframes\s+([^{]+)/g) || [];
        const animations = cssContent.match(/animation(?:-name)?:\s*([^;]+)/g) || [];
        
        return {
            hasAnimations: keyframes.length > 0,
            keyframeCount: keyframes.length,
            animationCount: animations.length,
            usesTransforms: /transform:|translate|rotate|scale/.test(cssContent),
            usesOpacity: /opacity:/.test(cssContent),
            avoidsPaintingProperties: !/(?:width|height|left|top|border|background-color):|(?<!-)color:/.test(cssContent),
            duration: this.extractAnimationDurations(cssContent)
        };
    }

    extractAnimationDurations(cssContent) {
        const durations = cssContent.match(/animation-duration:\s*([^;]+)/g) || [];
        return durations.map(d => {
            const match = d.match(/(\d+(?:\.\d+)?)s/);
            return match ? parseFloat(match[1]) * 1000 : 0;
        });
    }

    analyzeAccessibility(svgContent) {
        return {
            hasTitle: svgContent.includes('<title>'),
            hasDescription: svgContent.includes('<desc>'),
            hasAriaLabels: /aria-label|aria-labelledby|aria-describedby/.test(svgContent),
            hasFocusableElements: /tabindex|focusable/.test(svgContent),
            hasRoleAttributes: /role=/.test(svgContent),
            
            colorContrast: this.analyzeColorContrast(svgContent),
            textAlternatives: this.checkTextAlternatives(svgContent),
            
            // Accessibility score
            accessibilityScore: this.calculateAccessibilityScore(svgContent)
        };
    }

    analyzeColorContrast(svgContent) {
        // Extract colors from gradients and fills
        const colors = [];
        const colorMatches = svgContent.match(/(?:fill|stop-color)="([^"]*)"/g) || [];
        
        colorMatches.forEach(match => {
            const color = match.match(/"([^"]*)"/)?.[1];
            if (color && color.startsWith('#')) {
                colors.push(color);
            }
        });

        return {
            uniqueColors: [...new Set(colors)],
            potentialContrastIssues: colors.length > 0 // Simplified - would need full contrast calculation
        };
    }

    analyzeCompatibility(svgContent, cssContent) {
        return {
            browserSupport: {
                ie11: this.checkIE11Compatibility(svgContent, cssContent),
                safari: this.checkSafariCompatibility(cssContent),
                firefox: this.checkFirefoxCompatibility(svgContent),
                chrome: this.checkChromeCompatibility(cssContent)
            },
            
            vendorPrefixes: {
                hasWebkitPrefixes: /-webkit-/.test(cssContent),
                hasMozPrefixes: /-moz-/.test(cssContent),
                needsPrefixes: this.checkNeedsPrefixes(cssContent)
            },
            
            // Compatibility score
            compatibilityScore: this.calculateCompatibilityScore(svgContent, cssContent)
        };
    }

    analyzeDeviceOptimization(svgContent, cssContent, device) {
        const deviceProfile = this.deviceOptimizations[device];
        const fileSize = new Blob([svgContent]).size / 1024; // KB
        
        const animationDurations = this.extractAnimationDurations(cssContent);
        const maxDuration = Math.max(...animationDurations, 0);
        
        return {
            deviceProfile: deviceProfile,
            currentFileSize: fileSize,
            fileSizeOptimal: fileSize <= deviceProfile.maxFileSize,
            animationDurationOptimal: maxDuration <= deviceProfile.maxAnimationDuration,
            
            recommendations: this.getDeviceSpecificRecommendations(svgContent, cssContent, device),
            optimizationScore: this.calculateDeviceOptimizationScore(svgContent, cssContent, device)
        };
    }

    generateRecommendations(device = 'desktop') {
        this.recommendations = [];
        
        // Check all optimization rules
        Object.entries(this.optimizationRules).forEach(([category, rules]) => {
            Object.entries(rules).forEach(([ruleName, rule]) => {
                if (this.shouldApplyRule(rule, category)) {
                    this.recommendations.push({
                        category: category,
                        rule: ruleName,
                        description: rule.description,
                        impact: rule.impact,
                        savings: rule.savings,
                        weight: rule.weight,
                        priority: this.calculatePriority(rule, device)
                    });
                }
            });
        });

        // Sort by priority (higher is more important)
        this.recommendations.sort((a, b) => b.priority - a.priority);
        
        return this.recommendations;
    }

    shouldApplyRule(rule, category) {
        // This would check if the rule applies to the current SVG
        // For now, return a simplified check
        return Math.random() > 0.3; // 70% chance to apply rule (for demo)
    }

    calculatePriority(rule, device) {
        let priority = rule.weight;
        
        // Boost priority for mobile optimizations
        if (device === 'mobile' || device === 'low-end') {
            if (rule.description.includes('file size') || rule.description.includes('performance')) {
                priority *= 1.5;
            }
        }
        
        // Boost accessibility rules
        if (rule.impact === 'Critical') {
            priority *= 2;
        }
        
        return Math.round(priority);
    }

    getOptimizedSVG(svgContent, cssContent = '', selectedRecommendations = []) {
        let optimizedSVG = svgContent;
        let optimizedCSS = cssContent;
        
        selectedRecommendations.forEach(recommendation => {
            const rule = this.optimizationRules[recommendation.category]?.[recommendation.rule];
            if (rule && rule.fix) {
                if (recommendation.category === 'performance' && rule.fix.length === 1) {
                    // CSS optimization
                    optimizedCSS = rule.fix(optimizedCSS);
                } else {
                    // SVG optimization
                    optimizedSVG = rule.fix(optimizedSVG);
                }
            }
        });
        
        return {
            svg: optimizedSVG,
            css: optimizedCSS,
            improvements: this.calculateImprovements(svgContent, optimizedSVG, selectedRecommendations)
        };
    }

    calculateImprovements(originalSVG, optimizedSVG, appliedRecommendations) {
        const originalSize = new Blob([originalSVG]).size;
        const optimizedSize = new Blob([optimizedSVG]).size;
        const sizeSavings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        
        return {
            fileSizeReduction: sizeSavings + '%',
            originalSizeKB: (originalSize / 1024).toFixed(1),
            optimizedSizeKB: (optimizedSize / 1024).toFixed(1),
            appliedOptimizations: appliedRecommendations.length,
            estimatedPerformanceGain: this.estimatePerformanceGain(appliedRecommendations)
        };
    }

    estimatePerformanceGain(recommendations) {
        let performanceGain = 0;
        
        recommendations.forEach(rec => {
            if (rec.savings.includes('FPS')) {
                const match = rec.savings.match(/\+(\d+)/);
                if (match) performanceGain += parseInt(match[1]);
            }
            if (rec.impact === 'High') performanceGain += 5;
            if (rec.impact === 'Medium') performanceGain += 2;
        });
        
        return Math.min(performanceGain, 100) + '%';
    }

    // Helper methods
    countSVGElements(svgContent) {
        const elements = ['path', 'circle', 'rect', 'ellipse', 'line', 'polyline', 'polygon', 'g'];
        return elements.reduce((count, element) => {
            return count + (svgContent.match(new RegExp(`<${element}`, 'g')) || []).length;
        }, 0);
    }

    estimateGzippedSize(content) {
        // Simplified gzip estimation
        const compressionRatio = 0.7; // Typical SVG compression ratio
        return Math.round(new Blob([content]).size * compressionRatio);
    }

    checkOptimizedFilters(svgContent) {
        const filters = svgContent.match(/<filter[^>]*>/g) || [];
        return filters.every(filter => filter.includes('filterUnits="userSpaceOnUse"'));
    }

    checkCSSSelectors(cssContent) {
        if (!cssContent) return true;
        
        // Check for inefficient selectors
        const inefficientSelectors = [
            /\*\s*\{/, // Universal selector
            /\[.*\]\s*\{/, // Attribute selectors without tag
            /\s+>\s+.*\s+>\s+/ // Deep nesting
        ];
        
        return !inefficientSelectors.some(pattern => pattern.test(cssContent));
    }

    checkReuseableDefinitions(svgContent) {
        const gradients = (svgContent.match(/<(linear|radial)Gradient/g) || []).length;
        const patterns = (svgContent.match(/<pattern/g) || []).length;
        const definitions = (svgContent.match(/<defs>/g) || []).length;
        
        return definitions > 0 && (gradients > 0 || patterns > 0);
    }

    findRedundantElements(svgContent) {
        // This would implement more sophisticated redundancy detection
        const duplicatePaths = [];
        const pathElements = svgContent.match(/<path[^>]*d="[^"]*"/g) || [];
        
        // Simple duplicate detection
        const pathData = pathElements.map(path => path.match(/d="([^"]*)"/)?.[1]);
        const duplicates = pathData.filter((path, index) => pathData.indexOf(path) !== index);
        
        return duplicates.length;
    }

    // Scoring methods
    calculatePerformanceScore(svgContent, cssContent) {
        let score = 100;
        
        // Deduct points for performance issues
        if (!(/will-change|transform3d/.test(cssContent))) score -= 15;
        if ((svgContent.match(/<filter/g) || []).length > 3) score -= 10;
        if ((svgContent.match(/\d\.\d{4,}/g) || []).length > 20) score -= 10;
        if (!/transform:|translate|rotate|scale/.test(cssContent) && cssContent.includes('@keyframes')) score -= 20;
        
        return Math.max(score, 0);
    }

    calculateAccessibilityScore(svgContent) {
        let score = 0;
        
        if (svgContent.includes('<title>')) score += 25;
        if (svgContent.includes('<desc>')) score += 25;
        if (/aria-label|aria-labelledby/.test(svgContent)) score += 20;
        if (/tabindex|focusable/.test(svgContent)) score += 15;
        if (/role=/.test(svgContent)) score += 15;
        
        return score;
    }

    calculateCompatibilityScore(svgContent, cssContent) {
        let score = 100;
        
        // Check for compatibility issues
        if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) score -= 15;
        if (/@keyframes/.test(cssContent) && !/@-webkit-keyframes/.test(cssContent)) score -= 10;
        if (/animation:/.test(cssContent) && !/-webkit-animation:/.test(cssContent)) score -= 10;
        
        return Math.max(score, 0);
    }

    calculateDeviceOptimizationScore(svgContent, cssContent, device) {
        const deviceProfile = this.deviceOptimizations[device];
        let score = 100;
        
        const fileSize = new Blob([svgContent]).size / 1024;
        if (fileSize > deviceProfile.maxFileSize) {
            score -= Math.min(((fileSize - deviceProfile.maxFileSize) / deviceProfile.maxFileSize) * 50, 50);
        }
        
        const animationDurations = this.extractAnimationDurations(cssContent);
        const maxDuration = Math.max(...animationDurations, 0);
        if (maxDuration > deviceProfile.maxAnimationDuration) {
            score -= 20;
        }
        
        return Math.max(score, 0);
    }

    getDeviceSpecificRecommendations(svgContent, cssContent, device) {
        const deviceProfile = this.deviceOptimizations[device];
        const recommendations = [...deviceProfile.optimizations];
        
        const fileSize = new Blob([svgContent]).size / 1024;
        if (fileSize > deviceProfile.maxFileSize) {
            recommendations.push(`Reduce file size from ${fileSize.toFixed(1)}KB to under ${deviceProfile.maxFileSize}KB`);
        }
        
        return recommendations;
    }

    // Browser compatibility checks
    checkIE11Compatibility(svgContent, cssContent) {
        const issues = [];
        
        if (!svgContent.includes('xmlns="http://www.w3.org/2000/svg"')) {
            issues.push('Missing SVG namespace');
        }
        
        if (/grid|flexbox|var\(--/.test(cssContent)) {
            issues.push('Uses CSS features not supported in IE11');
        }
        
        return { compatible: issues.length === 0, issues };
    }

    checkSafariCompatibility(cssContent) {
        const issues = [];
        
        if (/@keyframes/.test(cssContent) && !/@-webkit-keyframes/.test(cssContent)) {
            issues.push('Missing webkit prefixes for animations');
        }
        
        return { compatible: issues.length === 0, issues };
    }

    checkFirefoxCompatibility(svgContent) {
        // Firefox has good SVG support, minimal issues
        return { compatible: true, issues: [] };
    }

    checkChromeCompatibility(cssContent) {
        // Chrome has excellent support, minimal issues
        return { compatible: true, issues: [] };
    }

    checkNeedsPrefixes(cssContent) {
        const prefixNeeded = [
            'animation:',
            'transform:',
            'transition:',
            '@keyframes'
        ];
        
        return prefixNeeded.some(prop => 
            cssContent.includes(prop) && !cssContent.includes('-webkit-' + prop)
        );
    }

    checkTextAlternatives(svgContent) {
        return {
            hasTitle: svgContent.includes('<title>'),
            hasDesc: svgContent.includes('<desc>'),
            hasAriaLabel: /aria-label/.test(svgContent),
            needsImprovement: !svgContent.includes('<title>') && !/aria-label/.test(svgContent)
        };
    }

    // Export analysis results
    exportAnalysis(format = 'json') {
        const data = {
            timestamp: new Date().toISOString(),
            analysis: this.analysisResults,
            recommendations: this.recommendations,
            summary: this.generateSummary()
        };
        
        if (format === 'json') {
            return JSON.stringify(data, null, 2);
        }
        
        if (format === 'markdown') {
            return this.generateMarkdownReport(data);
        }
        
        return data;
    }

    generateSummary() {
        const totalRecommendations = this.recommendations.length;
        const highPriorityRecs = this.recommendations.filter(r => r.priority >= 15).length;
        
        return {
            overallScore: this.calculateOverallScore(),
            totalRecommendations: totalRecommendations,
            highPriorityRecommendations: highPriorityRecs,
            estimatedImprovementPotential: this.calculateImprovementPotential()
        };
    }

    calculateOverallScore() {
        if (!this.analysisResults.performance) return 0;
        
        const scores = [
            this.analysisResults.performance.performanceScore || 0,
            this.analysisResults.accessibility.accessibilityScore || 0,
            this.analysisResults.compatibility.compatibilityScore || 0
        ];
        
        return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    }

    calculateImprovementPotential() {
        const highImpactRecs = this.recommendations.filter(r => r.impact === 'High').length;
        const mediumImpactRecs = this.recommendations.filter(r => r.impact === 'Medium').length;
        
        return Math.min((highImpactRecs * 15) + (mediumImpactRecs * 8), 100);
    }

    generateMarkdownReport(data) {
        return `# SVG Optimization Analysis Report

## Summary
- **Overall Score:** ${data.summary.overallScore}/100
- **Total Recommendations:** ${data.summary.totalRecommendations}
- **High Priority Items:** ${data.summary.highPriorityRecommendations}
- **Improvement Potential:** ${data.summary.estimatedImprovementPotential}%

## Top Recommendations

${data.recommendations.slice(0, 5).map((rec, i) => 
`${i + 1}. **${rec.description}**
   - Category: ${rec.category}
   - Impact: ${rec.impact}
   - Expected Savings: ${rec.savings}`
).join('\n\n')}

---
*Generated: ${data.timestamp}*
`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DafelOptimizationEngine;
}

// Global access for browser environment
if (typeof window !== 'undefined') {
    window.DafelOptimizationEngine = DafelOptimizationEngine;
}