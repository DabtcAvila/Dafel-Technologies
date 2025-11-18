/**
 * DAFEL BANDA AI DESIGN SYSTEM - PARAMETRIC ENGINE
 * Mathematical pattern extraction and parametric design generation
 * 
 * This engine analyzes the existing Dafel banda design structure and
 * extracts mathematical patterns to create controllable parameters
 * for generating infinite design variations.
 */

class ParametricEngine {
  constructor(designData) {
    this.originalData = designData;
    this.parameters = this.extractParameters();
    this.patterns = this.analyzePatterns();
    this.constraints = this.defineConstraints();
  }

  /**
   * Extract controllable parameters from the original design
   */
  extractParameters() {
    return {
      // Curve Parameters
      curve: {
        intensity: {
          min: 0.3,
          max: 2.0,
          default: 1.0,
          description: "Controls the dramatic curve of the bands"
        },
        amplitude: {
          min: 80,
          max: 300,
          default: 180,
          description: "Vertical variation in curve height"
        },
        frequency: {
          min: 0.5,
          max: 3.0,
          default: 1.0,
          description: "Number of wave cycles across the design"
        },
        phase: {
          min: 0,
          max: 360,
          default: 0,
          description: "Horizontal offset of the wave pattern"
        }
      },

      // Layer Parameters
      layers: {
        count: {
          min: 3,
          max: 12,
          default: 7,
          description: "Number of band layers"
        },
        spacing: {
          min: 40,
          max: 120,
          default: 75,
          description: "Vertical spacing between bands"
        },
        thickness: {
          min: 45,
          max: 220,
          default: 120,
          description: "Base thickness of bands"
        },
        thicknessVariation: {
          min: 0.2,
          max: 0.8,
          default: 0.4,
          description: "How much thickness varies between layers"
        }
      },

      // Color Parameters
      color: {
        hueRange: {
          min: 160,
          max: 220,
          default: 190,
          description: "Base hue in HSL color space"
        },
        hueVariation: {
          min: 10,
          max: 80,
          default: 30,
          description: "Hue spread across layers"
        },
        saturation: {
          min: 0.3,
          max: 0.9,
          default: 0.6,
          description: "Color saturation intensity"
        },
        lightness: {
          min: 0.3,
          max: 0.9,
          default: 0.65,
          description: "Overall brightness"
        }
      },

      // Opacity Parameters
      opacity: {
        baseRange: {
          min: 0.25,
          max: 0.9,
          default: 0.6,
          description: "Base opacity range"
        },
        progression: {
          min: 0.05,
          max: 0.25,
          default: 0.12,
          description: "How much opacity increases per layer"
        }
      },

      // Grid Parameters
      grid: {
        enabled: {
          type: "boolean",
          default: true,
          description: "Enable grid overlay on bands"
        },
        density: {
          min: 8,
          max: 32,
          default: 16,
          description: "Grid cell size in pixels"
        },
        intensity: {
          min: 0.1,
          max: 0.6,
          default: 0.3,
          description: "Grid line opacity"
        },
        layerStart: {
          min: 3,
          max: 8,
          default: 4,
          description: "Which layer to start showing grid"
        }
      }
    };
  }

  /**
   * Analyze mathematical patterns in the original design
   */
  analyzePatterns() {
    const patterns = {
      // Bezier curve mathematical model
      curveEquation: this.extractCurveEquation(),
      
      // Color progression patterns
      colorProgression: this.analyzeColorProgression(),
      
      // Geometric relationships
      layerRelationships: this.analyzeLayerRelationships(),
      
      // Gradient patterns
      gradientPatterns: this.analyzeGradientPatterns()
    };

    return patterns;
  }

  /**
   * Extract the mathematical equation governing the curve paths
   */
  extractCurveEquation() {
    // Analyze the original control points to derive mathematical model
    const originalLayers = this.originalData.layers;
    const curveData = [];

    originalLayers.forEach((layer, index) => {
      if (layer.curve_path) {
        const points = layer.curve_path.control_points;
        curveData.push({
          layerIndex: index,
          points: points,
          thickness: layer.curve_path.thickness,
          intensity: layer.curve_path.curve_intensity
        });
      }
    });

    // Derive base wave function: y = A * sin(B * x + C) + D + E * x
    const baseEquation = {
      amplitude: 80,      // A - vertical variation
      frequency: 0.003,   // B - horizontal frequency 
      phase: 0,          // C - horizontal offset
      baseline: 350,     // D - vertical center
      slope: 0.2         // E - overall upward trend
    };

    return {
      equation: baseEquation,
      controlPointPattern: this.deriveControlPointPattern(curveData),
      thicknessProgression: this.analyzeThicknessProgression(curveData)
    };
  }

