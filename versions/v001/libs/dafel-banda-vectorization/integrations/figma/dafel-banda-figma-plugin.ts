/**
 * Dafel Banda Figma Plugin
 * 
 * Features:
 * - Direct export of Dafel Banda animations to Figma
 * - Real-time preview in Figma
 * - Customizable color schemes
 * - Animation settings panel
 * - Batch export capabilities
 * - Team library integration
 */

// Plugin manifest should be: manifest.json
// {
//   "name": "Dafel Banda Animations",
//   "id": "dafel-banda-animations",
//   "api": "1.0.0",
//   "main": "code.js",
//   "ui": "ui.html",
//   "capabilities": [],
//   "enableProposedApi": false,
//   "editorType": ["figma", "figjam"],
//   "networkAccess": {
//     "allowedDomains": ["https://dafel.com.mx", "https://api.dafel.com.mx"]
//   }
// }

// Main plugin code
figma.showUI(__html__, { 
  width: 400, 
  height: 600,
  themeColors: true 
});

interface DafelBandaSettings {
  animation: string;
  colorScheme: string;
  size: 'small' | 'medium' | 'large' | 'custom';
  customWidth?: number;
  customHeight?: number;
  interactive: boolean;
  exportFormat: 'svg' | 'component' | 'both';
  includeAnimationCSS: boolean;
}

interface ColorScheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    gradientStops: string[];
  };
}

class DafelBandaFigmaPlugin {
  private settings: DafelBandaSettings;
  private colorSchemes: ColorScheme[];
  
  constructor() {
    this.settings = {
      animation: 'fadeIn',
      colorScheme: 'default',
      size: 'large',
      interactive: false,
      exportFormat: 'svg',
      includeAnimationCSS: true
    };
    
    this.initializeColorSchemes();
    this.setupMessageHandlers();
  }
  
  private initializeColorSchemes(): void {
    this.colorSchemes = [
      {
        name: 'default',
        colors: {
          primary: '#D0E8F5',
          secondary: '#7DBBDB',
          accent: '#1E7FA4',
          background: '#ffffff',
          gradientStops: ['#D0E8F5', '#A8D1E6', '#7DBBDB', '#6FB3D9', '#5AAED0', '#3493B8', '#1E7FA4']
        }
      },
      {
        name: 'dark',
        colors: {
          primary: '#1a1a2e',
          secondary: '#16213e',
          accent: '#0f3460',
          background: '#000000',
          gradientStops: ['#1a1a2e', '#16213e', '#0f3460', '#0e4b99', '#0d4f8c', '#0c4d84', '#0b4a7c']
        }
      },
      {
        name: 'sunset',
        colors: {
          primary: '#FF6B6B',
          secondary: '#FFE66D',
          accent: '#FF8E53',
          background: '#ffffff',
          gradientStops: ['#FF6B6B', '#FF8E53', '#FFE66D', '#FF6B9D', '#C44569', '#F8B500', '#FF6348']
        }
      },
      {
        name: 'ocean',
        colors: {
          primary: '#0077BE',
          secondary: '#00A8E8',
          accent: '#003459',
          background: '#ffffff',
          gradientStops: ['#0077BE', '#00A8E8', '#007EA7', '#003459', '#00171F', '#007BA7', '#0093C4']
        }
      },
      {
        name: 'forest',
        colors: {
          primary: '#2D5016',
          secondary: '#61892F',
          accent: '#86C232',
          background: '#ffffff',
          gradientStops: ['#2D5016', '#61892F', '#86C232', '#6B6E70', '#474B4F', '#222629', '#1B1B2F']
        }
      }
    ];
  }
  
  private setupMessageHandlers(): void {
    figma.ui.onmessage = (msg) => {
      switch (msg.type) {
        case 'create-banda':
          this.createBandaAnimation(msg.settings);
          break;
        case 'preview-banda':
          this.previewBanda(msg.settings);
          break;
        case 'export-to-library':
          this.exportToLibrary(msg.settings);
          break;
        case 'batch-export':
          this.batchExport(msg.schemes);
          break;
        case 'get-color-schemes':
          this.sendColorSchemes();
          break;
        case 'save-settings':
          this.saveSettings(msg.settings);
          break;
        case 'load-settings':
          this.loadSettings();
          break;
        case 'close':
          figma.closePlugin();
          break;
      }
    };
  }
  
