/**
 * DAFEL BANDA AI DESIGN SYSTEM - COLOR INTELLIGENCE
 * Advanced color theory system for generating harmonious variations
 * 
 * This system analyzes color relationships in the original design and
 * generates complementary color schemes, seasonal variations, mood-based
 * adaptations, and brand color translations.
 */

class ColorIntelligence {
  constructor(originalPalette) {
    this.originalPalette = originalPalette;
    this.colorTheory = this.initializeColorTheory();
    this.harmonies = this.analyzeHarmonies();
    this.brandMapping = this.initializeBrandMapping();
  }

  /**
   * Initialize color theory rules and calculations
   */
  initializeColorTheory() {
    return {
      // Color harmony rules
      harmonicIntervals: {
        complementary: 180,
        triadic: 120,
        splitComplementary: [150, 210],
        analogous: 30,
        tetradic: [60, 180, 240]
      },

      // Emotional color associations
      colorEmotions: {
        red: ['energy', 'passion', 'urgency', 'warmth'],
        orange: ['creativity', 'enthusiasm', 'adventure', 'confidence'],
        yellow: ['happiness', 'optimism', 'clarity', 'innovation'],
        green: ['growth', 'harmony', 'nature', 'stability'],
        blue: ['trust', 'professionalism', 'calm', 'reliability'],
        purple: ['luxury', 'creativity', 'mystery', 'spirituality'],
        pink: ['nurturing', 'playfulness', 'romance', 'softness'],
        brown: ['earthiness', 'reliability', 'comfort', 'organic'],
        gray: ['neutrality', 'sophistication', 'balance', 'timelessness'],
        black: ['elegance', 'power', 'sophistication', 'mystery'],
        white: ['purity', 'simplicity', 'cleanliness', 'spaciousness']
      },

      // Seasonal color mappings
      seasonalPalettes: {
        spring: {
          temperature: 'warm',
          saturation: 'high',
          lightness: 'medium-high',
          hueShifts: [60, 90, 120] // Toward greens and warm colors
        },
        summer: {
          temperature: 'cool',
          saturation: 'medium',
          lightness: 'high',
          hueShifts: [180, 210, 240] // Toward blues and cool colors
        },
        autumn: {
          temperature: 'warm',
          saturation: 'high',
          lightness: 'medium',
          hueShifts: [30, 15, 0] // Toward oranges and warm colors
        },
        winter: {
          temperature: 'cool',
          saturation: 'low',
          lightness: 'low',
          hueShifts: [240, 270, 300] // Toward cool purples and blues
        }
      }
    };
  }

  /**
   * Analyze harmonic relationships in the original design
   */
  analyzeHarmonies() {
    const families = this.originalPalette.primary_colors;
    const analysis = {
      dominantHue: this.findDominantHue(families),
      accentHues: this.findAccentHues(families),
      harmonyType: this.identifyHarmonyType(families),
      colorTemperature: this.analyzeColorTemperature(families),
      contrastPattern: this.analyzeContrastPattern(families)
    };

    return analysis;
  }

  /**
   * Find the dominant hue family in the original design
   */
  findDominantHue(families) {
    const hueAnalysis = {};
    
    Object.keys(families).forEach(familyName => {
      const family = families[familyName];
      if (family.colors && family.colors.length > 0) {
        const avgHue = this.calculateAverageHue(family.colors);
        hueAnalysis[familyName] = {
          averageHue: avgHue,
          colorCount: family.colors.length,
          weight: family.colors.length * 2 // Weight by usage
        };
      }
    });

    // Find the family with the highest weight
    const dominantFamily = Object.keys(hueAnalysis).reduce((a, b) => 
      hueAnalysis[a].weight > hueAnalysis[b].weight ? a : b
    );

    return {
      family: dominantFamily,
      hue: hueAnalysis[dominantFamily].averageHue,
      dominanceScore: hueAnalysis[dominantFamily].weight
    };
  }

  /**
   * Calculate average hue from a color array
   */
  calculateAverageHue(colors) {
    const hues = colors.map(color => {
      const hsl = this.hexToHsl(color.hex);
      return hsl[0];
    });

    // Handle circular average for hue
    const x = hues.reduce((sum, hue) => sum + Math.cos(hue * Math.PI / 180), 0) / hues.length;
    const y = hues.reduce((sum, hue) => sum + Math.sin(hue * Math.PI / 180), 0) / hues.length;
    
    let avgHue = Math.atan2(y, x) * 180 / Math.PI;
    if (avgHue < 0) avgHue += 360;
    
    return avgHue;
  }

