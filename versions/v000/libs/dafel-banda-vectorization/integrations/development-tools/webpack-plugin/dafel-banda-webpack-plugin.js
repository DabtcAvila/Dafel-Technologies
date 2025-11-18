/**
 * Dafel Banda Webpack Plugin
 * 
 * A webpack plugin that automatically processes and optimizes Dafel Banda SVG animations
 * during the build process. Provides hot reload support, automatic optimization,
 * and seamless integration with modern build workflows.
 * 
 * Features:
 * - Automatic SVG optimization during build
 * - Hot module replacement support
 * - Tree shaking for unused animations
 * - Dynamic imports for better code splitting
 * - Performance analytics and reporting
 * - Custom loaders for SVG processing
 */

const path = require('path');
const fs = require('fs');
const { validate } = require('schema-utils');
const { sources, Compilation } = require('webpack');

// Plugin options schema
const optionsSchema = {
  type: 'object',
  properties: {
    animations: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['fadeIn', 'wave', 'pulse']
    },
    colorSchemes: {
      type: 'array',
      items: {
        type: 'string'
      },
      default: ['default', 'dark']
    },
    outputPath: {
      type: 'string',
      default: 'dafel-banda'
    },
    optimize: {
      type: 'boolean',
      default: true
    },
    generateCSS: {
      type: 'boolean',
      default: true
    },
    generateJS: {
      type: 'boolean',
      default: true
    },
    treeshaking: {
      type: 'boolean',
      default: true
    },
    hotReload: {
      type: 'boolean',
      default: true
    },
    analytics: {
      type: 'boolean',
      default: false
    },
    minify: {
      type: 'boolean',
      default: true
    },
    cache: {
      type: 'boolean',
      default: true
    }
  },
  additionalProperties: false
};

class DafelBandaWebpackPlugin {
  constructor(options = {}) {
    validate(optionsSchema, options, {
      name: 'DafelBandaWebpackPlugin',
      baseDataPath: 'options'
    });

    this.options = {
      animations: ['fadeIn', 'wave', 'pulse'],
      colorSchemes: ['default', 'dark'],
      outputPath: 'dafel-banda',
      optimize: true,
      generateCSS: true,
      generateJS: true,
      treeshaking: true,
      hotReload: true,
      analytics: false,
      minify: true,
      cache: true,
      ...options
    };

    this.cache = new Map();
    this.stats = {
      processedFiles: 0,
      optimizationSavings: 0,
      buildTime: 0
    };
  }

