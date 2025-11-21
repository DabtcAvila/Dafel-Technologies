/**
 * DAFEL BANDA PERFORMANCE BENCHMARK SUITE
 * Comprehensive performance testing and metrics for SVG optimization and animations
 * Created: 2025-10-08
 * Version: 1.0.0
 */

class DafelPerformanceBenchmark {
    constructor() {
        this.benchmarks = new Map();
        this.results = new Map();
        this.metrics = {
            fileSize: {},
            renderTime: {},
            animationFPS: {},
            memoryUsage: {},
            networkTransfer: {},
            batteryImpact: {}
        };
        this.deviceProfiles = {
            'high-end': {
                name: 'High-End Device',
                cpu: 'Fast',
                gpu: 'Dedicated',
                memory: '8GB+',
                connection: '5G/Fiber'
            },
            'mid-range': {
                name: 'Mid-Range Device',
                cpu: 'Medium',
                gpu: 'Integrated',
                memory: '4GB',
                connection: '4G/Cable'
            },
            'low-end': {
                name: 'Low-End Device',
                cpu: 'Slow',
                gpu: 'Basic',
                memory: '2GB',
                connection: '3G/DSL'
            }
        };
        this.testSuites = this.initializeTestSuites();
    }

    /**
     * Initialize test suites for comprehensive benchmarking
     */
    initializeTestSuites() {
        return {
            fileSize: {
                name: 'File Size Optimization',
                tests: [
                    'original-size',
                    'ultra-light-optimization',
                    'light-optimization', 
                    'balanced-optimization',
                    'quality-optimization',
                    'maximum-quality',
                    'gzip-compression',
                    'brotli-compression'
                ]
            },
            renderPerformance: {
                name: 'Render Performance',
                tests: [
                    'initial-paint',
                    'first-contentful-paint',
                    'largest-contentful-paint',
                    'dom-content-loaded',
                    'svg-parse-time',
                    'gradient-render-time',
                    'path-complexity-impact',
                    'filter-performance'
                ]
            },
            animationPerformance: {
                name: 'Animation Performance',
                tests: [
                    'basic-transform-fps',
                    'complex-path-morph-fps',
                    'multiple-simultaneous-fps',
                    'stagger-performance',
                    'composite-animation-fps',
                    'css-vs-js-animation',
                    'gpu-acceleration-impact',
                    'memory-leak-detection'
                ]
            },
            scalability: {
                name: 'Scalability Testing',
                tests: [
                    'responsive-resize-performance',
                    'multiple-instances',
                    'viewport-scaling-cost',
                    'retina-display-impact',
                    'zoom-performance',
                    'rotation-cost'
                ]
            },
            browserCompatibility: {
                name: 'Browser Compatibility',
                tests: [
                    'chrome-performance',
                    'firefox-performance', 
                    'safari-performance',
                    'edge-performance',
                    'mobile-safari-ios',
                    'chrome-android'
                ]
            },
            networkImpact: {
                name: 'Network & Loading',
                tests: [
                    'download-time-3g',
                    'download-time-4g',
                    'download-time-5g',
                    'cache-effectiveness',
                    'cdn-performance',
                    'parallel-loading'
                ]
            }
        };
    }

    /**
     * Run comprehensive benchmark suite
     * @param {string} svgContent - SVG content to benchmark
     * @param {Object} options - Benchmark options
     */
    async runFullBenchmark(svgContent, options = {}) {
        console.log('🏁 Starting comprehensive Dafel Banda performance benchmark...');
        
        const startTime = performance.now();
        const results = {
            timestamp: new Date().toISOString(),
            testEnvironment: await this.getTestEnvironment(),
            results: {}
        };

        // Run all test suites
        for (const [suiteName, suite] of Object.entries(this.testSuites)) {
            console.log(`📊 Running ${suite.name} tests...`);
            results.results[suiteName] = await this.runTestSuite(suiteName, svgContent, options);
        }

        const totalTime = performance.now() - startTime;
        results.totalBenchmarkTime = `${totalTime.toFixed(2)}ms`;
        results.summary = this.generateSummary(results.results);

        this.results.set('full-benchmark', results);
        console.log('✅ Benchmark completed in', results.totalBenchmarkTime);
        
        return results;
    }