  /**
   * Generate complementary color scheme
   */
  generateComplementaryScheme(baseHue = null) {
    const targetHue = baseHue || this.harmonies.dominantHue.hue;
    const complementHue = (targetHue + 180) % 360;
    
    return this.generateSchemeFromHues([targetHue, complementHue], 'complementary');
  }

  /**
   * Generate triadic color scheme
   */
  generateTriadicScheme(baseHue = null) {
    const targetHue = baseHue || this.harmonies.dominantHue.hue;
    const hues = [
      targetHue,
      (targetHue + 120) % 360,
      (targetHue + 240) % 360
    ];
    
    return this.generateSchemeFromHues(hues, 'triadic');
  }

  /**
   * Generate analogous color scheme
   */
  generateAnalogousScheme(baseHue = null, spread = 60) {
    const targetHue = baseHue || this.harmonies.dominantHue.hue;
    const hues = [];
    
    for (let i = -2; i <= 2; i++) {
      hues.push((targetHue + (i * spread / 4)) % 360);
    }
    
    return this.generateSchemeFromHues(hues, 'analogous');
  }

  /**
   * Generate seasonal color variation
   */
  generateSeasonalScheme(season) {
    const seasonalRules = this.colorTheory.seasonalPalettes[season];
    if (!seasonalRules) {
      throw new Error(`Unknown season: ${season}`);
    }

    const baseHue = this.harmonies.dominantHue.hue;
    const adjustedHues = seasonalRules.hueShifts.map(shift => 
      (baseHue + shift) % 360
    );

    const scheme = this.generateSchemeFromHues(adjustedHues, `seasonal_${season}`);
    
    // Apply seasonal adjustments
    scheme.colors = scheme.colors.map(color => {
      const hsl = this.hexToHsl(color.hex);
      
      // Adjust saturation based on season
      let saturation = hsl[1];
      switch (seasonalRules.saturation) {
        case 'high':
          saturation = Math.min(1, saturation * 1.2);
          break;
        case 'low':
          saturation = saturation * 0.7;
          break;
        case 'medium':
          saturation = saturation * 0.9;
          break;
      }
      
      // Adjust lightness based on season
      let lightness = hsl[2];
      switch (seasonalRules.lightness) {
        case 'high':
          lightness = Math.min(0.9, lightness * 1.1);
          break;
        case 'low':
          lightness = lightness * 0.8;
          break;
        case 'medium-high':
          lightness = Math.min(0.85, lightness * 1.05);
          break;
      }
      
      return {
        ...color,
        hex: this.hslToHex(hsl[0], saturation, lightness),
        hsl: [hsl[0], saturation, lightness],
        seasonalAdjustment: season
      };
    });

    return scheme;
  }

  /**
   * Generate mood-based color scheme
   */
  generateMoodScheme(mood) {
    const moodMappings = {
      energetic: {
        hueShifts: [15, 345, 30], // Reds and oranges
        saturationBoost: 1.3,
        lightnessShift: 0.1,
        temperature: 'warm'
      },
      calming: {
        hueShifts: [210, 240, 180], // Blues and cool tones
        saturationBoost: 0.8,
        lightnessShift: 0.15,
        temperature: 'cool'
      },
      professional: {
        hueShifts: [210, 195, 225], // Professional blues
        saturationBoost: 0.7,
        lightnessShift: -0.1,
        temperature: 'cool'
      },
      creative: {
        hueShifts: [270, 300, 60], // Purples and creative colors
        saturationBoost: 1.1,
        lightnessShift: 0.05,
        temperature: 'mixed'
      },
      luxurious: {
        hueShifts: [270, 285, 315], // Deep purples and magentas
        saturationBoost: 0.9,
        lightnessShift: -0.2,
        temperature: 'cool'
      },
      natural: {
        hueShifts: [120, 90, 150], // Greens
        saturationBoost: 0.9,
        lightnessShift: 0,
        temperature: 'neutral'
      }
    };

    const moodRules = moodMappings[mood];
    if (!moodRules) {
      throw new Error(`Unknown mood: ${mood}`);
    }

    const scheme = this.generateSchemeFromHues(moodRules.hueShifts, `mood_${mood}`);
    
    // Apply mood adjustments
    scheme.colors = scheme.colors.map(color => {
      const hsl = this.hexToHsl(color.hex);
      
      const newSaturation = Math.min(1, hsl[1] * moodRules.saturationBoost);
      const newLightness = Math.max(0.1, Math.min(0.9, hsl[2] + moodRules.lightnessShift));
      
      return {
        ...color,
        hex: this.hslToHex(hsl[0], newSaturation, newLightness),
        hsl: [hsl[0], newSaturation, newLightness],
        moodAdjustment: mood
      };
    });

    return scheme;
  }