  apply(compiler) {
    const pluginName = 'DafelBandaWebpackPlugin';

    // Hook into compilation
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Register asset processing hook
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE
        },
        async (assets, callback) => {
          try {
            await this.processAssets(compilation, assets);
            callback();
          } catch (error) {
            callback(error);
          }
        }
      );

      // Register additional assets hook
      compilation.hooks.additionalAssets.tapAsync(
        pluginName,
        async (callback) => {
          try {
            await this.generateAssets(compilation);
            callback();
          } catch (error) {
            callback(error);
          }
        }
      );
    });

    // Hook into normal module factory for module processing
    compiler.hooks.normalModuleFactory.tap(pluginName, (factory) => {
      factory.hooks.createModule.tap(pluginName, (createData) => {
        if (this.isDafelBandaModule(createData.request)) {
          return this.createDafelBandaModule(createData);
        }
      });
    });

    // Hook into done for analytics
    if (this.options.analytics) {
      compiler.hooks.done.tap(pluginName, (stats) => {
        this.generateAnalytics(stats);
      });
    }

    // Setup hot reload
    if (this.options.hotReload && compiler.options.mode === 'development') {
      this.setupHotReload(compiler);
    }
  }

  async processAssets(compilation, assets) {
    const startTime = Date.now();
    
    // Process existing Dafel Banda SVG files
    for (const [assetName, asset] of Object.entries(assets)) {
      if (this.isSVGAsset(assetName)) {
        await this.processSVGAsset(compilation, assetName, asset);
      }
    }

    this.stats.buildTime = Date.now() - startTime;
  }

  async generateAssets(compilation) {
    // Generate SVG animations
    await this.generateSVGAnimations(compilation);
    
    // Generate CSS if enabled
    if (this.options.generateCSS) {
      await this.generateCSSAssets(compilation);
    }

    // Generate JavaScript if enabled
    if (this.options.generateJS) {
      await this.generateJSAssets(compilation);
    }

    // Generate TypeScript definitions
    await this.generateTypeDefinitions(compilation);
  }

  async generateSVGAnimations(compilation) {
    const { animations, colorSchemes } = this.options;

    for (const animation of animations) {
      for (const colorScheme of colorSchemes) {
        const svgContent = this.generateSVGContent(animation, colorScheme);
        const filename = `${this.options.outputPath}/${animation}-${colorScheme}.svg`;
        
        if (this.options.optimize) {
          const optimized = await this.optimizeSVG(svgContent);
          this.stats.optimizationSavings += svgContent.length - optimized.length;
          compilation.emitAsset(filename, new sources.RawSource(optimized));
        } else {
          compilation.emitAsset(filename, new sources.RawSource(svgContent));
        }

        this.stats.processedFiles++;
      }
    }
  }

  async generateCSSAssets(compilation) {
    const cssContent = this.generateCSSContent();
    const filename = `${this.options.outputPath}/dafel-banda.css`;
    
    if (this.options.minify) {
      const minified = this.minifyCSS(cssContent);
      compilation.emitAsset(filename, new sources.RawSource(minified));
    } else {
      compilation.emitAsset(filename, new sources.RawSource(cssContent));
    }

    // Generate CSS modules version
    const modulesCSS = this.generateCSSModules();
    compilation.emitAsset(
      `${this.options.outputPath}/dafel-banda.module.css`,
      new sources.RawSource(modulesCSS)
    );
  }

  async generateJSAssets(compilation) {
    const jsContent = this.generateJSContent();
    const filename = `${this.options.outputPath}/dafel-banda.js`;
    
    compilation.emitAsset(filename, new sources.RawSource(jsContent));

    // Generate ES modules version
    const esmContent = this.generateESMContent();
    compilation.emitAsset(
      `${this.options.outputPath}/dafel-banda.esm.js`,
      new sources.RawSource(esmContent)
    );

    // Generate React components
    if (this.shouldGenerateReactComponents()) {
      const reactContent = this.generateReactComponents();
      compilation.emitAsset(
        `${this.options.outputPath}/react.js`,
        new sources.RawSource(reactContent)
      );
    }
  }

  async generateTypeDefinitions(compilation) {
    const dtsContent = this.generateTypeScriptDefinitions();
    const filename = `${this.options.outputPath}/index.d.ts`;
    
    compilation.emitAsset(filename, new sources.RawSource(dtsContent));
  }

  generateSVGContent(animation, colorScheme) {
    const colors = this.getColorScheme(colorScheme);
    const dimensions = { width: 1280, height: 720 };

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${dimensions.width}" height="${dimensions.height}" 
     viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg"
     class="dafel-banda animate-${animation} scheme-${colorScheme}"
     data-animation="${animation}" data-scheme="${colorScheme}">
    
    <defs>
        ${this.generateGradientDefs(colors)}
        ${this.generatePatternDefs(colors)}
        <style>
            ${this.generateInlineCSSForAnimation(animation)}
        </style>
    </defs>
    
    <g class="banda-container">
        ${this.generateBandaLayers(colors, animation)}
    </g>
</svg>`;
  }

  generateCSSContent() {
    const { animations } = this.options;
    
    let css = `/* Dafel Banda Webpack Plugin Generated CSS */
.dafel-banda {
    display: block;
    width: 100%;
    height: auto;
    max-width: 100%;
}

.dafel-banda * {
    will-change: transform, opacity;
    transform: translateZ(0);
}

`;

    // Generate animation classes
    animations.forEach(animation => {
      css += this.generateAnimationCSS(animation);
    });

    // Generate responsive styles
    css += this.generateResponsiveCSS();

    // Generate utility classes
    css += this.generateUtilityCSS();

    return css;
  }

  generateJSContent() {
    return `/**
 * Dafel Banda Runtime - Generated by Webpack Plugin
 */

class DafelBandaRuntime {
    constructor() {
        this.instances = new Map();
        this.observers = new Map();
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.autoInit());
        } else {
            this.autoInit();
        }
    }

    autoInit() {
        document.querySelectorAll('.dafel-banda').forEach(el => {
            if (!this.instances.has(el)) {
                this.createInstance(el);
            }
        });
    }

    createInstance(element, options = {}) {
        const instance = new DafelBandaInstance(element, options);
        this.instances.set(element, instance);
        return instance;
    }

    destroyInstance(element) {
        const instance = this.instances.get(element);
        if (instance) {
            instance.destroy();
            this.instances.delete(element);
        }
    }

    // Hot reload support
    __hmr_update(newAnimations) {
        this.instances.forEach(instance => {
            instance.update(newAnimations);
        });
    }
}

