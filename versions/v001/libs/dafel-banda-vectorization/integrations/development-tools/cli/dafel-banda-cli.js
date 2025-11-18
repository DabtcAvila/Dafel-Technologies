#!/usr/bin/env node

/**
 * Dafel Banda CLI Tool
 * 
 * A powerful command-line interface for managing Dafel Banda SVG animations
 * 
 * Features:
 * - Generate animations with custom parameters
 * - Batch processing capabilities
 * - Color scheme management
 * - Performance optimization
 * - Integration with build tools
 * - Analytics and reporting
 */

const fs = require('fs');
const path = require('path');
const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');
const boxen = require('boxen');
const figlet = require('figlet');

// Package info
const packageJson = require('./package.json');

// Configuration
const CONFIG_FILE = 'dafel-banda.config.json';
const TEMPLATES_DIR = path.join(__dirname, 'templates');
const OUTPUT_DIR = './dafel-banda-output';

// Color schemes
const COLOR_SCHEMES = {
    default: {
        name: 'Default Blue',
        colors: ['#D0E8F5', '#A8D1E6', '#7DBBDB', '#6FB3D9', '#5AAED0', '#3493B8', '#1E7FA4']
    },
    dark: {
        name: 'Dark Mode',
        colors: ['#1a1a2e', '#16213e', '#0f3460', '#0e4b99', '#0d4f8c', '#0c4d84', '#0b4a7c']
    },
    sunset: {
        name: 'Sunset',
        colors: ['#FF6B6B', '#FF8E53', '#FFE66D', '#FF6B9D', '#C44569', '#F8B500', '#FF6348']
    },
    ocean: {
        name: 'Ocean',
        colors: ['#0077BE', '#00A8E8', '#007EA7', '#003459', '#00171F', '#007BA7', '#0093C4']
    },
    forest: {
        name: 'Forest',
        colors: ['#2D5016', '#61892F', '#86C232', '#6B6E70', '#474B4F', '#222629', '#1B1B2F']
    }
};

// Animation types
const ANIMATIONS = {
    fadeIn: 'Smooth fade-in effect',
    wave: 'Horizontal wave motion',
    pulse: 'Pulsating opacity and scale',
    staggerIn: 'Staggered layer entrance',
    interactive: 'Hover-based interactions',
    scroll: 'Scroll-triggered animations',
    waveSmooth: 'Complex wave patterns',
    gridShimmer: 'Grid shimmer effects'
};

class DafelBandaCLI {
    constructor() {
        this.config = this.loadConfig();
        this.setupCommands();
    }

    setupCommands() {
        program
            .name('dafel-banda')
            .description('CLI tool for Dafel Banda SVG animations')
            .version(packageJson.version);

        // Generate command
        program
            .command('generate')
            .alias('g')
            .description('Generate a new Dafel Banda animation')
            .option('-a, --animation <type>', 'Animation type')
            .option('-c, --color-scheme <scheme>', 'Color scheme')
            .option('-s, --size <size>', 'Size preset (small, medium, large)', 'large')
            .option('-o, --output <path>', 'Output directory', OUTPUT_DIR)
            .option('-i, --interactive', 'Enable interactive mode')
            .option('--no-css', 'Skip CSS generation')
            .option('--no-js', 'Skip JavaScript generation')
            .action(this.generateCommand.bind(this));

        // Batch command
        program
            .command('batch')
            .alias('b')
            .description('Generate multiple animations in batch')
            .option('-s, --schemes <schemes...>', 'Color schemes to generate')
            .option('-a, --animations <animations...>', 'Animation types to generate')
            .option('-o, --output <path>', 'Output directory', OUTPUT_DIR)
            .option('--format <format>', 'Output format (svg, component, both)', 'both')
            .action(this.batchCommand.bind(this));

        // Optimize command
        program
            .command('optimize')
            .alias('opt')
            .description('Optimize existing SVG files')
            .argument('<files...>', 'SVG files to optimize')
            .option('-o, --output <path>', 'Output directory')
            .option('--quality <level>', 'Optimization level (1-5)', '3')
            .action(this.optimizeCommand.bind(this));

        // Preview command
        program
            .command('preview')
            .alias('p')
            .description('Preview animations in browser')
            .option('-p, --port <port>', 'Server port', '3000')
            .option('--open', 'Open browser automatically')
            .action(this.previewCommand.bind(this));

        // Init command
        program
            .command('init')
            .description('Initialize a new Dafel Banda project')
            .option('--force', 'Force overwrite existing config')
            .action(this.initCommand.bind(this));

        // Config command
        program
            .command('config')
            .description('Manage configuration')
            .option('--set <key=value>', 'Set configuration value')
            .option('--get <key>', 'Get configuration value')
            .option('--list', 'List all configuration')
            .action(this.configCommand.bind(this));

        // Analytics command
        program
            .command('analytics')
            .alias('stats')
            .description('View usage analytics and performance stats')
            .option('--export <format>', 'Export format (json, csv)')
            .action(this.analyticsCommand.bind(this));

        // Build command
        program
            .command('build')
            .description('Build production-ready assets')
            .option('-e, --env <environment>', 'Build environment', 'production')
            .option('--minify', 'Minify output files')
            .option('--gzip', 'Generate gzipped versions')
            .action(this.buildCommand.bind(this));

        program.parse();
    }