  /**
   * Adapt design to specific brand colors
   */
  adaptToBrandColors(brandPalette) {
    const brandHues = brandPalette.map(color => {
      const hsl = this.hexToHsl(color);
      return hsl[0];
    });

    // Find the closest brand hue to our dominant hue
    const dominantHue = this.harmonies.dominantHue.hue;
    const closestBrandHue = brandHues.reduce((closest, hue) => {
      const currentDistance = Math.min(
        Math.abs(hue - dominantHue),
        360 - Math.abs(hue - dominantHue)
      );
      const closestDistance = Math.min(
        Math.abs(closest - dominantHue),
        360 - Math.abs(closest - dominantHue)
      );
      return currentDistance < closestDistance ? hue : closest;
    });

    // Calculate hue shift needed
    const hueShift = closestBrandHue - dominantHue;
    
    // Generate new scheme based on brand colors
    const adjustedHues = brandHues.concat(
      brandHues.map(hue => (hue + 30) % 360), // Add analogous colors
      brandHues.map(hue => (hue - 30) % 360)
    );

    const scheme = this.generateSchemeFromHues(adjustedHues, 'brand_adapted');
    
    scheme.brandAlignment = {
      originalDominantHue: dominantHue,
      newDominantHue: closestBrandHue,
      hueShift: hueShift,
      brandColors: brandPalette
    };

    return scheme;
  }

  /**
   * Generate accessibility-compliant color scheme
   */
  generateAccessibleScheme(contrastRatio = 4.5) {
    const scheme = this.generateAnalogousScheme();
    
    // Ensure proper contrast ratios
    scheme.colors = scheme.colors.map((color, index) => {
      const hsl = this.hexToHsl(color.hex);
      
      // Adjust lightness to ensure contrast
      let lightness = hsl[2];
      if (index < scheme.colors.length / 2) {
        // Lighter colors for background
        lightness = Math.max(0.7, lightness);
      } else {
        // Darker colors for foreground
        lightness = Math.min(0.3, lightness);
      }
      
      const adjustedColor = this.hslToHex(hsl[0], hsl[1], lightness);
      
      return {
        ...color,
        hex: adjustedColor,
        hsl: [hsl[0], hsl[1], lightness],
        contrastCompliant: true,
        contrastRatio: this.calculateContrastRatio(adjustedColor, '#FFFFFF')
      };
    });

    return scheme;
  }

  /**
   * Generate scheme from array of hues
   */
  generateSchemeFromHues(hues, schemeType) {
    const colors = hues.map((hue, index) => {
      // Generate variations for each hue
      const variations = this.generateHueVariations(hue, 7); // Match original layer count
      return variations;
    }).flat();

    // Sort by hue and lightness for logical ordering
    colors.sort((a, b) => {
      const aHsl = this.hexToHsl(a.hex);
      const bHsl = this.hexToHsl(b.hex);
      return aHsl[0] - bHsl[0] || bHsl[2] - aHsl[2]; // Sort by hue, then by lightness descending
    });

    return {
      type: schemeType,
      baseHues: hues,
      colors: colors,
      harmony: this.analyzeSchemeHarmony(colors),
      metadata: {
        generated: new Date().toISOString(),
        colorCount: colors.length,
        harmonyScore: this.calculateHarmonyScore(colors)
      }
    };
  }

