/**
 * SVG MONITORING DASHBOARD ENGINE
 * 
 * Real-time monitoring and analytics system for SVG performance,
 * user experience, and business metrics.
 * 
 * Features:
 * - Real-time performance monitoring
 * - User experience analytics
 * - Error tracking and alerting
 * - A/B testing framework
 * - Business intelligence metrics
 * - Automated reporting
 */

class SVGMonitoringDashboard {
    constructor() {
        this.isActive = false;
        this.currentPage = 'overview';
        this.metrics = {
            performance: {
                loadTime: [],
                animationFPS: [],
                memoryUsage: [],
                cpuUsage: []
            },
            userExperience: {
                satisfaction: [],
                engagement: [],
                bounceRate: [],
                conversionRate: []
            },
            errors: {
                count: 0,
                types: {},
                timeline: []
            },
            analytics: {
                impressions: 0,
                interactions: 0,
                uniqueUsers: 0,
                sessions: 0
            }
        };
        
        this.alerts = [];
        this.feedItems = [];
        this.abTests = new Map();
        
        // Monitoring intervals
        this.intervals = {
            performance: null,
            analytics: null,
            alerts: null
        };
        
        // Chart instances
        this.charts = new Map();
        
        // Thresholds for alerts
        this.thresholds = {
            loadTime: 3000, // ms
            fps: 30,
            memoryUsage: 100, // MB
            errorRate: 0.05, // 5%
            satisfaction: 3.5 // out of 5
        };
    }

    initialize() {
        this.log('SVG Monitoring Dashboard initializing...');
        
        this.setupEventListeners();
        this.startMonitoring();
        this.initializeCharts();
        this.generateMockData();
        
        this.isActive = true;
        this.log('Dashboard initialization complete');
    }

    log(message, type = 'info') {
        console.log(`[SVG Monitor] ${message}`);
        this.addFeedItem(message, type);
    }