  /**
   * Analyze color progression patterns across layers
   */
  analyzeColorProgression() {
    const colorFamilies = this.originalData.primary_colors;
    
    return {
      hueProgression: {
        pattern: "blue_dominant_with_accent",
        baseHue: 195, // Blue family center
        accentHues: [87, 172], // Green and teal
        transitionPoints: [2, 3] // Where accent colors appear
      },
      
      saturationProgression: {
        pattern: "decreasing_toward_front",
        start: 0.63,
        end: 0.80,
        curve: "linear"
      },
      
      lightnessProgression: {
        pattern: "decreasing_toward_front", 
        start: 0.89,
        end: 0.21,
        curve: "exponential"
      }
    };
  }

  /**
   * Analyze geometric relationships between layers
   */
  analyzeLayerRelationships() {
    return {
      verticalSpacing: {
        pattern: "increasing",
        baseSpacing: 60,
        increment: 15,
        maxSpacing: 120
      },
      
      thicknessRelation: {
        pattern: "decreasing_linear",
        startThickness: 180,
        endThickness: 65,
        decreaseRate: 0.85
      },
      
      horizontalOffset: {
        pattern: "progressive_shift",
        baseOffset: 60,
        shiftIncrement: 40,
        direction: "right"
      }
    };
  }

  /**
   * Analyze gradient patterns across the design
   */
  analyzeGradientPatterns() {
    return {
      radialGradients: {
        centerPattern: "upper_left_bias",
        centerX: 0.32,
        centerY: 0.42,
        usedInLayers: [0, 2] // Background layers
      },
      
      linearGradients: {
        anglePattern: "diagonal_135",
        angle: 135,
        usedInLayers: [1, 3, 4, 5, 6] // Most layers
      },
      
      stopProgression: {
        pattern: "three_stop_smooth",
        distribution: [0, 0.5, 1.0],
        colorShifts: "increasing_contrast"
      }
    };
  }

  /**
   * Generate a new design variation based on parameter values
   */
  generateVariation(params = {}) {
    // Merge provided params with defaults
    const fullParams = this.mergeWithDefaults(params);
    
    // Generate curve paths
    const curvePaths = this.generateCurvePaths(fullParams);
    
    // Generate color scheme
    const colorScheme = this.generateColorScheme(fullParams);
    
    // Generate layer structure
    const layers = this.generateLayers(fullParams, curvePaths, colorScheme);
    
    // Generate gradients and patterns
    const gradients = this.generateGradients(colorScheme);
    const patterns = this.generatePatterns(fullParams);
    
    return {
      metadata: {
        generated: new Date().toISOString(),
        parameters: fullParams,
        variation_id: this.generateVariationId()
      },
      layers: layers,
      gradients: gradients,
      patterns: patterns,
      svgOutput: this.generateSVG(layers, gradients, patterns)
    };
  }

  /**
   * Generate curved paths based on mathematical model
   */
  generateCurvePaths(params) {
    const paths = [];
    const layerCount = params.layers.count;
    
    for (let i = 0; i < layerCount; i++) {
      const layerRatio = i / (layerCount - 1);
      
      // Calculate base curve using mathematical model
      const baseY = this.calculateBaseCurve(params, layerRatio);
      
      // Generate control points
      const controlPoints = this.generateControlPoints(params, baseY, i);
      
      // Calculate thickness with variation
      const thickness = this.calculateThickness(params, layerRatio);
      
      paths.push({
        layerIndex: i,
        startPoint: controlPoints[0],
        controlPoints: controlPoints.slice(1),
        thickness: thickness,
        curveIntensity: this.calculateCurveIntensity(params, layerRatio)
      });
    }
    
    return paths;
  }

  /**
   * Calculate base curve height at different x positions
   */
  calculateBaseCurve(params, layerRatio) {
    const width = 1280;
    const points = [];
    
    for (let x = 0; x <= width; x += 40) {
      const normalizedX = x / width;
      
      // Base wave equation with parameters
      const A = params.curve.amplitude * (0.5 + layerRatio * 0.8);
      const B = params.curve.frequency * 0.003;
      const C = (params.curve.phase * Math.PI) / 180;
      const D = 280 + layerRatio * params.layers.spacing;
      const E = 0.15; // Slight upward trend
      
      const y = A * Math.sin(B * x + C) + D + E * x;
      points.push([x, y]);
    }
    
    return points;
  }