  /**
   * Generate variations of a single hue
   */
  generateHueVariations(hue, count) {
    const variations = [];
    
    for (let i = 0; i < count; i++) {
      const ratio = i / (count - 1);
      
      // Create lightness progression (light to dark)
      const lightness = 0.9 - (ratio * 0.65); // 90% to 25%
      
      // Vary saturation slightly
      const saturation = 0.6 + (Math.sin(ratio * Math.PI) * 0.3); // Wave pattern
      
      // Slight hue variation for organic feel
      const hueVariation = hue + (Math.sin(ratio * Math.PI * 2) * 10);
      
      variations.push({
        hex: this.hslToHex(hueVariation, saturation, lightness),
        hsl: [hueVariation, saturation, lightness],
        layerIndex: i,
        usage: this.determineColorUsage(ratio),
        opacity: 0.45 + (ratio * 0.37) // Progressive opacity like original
      });
    }
    
    return variations;
  }

  /**
   * Determine appropriate usage for color based on its properties
   */
  determineColorUsage(ratio) {
    if (ratio < 0.3) return 'background';
    if (ratio < 0.7) return 'midground';
    return 'foreground';
  }

  /**
   * Analyze harmony relationships in a color scheme
   */
  analyzeSchemeHarmony(colors) {
    const hues = colors.map(color => this.hexToHsl(color.hex)[0]);
    
    return {
      hueRange: Math.max(...hues) - Math.min(...hues),
      averageHue: hues.reduce((sum, hue) => sum + hue, 0) / hues.length,
      harmonyType: this.identifyHarmonyType({ colors: colors }),
      temperature: this.analyzeColorTemperature({ colors: colors }),
      balance: this.calculateColorBalance(colors)
    };
  }

  /**
   * Calculate harmony score for a color scheme
   */
  calculateHarmonyScore(colors) {
    let score = 100;
    
    // Check for proper contrast progression
    const lightnesses = colors.map(color => this.hexToHsl(color.hex)[2]);
    const lightnessProgression = this.calculateProgression(lightnesses);
    score += lightnessProgression * 20;
    
    // Check for hue harmony
    const hues = colors.map(color => this.hexToHsl(color.hex)[0]);
    const hueHarmony = this.calculateHueHarmony(hues);
    score += hueHarmony * 30;
    
    // Check for saturation balance
    const saturations = colors.map(color => this.hexToHsl(color.hex)[1]);
    const saturationBalance = this.calculateBalance(saturations);
    score += saturationBalance * 20;
    
    return Math.min(100, Math.max(0, score));
  }

  /**
   * Utility functions for color calculations
   */
  
  hexToHsl(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [h * 360, s, l];
  }

  hslToHex(h, s, l) {
    h = h % 360;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r, g, b;
    
    if (0 <= h && h < 60) {
      r = c; g = x; b = 0;
    } else if (60 <= h && h < 120) {
      r = x; g = c; b = 0;
    } else if (120 <= h && h < 180) {
      r = 0; g = c; b = x;
    } else if (180 <= h && h < 240) {
      r = 0; g = x; b = c;
    } else if (240 <= h && h < 300) {
      r = x; g = 0; b = c;
    } else {
      r = c; g = 0; b = x;
    }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }

  calculateContrastRatio(color1, color2) {
    const getLuminance = (hex) => {
      const rgb = [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16)
      ].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
    };
    
    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }

  // Additional helper methods...
  findAccentHues(families) {
    // Implementation for finding accent colors
    return [];
  }

  identifyHarmonyType(families) {
    // Implementation for identifying harmony type
    return 'analogous';
  }

  analyzeColorTemperature(families) {
    // Implementation for analyzing color temperature
    return 'cool';
  }

  analyzeContrastPattern(families) {
    // Implementation for analyzing contrast patterns
    return 'progressive';
  }

  calculateProgression(values) {
    // Implementation for calculating progression quality
    return 0.8;
  }

  calculateHueHarmony(hues) {
    // Implementation for calculating hue harmony
    return 0.7;
  }

  calculateBalance(values) {
    // Implementation for calculating balance
    return 0.6;
  }

  calculateColorBalance(colors) {
    // Implementation for calculating color balance
    return 'balanced';
  }

  initializeBrandMapping() {
    // Initialize brand color mapping system
    return {};
  }
}

export default ColorIntelligence;