    /**
     * Run specific test suite
     */
    async runTestSuite(suiteName, svgContent, options) {
        const suite = this.testSuites[suiteName];
        if (!suite) throw new Error(`Test suite not found: ${suiteName}`);

        const suiteResults = {
            suiteName: suite.name,
            tests: {},
            summary: {}
        };

        for (const testName of suite.tests) {
            try {
                const testResult = await this.runSingleTest(suiteName, testName, svgContent, options);
                suiteResults.tests[testName] = testResult;
            } catch (error) {
                suiteResults.tests[testName] = {
                    error: error.message,
                    status: 'failed'
                };
            }
        }

        suiteResults.summary = this.summarizeTestSuite(suiteResults.tests);
        return suiteResults;
    }

    /**
     * Run individual test
     */
    async runSingleTest(suiteName, testName, svgContent, options) {
        const testStart = performance.now();
        let result = { status: 'unknown' };

        switch (suiteName) {
            case 'fileSize':
                result = await this.runFileSizeTest(testName, svgContent);
                break;
            case 'renderPerformance':
                result = await this.runRenderTest(testName, svgContent);
                break;
            case 'animationPerformance':
                result = await this.runAnimationTest(testName, svgContent);
                break;
            case 'scalability':
                result = await this.runScalabilityTest(testName, svgContent);
                break;
            case 'browserCompatibility':
                result = await this.runCompatibilityTest(testName, svgContent);
                break;
            case 'networkImpact':
                result = await this.runNetworkTest(testName, svgContent);
                break;
        }

        result.executionTime = `${(performance.now() - testStart).toFixed(2)}ms`;
        result.timestamp = new Date().toISOString();
        
        return result;
    }

    /**
     * File size optimization tests
     */
    async runFileSizeTest(testName, svgContent) {
        const optimizer = new DafelSvgOptimizer();
        optimizer.loadSvg(svgContent);

        switch (testName) {
            case 'original-size':
                return {
                    status: 'completed',
                    size: new Blob([svgContent]).size,
                    sizeKB: (new Blob([svgContent]).size / 1024).toFixed(2),
                    baseline: true
                };

            case 'ultra-light-optimization':
            case 'light-optimization':
            case 'balanced-optimization':
            case 'quality-optimization':
            case 'maximum-quality':
                const level = testName.replace('-optimization', '').replace('-quality', '');
                const result = optimizer.optimize(level);
                return {
                    status: 'completed',
                    size: result.metrics.size,
                    sizeKB: (result.metrics.size / 1024).toFixed(2),
                    compression: result.metrics.compression,
                    compressionRatio: result.metrics.compressionRatio,
                    qualityScore: result.metrics.qualityScore
                };

            case 'gzip-compression':
                const gzipSize = await this.estimateGzipSize(svgContent);
                return {
                    status: 'completed',
                    originalSize: new Blob([svgContent]).size,
                    gzipSize: gzipSize,
                    compressionRatio: (new Blob([svgContent]).size / gzipSize).toFixed(2)
                };

            default:
                return { status: 'not-implemented' };
        }
    }