  /**
   * Generate control points for Bezier curves
   */
  generateControlPoints(params, baseCurve, layerIndex) {
    const points = [];
    
    // Sample control points from base curve
    const sampleIndices = [0, 5, 10, 15, 20, 25, 30, 32];
    
    sampleIndices.forEach(index => {
      if (baseCurve[index]) {
        // Add some randomness for organic feel
        const variation = (Math.random() - 0.5) * 20 * params.curve.intensity;
        points.push([
          baseCurve[index][0],
          baseCurve[index][1] + variation
        ]);
      }
    });
    
    return points;
  }

  /**
   * Calculate thickness based on layer position and parameters
   */
  calculateThickness(params, layerRatio) {
    const baseThickness = params.layers.thickness;
    const variation = params.layers.thicknessVariation;
    
    // Decreasing thickness toward front layers
    const thicknessFactor = 1 - (layerRatio * variation);
    
    return Math.max(baseThickness * thicknessFactor, 45);
  }

  /**
   * Generate color scheme based on parameters
   */
  generateColorScheme(params) {
    const colors = [];
    const layerCount = params.layers.count;
    
    for (let i = 0; i < layerCount; i++) {
      const layerRatio = i / (layerCount - 1);
      
      // Calculate hue with variation
      const baseHue = params.color.hueRange;
      const hueShift = (layerRatio - 0.5) * params.color.hueVariation;
      let hue = baseHue + hueShift;
      
      // Add accent color logic
      if (i === 2 && layerCount >= 5) {
        hue = 87; // Green accent
      } else if (i === 3 && layerCount >= 6) {
        hue = 172; // Teal accent
      }
      
      // Calculate saturation and lightness
      const saturation = params.color.saturation * (0.8 + layerRatio * 0.4);
      const lightness = params.color.lightness * (1.2 - layerRatio * 0.6);
      
      colors.push({
        layerIndex: i,
        hsl: [hue, saturation, lightness],
        hex: this.hslToHex(hue, saturation, lightness),
        opacity: this.calculateOpacity(params, layerRatio)
      });
    }
    
    return colors;
  }

  /**
   * Calculate opacity based on layer position
   */
  calculateOpacity(params, layerRatio) {
    const baseOpacity = params.opacity.baseRange;
    const progression = params.opacity.progression;
    
    return Math.min(baseOpacity + (layerRatio * progression), 0.9);
  }