  private async createBandaAnimation(settings: DafelBandaSettings): Promise<void> {
    try {
      // Create main frame
      const frame = figma.createFrame();
      frame.name = `Dafel Banda - ${settings.animation}`;
      
      // Set dimensions based on size
      const dimensions = this.getDimensions(settings.size, settings.customWidth, settings.customHeight);
      frame.resize(dimensions.width, dimensions.height);
      
      // Get color scheme
      const colorScheme = this.colorSchemes.find(cs => cs.name === settings.colorScheme) || this.colorSchemes[0];
      
      // Create SVG layers
      await this.createBandaLayers(frame, colorScheme, settings);
      
      // Add animation properties if requested
      if (settings.includeAnimationCSS) {
        await this.addAnimationProperties(frame, settings.animation);
      }
      
      // Position in viewport
      frame.x = figma.viewport.center.x - dimensions.width / 2;
      frame.y = figma.viewport.center.y - dimensions.height / 2;
      
      // Select the created frame
      figma.currentPage.selection = [frame];
      figma.viewport.scrollAndZoomIntoView([frame]);
      
      // Send success message to UI
      figma.ui.postMessage({
        type: 'creation-success',
        message: 'Dafel Banda animation created successfully!'
      });
      
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: `Error creating animation: ${error.message}`
      });
    }
  }
  
  private getDimensions(size: string, customWidth?: number, customHeight?: number): { width: number, height: number } {
    switch (size) {
      case 'small':
        return { width: 640, height: 360 };
      case 'medium':
        return { width: 1024, height: 576 };
      case 'large':
        return { width: 1280, height: 720 };
      case 'custom':
        return { 
          width: customWidth || 1280, 
          height: customHeight || 720 
        };
      default:
        return { width: 1280, height: 720 };
    }
  }
  
  private async createBandaLayers(frame: FrameNode, colorScheme: ColorScheme, settings: DafelBandaSettings): Promise<void> {
    const layers = [
      { name: 'Blue Light Back', opacity: 0.45, hasGrid: false, colorIndex: 0, yOffset: 180 },
      { name: 'Blue Light Front', opacity: 0.55, hasGrid: false, colorIndex: 1, yOffset: 220 },
      { name: 'Green Lime', opacity: 0.38, hasGrid: false, colorIndex: 2, yOffset: 260 },
      { name: 'Teal Grid', opacity: 0.65, hasGrid: true, colorIndex: 3, yOffset: 300 },
      { name: 'Blue Medium Grid', opacity: 0.70, hasGrid: true, colorIndex: 4, yOffset: 340 },
      { name: 'Blue Dark Grid', opacity: 0.75, hasGrid: true, colorIndex: 5, yOffset: 380 },
      { name: 'Blue Deepest', opacity: 0.82, hasGrid: false, colorIndex: 6, yOffset: 420 }
    ];
    
    for (let i = 0; i < layers.length; i++) {
      const layer = layers[i];
      const path = this.createWavePath(frame.width, layer.yOffset);
      const vectorNode = figma.createVector();
      
      vectorNode.name = layer.name;
      vectorNode.vectorPaths = [{ windingRule: 'NONZERO', data: path }];
      vectorNode.opacity = layer.opacity;
      
      // Create gradient fill
      const gradient = this.createGradientFill(colorScheme.colors.gradientStops[layer.colorIndex], colorScheme.colors.gradientStops[layer.colorIndex + 1] || colorScheme.colors.accent);
      vectorNode.fills = [gradient];
      
      // Add grid pattern if needed
      if (layer.hasGrid) {
        await this.addGridPattern(vectorNode, colorScheme.colors.accent);
      }
      
      frame.appendChild(vectorNode);
    }
  }
  
  private createWavePath(width: number, yOffset: number): string {
    const height = 180; // Height of each wave
    const amplitude = 60; // Wave amplitude
    
    // Create curved path using bezier curves
    const path = `M 0,${yOffset} ` +
      `C ${width * 0.167},${yOffset - amplitude} ${width * 0.333},${yOffset + amplitude} ${width * 0.5},${yOffset} ` +
      `C ${width * 0.667},${yOffset - amplitude} ${width * 0.833},${yOffset + amplitude} ${width},${yOffset} ` +
      `L ${width},${yOffset + height} ` +
      `C ${width * 0.833},${yOffset + height + amplitude} ${width * 0.667},${yOffset + height - amplitude} ${width * 0.5},${yOffset + height} ` +
      `C ${width * 0.333},${yOffset + height + amplitude} ${width * 0.167},${yOffset + height - amplitude} 0,${yOffset + height} ` +
      `Z`;
    
    return path;
  }
  
  private createGradientFill(startColor: string, endColor: string): Paint {
    return {
      type: 'GRADIENT_LINEAR',
      gradientTransform: [
        [Math.cos(135 * Math.PI / 180), Math.sin(135 * Math.PI / 180), 0],
        [-Math.sin(135 * Math.PI / 180), Math.cos(135 * Math.PI / 180), 0]
      ],
      gradientStops: [
        { position: 0, color: this.hexToRgb(startColor) },
        { position: 1, color: this.hexToRgb(endColor) }
      ]
    };
  }
  
  private hexToRgb(hex: string): RGBA {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
      a: 1
    } : { r: 0, g: 0, b: 0, a: 1 };
  }
  
  private async addGridPattern(node: VectorNode, accentColor: string): Promise<void> {
    // Create a simple grid effect using stroke
    const gridStroke: SolidPaint = {
      type: 'SOLID',
      color: this.hexToRgb(accentColor),
      opacity: 0.3
    };
    
    node.strokes = [gridStroke];
    node.strokeWeight = 1;
    node.strokeAlign = 'INSIDE';
    node.dashPattern = [4, 4]; // Dashed pattern to simulate grid
  }
  
  private async addAnimationProperties(frame: FrameNode, animation: string): Promise<void> {
    // Add custom properties for animation export
    const animationData = {
      'animation-type': animation,
      'animation-duration': '2s',
      'animation-timing': 'ease-in-out',
      'animation-iteration': 'infinite'
    };
    
    // Store as frame description for export
    frame.description = JSON.stringify(animationData);
    
    // Add visual indicator
    const animationLabel = figma.createText();
    await figma.loadFontAsync({ family: 'Inter', style: 'Medium' });
    
    animationLabel.characters = `Animation: ${animation}`;
    animationLabel.fontSize = 14;
    animationLabel.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }];
    animationLabel.x = 10;
    animationLabel.y = frame.height + 10;
    
    frame.appendChild(animationLabel);
  }
  
  private async exportToLibrary(settings: DafelBandaSettings): Promise<void> {
    try {
      const frame = figma.currentPage.selection[0] as FrameNode;
      
      if (!frame || frame.type !== 'FRAME') {
        throw new Error('Please select a Dafel Banda frame to export');
      }
      
      // Create component
      const component = figma.createComponent();
      component.name = `Dafel Banda - ${settings.animation} - ${settings.colorScheme}`;
      component.description = `Dafel Banda animation component with ${settings.animation} animation and ${settings.colorScheme} color scheme.`;
      
      // Copy frame contents to component
      const frameClone = frame.clone();
      frameClone.x = 0;
      frameClone.y = 0;
      
      component.appendChild(frameClone);
      component.resize(frame.width, frame.height);
      
      // Position component
      component.x = frame.x;
      component.y = frame.y + frame.height + 50;
      
      figma.ui.postMessage({
        type: 'export-success',
        message: 'Component created and ready for library publishing!'
      });
      
    } catch (error) {
      figma.ui.postMessage({
        type: 'error',
        message: `Export failed: ${error.message}`
      });
    }
  }
  
  private async batchExport(schemes: string[]): Promise<void> {
    const animations = ['fadeIn', 'wave', 'pulse', 'staggerIn'];
    const createdComponents: ComponentNode[] = [];
    
    for (const scheme of schemes) {
      for (const animation of animations) {
        const settings: DafelBandaSettings = {
          animation,
          colorScheme: scheme,
          size: 'large',
          interactive: false,
          exportFormat: 'component',
          includeAnimationCSS: true
        };
        
        try {
          await this.createBandaAnimation(settings);
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay
          
          const frame = figma.currentPage.selection[0] as FrameNode;
          if (frame) {
            const component = figma.createComponent();
            component.name = `Dafel Banda - ${animation} - ${scheme}`;
            
            const frameClone = frame.clone();
            frameClone.x = 0;
            frameClone.y = 0;
            component.appendChild(frameClone);
            component.resize(frame.width, frame.height);
            
            createdComponents.push(component);
          }
          
        } catch (error) {
          console.error(`Failed to create ${animation} with ${scheme}:`, error);
        }
      }
    }
    
    // Organize components in grid
    this.organizeComponentsInGrid(createdComponents);
    
    figma.ui.postMessage({
      type: 'batch-success',
      message: `Created ${createdComponents.length} components successfully!`
    });
  }
  
  private organizeComponentsInGrid(components: ComponentNode[]): void {
    const cols = 4;
    const spacing = 50;
    const componentWidth = 320; // Scaled down for overview
    const componentHeight = 180;
    
    components.forEach((component, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      component.resize(componentWidth, componentHeight);
      component.x = col * (componentWidth + spacing);
      component.y = row * (componentHeight + spacing);
    });
  }
  
  private sendColorSchemes(): void {
    figma.ui.postMessage({
      type: 'color-schemes',
      schemes: this.colorSchemes
    });
  }
  
  private saveSettings(settings: DafelBandaSettings): void {
    this.settings = settings;
    figma.clientStorage.setAsync('dafel-banda-settings', settings);
  }
  
  private async loadSettings(): Promise<void> {
    try {
      const savedSettings = await figma.clientStorage.getAsync('dafel-banda-settings');
      if (savedSettings) {
        this.settings = savedSettings;
      }
      
      figma.ui.postMessage({
        type: 'settings-loaded',
        settings: this.settings
      });
    } catch (error) {
      figma.ui.postMessage({
        type: 'settings-loaded',
        settings: this.settings
      });
    }
  }
  
  private previewBanda(settings: DafelBandaSettings): void {
    // Send preview data to UI
    const colorScheme = this.colorSchemes.find(cs => cs.name === settings.colorScheme) || this.colorSchemes[0];
    
    figma.ui.postMessage({
      type: 'preview-data',
      settings,
      colorScheme
    });
  }
}

// Initialize plugin
new DafelBandaFigmaPlugin();