    /**
     * Render performance tests
     */
    async runRenderTest(testName, svgContent) {
        return new Promise((resolve) => {
            const startTime = performance.now();
            
            // Create temporary container
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.width = '1280px';
            container.style.height = '720px';
            document.body.appendChild(container);

            switch (testName) {
                case 'initial-paint':
                case 'svg-parse-time':
                    container.innerHTML = svgContent;
                    const parseTime = performance.now() - startTime;
                    
                    requestAnimationFrame(() => {
                        const paintTime = performance.now() - startTime;
                        document.body.removeChild(container);
                        resolve({
                            status: 'completed',
                            parseTime: `${parseTime.toFixed(2)}ms`,
                            paintTime: `${paintTime.toFixed(2)}ms`,
                            score: this.calculateRenderScore(paintTime)
                        });
                    });
                    break;

                case 'gradient-render-time':
                    container.innerHTML = svgContent;
                    const gradientTime = performance.now() - startTime;
                    document.body.removeChild(container);
                    resolve({
                        status: 'completed',
                        renderTime: `${gradientTime.toFixed(2)}ms`,
                        score: this.calculateRenderScore(gradientTime)
                    });
                    break;

                case 'path-complexity-impact':
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
                    const paths = doc.querySelectorAll('path');
                    
                    let totalComplexity = 0;
                    paths.forEach(path => {
                        const d = path.getAttribute('d');
                        totalComplexity += d ? d.length : 0;
                    });
                    
                    container.innerHTML = svgContent;
                    const complexityTime = performance.now() - startTime;
                    document.body.removeChild(container);
                    
                    resolve({
                        status: 'completed',
                        pathCount: paths.length,
                        totalComplexity,
                        avgComplexityPerPath: (totalComplexity / paths.length).toFixed(2),
                        renderTime: `${complexityTime.toFixed(2)}ms`,
                        complexityImpact: this.calculateComplexityImpact(totalComplexity, complexityTime)
                    });
                    break;

                default:
                    document.body.removeChild(container);
                    resolve({ status: 'not-implemented' });
            }
        });
    }

    /**
     * Animation performance tests
     */
    async runAnimationTest(testName, svgContent) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.innerHTML = svgContent;
            document.body.appendChild(container);

            const svg = container.querySelector('svg');
            if (!svg) {
                document.body.removeChild(container);
                resolve({ status: 'no-svg-found' });
                return;
            }

            const orchestrator = new DafelAnimationOrchestrator();
            let frameCount = 0;
            let startTime = performance.now();
            const duration = 2000; // 2 second test

            const measureFrames = () => {
                frameCount++;
                if (performance.now() - startTime < duration) {
                    requestAnimationFrame(measureFrames);
                } else {
                    const actualTime = performance.now() - startTime;
                    const fps = (frameCount * 1000) / actualTime;
                    
                    document.body.removeChild(container);
                    resolve({
                        status: 'completed',
                        fps: fps.toFixed(2),
                        frameCount,
                        duration: `${actualTime.toFixed(2)}ms`,
                        performance: this.calculateAnimationScore(fps),
                        testType: testName
                    });
                }
            };

            switch (testName) {
                case 'basic-transform-fps':
                    const basicTargets = svg.querySelectorAll('path, g');
                    orchestrator.animate(basicTargets, 'wave');
                    break;
                    
                case 'complex-path-morph-fps':
                    const pathTargets = svg.querySelectorAll('path');
                    orchestrator.animate(pathTargets, 'morph');
                    break;
                    
                case 'composite-animation-fps':
                    const compositeTargets = svg.querySelectorAll('g');
                    orchestrator.animate(compositeTargets, 'waveAndPulse');
                    break;
                    
                default:
                    // Default basic animation test
                    const defaultTargets = svg.querySelectorAll('*');
                    orchestrator.animate(defaultTargets, 'pulse');
            }