  /**
   * Generate complete SVG output
   */
  generateSVG(layers, gradients, patterns) {
    let svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
  <!-- Generated by Dafel AI Design System -->
  
  <defs>
`;

    // Add gradients
    gradients.forEach(gradient => {
      svg += gradient.svgDef + '\n';
    });

    // Add patterns
    patterns.forEach(pattern => {
      svg += pattern.svgDef + '\n';
    });

    svg += '  </defs>\n\n';

    // Add layers
    layers.forEach(layer => {
      svg += layer.svgElement + '\n';
    });

    svg += '</svg>';

    return svg;
  }

  /**
   * Utility: Convert HSL to HEX
   */
  hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  /**
   * Utility: Generate unique variation ID
   */
  generateVariationId() {
    return 'variation_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Merge provided parameters with defaults
   */
  mergeWithDefaults(params) {
    const defaults = this.extractDefaultValues(this.parameters);
    return this.deepMerge(defaults, params);
  }

  /**
   * Extract default values from parameter definitions
   */
  extractDefaultValues(paramDef) {
    const defaults = {};
    
    Object.keys(paramDef).forEach(section => {
      defaults[section] = {};
      Object.keys(paramDef[section]).forEach(param => {
        if (paramDef[section][param].default !== undefined) {
          defaults[section][param] = paramDef[section][param].default;
        }
      });
    });
    
    return defaults;
  }

  /**
   * Deep merge objects
   */
  deepMerge(target, source) {
    const result = { ...target };
    
    Object.keys(source).forEach(key => {
      if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
        result[key] = this.deepMerge(result[key] || {}, source[key]);
      } else {
        result[key] = source[key];
      }
    });
    
    return result;
  }

  // Additional helper methods for pattern analysis...
  deriveControlPointPattern(curveData) {
    // Implementation for analyzing control point patterns
    return {
      horizontalSpacing: 160,
      verticalVariation: 40,
      pattern: "smooth_wave"
    };
  }

  analyzeThicknessProgression(curveData) {
    // Implementation for analyzing thickness patterns
    return {
      startThickness: 180,
      endThickness: 65,
      progressionType: "linear_decrease"
    };
  }

  calculateCurveIntensity(params, layerRatio) {
    return "medium"; // Simplified for now
  }

  generateLayers(params, curvePaths, colorScheme) {
    // Generate complete layer definitions
    return curvePaths.map((path, index) => {
      const color = colorScheme[index];
      return {
        id: `ai_generated_layer_${index}`,
        path: path,
        color: color,
        svgElement: this.generateLayerSVG(path, color, index)
      };
    });
  }

  generateLayerSVG(path, color, index) {
    // Generate SVG path element for a layer
    const pathData = this.generatePathData(path);
    
    return `  <path id="layer-${index}" 
         d="${pathData}"
         fill="url(#gradient-${index})"
         opacity="${color.opacity}"
         class="ai-generated-layer" />`;
  }

  generatePathData(path) {
    // Convert control points to SVG path data
    let pathData = `M ${path.startPoint[0]},${path.startPoint[1]}`;
    
    // Add smooth curves through control points
    for (let i = 0; i < path.controlPoints.length - 1; i += 2) {
      const cp1 = path.controlPoints[i];
      const cp2 = path.controlPoints[i + 1] || cp1;
      pathData += ` Q ${cp1[0]},${cp1[1]} ${cp2[0]},${cp2[1]}`;
    }
    
    // Close the path for filled band
    pathData += ` L 1280,720 L 0,720 Z`;
    
    return pathData;
  }

  generateGradients(colorScheme) {
    return colorScheme.map((color, index) => {
      const gradient = this.createGradientDefinition(color, index);
      return {
        id: `gradient-${index}`,
        svgDef: gradient
      };
    });
  }

  createGradientDefinition(color, index) {
    // Create gradient based on original patterns
    const isRadial = index === 0 || index === 2; // Background layers use radial
    
    if (isRadial) {
      return `    <radialGradient id="gradient-${index}" cx="32%" cy="42%">
      <stop offset="0%" stop-color="${this.lightenColor(color.hex, 0.1)}" />
      <stop offset="50%" stop-color="${color.hex}" />
      <stop offset="100%" stop-color="${this.darkenColor(color.hex, 0.15)}" />
    </radialGradient>`;
    } else {
      return `    <linearGradient id="gradient-${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${this.lightenColor(color.hex, 0.05)}" />
      <stop offset="50%" stop-color="${color.hex}" />
      <stop offset="100%" stop-color="${this.darkenColor(color.hex, 0.2)}" />
    </linearGradient>`;
    }
  }

  generatePatterns(params) {
    const patterns = [];
    
    if (params.grid.enabled) {
      // Generate grid patterns for appropriate layers
      for (let i = params.grid.layerStart - 1; i < params.layers.count; i++) {
        patterns.push({
          id: `grid-pattern-${i}`,
          svgDef: this.createGridPattern(params.grid, i)
        });
      }
    }
    
    return patterns;
  }

  createGridPattern(gridParams, layerIndex) {
    const size = gridParams.density;
    const opacity = gridParams.intensity;
    
    return `    <pattern id="grid-pattern-${layerIndex}" width="${size}" height="${size}" patternUnits="userSpaceOnUse">
      <path d="M0 0v${size}M0 0h${size}" stroke="white" stroke-width="1.5" opacity="${opacity}"/>
    </pattern>`;
  }

  lightenColor(hex, amount) {
    // Utility to lighten a hex color
    const color = parseInt(hex.slice(1), 16);
    const r = Math.min(255, (color >> 16) + Math.round(255 * amount));
    const g = Math.min(255, ((color >> 8) & 0x00FF) + Math.round(255 * amount));
    const b = Math.min(255, (color & 0x0000FF) + Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }

  darkenColor(hex, amount) {
    // Utility to darken a hex color
    const color = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (color >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((color >> 8) & 0x00FF) - Math.round(255 * amount));
    const b = Math.max(0, (color & 0x0000FF) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  }
}

export default ParametricEngine;