    setupEventListeners() {
        // Performance monitoring
        if ('PerformanceObserver' in window) {
            this.setupPerformanceObserver();
        }

        // User interaction tracking
        this.setupUserInteractionTracking();
        
        // Error tracking
        this.setupErrorTracking();
        
        // Visibility change handling
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
                    this.processPerformanceEntry(entry);
                }
            });
            
            observer.observe({ 
                entryTypes: ['navigation', 'paint', 'measure', 'mark']
            });
            
            this.log('Performance Observer enabled');
        } catch (error) {
            this.log('Performance Observer not supported', 'warning');
        }
    }

    processPerformanceEntry(entry) {
        switch (entry.entryType) {
            case 'navigation':
                this.recordLoadTime(entry.duration);
                break;
            case 'paint':
                if (entry.name === 'first-contentful-paint') {
                    this.recordPaintTime(entry.startTime);
                }
                break;
            case 'measure':
                if (entry.name.includes('svg-render')) {
                    this.recordRenderTime(entry.duration);
                }
                break;
        }
    }

    setupUserInteractionTracking() {
        ['click', 'scroll', 'mouseover', 'touchstart'].forEach(event => {
            document.addEventListener(event, (e) => {
                this.trackUserInteraction(event, e);
            }, { passive: true });
        });
        
        this.log('User interaction tracking enabled');
    }

    trackUserInteraction(type, event) {
        const interaction = {
            type: type,
            timestamp: Date.now(),
            element: event.target.tagName,
            coordinates: { x: event.clientX, y: event.clientY }
        };
        
        // Track SVG-specific interactions
        if (event.target.closest('svg')) {
            interaction.svgInteraction = true;
            this.metrics.analytics.interactions++;
            this.updateAnalyticsDisplay();
        }
        
        // Update engagement metrics
        this.updateEngagementMetrics(interaction);
    }

    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.recordError({
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                timestamp: Date.now(),
                type: 'javascript'
            });
        });

        window.addEventListener('unhandledrejection', (event) => {
            this.recordError({
                message: event.reason.toString(),
                timestamp: Date.now(),
                type: 'promise-rejection'
            });
        });
        
        this.log('Error tracking enabled');
    }

    startMonitoring() {
        // Performance monitoring every 5 seconds
        this.intervals.performance = setInterval(() => {
            this.collectPerformanceMetrics();
        }, 5000);
        
        // Analytics update every 30 seconds
        this.intervals.analytics = setInterval(() => {
            this.updateAnalytics();
        }, 30000);
        
        // Alert checking every 10 seconds
        this.intervals.alerts = setInterval(() => {
            this.checkAlerts();
        }, 10000);
        
        this.log('Monitoring intervals started');
    }

    pauseMonitoring() {
        Object.values(this.intervals).forEach(interval => {
            if (interval) clearInterval(interval);
        });
        this.log('Monitoring paused');
    }

    resumeMonitoring() {
        this.startMonitoring();
        this.log('Monitoring resumed');
    }

    collectPerformanceMetrics() {
        // Memory usage
        if (performance.memory) {
            const memoryMB = performance.memory.usedJSHeapSize / 1024 / 1024;
            this.recordMemoryUsage(memoryMB);
        }
        
        // FPS monitoring
        this.measureFPS();
        
        // CPU usage estimation
        this.estimateCPUUsage();
    }

    measureFPS() {
        let frameCount = 0;
        const startTime = performance.now();
        
        const countFrames = () => {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime - startTime >= 1000) {
                const fps = frameCount;
                this.recordAnimationFPS(fps);
                return;
            }
            
            requestAnimationFrame(countFrames);
        };
        
        requestAnimationFrame(countFrames);
    }

    estimateCPUUsage() {
        const start = performance.now();
        
        // Perform a CPU-intensive task
        const iterations = 100000;
        for (let i = 0; i < iterations; i++) {
            Math.random();
        }
        
        const duration = performance.now() - start;
        const cpuUsage = Math.min((duration / 10) * 100, 100); // Rough estimation
        
        this.recordCPUUsage(cpuUsage);
    }

    recordLoadTime(duration) {
        this.metrics.performance.loadTime.push({
            value: duration,
            timestamp: Date.now()
        });
        
        this.updateMetricDisplay('loadTime', Math.round(duration) + 'ms');
        
        if (duration > this.thresholds.loadTime) {
            this.createAlert('Performance', `Load time exceeded threshold: ${Math.round(duration)}ms`, 'warning');
        }
    }

    recordAnimationFPS(fps) {
        this.metrics.performance.animationFPS.push({
            value: fps,
            timestamp: Date.now()
        });
        
        this.updateMetricDisplay('animationFPS', fps + ' fps');
        
        if (fps < this.thresholds.fps) {
            this.createAlert('Performance', `Low FPS detected: ${fps}fps`, 'warning');
        }
    }

    recordMemoryUsage(memoryMB) {
        this.metrics.performance.memoryUsage.push({
            value: memoryMB,
            timestamp: Date.now()
        });
        
        this.updateMetricDisplay('memoryUsage', memoryMB.toFixed(1) + ' MB');
        
        if (memoryMB > this.thresholds.memoryUsage) {
            this.createAlert('Memory', `High memory usage: ${memoryMB.toFixed(1)}MB`, 'critical');
        }
    }

    recordCPUUsage(cpuUsage) {
        this.metrics.performance.cpuUsage.push({
            value: cpuUsage,
            timestamp: Date.now()
        });
        
        // Keep only last 100 measurements
        ['loadTime', 'animationFPS', 'memoryUsage', 'cpuUsage'].forEach(metric => {
            if (this.metrics.performance[metric].length > 100) {
                this.metrics.performance[metric] = this.metrics.performance[metric].slice(-100);
            }
        });
    }

    recordPaintTime(time) {
        this.addFeedItem(`First contentful paint: ${Math.round(time)}ms`, 'info');
    }

    recordRenderTime(time) {
        this.addFeedItem(`SVG render time: ${Math.round(time)}ms`, 'info');
    }

    recordError(error) {
        this.metrics.errors.count++;
        this.metrics.errors.timeline.push(error);
        
        if (!this.metrics.errors.types[error.type]) {
            this.metrics.errors.types[error.type] = 0;
        }
        this.metrics.errors.types[error.type]++;
        
        this.createAlert('Error', error.message, 'critical');
        this.addFeedItem(`Error: ${error.message}`, 'error');
    }

    updateEngagementMetrics(interaction) {
        // Simple engagement calculation based on interaction frequency
        const now = Date.now();
        const recentInteractions = this.metrics.analytics.interactions;
        
        // Update satisfaction based on interaction patterns
        const satisfaction = Math.min(4.5 + (recentInteractions / 1000), 5.0);
        this.updateMetricDisplay('satisfaction', satisfaction.toFixed(1) + '/5');
        
        // Update engagement rate
        const engagementRate = Math.min(85 + (recentInteractions / 100), 95);
        this.updateMetricDisplay('engagement', engagementRate.toFixed(1) + '%');
    }

    updateAnalytics() {
        // Simulate real analytics data
        this.metrics.analytics.impressions += Math.floor(Math.random() * 50) + 10;
        this.metrics.analytics.uniqueUsers += Math.floor(Math.random() * 5) + 1;
        this.metrics.analytics.sessions += Math.floor(Math.random() * 10) + 2;
        
        this.updateAnalyticsDisplay();
    }

    updateAnalyticsDisplay() {
        this.updateMetricDisplay('impressions', this.metrics.analytics.impressions.toLocaleString());
        
        const conversionRate = ((this.metrics.analytics.interactions / this.metrics.analytics.impressions) * 100).toFixed(2);
        this.updateMetricDisplay('conversion', conversionRate + '%');
        
        const bounceRate = Math.max(45 - (this.metrics.analytics.interactions / 10), 15).toFixed(1);
        this.updateMetricDisplay('bounceRate', bounceRate + '%');
    }

    updateMetricDisplay(metricId, value) {
        const element = document.getElementById(metricId);
        if (element) {
            element.textContent = value;
        }
    }

    createAlert(category, message, severity = 'info') {
        const alert = {
            id: Date.now(),
            category: category,
            message: message,
            severity: severity,
            timestamp: new Date(),
            acknowledged: false
        };
        
        this.alerts.unshift(alert);
        
        // Keep only last 20 alerts
        if (this.alerts.length > 20) {
            this.alerts = this.alerts.slice(0, 20);
        }
        
        this.updateAlertsDisplay();
    }

    addFeedItem(message, type = 'info') {
        const feedItem = {
            id: Date.now(),
            message: message,
            type: type,
            timestamp: new Date()
        };
        
        this.feedItems.unshift(feedItem);
        
        // Keep only last 50 feed items
        if (this.feedItems.length > 50) {
            this.feedItems = this.feedItems.slice(0, 50);
        }
        
        this.updateFeedDisplay();
    }

    updateAlertsDisplay() {
        const alertsList = document.getElementById('alertsList');
        const alertCount = document.getElementById('alertCount');
        
        if (!alertsList) return;
        
        alertCount.textContent = `${this.alerts.length} alerts`;
        
        alertsList.innerHTML = this.alerts.slice(0, 10).map(alert => {
            const icon = this.getAlertIcon(alert.severity);
            return `
                <div class="alert-item ${alert.severity}">
                    <span class="feed-icon">${icon}</span>
                    <div class="feed-content">
                        <div class="feed-message">${alert.message}</div>
                        <div class="feed-time">${alert.timestamp.toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    updateFeedDisplay() {
        const liveFeed = document.getElementById('liveFeed');
        const feedCount = document.getElementById('feedCount');
        
        if (!liveFeed) return;
        
        feedCount.textContent = `${this.feedItems.length} events`;
        
        liveFeed.innerHTML = this.feedItems.slice(0, 20).map(item => {
            const icon = this.getFeedIcon(item.type);
            return `
                <div class="feed-item ${item.type}">
                    <span class="feed-icon">${icon}</span>
                    <div class="feed-content">
                        <div class="feed-message">${item.message}</div>
                        <div class="feed-time">${item.timestamp.toLocaleTimeString()}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    getAlertIcon(severity) {
        const icons = {
            info: 'ℹ️',
            warning: '⚠️',
            critical: '🚨'
        };
        return icons[severity] || 'ℹ️';
    }

    getFeedIcon(type) {
        const icons = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        return icons[type] || 'ℹ️';
    }

    checkAlerts() {
        // Check performance thresholds
        const latestMetrics = this.getLatestMetrics();
        
        if (latestMetrics.memoryUsage > this.thresholds.memoryUsage) {
            this.createAlert('Memory', 'High memory usage detected', 'warning');
        }
        
        if (latestMetrics.fps < this.thresholds.fps) {
            this.createAlert('Performance', 'Low FPS detected', 'warning');
        }
        
        // Check error rate
        const errorRate = this.calculateErrorRate();
        if (errorRate > this.thresholds.errorRate) {
            this.createAlert('Errors', `High error rate: ${(errorRate * 100).toFixed(2)}%`, 'critical');
        }
    }

    getLatestMetrics() {
        return {
            loadTime: this.getLatest('loadTime'),
            fps: this.getLatest('animationFPS'),
            memoryUsage: this.getLatest('memoryUsage'),
            cpuUsage: this.getLatest('cpuUsage')
        };
    }

    getLatest(metric) {
        const data = this.metrics.performance[metric];
        return data.length > 0 ? data[data.length - 1].value : 0;
    }

    calculateErrorRate() {
        const timeWindow = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();
        
        const recentErrors = this.metrics.errors.timeline.filter(
            error => now - error.timestamp < timeWindow
        );
        
        const totalEvents = this.metrics.analytics.impressions || 1;
        return recentErrors.length / totalEvents;
    }

    initializeCharts() {
        // Initialize chart placeholders
        const chartCanvases = [
            'performanceChart',
            'uxChart',
            'errorChart',
            'analyticsChart'
        ];
        
        chartCanvases.forEach(canvasId => {
            const canvas = document.getElementById(canvasId);
            if (canvas) {
                this.initializeChart(canvasId, canvas);
            }
        });
        
        // Initialize performance heatmap
        this.initializePerformanceHeatmap();
    }

    initializeChart(chartId, canvas) {
        const ctx = canvas.getContext('2d');
        
        // Simple chart rendering for demonstration
        ctx.fillStyle = 'rgba(0, 210, 255, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.strokeStyle = '#00d2ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        // Generate sample data line
        for (let i = 0; i < canvas.width; i += 10) {
            const y = canvas.height / 2 + Math.sin(i / 50) * 50;
            if (i === 0) {
                ctx.moveTo(i, y);
            } else {
                ctx.lineTo(i, y);
            }
        }
        
        ctx.stroke();
        
        this.charts.set(chartId, { canvas, ctx });
    }

    initializePerformanceHeatmap() {
        const heatmap = document.getElementById('performanceHeatmap');
        if (!heatmap) return;
        
        // Generate 24 hours worth of performance data (one cell per hour)
        for (let i = 0; i < 24; i++) {
            const cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Simulate performance data
            const performance = Math.random();
            if (performance > 0.8) {
                cell.classList.add('excellent');
            } else if (performance > 0.6) {
                cell.classList.add('good');
            } else if (performance > 0.4) {
                cell.classList.add('fair');
            } else {
                cell.classList.add('poor');
            }
            
            cell.title = `Hour ${i}: ${(performance * 100).toFixed(1)}% performance`;
            heatmap.appendChild(cell);
        }
    }

    generateMockData() {
        // Generate some initial data for demonstration
        this.addFeedItem('Dashboard initialized successfully', 'success');
        this.addFeedItem('Performance monitoring started', 'info');
        this.addFeedItem('User tracking enabled', 'info');
        
        // Initialize metrics with some baseline values
        this.updateMetricDisplay('loadTime', '1.2s');
        this.updateMetricDisplay('animationFPS', '60 fps');
        this.updateMetricDisplay('memoryUsage', '18.5 MB');
        this.updateMetricDisplay('satisfaction', '4.6/5');
        this.updateMetricDisplay('impressions', '12,847');
        this.updateMetricDisplay('engagement', '87.3%');
        this.updateMetricDisplay('conversion', '3.2%');
        this.updateMetricDisplay('bounceRate', '28.5%');
        
        // Add some sample alerts
        this.createAlert('System', 'Monitoring system online', 'info');
        this.createAlert('Performance', 'Baseline metrics established', 'info');
    }

    // A/B Testing functionality
    createABTest(name, variants, trafficSplit = 0.5) {
        const test = {
            id: Date.now(),
            name: name,
            variants: variants,
            trafficSplit: trafficSplit,
            startTime: new Date(),
            results: {
                variantA: { impressions: 0, conversions: 0 },
                variantB: { impressions: 0, conversions: 0 }
            },
            status: 'active'
        };
        
        this.abTests.set(test.id, test);
        this.updateABTestsDisplay();
        
        this.log(`A/B test created: ${name}`, 'success');
        return test.id;
    }

    assignUserToVariant(testId, userId) {
        const test = this.abTests.get(testId);
        if (!test || test.status !== 'active') return null;
        
        // Simple hash-based assignment
        const hash = this.simpleHash(userId + testId);
        const variant = hash < test.trafficSplit ? 'A' : 'B';
        
        // Record impression
        test.results[`variant${variant}`].impressions++;
        
        return variant;
    }

    recordABTestConversion(testId, variant) {
        const test = this.abTests.get(testId);
        if (!test) return;
        
        test.results[`variant${variant}`].conversions++;
        this.updateABTestsDisplay();
    }

    updateABTestsDisplay() {
        const abTestsList = document.getElementById('abTestsList');
        if (!abTestsList) return;
        
        abTestsList.innerHTML = Array.from(this.abTests.values()).map(test => {
            const variantA = test.results.variantA;
            const variantB = test.results.variantB;
            
            const conversionRateA = variantA.impressions > 0 ? 
                (variantA.conversions / variantA.impressions * 100).toFixed(2) : '0.00';
            const conversionRateB = variantB.impressions > 0 ? 
                (variantB.conversions / variantB.impressions * 100).toFixed(2) : '0.00';
            
            return `
                <div class="metric-card">
                    <h4>${test.name}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin: 1rem 0;">
                        <div>
                            <strong>Variant A</strong><br>
                            Impressions: ${variantA.impressions}<br>
                            Conversions: ${variantA.conversions}<br>
                            Rate: ${conversionRateA}%
                        </div>
                        <div>
                            <strong>Variant B</strong><br>
                            Impressions: ${variantB.impressions}<br>
                            Conversions: ${variantB.conversions}<br>
                            Rate: ${conversionRateB}%
                        </div>
                    </div>
                    <div class="metric-change ${conversionRateB > conversionRateA ? 'positive' : 'negative'}">
                        Winner: Variant ${conversionRateB > conversionRateA ? 'B' : 'A'}
                        (${Math.abs(conversionRateB - conversionRateA).toFixed(2)}% difference)
                    </div>
                </div>
            `;
        }).join('');
    }

    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash) / 2147483647; // Normalize to 0-1
    }

    // Export data functionality
    exportData(timeRange = '24h') {
        const data = {
            timeRange: timeRange,
            exportTime: new Date().toISOString(),
            metrics: this.metrics,
            alerts: this.alerts,
            feedItems: this.feedItems.slice(0, 100),
            abTests: Array.from(this.abTests.values())
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `svg-monitoring-data-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.log('Monitoring data exported', 'success');
    }

    generateReport(format = 'html') {
        const report = {
            generatedAt: new Date().toISOString(),
            summary: this.generateSummary(),
            performance: this.generatePerformanceReport(),
            userExperience: this.generateUXReport(),
            errors: this.generateErrorReport(),
            recommendations: this.generateRecommendations()
        };
        
        if (format === 'json') {
            return JSON.stringify(report, null, 2);
        }
        
        return this.generateHTMLReport(report);
    }

    generateSummary() {
        const latestMetrics = this.getLatestMetrics();
        
        return {
            overallHealth: this.calculateOverallHealth(),
            keyMetrics: latestMetrics,
            totalErrors: this.metrics.errors.count,
            totalAlerts: this.alerts.length,
            uptime: '99.8%',
            activeUsers: this.metrics.analytics.uniqueUsers
        };
    }

    calculateOverallHealth() {
        const metrics = this.getLatestMetrics();
        let score = 100;
        
        // Deduct points for performance issues
        if (metrics.loadTime > 2000) score -= 20;
        if (metrics.fps < 45) score -= 15;
        if (metrics.memoryUsage > 50) score -= 10;
        if (this.metrics.errors.count > 5) score -= 25;
        
        return Math.max(score, 0);
    }

    generatePerformanceReport() {
        return {
            averageLoadTime: this.calculateAverage('loadTime'),
            averageFPS: this.calculateAverage('animationFPS'),
            averageMemoryUsage: this.calculateAverage('memoryUsage'),
            performanceTrend: this.calculateTrend('loadTime')
        };
    }

    generateUXReport() {
        return {
            averageSatisfaction: 4.6,
            engagementRate: 87.3,
            bounceRate: 28.5,
            conversionRate: 3.2,
            userJourneyHealth: 'Excellent'
        };
    }

    generateErrorReport() {
        return {
            totalErrors: this.metrics.errors.count,
            errorTypes: this.metrics.errors.types,
            errorRate: this.calculateErrorRate(),
            criticalErrors: this.alerts.filter(a => a.severity === 'critical').length
        };
    }

    generateRecommendations() {
        const recommendations = [];
        const latestMetrics = this.getLatestMetrics();
        
        if (latestMetrics.loadTime > 2000) {
            recommendations.push({
                category: 'Performance',
                priority: 'High',
                issue: 'Load time exceeds 2 seconds',
                recommendation: 'Optimize SVG file size and implement lazy loading'
            });
        }
        
        if (latestMetrics.fps < 45) {
            recommendations.push({
                category: 'Animation',
                priority: 'Medium',
                issue: 'Low animation frame rate',
                recommendation: 'Reduce animation complexity or use CSS transforms'
            });
        }
        
        if (this.metrics.errors.count > 0) {
            recommendations.push({
                category: 'Reliability',
                priority: 'High',
                issue: 'JavaScript errors detected',
                recommendation: 'Review error logs and implement error boundaries'
            });
        }
        
        return recommendations;
    }

    calculateAverage(metric) {
        const data = this.metrics.performance[metric];
        if (data.length === 0) return 0;
        
        const sum = data.reduce((acc, item) => acc + item.value, 0);
        return (sum / data.length).toFixed(2);
    }

    calculateTrend(metric) {
        const data = this.metrics.performance[metric];
        if (data.length < 2) return 'stable';
        
        const recent = data.slice(-10);
        const older = data.slice(-20, -10);
        
        const recentAvg = recent.reduce((acc, item) => acc + item.value, 0) / recent.length;
        const olderAvg = older.reduce((acc, item) => acc + item.value, 0) / older.length;
        
        const change = ((recentAvg - olderAvg) / olderAvg) * 100;
        
        if (change > 5) return 'improving';
        if (change < -5) return 'degrading';
        return 'stable';
    }

    generateHTMLReport(report) {
        return `
            <html>
            <head>
                <title>SVG Monitoring Report</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 2rem; }
                    .metric { background: #f5f5f5; padding: 1rem; margin: 1rem 0; border-radius: 8px; }
                    .critical { border-left: 4px solid #f44336; }
                    .warning { border-left: 4px solid #ffc107; }
                    .good { border-left: 4px solid #4caf50; }
                </style>
            </head>
            <body>
                <h1>SVG Performance Monitoring Report</h1>
                <p>Generated: ${report.generatedAt}</p>
                
                <h2>Summary</h2>
                <div class="metric ${report.summary.overallHealth > 80 ? 'good' : report.summary.overallHealth > 60 ? 'warning' : 'critical'}">
                    <h3>Overall Health: ${report.summary.overallHealth}%</h3>
                    <p>Active Users: ${report.summary.activeUsers}</p>
                    <p>Total Errors: ${report.summary.totalErrors}</p>
                    <p>Uptime: ${report.summary.uptime}</p>
                </div>
                
                <h2>Performance Metrics</h2>
                <div class="metric">
                    <p>Average Load Time: ${report.performance.averageLoadTime}ms</p>
                    <p>Average FPS: ${report.performance.averageFPS}</p>
                    <p>Memory Usage: ${report.performance.averageMemoryUsage}MB</p>
                </div>
                
                <h2>Recommendations</h2>
                ${report.recommendations.map(rec => `
                    <div class="metric ${rec.priority === 'High' ? 'critical' : 'warning'}">
                        <h4>${rec.category} - ${rec.priority} Priority</h4>
                        <p><strong>Issue:</strong> ${rec.issue}</p>
                        <p><strong>Recommendation:</strong> ${rec.recommendation}</p>
                    </div>
                `).join('')}
            </body>
            </html>
        `;
    }
}

// Global functions for dashboard interface
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page-content').forEach(page => {
        page.classList.remove('active');
    });
    
    // Remove active class from nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected page
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
    }
    
    // Add active class to nav item
    const navItems = document.querySelectorAll('.nav-item');
    const pageIndex = ['overview', 'performance', 'user-experience', 'errors', 'analytics', 'ab-testing'].indexOf(pageName);
    if (navItems[pageIndex]) {
        navItems[pageIndex].classList.add('active');
    }
    
    // Update current page
    if (window.monitor) {
        window.monitor.currentPage = pageName;
    }
}

function setTimeRange(range) {
    // Update chart controls
    document.querySelectorAll('.chart-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Update charts with new time range
    if (window.monitor) {
        window.monitor.log(`Time range changed to: ${range}`);
    }
}

// Initialize when script loads
window.addEventListener('DOMContentLoaded', () => {
    window.monitor = new SVGMonitoringDashboard();
});