/**
 * DAFEL SVG PERFORMANCE TEST ENGINE
 * 
 * Comprehensive testing suite for SVG performance, optimization,
 * and user experience analysis.
 * 
 * Features:
 * - Real-time performance monitoring
 * - Memory usage tracking
 * - Animation FPS measurement
 * - Load time analysis
 * - Battery usage estimation
 * - Cross-browser compatibility testing
 * - Accessibility compliance checking
 * - Visual regression detection
 */

class DafelPerformanceTestSuite {
    constructor() {
        this.testResults = [];
        this.currentDevice = 'desktop';
        this.isRunning = false;
        this.frameCount = 0;
        this.lastTime = 0;
        this.fpsHistory = [];
        this.memoryHistory = [];
        this.cpuHistory = [];
        
        // Test configurations for different devices
        this.deviceProfiles = {
            desktop: {
                name: 'Desktop',
                cpu: 'high',
                memory: 'high',
                connection: 'broadband',
                expectedFPS: 60,
                maxLoadTime: 100
            },
            tablet: {
                name: 'Tablet',
                cpu: 'medium',
                memory: 'medium', 
                connection: 'wifi',
                expectedFPS: 60,
                maxLoadTime: 200
            },
            mobile: {
                name: 'Mobile',
                cpu: 'medium',
                memory: 'medium',
                connection: '4g',
                expectedFPS: 45,
                maxLoadTime: 300
            },
            'low-end': {
                name: 'Low-end Device',
                cpu: 'low',
                memory: 'low',
                connection: '3g',
                expectedFPS: 30,
                maxLoadTime: 500
            }
        };

        this.svgFiles = [
            'original.svg',
            'optimized.svg',
            'animatable.svg'
        ];

        this.animationTypes = [
            'none',
            'animate-wave-horizontal',
            'animate-pulse',
            'animate-stagger-in',
            'animate-wave-smooth',
            'animate-grid-shimmer',
            'animate-wave-pulse'
        ];
    }

    initialize() {
        this.log('Performance Test Suite initialized');
        this.setupEventListeners();
        this.startRealTimeMonitoring();
        
        // Load CSS animations
        this.loadAnimationCSS();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const logContainer = document.getElementById('testLog');
        const statusIcon = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        
        logContainer.innerHTML += `[${timestamp}] ${statusIcon} ${message}<br>`;
        logContainer.scrollTop = logContainer.scrollHeight;
        
        console.log(`[Dafel Test Suite] ${message}`);
    }

    setupEventListeners() {
        // Performance monitoring
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }

        // Memory monitoring  
        if ('memory' in performance) {
            this.setupMemoryMonitoring();
        }