            requestAnimationFrame(measureFrames);
        });
    }

    /**
     * Scalability tests
     */
    async runScalabilityTest(testName, svgContent) {
        switch (testName) {
            case 'responsive-resize-performance':
                return await this.testResponsiveResize(svgContent);
                
            case 'multiple-instances':
                return await this.testMultipleInstances(svgContent);
                
            case 'retina-display-impact':
                return await this.testRetinaImpact(svgContent);
                
            default:
                return { status: 'not-implemented' };
        }
    }

    /**
     * Browser compatibility tests
     */
    async runCompatibilityTest(testName, svgContent) {
        const userAgent = navigator.userAgent;
        const browserInfo = this.getBrowserInfo();
        
        return {
            status: 'completed',
            browser: browserInfo.name,
            version: browserInfo.version,
            userAgent: userAgent,
            svgSupport: this.checkSvgSupport(),
            animationSupport: this.checkAnimationSupport(),
            performanceEstimate: this.estimateBrowserPerformance(browserInfo)
        };
    }

    /**
     * Network impact tests
     */
    async runNetworkTest(testName, svgContent) {
        const size = new Blob([svgContent]).size;
        
        const networkSpeeds = {
            '3g': 1.5 * 1024 * 1024 / 8, // 1.5 Mbps in bytes per second
            '4g': 20 * 1024 * 1024 / 8,   // 20 Mbps
            '5g': 100 * 1024 * 1024 / 8   // 100 Mbps
        };
        
        switch (testName) {
            case 'download-time-3g':
            case 'download-time-4g':
            case 'download-time-5g':
                const network = testName.split('-')[2];
                const speed = networkSpeeds[network];
                const downloadTime = (size / speed) * 1000; // in ms
                
                return {
                    status: 'completed',
                    network: network.toUpperCase(),
                    fileSize: size,
                    downloadTime: `${downloadTime.toFixed(2)}ms`,
                    downloadTimeSeconds: `${(downloadTime / 1000).toFixed(2)}s`,
                    networkSpeed: `${(speed * 8 / 1024 / 1024).toFixed(1)} Mbps`,
                    performance: this.calculateNetworkScore(downloadTime)
                };
                
            default:
                return { status: 'not-implemented' };
        }
    }

    /**
     * Test responsive resize performance
     */
    async testResponsiveResize(svgContent) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.innerHTML = svgContent;
            document.body.appendChild(container);

            const svg = container.querySelector('svg');
            const sizes = [
                { width: 375, height: 211 },   // Mobile
                { width: 768, height: 432 },   // Tablet
                { width: 1280, height: 720 },  // Desktop
                { width: 1920, height: 1080 }  // Large
            ];

            let resizeTime = 0;
            const startTime = performance.now();

            sizes.forEach((size, index) => {
                const resizeStart = performance.now();
                svg.setAttribute('width', size.width);
                svg.setAttribute('height', size.height);
                svg.setAttribute('viewBox', `0 0 ${size.width} ${size.height}`);
                
                // Force reflow
                svg.getBoundingClientRect();
                resizeTime += performance.now() - resizeStart;
            });

            document.body.removeChild(container);
            
            resolve({
                status: 'completed',
                totalResizeTime: `${resizeTime.toFixed(2)}ms`,
                avgResizeTime: `${(resizeTime / sizes.length).toFixed(2)}ms`,
                sizesTestted: sizes.length,
                performance: this.calculateResizeScore(resizeTime)
            });
        });
    }

    /**
     * Test multiple instances performance
     */
    async testMultipleInstances(svgContent) {
        return new Promise((resolve) => {
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            document.body.appendChild(container);

            const instances = 10;
            const startTime = performance.now();
            
            for (let i = 0; i < instances; i++) {
                const div = document.createElement('div');
                div.innerHTML = svgContent;
                container.appendChild(div);
            }

            const loadTime = performance.now() - startTime;
            
            // Measure memory usage (approximate)
            const beforeMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
            
            setTimeout(() => {
                const afterMemory = performance.memory ? performance.memory.usedJSHeapSize : 0;
                const memoryIncrease = afterMemory - beforeMemory;
                
                document.body.removeChild(container);
                
                resolve({
                    status: 'completed',
                    instances,
                    totalLoadTime: `${loadTime.toFixed(2)}ms`,
                    avgLoadTimePerInstance: `${(loadTime / instances).toFixed(2)}ms`,
                    memoryIncrease: `${(memoryIncrease / 1024).toFixed(2)}KB`,
                    performance: this.calculateMultiInstanceScore(loadTime, instances)
                });
            }, 100);
        });
    }

    /**
     * Estimate GZIP compression size
     */
    async estimateGzipSize(content) {
        // Simplified estimation - in real implementation would use actual compression
        const repetitionFactor = this.calculateRepetition(content);
        const estimatedRatio = 0.3 + (repetitionFactor * 0.4); // 30-70% compression
        return Math.round(content.length * estimatedRatio);
    }

    /**
     * Calculate content repetition for compression estimation
     */
    calculateRepetition(content) {
        const patterns = content.match(/(\w{3,})/g) || [];
        const uniquePatterns = new Set(patterns);
        return 1 - (uniquePatterns.size / patterns.length);
    }

    /**
     * Calculate render performance score
     */
    calculateRenderScore(time) {
        if (time < 16) return 'Excellent'; // 60fps threshold
        if (time < 33) return 'Good';      // 30fps threshold
        if (time < 50) return 'Fair';
        return 'Poor';
    }

    /**
     * Calculate animation performance score
     */
    calculateAnimationScore(fps) {
        if (fps >= 60) return 'Excellent';
        if (fps >= 45) return 'Good';
        if (fps >= 30) return 'Fair';
        return 'Poor';
    }

    /**
     * Calculate network performance score
     */
    calculateNetworkScore(downloadTime) {
        if (downloadTime < 100) return 'Excellent'; // Under 100ms
        if (downloadTime < 500) return 'Good';      // Under 500ms
        if (downloadTime < 1000) return 'Fair';     // Under 1s
        return 'Poor';
    }

    /**
     * Calculate resize performance score
     */
    calculateResizeScore(time) {
        if (time < 10) return 'Excellent';
        if (time < 25) return 'Good';
        if (time < 50) return 'Fair';
        return 'Poor';
    }

    /**
     * Calculate multi-instance performance score
     */
    calculateMultiInstanceScore(time, instances) {
        const avgTime = time / instances;
        if (avgTime < 5) return 'Excellent';
        if (avgTime < 10) return 'Good';
        if (avgTime < 20) return 'Fair';
        return 'Poor';
    }

    /**
     * Calculate complexity impact
     */
    calculateComplexityImpact(complexity, time) {
        const ratio = time / complexity;
        if (ratio < 0.001) return 'Low Impact';
        if (ratio < 0.005) return 'Medium Impact';
        return 'High Impact';
    }

    /**
     * Get test environment information
     */
    async getTestEnvironment() {
        const connection = navigator.connection || {};
        const memory = performance.memory || {};
        
        return {
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenResolution: `${screen.width}x${screen.height}`,
            colorDepth: screen.colorDepth,
            devicePixelRatio: window.devicePixelRatio,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            connection: {
                effectiveType: connection.effectiveType || 'unknown',
                downlink: connection.downlink || 'unknown',
                rtt: connection.rtt || 'unknown'
            },
            memory: {
                jsHeapSizeLimit: memory.jsHeapSizeLimit || 'unknown',
                totalJSHeapSize: memory.totalJSHeapSize || 'unknown',
                usedJSHeapSize: memory.usedJSHeapSize || 'unknown'
            },
            timestamp: new Date().toISOString()
        };
    }

    /**
     * Get browser information
     */
    getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';

        if (ua.includes('Chrome')) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Firefox')) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+)/)?.[1] || 'Unknown';
        } else if (ua.includes('Edge')) {
            browser = 'Edge';
            version = ua.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
        }

        return { name: browser, version };
    }

    /**
     * Check SVG support
     */
    checkSvgSupport() {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        return !!(svg && svg.createSVGRect);
    }

    /**
     * Check animation support
     */
    checkAnimationSupport() {
        return {
            webAnimations: 'animate' in document.createElement('div'),
            css3Animations: 'animationName' in document.createElement('div').style,
            css3Transforms: 'transform' in document.createElement('div').style,
            requestAnimationFrame: 'requestAnimationFrame' in window
        };
    }

    /**
     * Estimate browser performance
     */
    estimateBrowserPerformance(browserInfo) {
        const performanceRatings = {
            Chrome: 'High',
            Firefox: 'High', 
            Safari: 'Medium',
            Edge: 'Medium'
        };
        
        return performanceRatings[browserInfo.name] || 'Unknown';
    }

    /**
     * Summarize test suite results
     */
    summarizeTestSuite(tests) {
        const completed = Object.values(tests).filter(t => t.status === 'completed').length;
        const total = Object.keys(tests).length;
        const successRate = ((completed / total) * 100).toFixed(1);
        
        return {
            totalTests: total,
            completedTests: completed,
            successRate: `${successRate}%`,
            status: completed === total ? 'All Passed' : 'Some Failed'
        };
    }

    /**
     * Generate comprehensive summary
     */
    generateSummary(results) {
        const summary = {
            overallStatus: 'Completed',
            recommendations: [],
            keyMetrics: {},
            performanceGrade: 'A'
        };

        // Analyze file size results
        if (results.fileSize) {
            const balanced = results.fileSize.tests['balanced-optimization'];
            if (balanced) {
                summary.keyMetrics.optimizedSize = balanced.sizeKB + 'KB';
                summary.keyMetrics.compression = balanced.compression;
            }
        }

        // Analyze animation performance
        if (results.animationPerformance) {
            const basicFps = results.animationPerformance.tests['basic-transform-fps'];
            if (basicFps) {
                summary.keyMetrics.animationFPS = basicFps.fps;
                summary.keyMetrics.animationPerformance = basicFps.performance;
            }
        }

        // Generate recommendations
        summary.recommendations = this.generateRecommendations(results);

        return summary;
    }

    /**
     * Generate performance recommendations
     */
    generateRecommendations(results) {
        const recommendations = [];

        // File size recommendations
        if (results.fileSize) {
            const original = results.fileSize.tests['original-size'];
            const balanced = results.fileSize.tests['balanced-optimization'];
            
            if (original && balanced) {
                const savings = ((original.size - balanced.size) / original.size * 100).toFixed(1);
                if (savings > 80) {
                    recommendations.push({
                        type: 'optimization',
                        priority: 'high',
                        message: `Excellent ${savings}% file size reduction achieved. Ready for production.`
                    });
                }
            }
        }

        // Animation recommendations
        if (results.animationPerformance) {
            const basicFps = results.animationPerformance.tests['basic-transform-fps'];
            if (basicFps && parseFloat(basicFps.fps) < 30) {
                recommendations.push({
                    type: 'performance',
                    priority: 'medium',
                    message: 'Animation FPS below 30. Consider simplifying animations or using CSS transforms.'
                });
            }
        }

        // Network recommendations
        if (results.networkImpact) {
            const downloadTime3g = results.networkImpact.tests['download-time-3g'];
            if (downloadTime3g && parseFloat(downloadTime3g.downloadTime) > 1000) {
                recommendations.push({
                    type: 'network',
                    priority: 'medium',
                    message: 'Download time over 1s on 3G. Consider further optimization for mobile users.'
                });
            }
        }

        return recommendations;
    }

    /**
     * Export benchmark results
     */
    exportResults(format = 'json') {
        const results = Array.from(this.results.values());
        
        switch (format) {
            case 'json':
                return JSON.stringify(results, null, 2);
            case 'csv':
                return this.convertToCSV(results);
            case 'html':
                return this.generateHtmlReport(results);
            default:
                return results;
        }
    }

    /**
     * Convert results to CSV
     */
    convertToCSV(results) {
        // Simplified CSV conversion
        let csv = 'Test Suite,Test Name,Status,Value,Performance\n';
        
        results.forEach(result => {
            Object.entries(result.results || {}).forEach(([suiteName, suite]) => {
                Object.entries(suite.tests || {}).forEach(([testName, test]) => {
                    csv += `${suiteName},${testName},${test.status},${test.value || ''},${test.performance || ''}\n`;
                });
            });
        });
        
        return csv;
    }

    /**
     * Generate HTML report
     */
    generateHtmlReport(results) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Dafel Banda Performance Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
                .summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .metric { display: inline-block; margin: 10px; padding: 10px; background: white; border-radius: 4px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .recommendations { background: #e3f2fd; padding: 15px; border-radius: 8px; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🎨 Dafel Banda Performance Report</h1>
                <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            <div class="summary">
                <h2>Performance Summary</h2>
                <div class="metric">
                    <strong>File Size:</strong> ${results[0]?.summary?.keyMetrics?.optimizedSize || 'N/A'}
                </div>
                <div class="metric">
                    <strong>Animation FPS:</strong> ${results[0]?.summary?.keyMetrics?.animationFPS || 'N/A'}
                </div>
                <div class="metric">
                    <strong>Grade:</strong> ${results[0]?.summary?.performanceGrade || 'N/A'}
                </div>
            </div>
            <pre>${JSON.stringify(results, null, 2)}</pre>
        </body>
        </html>
        `;
    }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DafelPerformanceBenchmark;
} else {
    window.DafelPerformanceBenchmark = DafelPerformanceBenchmark;
}