    async generateCommand(options) {
        console.log(chalk.cyan(figlet.textSync('Dafel Banda', { horizontalLayout: 'full' })));
        console.log(chalk.gray('Enterprise SVG Animation Generator\n'));

        let settings = {};

        if (options.interactive || (!options.animation && !options.colorScheme)) {
            settings = await this.promptForSettings();
        } else {
            settings = {
                animation: options.animation || 'fadeIn',
                colorScheme: options.colorScheme || 'default',
                size: options.size,
                includeCss: options.css !== false,
                includeJs: options.js !== false
            };
        }

        const spinner = ora('Generating Dafel Banda animation...').start();

        try {
            const result = await this.generateAnimation(settings, options.output);
            spinner.succeed('Animation generated successfully!');

            this.showGenerationSummary(result);
            
            if (result.analytics) {
                this.trackUsage('generate', settings);
            }

        } catch (error) {
            spinner.fail(`Generation failed: ${error.message}`);
            process.exit(1);
        }
    }

    async batchCommand(options) {
        console.log(chalk.cyan('🚀 Batch Generation Mode\n'));

        const schemes = options.schemes || Object.keys(COLOR_SCHEMES);
        const animations = options.animations || Object.keys(ANIMATIONS);
        
        const totalJobs = schemes.length * animations.length;
        
        console.log(chalk.yellow(`Generating ${totalJobs} animations...`));
        console.log(chalk.gray(`Color schemes: ${schemes.join(', ')}`));
        console.log(chalk.gray(`Animations: ${animations.join(', ')}\n`));

        const spinner = ora('Processing batch generation...').start();
        const results = [];

        for (const scheme of schemes) {
            for (const animation of animations) {
                try {
                    const settings = {
                        animation,
                        colorScheme: scheme,
                        size: 'large',
                        includeCss: true,
                        includeJs: true
                    };

                    const result = await this.generateAnimation(settings, options.output, true);
                    results.push({ ...settings, ...result });

                    spinner.text = `Generated ${animation} with ${scheme} scheme (${results.length}/${totalJobs})`;

                } catch (error) {
                    console.error(chalk.red(`Failed to generate ${animation} with ${scheme}: ${error.message}`));
                }
            }
        }

        spinner.succeed(`Batch generation completed! Generated ${results.length} animations.`);
        this.showBatchSummary(results);
    }

    async optimizeCommand(files, options) {
        console.log(chalk.cyan('⚡ SVG Optimization\n'));

        const spinner = ora('Optimizing SVG files...').start();
        const results = [];

        for (const file of files) {
            try {
                const result = await this.optimizeSVG(file, options);
                results.push(result);
                spinner.text = `Optimized ${path.basename(file)}`;
            } catch (error) {
                console.error(chalk.red(`Failed to optimize ${file}: ${error.message}`));
            }
        }

        spinner.succeed(`Optimization completed! Processed ${results.length} files.`);
        this.showOptimizationSummary(results);
    }