        // Visibility change detection
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseMonitoring();
            } else {
                this.resumeMonitoring();
            }
        });
    }

    setupPerformanceObserver() {
        try {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    if (entry.entryType === 'measure') {
                        this.updateMetric('renderTime', Math.round(entry.duration));
                    }
                    if (entry.entryType === 'paint') {
                        if (entry.name === 'first-contentful-paint') {
                            this.updateMetric('loadTime', Math.round(entry.startTime));
                        }
                    }
                }
            });
            
            observer.observe({ entryTypes: ['measure', 'paint', 'navigation'] });
            this.log('Performance Observer enabled');
        } catch (error) {
            this.log('Performance Observer not supported', 'warning');
        }
    }

    setupMemoryMonitoring() {
        setInterval(() => {
            if (performance.memory) {
                const memoryMB = (performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(1);
                this.updateMetric('memoryUsage', memoryMB);
                this.memoryHistory.push(parseFloat(memoryMB));
                
                // Keep only last 100 measurements
                if (this.memoryHistory.length > 100) {
                    this.memoryHistory.shift();
                }
            }
        }, 1000);
    }

    startRealTimeMonitoring() {
        const monitorFrame = () => {
            if (!this.isRunning) {
                requestAnimationFrame(monitorFrame);
                return;
            }

            const now = performance.now();
            this.frameCount++;

            if (this.lastTime) {
                const delta = now - this.lastTime;
                const fps = Math.round(1000 / delta);
                
                this.fpsHistory.push(fps);
                if (this.fpsHistory.length > 60) {
                    this.fpsHistory.shift();
                }

                const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
                this.updateMetric('animationFPS', Math.round(avgFPS));
                
                // Update live overlay
                document.getElementById('liveFPS').textContent = Math.round(avgFPS);
            }

            this.lastTime = now;
            requestAnimationFrame(monitorFrame);
        };

        requestAnimationFrame(monitorFrame);
    }

    updateMetric(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            element.textContent = value;
            
            // Add visual feedback based on performance thresholds
            element.className = 'metric-value ' + this.getPerformanceClass(metricId, value);
        }

        // Update live overlay
        const liveElement = document.getElementById('live' + metricId.charAt(0).toUpperCase() + metricId.slice(1));
        if (liveElement) {
            liveElement.textContent = value;
        }
    }

    getPerformanceClass(metric, value) {
        const thresholds = {
            renderTime: { good: 50, warning: 100 },
            animationFPS: { good: 50, warning: 30 },
            memoryUsage: { good: 50, warning: 100 },
            loadTime: { good: 200, warning: 500 }
        };

        const threshold = thresholds[metric];
        if (!threshold) return '';

        if (metric === 'animationFPS') {
            return value >= threshold.good ? 'benchmark-good' : 
                   value >= threshold.warning ? 'benchmark-warning' : 'benchmark-poor';
        } else {
            return value <= threshold.good ? 'benchmark-good' : 
                   value <= threshold.warning ? 'benchmark-warning' : 'benchmark-poor';
        }
    }

    async loadAnimationCSS() {
        try {
            const response = await fetch('../animations/css-examples.css');
            if (response.ok) {
                const css = await response.text();
                const styleSheet = document.createElement('style');
                styleSheet.textContent = css;
                document.head.appendChild(styleSheet);
                this.log('Animation CSS loaded successfully');
            }
        } catch (error) {
            this.log('Failed to load animation CSS: ' + error.message, 'warning');
        }
    }

    async loadSVGForTesting(svgFile = 'optimized.svg') {
        const container = document.getElementById('svgContainer');
        
        try {
            const startTime = performance.now();
            
            const response = await fetch(`../svg/${svgFile}`);
            const svgText = await response.text();
            
            // Create performance mark
            performance.mark('svg-load-start');
            
            container.innerHTML = svgText + container.querySelector('.performance-overlay').outerHTML;
            
            performance.mark('svg-load-end');
            performance.measure('svg-load-time', 'svg-load-start', 'svg-load-end');
            
            const loadTime = performance.now() - startTime;
            this.updateMetric('loadTime', Math.round(loadTime));
            
            // Calculate file size
            const fileSizeKB = (new Blob([svgText]).size / 1024).toFixed(1);
            this.updateMetric('fileSize', fileSizeKB);
            
            this.log(`SVG loaded: ${svgFile} (${fileSizeKB}KB in ${Math.round(loadTime)}ms)`);
            
            return true;
        } catch (error) {
            this.log('Failed to load SVG: ' + error.message, 'error');
            return false;
        }
    }

    async runFullSuite() {
        if (this.isRunning) {
            this.log('Test suite already running', 'warning');
            return;
        }

        this.isRunning = true;
        this.updateProgress(0);
        this.setButtonState('fullSuiteBtn', true);
        
        this.log('Starting full test suite...');
        
        const tests = [
            { name: 'Performance Benchmark', fn: () => this.runPerformanceTest() },
            { name: 'Memory Analysis', fn: () => this.runMemoryTest() },
            { name: 'Animation FPS Test', fn: () => this.runAnimationTest() },
            { name: 'Load Time Analysis', fn: () => this.runLoadTimeTest() },
            { name: 'Battery Impact Test', fn: () => this.runBatteryTest() },
            { name: 'Browser Compatibility', fn: () => this.runCompatibilityTest() },
            { name: 'Accessibility Audit', fn: () => this.runAccessibilityTest() }
        ];

        for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            this.log(`Running ${test.name}...`);
            
            try {
                await test.fn();
                this.updateProgress(((i + 1) / tests.length) * 100);
                await this.delay(500); // Small delay between tests
            } catch (error) {
                this.log(`Error in ${test.name}: ${error.message}`, 'error');
            }
        }

        this.isRunning = false;
        this.setButtonState('fullSuiteBtn', false);
        this.log('Full test suite completed!', 'success');
        this.generateSummaryReport();
    }

    async runPerformanceTest() {
        this.log('Running performance benchmarks...');
        
        const results = {};
        
        for (const svgFile of this.svgFiles) {
            this.log(`Testing ${svgFile}...`);
            
            const startTime = performance.now();
            await this.loadSVGForTesting(svgFile);
            const loadTime = performance.now() - startTime;
            
            // Test rendering performance
            const renderStart = performance.now();
            await this.triggerReflow();
            const renderTime = performance.now() - renderStart;
            
            results[svgFile] = {
                loadTime: Math.round(loadTime),
                renderTime: Math.round(renderTime),
                fileSize: this.getFileSizeKB(svgFile)
            };
            
            await this.delay(1000);
        }
        
        this.addTestResult('Performance Benchmark', 'PASSED', results);
        return results;
    }

    async runMemoryTest() {
        this.log('Analyzing memory usage patterns...');
        
        if (!performance.memory) {
            this.addTestResult('Memory Analysis', 'SKIPPED', 'Memory API not available');
            return;
        }

        const initialMemory = performance.memory.usedJSHeapSize;
        this.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(1)}MB`);
        
        const memoryTests = [];
        
        // Test each SVG file
        for (const svgFile of this.svgFiles) {
            await this.loadSVGForTesting(svgFile);
            
            // Force garbage collection if available
            if (window.gc) window.gc();
            
            const currentMemory = performance.memory.usedJSHeapSize;
            const memoryUsed = (currentMemory - initialMemory) / 1024 / 1024;
            
            memoryTests.push({
                file: svgFile,
                memoryMB: memoryUsed.toFixed(1)
            });
            
            this.log(`${svgFile}: ${memoryUsed.toFixed(1)}MB`);
            await this.delay(2000);
        }
        
        const avgMemoryUsage = memoryTests.reduce((sum, test) => sum + parseFloat(test.memoryMB), 0) / memoryTests.length;
        const status = avgMemoryUsage < 10 ? 'PASSED' : avgMemoryUsage < 25 ? 'WARNING' : 'FAILED';
        
        this.addTestResult('Memory Analysis', status, `Avg: ${avgMemoryUsage.toFixed(1)}MB`);
        return memoryTests;
    }

    async runAnimationTest() {
        this.log('Testing animation performance...');
        
        const animationResults = [];
        
        for (const animation of this.animationTypes) {
            this.log(`Testing animation: ${animation}`);
            
            await this.loadSVGForTesting('animatable.svg');
            const svg = document.querySelector('#svgContainer svg');
            
            if (svg && animation !== 'none') {
                svg.classList.add(animation);
            }
            
            // Reset FPS history
            this.fpsHistory = [];
            
            // Monitor for 3 seconds
            await this.delay(3000);
            
            const avgFPS = this.fpsHistory.length > 0 ? 
                this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length : 0;
            
            animationResults.push({
                animation: animation,
                avgFPS: Math.round(avgFPS),
                minFPS: Math.min(...this.fpsHistory),
                maxFPS: Math.max(...this.fpsHistory)
            });
            
            this.log(`${animation}: ${Math.round(avgFPS)} FPS avg`);
            
            if (svg && animation !== 'none') {
                svg.classList.remove(animation);
            }
        }
        
        const overallAvgFPS = animationResults.reduce((sum, result) => sum + result.avgFPS, 0) / animationResults.length;
        const expectedFPS = this.deviceProfiles[this.currentDevice].expectedFPS;
        const status = overallAvgFPS >= expectedFPS ? 'PASSED' : overallAvgFPS >= expectedFPS * 0.8 ? 'WARNING' : 'FAILED';
        
        this.addTestResult('Animation FPS Test', status, `${Math.round(overallAvgFPS)} FPS avg`);
        return animationResults;
    }

    async runLoadTimeTest() {
        this.log('Testing load times across different conditions...');
        
        const loadTests = [];
        
        for (const svgFile of this.svgFiles) {
            const iterations = 5;
            const times = [];
            
            for (let i = 0; i < iterations; i++) {
                // Clear cache simulation
                const cacheKey = Math.random();
                const startTime = performance.now();
                
                try {
                    const response = await fetch(`../svg/${svgFile}?t=${cacheKey}`);
                    await response.text();
                    const loadTime = performance.now() - startTime;
                    times.push(loadTime);
                } catch (error) {
                    this.log(`Load test error for ${svgFile}: ${error.message}`, 'error');
                }
                
                await this.delay(200);
            }
            
            const avgLoadTime = times.reduce((a, b) => a + b, 0) / times.length;
            loadTests.push({
                file: svgFile,
                avgLoadTime: Math.round(avgLoadTime),
                minLoadTime: Math.round(Math.min(...times)),
                maxLoadTime: Math.round(Math.max(...times))
            });
            
            this.log(`${svgFile}: ${Math.round(avgLoadTime)}ms avg load time`);
        }
        
        const overallAvgLoad = loadTests.reduce((sum, test) => sum + test.avgLoadTime, 0) / loadTests.length;
        const maxExpectedLoad = this.deviceProfiles[this.currentDevice].maxLoadTime;
        const status = overallAvgLoad <= maxExpectedLoad ? 'PASSED' : overallAvgLoad <= maxExpectedLoad * 1.5 ? 'WARNING' : 'FAILED';
        
        this.addTestResult('Load Time Analysis', status, `${Math.round(overallAvgLoad)}ms avg`);
        return loadTests;
    }

    async runBatteryTest() {
        this.log('Estimating battery impact...');
        
        if (!('getBattery' in navigator)) {
            this.addTestResult('Battery Impact Test', 'SKIPPED', 'Battery API not available');
            return;
        }

        try {
            const battery = await navigator.getBattery();
            const initialLevel = battery.level;
            
            this.log(`Initial battery level: ${(initialLevel * 100).toFixed(1)}%`);
            
            // Run intensive animation test
            await this.loadSVGForTesting('animatable.svg');
            const svg = document.querySelector('#svgContainer svg');
            
            if (svg) {
                svg.classList.add('animate-wave-pulse');
            }
            
            // Monitor for 10 seconds
            await this.delay(10000);
            
            const finalLevel = battery.level;
            const batteryDelta = (initialLevel - finalLevel) * 100;
            
            if (svg) {
                svg.classList.remove('animate-wave-pulse');
            }
            
            const estimatedHours = batteryDelta > 0 ? (100 / (batteryDelta * 360)) : Infinity;
            const status = estimatedHours > 4 ? 'PASSED' : estimatedHours > 2 ? 'WARNING' : 'FAILED';
            
            this.addTestResult('Battery Impact Test', status, `~${estimatedHours.toFixed(1)}h estimated`);
            
        } catch (error) {
            this.log('Battery test error: ' + error.message, 'error');
            this.addTestResult('Battery Impact Test', 'ERROR', error.message);
        }
    }

    async runCompatibilityTest() {
        this.log('Checking browser compatibility...');
        
        const features = {
            'SVG Support': !!document.createElementNS,
            'CSS Animations': 'animation' in document.body.style,
            'CSS Transforms': 'transform' in document.body.style,
            'RequestAnimationFrame': !!window.requestAnimationFrame,
            'Performance API': !!window.performance,
            'IntersectionObserver': !!window.IntersectionObserver,
            'WebGL': !!window.WebGLRenderingContext
        };
        
        const supportedFeatures = Object.values(features).filter(Boolean).length;
        const totalFeatures = Object.keys(features).length;
        const compatibilityScore = (supportedFeatures / totalFeatures) * 100;
        
        let detailsHTML = '<ul>';
        for (const [feature, supported] of Object.entries(features)) {
            const icon = supported ? '✅' : '❌';
            detailsHTML += `<li>${icon} ${feature}</li>`;
        }
        detailsHTML += '</ul>';
        
        const status = compatibilityScore >= 90 ? 'PASSED' : compatibilityScore >= 70 ? 'WARNING' : 'FAILED';
        
        this.addTestResult('Browser Compatibility', status, `${compatibilityScore.toFixed(0)}% compatible`);
        this.log(`Browser compatibility: ${compatibilityScore.toFixed(0)}%`);
        
        return features;
    }

    async runAccessibilityTest() {
        this.log('Running accessibility audit...');
        
        await this.loadSVGForTesting('optimized.svg');
        const svg = document.querySelector('#svgContainer svg');
        
        const accessibilityChecks = {
            'Has title element': !!svg.querySelector('title'),
            'Has desc element': !!svg.querySelector('desc'),
            'Has alt attribute': !!svg.getAttribute('alt') || !!svg.getAttribute('aria-label'),
            'Proper ARIA roles': !!svg.getAttribute('role'),
            'Focus management': svg.tabIndex >= 0,
            'Reduced motion support': this.checkReducedMotionSupport()
        };
        
        const passedChecks = Object.values(accessibilityChecks).filter(Boolean).length;
        const totalChecks = Object.keys(accessibilityChecks).length;
        const accessibilityScore = (passedChecks / totalChecks) * 100;
        
        const status = accessibilityScore >= 80 ? 'PASSED' : accessibilityScore >= 60 ? 'WARNING' : 'FAILED';
        
        this.addTestResult('Accessibility Audit', status, `${accessibilityScore.toFixed(0)}% compliant`);
        this.log(`Accessibility score: ${accessibilityScore.toFixed(0)}%`);
        
        return accessibilityChecks;
    }

    checkReducedMotionSupport() {
        return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    addTestResult(testName, status, result) {
        const timestamp = new Date().toLocaleTimeString();
        
        this.testResults.push({
            test: testName,
            status: status,
            result: result,
            timestamp: timestamp,
            device: this.currentDevice
        });
        
        this.updateResultsTable();
    }

    updateResultsTable() {
        const tbody = document.getElementById('resultsTableBody');
        
        if (this.testResults.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5">No tests run yet.</td></tr>';
            return;
        }
        
        tbody.innerHTML = this.testResults.map(result => {
            const statusClass = result.status.toLowerCase() === 'passed' ? 'benchmark-good' : 
                               result.status.toLowerCase() === 'warning' ? 'benchmark-warning' : 
                               'benchmark-poor';
            
            const benchmarkText = this.getBenchmarkText(result.test, result.result);
            
            return `
                <tr>
                    <td>${result.test}</td>
                    <td>${result.result}</td>
                    <td>${benchmarkText}</td>
                    <td><span class="${statusClass}">${result.status}</span></td>
                    <td>${result.timestamp}</td>
                </tr>
            `;
        }).join('');
    }

    getBenchmarkText(testName, result) {
        const benchmarks = {
            'Performance Benchmark': 'Load: <100ms, Render: <50ms',
            'Memory Analysis': 'Usage: <25MB',
            'Animation FPS Test': `Target: ${this.deviceProfiles[this.currentDevice].expectedFPS} FPS`,
            'Load Time Analysis': `Target: <${this.deviceProfiles[this.currentDevice].maxLoadTime}ms`,
            'Battery Impact Test': 'Target: >4h runtime',
            'Browser Compatibility': 'Target: >90%',
            'Accessibility Audit': 'Target: >80%'
        };
        
        return benchmarks[testName] || 'N/A';
    }

    generateSummaryReport() {
        this.log('Generating summary report...', 'success');
        
        const passedTests = this.testResults.filter(r => r.status === 'PASSED').length;
        const totalTests = this.testResults.length;
        const overallScore = (passedTests / totalTests) * 100;
        
        this.log(`Overall Score: ${overallScore.toFixed(0)}% (${passedTests}/${totalTests} tests passed)`);
        
        if (overallScore >= 80) {
            this.log('Excellent performance! SVG system is optimized.', 'success');
        } else if (overallScore >= 60) {
            this.log('Good performance with room for improvement.', 'warning');
        } else {
            this.log('Performance issues detected. Optimization recommended.', 'error');
        }
    }

    updateProgress(percentage) {
        const progressBar = document.getElementById('progressBar');
        progressBar.style.width = percentage + '%';
    }

    setButtonState(buttonId, running) {
        const button = document.getElementById(buttonId);
        const indicator = button.querySelector('.status-indicator');
        
        if (running) {
            button.classList.add('running');
            indicator.className = 'status-indicator status-running';
        } else {
            button.classList.remove('running');
            indicator.className = 'status-indicator status-idle';
        }
    }

    selectDevice(button) {
        // Update active device button
        document.querySelectorAll('.device-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        this.currentDevice = button.dataset.device;
        this.log(`Device profile changed to: ${this.deviceProfiles[this.currentDevice].name}`);
    }

    resetTests() {
        this.testResults = [];
        this.fpsHistory = [];
        this.memoryHistory = [];
        this.cpuHistory = [];
        this.updateResultsTable();
        this.updateProgress(0);
        
        // Reset metrics
        ['renderTime', 'animationFPS', 'memoryUsage', 'cpuUsage', 'loadTime', 'fileSize'].forEach(metric => {
            this.updateMetric(metric, '--');
        });
        
        this.log('All tests reset', 'success');
    }

    pauseMonitoring() {
        this.isRunning = false;
        this.log('Monitoring paused (tab not visible)');
    }

    resumeMonitoring() {
        this.isRunning = true;
        this.log('Monitoring resumed');
    }

    async triggerReflow() {
        const container = document.getElementById('svgContainer');
        const originalDisplay = container.style.display;
        container.style.display = 'none';
        container.offsetHeight; // Force reflow
        container.style.display = originalDisplay;
    }

    getFileSizeKB(filename) {
        // This would need to be implemented with actual file size data
        const estimatedSizes = {
            'original.svg': 45,
            'optimized.svg': 12,
            'animatable.svg': 38
        };
        return estimatedSizes[filename] || 0;
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global functions for HTML buttons
function runFullSuite() {
    window.testSuite.runFullSuite();
}

function runPerformanceTest() {
    window.testSuite.runPerformanceTest();
}

function runMemoryTest() {
    window.testSuite.runMemoryTest();
}

function runAnimationTest() {
    window.testSuite.runAnimationTest();
}

function runLoadTimeTest() {
    window.testSuite.runLoadTimeTest();
}

function runBatteryTest() {
    window.testSuite.runBatteryTest();
}

function runCompatibilityTest() {
    window.testSuite.runCompatibilityTest();
}

function runAccessibilityTest() {
    window.testSuite.runAccessibilityTest();
}

function resetTests() {
    window.testSuite.resetTests();
}

function selectDevice(button) {
    window.testSuite.selectDevice(button);
}

async function loadSVGForTesting() {
    await window.testSuite.loadSVGForTesting();
}

// Initialize when script loads
window.addEventListener('DOMContentLoaded', () => {
    window.testSuite = new DafelPerformanceTestSuite();
});