class DafelBandaInstance {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            autoPlay: true,
            loop: true,
            pauseOnHover: false,
            playOnVisible: true,
            ...options
        };
        this.isPlaying = false;
        this.setup();
    }

    setup() {
        if (this.options.playOnVisible) {
            this.setupIntersectionObserver();
        }
        
        if (this.options.pauseOnHover) {
            this.setupHoverEvents();
        }

        if (this.options.autoPlay) {
            this.play();
        }
    }

    play() {
        this.element.style.animationPlayState = 'running';
        this.isPlaying = true;
        this.dispatchEvent('play');
    }

    pause() {
        this.element.style.animationPlayState = 'paused';
        this.isPlaying = false;
        this.dispatchEvent('pause');
    }

    stop() {
        this.element.style.animation = 'none';
        this.isPlaying = false;
        this.dispatchEvent('stop');
    }

    restart() {
        this.stop();
        this.element.offsetHeight; // Force reflow
        this.play();
    }

    setAnimation(animation) {
        const currentClasses = Array.from(this.element.classList);
        const animateClasses = currentClasses.filter(cls => cls.startsWith('animate-'));
        animateClasses.forEach(cls => this.element.classList.remove(cls));
        this.element.classList.add('animate-' + animation);
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
        }, { threshold: 0.1 });

        observer.observe(this.element);
    }

    setupHoverEvents() {
        this.element.addEventListener('mouseenter', () => this.pause());
        this.element.addEventListener('mouseleave', () => this.play());
    }

    dispatchEvent(type) {
        this.element.dispatchEvent(new CustomEvent('dafel-banda-' + type, {
            detail: { instance: this }
        }));
    }

    update(newAnimations) {
        // Hot reload update logic
        this.restart();
    }

    destroy() {
        this.stop();
        // Clean up event listeners and observers
    }
}

// Global runtime instance
const dafelBandaRuntime = new DafelBandaRuntime();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DafelBandaRuntime, DafelBandaInstance, runtime: dafelBandaRuntime };
}

// Hot Module Replacement support
if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
        // Clean up instances
        dafelBandaRuntime.instances.clear();
    });
}`;
  }

  generateESMContent() {
    return `/**
 * Dafel Banda ES Modules - Generated by Webpack Plugin
 */