    async previewCommand(options) {
        console.log(chalk.cyan('🌐 Starting preview server...\n'));

        const express = require('express');
        const app = express();

        // Serve static files
        app.use(express.static(OUTPUT_DIR));
        app.use('/assets', express.static(path.join(__dirname, 'assets')));

        // Preview page
        app.get('/', (req, res) => {
            res.send(this.generatePreviewHTML());
        });

        // API endpoints
        app.get('/api/animations', (req, res) => {
            res.json(this.getAvailableAnimations());
        });

        app.listen(options.port, () => {
            const url = `http://localhost:${options.port}`;
            console.log(boxen(
                `Preview server running at:\n${chalk.cyan(url)}`,
                { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
            ));

            if (options.open) {
                const open = require('open');
                open(url);
            }
        });
    }

    async initCommand(options) {
        console.log(chalk.cyan('🏗️  Initializing Dafel Banda project...\n'));

        if (fs.existsSync(CONFIG_FILE) && !options.force) {
            const { overwrite } = await inquirer.prompt([{
                type: 'confirm',
                name: 'overwrite',
                message: 'Configuration file already exists. Overwrite?',
                default: false
            }]);

            if (!overwrite) {
                console.log(chalk.yellow('Initialization cancelled.'));
                return;
            }
        }

        const config = await this.promptForProjectConfig();
        
        // Create config file
        fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
        
        // Create directory structure
        this.createProjectStructure(config);

        console.log(chalk.green('✅ Project initialized successfully!'));
        console.log(chalk.gray(`Configuration saved to: ${CONFIG_FILE}`));
    }

    async configCommand(options) {
        if (options.set) {
            const [key, value] = options.set.split('=');
            this.setConfig(key, value);
            console.log(chalk.green(`✅ Set ${key} = ${value}`));
        } else if (options.get) {
            const value = this.getConfig(options.get);
            console.log(chalk.cyan(`${options.get}: ${value}`));
        } else if (options.list) {
            this.listConfig();
        } else {
            console.log(chalk.yellow('Please specify --set, --get, or --list'));
        }
    }

    async analyticsCommand(options) {
        console.log(chalk.cyan('📊 Dafel Banda Analytics\n'));

        const analytics = this.getAnalytics();
        
        if (options.export) {
            const filename = `dafel-banda-analytics.${options.export}`;
            this.exportAnalytics(analytics, options.export, filename);
            console.log(chalk.green(`✅ Analytics exported to ${filename}`));
        } else {
            this.displayAnalytics(analytics);
        }
    }

    async buildCommand(options) {
        console.log(chalk.cyan('🏗️  Building production assets...\n'));

        const spinner = ora('Building...').start();

        try {
            const buildResult = await this.buildProduction(options);
            spinner.succeed('Build completed successfully!');
            
            this.showBuildSummary(buildResult);

        } catch (error) {
            spinner.fail(`Build failed: ${error.message}`);
            process.exit(1);
        }
    }

    // Helper methods
    async promptForSettings() {
        return await inquirer.prompt([
            {
                type: 'list',
                name: 'animation',
                message: 'Select animation type:',
                choices: Object.entries(ANIMATIONS).map(([key, desc]) => ({
                    name: `${key} - ${desc}`,
                    value: key
                }))
            },
            {
                type: 'list',
                name: 'colorScheme',
                message: 'Select color scheme:',
                choices: Object.entries(COLOR_SCHEMES).map(([key, scheme]) => ({
                    name: scheme.name,
                    value: key
                }))
            },
            {
                type: 'list',
                name: 'size',
                message: 'Select size:',
                choices: [
                    { name: 'Small (640×360)', value: 'small' },
                    { name: 'Medium (1024×576)', value: 'medium' },
                    { name: 'Large (1280×720)', value: 'large' }
                ],
                default: 'large'
            },
            {
                type: 'confirm',
                name: 'includeCss',
                message: 'Include CSS animations?',
                default: true
            },
            {
                type: 'confirm',
                name: 'includeJs',
                message: 'Include JavaScript integration?',
                default: true
            }
        ]);
    }

    async generateAnimation(settings, outputDir, isBatch = false) {
        // Ensure output directory exists
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        const fileName = isBatch 
            ? `dafel-banda-${settings.animation}-${settings.colorScheme}`
            : 'dafel-banda';

        // Generate SVG
        const svgContent = this.generateSVGContent(settings);
        const svgPath = path.join(outputDir, `${fileName}.svg`);
        fs.writeFileSync(svgPath, svgContent);

        const result = {
            svgPath,
            fileSize: fs.statSync(svgPath).size
        };

        // Generate CSS if requested
        if (settings.includeCss) {
            const cssContent = this.generateCSSContent(settings);
            const cssPath = path.join(outputDir, `${fileName}.css`);
            fs.writeFileSync(cssPath, cssContent);
            result.cssPath = cssPath;
        }

        // Generate JS if requested
        if (settings.includeJs) {
            const jsContent = this.generateJSContent(settings);
            const jsPath = path.join(outputDir, `${fileName}.js`);
            fs.writeFileSync(jsPath, jsContent);
            result.jsPath = jsPath;
        }

        // Generate component if applicable
        if (settings.framework) {
            const componentContent = this.generateComponentContent(settings);
            const ext = settings.framework === 'react' ? 'jsx' : 'vue';
            const componentPath = path.join(outputDir, `${fileName}.${ext}`);
            fs.writeFileSync(componentPath, componentContent);
            result.componentPath = componentPath;
        }

        return result;
    }

    generateSVGContent(settings) {
        const scheme = COLOR_SCHEMES[settings.colorScheme];
        const dimensions = this.getSizeDimensions(settings.size);
        
        return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${dimensions.width}" height="${dimensions.height}" 
     viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"
     class="dafel-banda animate-${settings.animation} scheme-${settings.colorScheme}">
    
    <defs>
        ${this.generateGradients(scheme.colors)}
        ${this.generatePatterns(scheme.colors)}
    </defs>
    
    ${this.generateLayers(scheme.colors, settings.animation)}
</svg>`;
    }

    generateGradients(colors) {
        return colors.map((color, index) => `
        <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="${this.darken(color, 0.2)}" />
        </linearGradient>`).join('\n');
    }

    generatePatterns(colors) {
        return `
        <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="18" height="18">
            <rect width="18" height="18" fill="none"/>
            <path d="M18 0L0 0 0 18" fill="none" stroke="${colors[0]}" stroke-width="1.5" opacity="0.25"/>
        </pattern>`;
    }

    generateLayers(colors, animation) {
        const layers = [];
        const layerCount = Math.min(colors.length, 7);
        
        for (let i = 0; i < layerCount; i++) {
            const yOffset = 180 + (i * 40);
            const opacity = 0.45 + (i * 0.05);
            
            layers.push(`
            <g class="layer-${i + 1}" opacity="${opacity}" 
               style="animation-delay: ${i * 0.1}s;">
                <path d="M0,${yOffset} C${1280 * 0.167},${yOffset - 60} ${1280 * 0.333},${yOffset + 60} ${1280 * 0.5},${yOffset} C${1280 * 0.667},${yOffset - 60} ${1280 * 0.833},${yOffset + 60} ${1280},${yOffset} L${1280},${yOffset + 180} C${1280 * 0.833},${yOffset + 240} ${1280 * 0.667},${yOffset + 120} ${1280 * 0.5},${yOffset + 180} C${1280 * 0.333},${yOffset + 240} ${1280 * 0.167},${yOffset + 120} 0,${yOffset + 180} Z" 
                      fill="url(#grad-${i})" class="band-curved"/>
            </g>`);
        }
        
        return layers.join('\n');
    }

    generateCSSContent(settings) {
        return `/* Dafel Banda Animation: ${settings.animation} */
.dafel-banda {
    display: block;
    width: 100%;
    height: auto;
    max-width: 100%;
}

.animate-${settings.animation} {
    animation: dafel-${settings.animation} ${this.getAnimationDuration(settings.animation)} ${this.getAnimationTiming(settings.animation)} ${this.getAnimationIteration(settings.animation)};
}

${this.getAnimationKeyframes(settings.animation)}

/* Responsive styles */
@media (max-width: 768px) {
    .dafel-banda {
        max-width: 100vw;
    }
}

/* Performance optimizations */
.dafel-banda * {
    will-change: transform, opacity;
    transform: translateZ(0);
}`;
    }

    generateJSContent(settings) {
        return `/**
 * Dafel Banda Animation Controller
 * Animation: ${settings.animation}
 * Color Scheme: ${settings.colorScheme}
 */

class DafelBandaController {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            animation: '${settings.animation}',
            colorScheme: '${settings.colorScheme}',
            autoPlay: true,
            loop: true,
            ...options
        };
        this.init();
    }
    
    init() {
        if (this.options.autoPlay) {
            this.play();
        }
        
        this.setupIntersectionObserver();
        this.setupPerformanceMonitoring();
    }
    
    play() {
        this.element.classList.add('animate-${settings.animation}');
    }
    
    pause() {
        this.element.style.animationPlayState = 'paused';
    }
    
    resume() {
        this.element.style.animationPlayState = 'running';
    }
    
    stop() {
        this.element.classList.remove('animate-${settings.animation}');
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.play();
                } else {
                    this.pause();
                }
            });
        });
        
        observer.observe(this.element);
    }
    
    setupPerformanceMonitoring() {
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach(entry => {
                    if (entry.duration > 16) {
                        console.warn('Dafel Banda: Animation frame took', entry.duration, 'ms');
                    }
                });
            });
            
            observer.observe({ entryTypes: ['measure'] });
        }
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.dafel-banda').forEach(el => {
        new DafelBandaController(el);
    });
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DafelBandaController;
}`;
    }

    getAnimationDuration(animation) {
        const durations = {
            fadeIn: '2s',
            wave: '4s',
            pulse: '3s',
            staggerIn: '1.5s',
            interactive: '0.8s',
            scroll: '1s',
            waveSmooth: '6s',
            gridShimmer: '2.5s'
        };
        return durations[animation] || '2s';
    }

    getAnimationTiming(animation) {
        const timings = {
            fadeIn: 'ease-out',
            wave: 'ease-in-out',
            pulse: 'ease-in-out',
            staggerIn: 'ease-out',
            interactive: 'ease-out',
            scroll: 'linear',
            waveSmooth: 'ease-in-out',
            gridShimmer: 'ease-in-out'
        };
        return timings[animation] || 'ease-in-out';
    }

    getAnimationIteration(animation) {
        const iterations = {
            fadeIn: '1',
            wave: 'infinite',
            pulse: 'infinite',
            staggerIn: '1',
            interactive: '1',
            scroll: '1',
            waveSmooth: 'infinite',
            gridShimmer: 'infinite'
        };
        return iterations[animation] || '1';
    }

    getAnimationKeyframes(animation) {
        const keyframes = {
            fadeIn: `@keyframes dafel-fadeIn {
    0% { opacity: 0; transform: translateY(30px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}`,
            wave: `@keyframes dafel-wave {
    0%, 100% { transform: translateX(0) scaleX(1); }
    25% { transform: translateX(5px) scaleX(1.01); }
    75% { transform: translateX(-5px) scaleX(0.99); }
}`,
            pulse: `@keyframes dafel-pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
}`
        };
        
        return keyframes[animation] || keyframes.fadeIn;
    }

    getSizeDimensions(size) {
        const dimensions = {
            small: { width: 640, height: 360 },
            medium: { width: 1024, height: 576 },
            large: { width: 1280, height: 720 }
        };
        return dimensions[size] || dimensions.large;
    }

    darken(color, amount) {
        // Simple color darkening (would need proper color manipulation library)
        return color;
    }

    showGenerationSummary(result) {
        console.log(boxen(
            chalk.green('✅ Generation Complete\n\n') +
            chalk.cyan('Generated Files:\n') +
            `${chalk.white('SVG:')} ${result.svgPath}\n` +
            (result.cssPath ? `${chalk.white('CSS:')} ${result.cssPath}\n` : '') +
            (result.jsPath ? `${chalk.white('JS:')} ${result.jsPath}\n` : '') +
            `\n${chalk.white('File Size:')} ${(result.fileSize / 1024).toFixed(2)} KB`,
            { padding: 1, borderColor: 'green', borderStyle: 'round' }
        ));
    }

    showBatchSummary(results) {
        const totalSize = results.reduce((sum, result) => sum + result.fileSize, 0);
        
        console.log(boxen(
            chalk.green(`✅ Batch Generation Complete\n\n`) +
            chalk.cyan(`Generated: ${results.length} animations\n`) +
            chalk.white(`Total Size: ${(totalSize / 1024).toFixed(2)} KB\n`) +
            chalk.white(`Average Size: ${(totalSize / results.length / 1024).toFixed(2)} KB`),
            { padding: 1, borderColor: 'green', borderStyle: 'round' }
        ));
    }

    loadConfig() {
        if (fs.existsSync(CONFIG_FILE)) {
            try {
                return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
            } catch (error) {
                console.warn(chalk.yellow('Warning: Invalid config file, using defaults'));
            }
        }
        return this.getDefaultConfig();
    }

    getDefaultConfig() {
        return {
            defaultAnimation: 'fadeIn',
            defaultColorScheme: 'default',
            outputDir: OUTPUT_DIR,
            includeCss: true,
            includeJs: true,
            analytics: false,
            optimizationLevel: 3
        };
    }

    trackUsage(command, data) {
        if (!this.config.analytics) return;
        
        const usage = {
            timestamp: new Date().toISOString(),
            command,
            data,
            version: packageJson.version
        };
        
        // Store analytics (simplified implementation)
        const analyticsFile = 'dafel-banda-analytics.json';
        let analytics = [];
        
        if (fs.existsSync(analyticsFile)) {
            try {
                analytics = JSON.parse(fs.readFileSync(analyticsFile, 'utf8'));
            } catch (error) {
                analytics = [];
            }
        }
        
        analytics.push(usage);
        
        // Keep only last 1000 entries
        if (analytics.length > 1000) {
            analytics = analytics.slice(-1000);
        }
        
        fs.writeFileSync(analyticsFile, JSON.stringify(analytics, null, 2));
    }
}

// Initialize CLI
new DafelBandaCLI();

module.exports = DafelBandaCLI;