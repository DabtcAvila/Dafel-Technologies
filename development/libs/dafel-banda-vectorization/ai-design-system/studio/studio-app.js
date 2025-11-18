/**
 * DAFEL BANDA AI DESIGN STUDIO - APPLICATION
 * Interactive design studio application with real-time parameter manipulation
 */

import ParametricEngine from '../core/ParametricEngine.js';
import ColorIntelligence from '../core/ColorIntelligence.js';
import LayoutAdaptation from '../core/LayoutAdaptation.js';

class DesignStudioApp {
  constructor() {
    this.currentDesign = null;
    this.parametricEngine = null;
    this.colorIntelligence = null;
    this.layoutAdaptation = null;
    this.variations = [];
    this.currentTool = 'preview';
    this.zoomLevel = 1.0;
    this.isGenerating = false;
    
    this.init();
  }

  async init() {
    try {
      // Load original design data
      await this.loadOriginalDesign();
      
      // Initialize AI engines
      this.initializeEngines();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Generate initial design
      this.generateInitialDesign();
      
      // Setup AI suggestions
      this.generateAISuggestions();
      
      console.log('Dafel Banda AI Design Studio initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Design Studio:', error);
    }
  }

  async loadOriginalDesign() {
    try {
      // In a real implementation, this would fetch from the analysis files
      const response = await fetch('../../analysis/layer-breakdown.json');
      const layerData = await response.json();
      
      const colorResponse = await fetch('../../analysis/color-palette.json');
      const colorData = await colorResponse.json();
      
      this.originalData = {
        layers: layerData.layers,
        colors: colorData.primary_colors,
        metadata: layerData.metadata
      };
    } catch (error) {
      console.warn('Could not load original design data, using defaults:', error);
      this.useDefaultData();
    }
  }

  useDefaultData() {
    // Fallback data if files can't be loaded
    this.originalData = {
      layers: [
        {
          id: "banda-azul-clara-fondo",
          order: 1,
          colors: { start: "#D0E8F5", end: "#7DBBDB" },
          opacity: 0.45,
          curve_path: {
            start_point: [60, 280],
            control_points: [[200, 240], [400, 220], [600, 240], [800, 280]],
            thickness: 180
          }
        }
        // Additional default layers...
      ],
      colors: {
        light_blue_family: {
          colors: [
            { hex: "#D0E8F5", usage: "Background light start" },
            { hex: "#A8D1E6", usage: "Light band mid-tone" },
            { hex: "#7DBBDB", usage: "Light band end" }
          ]
        }
      }
    };
  }

  initializeEngines() {
    this.parametricEngine = new ParametricEngine(this.originalData);
    this.colorIntelligence = new ColorIntelligence(this.originalData.colors);
    this.layoutAdaptation = new LayoutAdaptation(this.originalData);
  }

  setupEventListeners() {
    // Parameter controls
    this.setupParameterControls();
    
    // Tool switching
    this.setupToolSwitching();
    
    // Canvas controls
    this.setupCanvasControls();
    
    // Color scheme buttons
    this.setupColorSchemeButtons();
    
    // Export functionality
    this.setupExportControls();
    
    // Modal controls
    this.setupModalControls();
    
    // Evolution controls
    this.setupEvolutionControls();
    
    // AI suggestions
    this.setupAISuggestions();
    
    // A/B testing
    this.setupABTesting();
  }