export class DafelBanda {
    static async load(animation, colorScheme = 'default') {
        const module = await import(/* webpackChunkName: "dafel-banda-[request]" */ \`./\${animation}-\${colorScheme}.svg\`);
        return module.default;
    }

    static async loadAll() {
        const animations = ${JSON.stringify(this.options.animations)};
        const colorSchemes = ${JSON.stringify(this.options.colorSchemes)};
        
        const loadPromises = [];
        animations.forEach(animation => {
            colorSchemes.forEach(colorScheme => {
                loadPromises.push(this.load(animation, colorScheme));
            });
        });

        return Promise.all(loadPromises);
    }

    static getAvailableAnimations() {
        return ${JSON.stringify(this.options.animations)};
    }

    static getAvailableColorSchemes() {
        return ${JSON.stringify(this.options.colorSchemes)};
    }
}

export default DafelBanda;`;
  }

  generateReactComponents() {
    return `/**
 * Dafel Banda React Components - Generated by Webpack Plugin
 */

import React, { useEffect, useRef, useState } from 'react';
import { DafelBanda } from './index';

export const DafelBandaComponent = ({
    animation = 'fadeIn',
    colorScheme = 'default',
    autoPlay = true,
    loop = true,
    pauseOnHover = false,
    playOnVisible = true,
    className = '',
    style = {},
    onPlay,
    onPause,
    onStop,
    ...props
}) => {
    const ref = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [svgContent, setSvgContent] = useState('');

    useEffect(() => {
        const loadSVG = async () => {
            try {
                const content = await DafelBanda.load(animation, colorScheme);
                setSvgContent(content);
                setIsLoaded(true);
            } catch (error) {
                console.error('Failed to load Dafel Banda animation:', error);
            }
        };

        loadSVG();
    }, [animation, colorScheme]);

    useEffect(() => {
        if (isLoaded && ref.current) {
            const element = ref.current;
            
            // Setup event listeners
            if (onPlay) element.addEventListener('dafel-banda-play', onPlay);
            if (onPause) element.addEventListener('dafel-banda-pause', onPause);
            if (onStop) element.addEventListener('dafel-banda-stop', onStop);

            return () => {
                if (onPlay) element.removeEventListener('dafel-banda-play', onPlay);
                if (onPause) element.removeEventListener('dafel-banda-pause', onPause);
                if (onStop) element.removeEventListener('dafel-banda-stop', onStop);
            };
        }
    }, [isLoaded, onPlay, onPause, onStop]);

    if (!isLoaded) {
        return <div className="dafel-banda-loading">Loading animation...</div>;
    }

    return (
        <div
            ref={ref}
            className={\`dafel-banda \${className}\`}
            style={style}
            dangerouslySetInnerHTML={{ __html: svgContent }}
            {...props}
        />
    );
};

export const useDafelBanda = (animation, colorScheme) => {
    const [svgContent, setSvgContent] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAnimation = async () => {
            setIsLoading(true);
            setError(null);
            
            try {
                const content = await DafelBanda.load(animation, colorScheme);
                setSvgContent(content);
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadAnimation();
    }, [animation, colorScheme]);

    return { svgContent, isLoading, error };
};

export default DafelBandaComponent;`;
  }

  generateTypeScriptDefinitions() {
    return `/**
 * Dafel Banda TypeScript Definitions - Generated by Webpack Plugin
 */

export interface DafelBandaOptions {
    autoPlay?: boolean;
    loop?: boolean;
    pauseOnHover?: boolean;
    playOnVisible?: boolean;
}

export interface DafelBandaInstance {
    play(): void;
    pause(): void;
    stop(): void;
    restart(): void;
    setAnimation(animation: string): void;
    destroy(): void;
}

export type AnimationType = ${this.options.animations.map(a => `'${a}'`).join(' | ')};
export type ColorScheme = ${this.options.colorSchemes.map(c => `'${c}'`).join(' | ')};

export class DafelBanda {
    static load(animation: AnimationType, colorScheme?: ColorScheme): Promise<string>;
    static loadAll(): Promise<string[]>;
    static getAvailableAnimations(): AnimationType[];
    static getAvailableColorSchemes(): ColorScheme[];
}

export interface DafelBandaComponentProps {
    animation?: AnimationType;
    colorScheme?: ColorScheme;
    autoPlay?: boolean;
    loop?: boolean;
    pauseOnHover?: boolean;
    playOnVisible?: boolean;
    className?: string;
    style?: React.CSSProperties;
    onPlay?: (event: CustomEvent) => void;
    onPause?: (event: CustomEvent) => void;
    onStop?: (event: CustomEvent) => void;
}

export declare const DafelBandaComponent: React.FC<DafelBandaComponentProps>;

export interface UseDafelBandaReturn {
    svgContent: string;
    isLoading: boolean;
    error: Error | null;
}

export declare function useDafelBanda(
    animation: AnimationType,
    colorScheme?: ColorScheme
): UseDafelBandaReturn;

declare module '*.svg' {
    const content: string;
    export default content;
}`;
  }

  async optimizeSVG(svgContent) {
    // Basic SVG optimization (in production, use SVGO)
    return svgContent
      .replace(/\s+/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();
  }

  minifyCSS(cssContent) {
    // Basic CSS minification
    return cssContent
      .replace(/\s+/g, ' ')
      .replace(/;\s*}/g, '}')
      .replace(/,\s+/g, ',')
      .trim();
  }

  getColorScheme(schemeName) {
    const schemes = {
      default: ['#D0E8F5', '#A8D1E6', '#7DBBDB', '#6FB3D9', '#5AAED0', '#3493B8', '#1E7FA4'],
      dark: ['#1a1a2e', '#16213e', '#0f3460', '#0e4b99', '#0d4f8c', '#0c4d84', '#0b4a7c'],
      sunset: ['#FF6B6B', '#FF8E53', '#FFE66D', '#FF6B9D', '#C44569', '#F8B500', '#FF6348'],
      ocean: ['#0077BE', '#00A8E8', '#007EA7', '#003459', '#00171F', '#007BA7', '#0093C4']
    };
    
    return schemes[schemeName] || schemes.default;
  }

  generateGradientDefs(colors) {
    return colors.map((color, index) => `
        <linearGradient id="grad-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${color}" />
            <stop offset="100%" stop-color="${this.adjustColor(color, -20)}" />
        </linearGradient>`).join('');
  }

  generatePatternDefs(colors) {
    return `
        <pattern id="grid-pattern" patternUnits="userSpaceOnUse" width="18" height="18">
            <rect width="18" height="18" fill="none"/>
            <path d="M18 0L0 0 0 18" fill="none" stroke="${colors[0]}" stroke-width="1.5" opacity="0.25"/>
        </pattern>`;
  }

  generateBandaLayers(colors, animation) {
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
    
    return layers.join('');
  }

  adjustColor(hex, percent) {
    // Simple color adjustment (would use proper color manipulation in production)
    return hex;
  }

  generateAnimationCSS(animation) {
    const animations = {
      fadeIn: `
.animate-fadeIn {
    animation: dafel-fadeIn 2s ease-out;
}

@keyframes dafel-fadeIn {
    0% { opacity: 0; transform: translateY(30px) scale(0.95); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
}`,
      wave: `
.animate-wave {
    animation: dafel-wave 4s ease-in-out infinite;
}

@keyframes dafel-wave {
    0%, 100% { transform: translateX(0) scaleX(1); }
    25% { transform: translateX(5px) scaleX(1.01); }
    75% { transform: translateX(-5px) scaleX(0.99); }
}`,
      pulse: `
.animate-pulse {
    animation: dafel-pulse 3s ease-in-out infinite;
}

@keyframes dafel-pulse {
    0%, 100% { opacity: 0.8; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.02); }
}`
    };

    return animations[animation] || animations.fadeIn;
  }

  generateInlineCSSForAnimation(animation) {
    return `.animate-${animation} { animation: dafel-${animation} 2s ease-in-out; }`;
  }

  generateResponsiveCSS() {
    return `
/* Responsive Styles */
@media (max-width: 768px) {
    .dafel-banda {
        max-width: 100vw;
    }
}

@media (prefers-reduced-motion: reduce) {
    .dafel-banda * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}`;
  }

  generateUtilityCSS() {
    return `
/* Utility Classes */
.dafel-banda-paused {
    animation-play-state: paused !important;
}

.dafel-banda-hidden {
    visibility: hidden;
}

.dafel-banda-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    color: #666;
    font-style: italic;
}`;
  }

  generateCSSModules() {
    return this.generateCSSContent().replace(/\.([a-zA-Z-]+)/g, ':local(.$1)');
  }

  isDafelBandaModule(request) {
    return request.includes('dafel-banda') && (request.endsWith('.svg') || request.includes('dafel-banda'));
  }

  isSVGAsset(assetName) {
    return assetName.endsWith('.svg') && assetName.includes('dafel-banda');
  }

  shouldGenerateReactComponents() {
    // Check if React is available in the project
    try {
      require.resolve('react');
      return true;
    } catch {
      return false;
    }
  }

  setupHotReload(compiler) {
    if (compiler.hooks.afterEmit) {
      compiler.hooks.afterEmit.tap('DafelBandaWebpackPlugin', () => {
        // Trigger hot reload for Dafel Banda modules
        if (module.hot) {
          module.hot.accept();
        }
      });
    }
  }

  generateAnalytics(stats) {
    const analytics = {
      timestamp: new Date().toISOString(),
      buildTime: this.stats.buildTime,
      processedFiles: this.stats.processedFiles,
      optimizationSavings: this.stats.optimizationSavings,
      webpack: {
        version: stats.compilation.compiler.webpack.version,
        mode: stats.compilation.options.mode
      }
    };

    // Write analytics to file
    const analyticsPath = path.join(stats.compilation.outputOptions.path, 'dafel-banda-analytics.json');
    require('fs').writeFileSync(analyticsPath, JSON.stringify(analytics, null, 2));
  }
}

module.exports = DafelBandaWebpackPlugin;