  setupParameterControls() {
    // Get all range inputs
    const sliders = document.querySelectorAll('input[type="range"]');
    const numberInputs = document.querySelectorAll('input[type="number"]');
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    
    // Setup slider listeners
    sliders.forEach(slider => {
      const valueDisplay = slider.parentElement.querySelector('.slider-value');
      
      // Update display value
      slider.addEventListener('input', (e) => {
        let value = e.target.value;
        
        // Format value based on parameter type
        if (e.target.id.includes('phase')) {
          value += '°';
        } else if (e.target.id.includes('hue')) {
          value += '°';
        } else if (e.target.step && parseFloat(e.target.step) < 1) {
          value = parseFloat(value).toFixed(2);
        }
        
        valueDisplay.textContent = value;
      });
      
      // Regenerate design on change
      slider.addEventListener('change', () => {
        this.debounceRegenerate();
      });
    });
    
    // Setup number input listeners
    numberInputs.forEach(input => {
      input.addEventListener('change', () => {
        this.debounceRegenerate();
      });
    });
    
    // Setup checkbox listeners
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.debounceRegenerate();
      });
    });
  }

  setupToolSwitching() {
    const toolButtons = document.querySelectorAll('.tool-btn');
    
    toolButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tool = e.currentTarget.dataset.tool;
        this.switchTool(tool);
      });
    });
  }

  switchTool(tool) {
    // Update active button
    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tool="${tool}"]`).classList.add('active');
    
    // Show/hide relevant panels
    const responsivePanel = document.getElementById('responsive-panel');
    
    switch (tool) {
      case 'preview':
        responsivePanel.classList.remove('active');
        this.currentTool = 'preview';
        break;
      case 'animation':
        responsivePanel.classList.remove('active');
        this.currentTool = 'animation';
        this.enableAnimationPreview();
        break;
      case 'responsive':
        responsivePanel.classList.add('active');
        this.currentTool = 'responsive';
        this.generateResponsivePreviews();
        break;
      case 'accessibility':
        responsivePanel.classList.remove('active');
        this.currentTool = 'accessibility';
        this.enableAccessibilityMode();
        break;
    }
  }

  setupCanvasControls() {
    document.getElementById('zoom-in').addEventListener('click', () => {
      this.zoomLevel = Math.min(3.0, this.zoomLevel * 1.2);
      this.updateCanvasZoom();
    });
    
    document.getElementById('zoom-out').addEventListener('click', () => {
      this.zoomLevel = Math.max(0.3, this.zoomLevel / 1.2);
      this.updateCanvasZoom();
    });
    
    document.getElementById('reset-view').addEventListener('click', () => {
      this.zoomLevel = 1.0;
      this.updateCanvasZoom();
    });
  }

  updateCanvasZoom() {
    const canvas = document.getElementById('design-canvas');
    canvas.style.transform = `scale(${this.zoomLevel})`;
    
    document.querySelector('.zoom-level').textContent = 
      Math.round(this.zoomLevel * 100) + '%';
  }

  setupColorSchemeButtons() {
    const schemeButtons = document.querySelectorAll('[data-scheme]');
    
    schemeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const scheme = e.currentTarget.dataset.scheme;
        this.applyColorScheme(scheme);
      });
    });
  }

  applyColorScheme(scheme) {
    if (!this.colorIntelligence) return;
    
    let newScheme;
    
    switch (scheme) {
      case 'complementary':
        newScheme = this.colorIntelligence.generateComplementaryScheme();
        break;
      case 'triadic':
        newScheme = this.colorIntelligence.generateTriadicScheme();
        break;
      case 'analogous':
        newScheme = this.colorIntelligence.generateAnalogousScheme();
        break;
      default:
        return;
    }
    
    // Update color parameters based on new scheme
    this.updateColorParameters(newScheme);
    this.regenerateDesign();
  }

  updateColorParameters(colorScheme) {
    if (!colorScheme.colors || colorScheme.colors.length === 0) return;
    
    // Extract average hue from the scheme
    const hues = colorScheme.colors.map(color => color.hsl[0]);
    const avgHue = hues.reduce((sum, hue) => sum + hue, 0) / hues.length;
    
    // Update UI controls
    const baseHueSlider = document.getElementById('base-hue');
    const hueVariationSlider = document.getElementById('hue-variation');
    
    if (baseHueSlider) {
      baseHueSlider.value = Math.round(avgHue);
      baseHueSlider.parentElement.querySelector('.slider-value').textContent = Math.round(avgHue) + '°';
    }
    
    if (hueVariationSlider) {
      const hueRange = Math.max(...hues) - Math.min(...hues);
      hueVariationSlider.value = Math.min(80, Math.max(10, hueRange));
      hueVariationSlider.parentElement.querySelector('.slider-value').textContent = Math.round(hueRange) + '°';
    }
  }

  setupExportControls() {
    // Export format buttons
    const exportButtons = document.querySelectorAll('.export-btn');
    exportButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const format = e.currentTarget.dataset.format;
        this.showExportModal(format);
      });
    });
    
    // Main export button
    document.getElementById('export-design').addEventListener('click', () => {
      this.showExportModal('svg');
    });
    
    // Export modal buttons
    document.getElementById('confirm-export').addEventListener('click', () => {
      this.exportCurrentDesign();
    });
    
    document.getElementById('cancel-export').addEventListener('click', () => {
      this.hideModal('export-modal');
    });
  }

  setupModalControls() {
    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modal = e.target.closest('.modal');
        this.hideModal(modal.id);
      });
    });
    
    // Click outside to close
    document.querySelectorAll('.modal').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.hideModal(modal.id);
        }
      });
    });
    
    // Preset loader
    document.getElementById('load-preset').addEventListener('click', () => {
      this.showModal('preset-modal');
    });
  }

  setupEvolutionControls() {
    document.getElementById('evolve-design').addEventListener('click', () => {
      this.evolveDesign();
    });
    
    document.getElementById('save-variation').addEventListener('click', () => {
      this.saveCurrentVariation();
    });
  }

  setupAISuggestions() {
    document.getElementById('generate-suggestions').addEventListener('click', () => {
      this.generateAISuggestions();
    });
    
    // Setup apply buttons for suggestions
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('suggestion-apply')) {
        this.applySuggestion(e.target.parentElement);
      }
    });
  }

  setupABTesting() {
    document.getElementById('generate-ab-test').addEventListener('click', () => {
      this.generateABTest();
    });
    
    document.getElementById('declare-winner').addEventListener('click', () => {
      this.declareABWinner();
    });
  }

  // Design generation methods
  generateInitialDesign() {
    const params = this.getCurrentParameters();
    this.regenerateDesign(params);
  }

  getCurrentParameters() {
    const params = {
      curve: {
        intensity: parseFloat(document.getElementById('curve-intensity')?.value || 1.0),
        amplitude: parseFloat(document.getElementById('curve-amplitude')?.value || 180),
        frequency: parseFloat(document.getElementById('curve-frequency')?.value || 1.0),
        phase: parseFloat(document.getElementById('curve-phase')?.value || 0)
      },
      layers: {
        count: parseInt(document.getElementById('layer-count')?.value || 7),
        spacing: parseFloat(document.getElementById('layer-spacing')?.value || 75),
        thickness: parseFloat(document.getElementById('layer-thickness')?.value || 120),
        thicknessVariation: parseFloat(document.getElementById('thickness-variation')?.value || 0.4)
      },
      color: {
        hueRange: parseFloat(document.getElementById('base-hue')?.value || 190),
        hueVariation: parseFloat(document.getElementById('hue-variation')?.value || 30),
        saturation: parseFloat(document.getElementById('saturation')?.value || 0.6),
        lightness: parseFloat(document.getElementById('lightness')?.value || 0.65)
      },
      opacity: {
        baseRange: parseFloat(document.getElementById('opacity-base')?.value || 0.6),
        progression: parseFloat(document.getElementById('opacity-progression')?.value || 0.12)
      },
      grid: {
        enabled: document.getElementById('grid-enabled')?.checked || true,
        density: parseFloat(document.getElementById('grid-density')?.value || 16),
        intensity: parseFloat(document.getElementById('grid-intensity')?.value || 0.3),
        layerStart: 4
      }
    };
    
    return params;
  }

  debounceRegenerate() {
    if (this.regenerateTimeout) {
      clearTimeout(this.regenerateTimeout);
    }
    
    this.regenerateTimeout = setTimeout(() => {
      this.regenerateDesign();
    }, 300); // 300ms debounce
  }

  regenerateDesign(params = null) {
    if (this.isGenerating) return;
    
    this.isGenerating = true;
    this.showLoading();
    
    try {
      const designParams = params || this.getCurrentParameters();
      
      if (this.parametricEngine) {
        this.currentDesign = this.parametricEngine.generateVariation(designParams);
        this.renderDesign(this.currentDesign);
      }
      
      // Update responsive previews if in responsive mode
      if (this.currentTool === 'responsive') {
        this.generateResponsivePreviews();
      }
      
    } catch (error) {
      console.error('Error generating design:', error);
    } finally {
      this.isGenerating = false;
      this.hideLoading();
    }
  }

  renderDesign(design) {
    if (!design) return;
    
    const canvas = document.getElementById('design-canvas');
    const defs = document.getElementById('canvas-defs');
    const layers = document.getElementById('design-layers');
    
    // Clear existing content
    defs.innerHTML = '';
    layers.innerHTML = '';
    
    // Add gradients
    if (design.gradients) {
      design.gradients.forEach(gradient => {
        defs.innerHTML += gradient.svgDef;
      });
    }
    
    // Add patterns
    if (design.patterns) {
      design.patterns.forEach(pattern => {
        defs.innerHTML += pattern.svgDef;
      });
    }
    
    // Add layers
    if (design.layers) {
      design.layers.forEach(layer => {
        layers.innerHTML += layer.svgElement;
      });
    }
    
    // Add animation class if in animation mode
    if (this.currentTool === 'animation') {
      canvas.classList.add('animated');
    } else {
      canvas.classList.remove('animated');
    }
  }

  showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
  }

  hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
  }

  // Tool-specific methods
  enableAnimationPreview() {
    const canvas = document.getElementById('design-canvas');
    canvas.classList.add('animated');
    
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
      .animated .ai-generated-layer {
        animation: wave 3s ease-in-out infinite;
        animation-delay: calc(var(--layer-index) * 0.15s);
      }
      
      @keyframes wave {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-5px) scale(1.02); }
      }
    `;
    document.head.appendChild(style);
  }

  generateResponsivePreviews() {
    if (!this.layoutAdaptation || !this.currentDesign) return;
    
    const devices = ['mobile', 'tablet', 'desktop'];
    
    devices.forEach(device => {
      const preview = document.querySelector(`[data-device="${device}"] svg`);
      if (preview) {
        // Generate device-specific adaptation
        const adaptation = this.layoutAdaptation.exportForContext({
          type: 'responsive',
          device: device
        });
        
        // Update preview with adapted design
        preview.innerHTML = this.currentDesign.svgOutput;
        
        // Apply device-specific styling
        this.applyDeviceOptimizations(preview, device);
      }
    });
  }

  applyDeviceOptimizations(svg, device) {
    const layers = svg.querySelectorAll('.ai-generated-layer');
    
    switch (device) {
      case 'mobile':
        // Reduce layer count and increase opacity for mobile
        layers.forEach((layer, index) => {
          if (index > 4) {
            layer.style.display = 'none';
          } else {
            layer.style.opacity = Math.min(1, parseFloat(layer.style.opacity || 0.5) * 1.2);
          }
        });
        break;
      case 'tablet':
        // Moderate optimization for tablet
        layers.forEach((layer, index) => {
          if (index > 5) {
            layer.style.opacity = '0.3';
          }
        });
        break;
      case 'desktop':
        // Full design for desktop
        break;
    }
  }

  enableAccessibilityMode() {
    if (!this.colorIntelligence) return;
    
    // Generate high-contrast version
    const accessibleScheme = this.colorIntelligence.generateAccessibleScheme();
    this.updateColorParameters(accessibleScheme);
    this.regenerateDesign();
  }

  // Evolution and variation methods
  evolveDesign() {
    const mutationRate = parseFloat(document.getElementById('mutation-rate')?.value || 0.2);
    const crossoverRate = parseFloat(document.getElementById('crossover-rate')?.value || 0.7);
    
    const currentParams = this.getCurrentParameters();
    const mutatedParams = this.mutateParameters(currentParams, mutationRate);
    
    this.regenerateDesign(mutatedParams);
  }

  mutateParameters(params, mutationRate) {
    const mutated = JSON.parse(JSON.stringify(params)); // Deep clone
    
    // Mutate curve parameters
    if (Math.random() < mutationRate) {
      mutated.curve.intensity *= (0.8 + Math.random() * 0.4); // ±20% variation
      mutated.curve.intensity = Math.max(0.3, Math.min(2.0, mutated.curve.intensity));
    }
    
    if (Math.random() < mutationRate) {
      mutated.curve.amplitude += (Math.random() - 0.5) * 40; // ±20px variation
      mutated.curve.amplitude = Math.max(80, Math.min(300, mutated.curve.amplitude));
    }
    
    // Mutate color parameters
    if (Math.random() < mutationRate) {
      mutated.color.hueRange += (Math.random() - 0.5) * 60; // ±30° variation
      mutated.color.hueRange = Math.max(160, Math.min(220, mutated.color.hueRange));
    }
    
    if (Math.random() < mutationRate) {
      mutated.color.saturation *= (0.8 + Math.random() * 0.4); // ±20% variation
      mutated.color.saturation = Math.max(0.3, Math.min(0.9, mutated.color.saturation));
    }
    
    // Update UI controls
    this.updateUIFromParameters(mutated);
    
    return mutated;
  }

  updateUIFromParameters(params) {
    // Update sliders to reflect mutated parameters
    const updateSlider = (id, value) => {
      const slider = document.getElementById(id);
      if (slider) {
        slider.value = value;
        const valueDisplay = slider.parentElement.querySelector('.slider-value');
        if (valueDisplay) {
          let displayValue = value;
          if (id.includes('hue') || id.includes('phase')) {
            displayValue += '°';
          } else if (slider.step && parseFloat(slider.step) < 1) {
            displayValue = parseFloat(value).toFixed(2);
          }
          valueDisplay.textContent = displayValue;
        }
      }
    };
    
    updateSlider('curve-intensity', params.curve.intensity.toFixed(1));
    updateSlider('curve-amplitude', Math.round(params.curve.amplitude));
    updateSlider('base-hue', Math.round(params.color.hueRange));
    updateSlider('saturation', params.color.saturation.toFixed(2));
  }

  saveCurrentVariation() {
    if (!this.currentDesign) return;
    
    const variation = {
      id: this.currentDesign.metadata.variation_id,
      timestamp: new Date().toISOString(),
      parameters: this.getCurrentParameters(),
      design: this.currentDesign,
      thumbnail: this.generateThumbnail()
    };
    
    this.variations.push(variation);
    this.updateVariationsDisplay();
  }

  generateThumbnail() {
    // Create a smaller version of the current design for thumbnails
    const canvas = document.getElementById('design-canvas');
    const serializer = new XMLSerializer();
    return serializer.serializeToString(canvas);
  }

  updateVariationsDisplay() {
    const grid = document.getElementById('variations-grid');
    
    // Clear existing thumbnails
    grid.innerHTML = '';
    
    // Add new thumbnails
    this.variations.slice(-8).forEach(variation => { // Show last 8 variations
      const thumbnail = document.createElement('div');
      thumbnail.className = 'variation-thumbnail';
      thumbnail.innerHTML = variation.thumbnail;
      thumbnail.addEventListener('click', () => {
        this.loadVariation(variation);
      });
      grid.appendChild(thumbnail);
    });
  }

  loadVariation(variation) {
    // Update UI controls with variation parameters
    this.updateUIFromParameters(variation.parameters);
    
    // Regenerate design
    this.regenerateDesign(variation.parameters);
  }

  // AI suggestion methods
  generateAISuggestions() {
    const suggestions = [
      {
        text: "Try increasing curve intensity for more drama",
        action: () => {
          document.getElementById('curve-intensity').value = '1.5';
          this.regenerateDesign();
        }
      },
      {
        text: "Consider complementary color scheme",
        action: () => {
          this.applyColorScheme('complementary');
        }
      },
      {
        text: "Reduce layers for mobile optimization",
        action: () => {
          document.getElementById('layer-count').value = '5';
          this.regenerateDesign();
        }
      },
      {
        text: "Increase opacity progression for depth",
        action: () => {
          document.getElementById('opacity-progression').value = '0.18';
          this.regenerateDesign();
        }
      },
      {
        text: "Try analogous color harmony",
        action: () => {
          this.applyColorScheme('analogous');
        }
      }
    ];
    
    // Randomly select 3 suggestions
    const selectedSuggestions = suggestions
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    
    // Update UI
    const container = document.querySelector('.ai-suggestions');
    container.innerHTML = '';
    
    selectedSuggestions.forEach(suggestion => {
      const item = document.createElement('div');
      item.className = 'suggestion-item';
      item.innerHTML = `
        <span class="suggestion-text">${suggestion.text}</span>
        <button class="btn btn-tiny suggestion-apply">Apply</button>
      `;
      
      item.querySelector('.suggestion-apply').addEventListener('click', suggestion.action);
      container.appendChild(item);
    });
  }

  applySuggestion(suggestionElement) {
    // This is handled by individual suggestion event listeners
    console.log('Applying suggestion:', suggestionElement.querySelector('.suggestion-text').textContent);
  }

  // A/B testing methods
  generateABTest() {
    if (!this.currentDesign) return;
    
    // Generate variant A (current design)
    const variantA = {
      design: this.currentDesign,
      parameters: this.getCurrentParameters(),
      metrics: this.calculateDesignMetrics(this.currentDesign)
    };
    
    // Generate variant B (evolved version)
    const mutatedParams = this.mutateParameters(this.getCurrentParameters(), 0.3);
    const variantB = {
      design: this.parametricEngine.generateVariation(mutatedParams),
      parameters: mutatedParams,
      metrics: null
    };
    variantB.metrics = this.calculateDesignMetrics(variantB.design);
    
    // Update UI
    this.updateABTestDisplay(variantA, variantB);
  }

  calculateDesignMetrics(design) {
    // Simplified metrics calculation
    return {
      harmony: 70 + Math.random() * 30, // Simulate harmony score
      impact: 60 + Math.random() * 40   // Simulate visual impact score
    };
  }

  updateABTestDisplay(variantA, variantB) {
    const slotA = document.querySelector('[data-variant="a"]');
    const slotB = document.querySelector('[data-variant="b"]');
    
    // Update variant A
    slotA.querySelector('svg').innerHTML = variantA.design.svgOutput;
    slotA.querySelector('.variant-metrics').innerHTML = `
      <span class="metric">Harmony: ${Math.round(variantA.metrics.harmony)}%</span>
      <span class="metric">Impact: ${Math.round(variantA.metrics.impact)}%</span>
    `;
    
    // Update variant B
    slotB.querySelector('svg').innerHTML = variantB.design.svgOutput;
    slotB.querySelector('.variant-metrics').innerHTML = `
      <span class="metric">Harmony: ${Math.round(variantB.metrics.harmony)}%</span>
      <span class="metric">Impact: ${Math.round(variantB.metrics.impact)}%</span>
    `;
    
    // Store variants for winner selection
    this.currentABTest = { variantA, variantB };
  }

  declareABWinner() {
    if (!this.currentABTest) return;
    
    // For demo purposes, automatically select the variant with higher combined score
    const scoreA = this.currentABTest.variantA.metrics.harmony + this.currentABTest.variantA.metrics.impact;
    const scoreB = this.currentABTest.variantB.metrics.harmony + this.currentABTest.variantB.metrics.impact;
    
    const winner = scoreA > scoreB ? this.currentABTest.variantA : this.currentABTest.variantB;
    
    // Apply winner's parameters
    this.updateUIFromParameters(winner.parameters);
    this.regenerateDesign(winner.parameters);
    
    alert(`Winner selected! ${scoreA > scoreB ? 'Variant A' : 'Variant B'} will be applied.`);
  }

  // Export methods
  showExportModal(format) {
    document.getElementById('export-format-display').textContent = format.toUpperCase();
    
    const width = parseInt(document.getElementById('export-width').value) || 1280;
    const height = Math.round(width / (16/9)); // Maintain aspect ratio
    document.getElementById('export-dimensions-display').textContent = `${width}×${height}`;
    
    // Estimate file size
    const estimatedSize = this.estimateFileSize(format, width);
    document.getElementById('export-size-display').textContent = estimatedSize;
    
    this.showModal('export-modal');
  }

  estimateFileSize(format, width) {
    const baseSize = 45; // Base SVG size in KB
    const scaleFactor = (width / 1280) ** 2; // Quadratic scaling
    
    switch (format) {
      case 'svg':
        return `~${Math.round(baseSize * scaleFactor)}KB`;
      case 'png':
        return `~${Math.round(baseSize * scaleFactor * 8)}KB`;
      case 'jpg':
        return `~${Math.round(baseSize * scaleFactor * 3)}KB`;
      case 'webp':
        return `~${Math.round(baseSize * scaleFactor * 2)}KB`;
      case 'pdf':
        return `~${Math.round(baseSize * scaleFactor * 1.5)}KB`;
      default:
        return '~Unknown';
    }
  }

  exportCurrentDesign() {
    if (!this.currentDesign) return;
    
    const format = document.getElementById('export-format-display').textContent.toLowerCase();
    const width = parseInt(document.getElementById('export-width').value) || 1280;
    const quality = parseFloat(document.getElementById('export-quality').value) || 0.9;
    
    switch (format) {
      case 'svg':
        this.exportSVG();
        break;
      case 'png':
      case 'jpg':
      case 'webp':
        this.exportRaster(format, width, quality);
        break;
      case 'pdf':
        this.exportPDF(width);
        break;
      case 'css':
        this.exportCSS();
        break;
    }
    
    this.hideModal('export-modal');
  }

  exportSVG() {
    const svgContent = this.currentDesign.svgOutput;
    this.downloadFile(svgContent, 'dafel-banda-design.svg', 'image/svg+xml');
  }

  exportRaster(format, width, quality) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const height = Math.round(width / (16/9));
    
    canvas.width = width;
    canvas.height = height;
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height);
      
      const mimeType = `image/${format}`;
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dafel-banda-design.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }, mimeType, quality);
    };
    
    const svgBlob = new Blob([this.currentDesign.svgOutput], { type: 'image/svg+xml' });
    img.src = URL.createObjectURL(svgBlob);
  }

  exportCSS() {
    const css = this.layoutAdaptation?.generateResponsiveCSS(this.currentDesign) || 
                '/* CSS export not available */';
    this.downloadFile(css, 'dafel-banda-styles.css', 'text/css');
  }

  exportPDF(width) {
    // PDF export would require a library like jsPDF
    console.log('PDF export not implemented in demo');
    alert('PDF export feature coming soon!');
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  // Modal utility methods
  showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
  }

  hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new DesignStudioApp();
});