/**
 * Dafel Banda Angular Component - Basic Implementation
 * Standalone component with full Angular features
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  ElementRef,
  ViewChild,
  computed,
  signal,
  effect,
  inject,
  PLATFORM_ID
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { 
  DafelBandaProps, 
  LAYER_DEFINITIONS, 
  shouldReduceMotion,
  AnimationType,
  ThemeConfig,
  AccessibilityConfig,
  PerformanceConfig
} from '../../../shared/types';

export interface DafelBandaComponentProps extends Omit<DafelBandaProps, 'animation'> {
  animation?: 'none' | 'fadeIn';
}

@Component({
  selector: 'dafel-banda',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      #svgElement
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="viewBox()"
      xmlns="http://www.w3.org/2000/svg"
      [class]="componentClasses()"
      [style]="componentStyles()"
      [attr.aria-label]="ariaLabel"
      [attr.role]="accessibilityConfig?.role || 'img'"
      [attr.tabindex]="getTabIndex()"
      (mouseenter)="handleInteraction($event)"
      (click)="handleInteraction($event)"
      (focus)="handleInteraction($event)"
      (load)="handleLoad()"
      (error)="handleError($event)"
    >
      <!-- SVG Definitions -->
      <defs>
        <!-- Gradients -->
        <ng-container *ngFor="let gradient of gradientDefinitions">
          <radialGradient
            *ngIf="gradient.type === 'radial'; else linearGradient"
            [id]="gradient.id + '-' + instanceId()"
            [attr.cx]="gradient.coordinates?.cx"
            [attr.cy]="gradient.coordinates?.cy"
          >
            <stop
              *ngFor="let stop of gradient.stops"
              [attr.offset]="stop.offset"
              [attr.stop-color]="getThemeColor(stop.color)"
            />
          </radialGradient>
          <ng-template #linearGradient>
            <linearGradient
              [id]="gradient.id + '-' + instanceId()"
              [attr.x1]="gradient.coordinates?.x1"
              [attr.y1]="gradient.coordinates?.y1"
              [attr.x2]="gradient.coordinates?.x2"
              [attr.y2]="gradient.coordinates?.y2"
            >
              <stop
                *ngFor="let stop of gradient.stops"
                [attr.offset]="stop.offset"
                [attr.stop-color]="getThemeColor(stop.color)"
              />
            </linearGradient>
          </ng-template>
        </ng-container>

        <!-- Patterns -->
        <pattern
          *ngFor="let pattern of patternDefinitions"
          [id]="pattern.id + '-' + instanceId()"
          [attr.width]="pattern.width"
          [attr.height]="pattern.height"
          patternUnits="userSpaceOnUse"
        >
          <path
            [attr.d]="pattern.path"
            [attr.stroke]="pattern.stroke"
            [attr.stroke-width]="pattern.strokeWidth"
            [attr.opacity]="pattern.opacity"
            fill="none"
          />
        </pattern>

        <!-- Filters -->
        <filter
          *ngFor="let filter of filterDefinitions"
          [id]="filter.id + '-' + instanceId()"
        >
          <ng-container *ngFor="let effect of filter.effects">
            <feGaussianBlur
              *ngIf="effect.type === 'blur'"
              [attr.in]="effect.properties['in']"
              [attr.stdDeviation]="effect.properties['stdDeviation']"
            />
            <feOffset
              *ngIf="effect.type === 'offset'"
              [attr.dy]="effect.properties['dy']"
            />
            <feComponentTransfer *ngIf="effect.type === 'alpha'">
              <feFuncA
                [attr.type]="effect.properties['type']"
                [attr.slope]="effect.properties['slope']"
              />
            </feComponentTransfer>
            <feMerge *ngIf="effect.type === 'merge'">
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </ng-container>
        </filter>

        <!-- High contrast filter -->
        <filter *ngIf="themeConfig?.highContrast" [id]="'high-contrast-' + instanceId()">
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 .5 1" />
          </feComponentTransfer>
        </filter>
      </defs>

      <!-- Background -->
      <rect 
        [attr.width]="width" 
        [attr.height]="height" 
        [attr.fill]="themeConfig?.colors?.background || '#F8FBFD'" 
      />

      <!-- Band Layers -->
      <g
        *ngFor="let layer of layerData; trackBy: trackByLayerId; let i = index"
        [id]="'layer-' + layer.id + '-' + layer.name + '-' + instanceId()"
        [class]="getLayerClasses(layer)"
        [attr.opacity]="layer.opacity"
        [style]="getLayerStyles(layer)"
        [attr.filter]="getLayerFilter(layer)"
      >
        <!-- Base path -->
        <path
          [attr.d]="layer.path"
          [attr.fill]="'url(#' + layer.gradient + '-' + instanceId() + ')'"
          class="band-path"
          [attr.vector-effect]="performance === 'low' ? 'non-scaling-stroke' : null"
        />

        <!-- Grid overlay -->
        <path
          *ngIf="layer.hasGrid"
          [attr.d]="layer.path"
          [attr.fill]="'url(#' + layer.gridPattern + '-' + instanceId() + ')'"
          class="band-grid-overlay"
          [attr.vector-effect]="performance === 'low' ? 'non-scaling-stroke' : null"
        />
      </g>
    </svg>
  `,
  styles: [`
    :host {
      display: block;
      max-width: 100%;
    }

    svg {
      display: block;
      max-width: 100%;
      height: auto;
    }

    .dafel-banda--interactive {
      cursor: pointer;
    }

    .dafel-banda--interactive:hover {
      transform: scale(1.01);
      transition: transform 0.2s ease;
    }

    .dafel-banda--reduced-motion,
    .dafel-banda--reduced-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }

    .dafel-banda--high {
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }

    .dafel-banda--low {
      image-rendering: optimizeSpeed;
    }

    .band-layer {
      transition: opacity 0.3s ease;
    }

    .band-layer--interactive:hover {
      opacity: 1;
    }

    .band-path {
      transition: fill 0.3s ease;
    }

    .band-grid-overlay {
      pointer-events: none;
      mix-blend-mode: overlay;
    }

    @media (prefers-reduced-motion: reduce) {
      svg,
      svg * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }

    @media (max-width: 768px) {
      svg {
        max-height: 300px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DafelBandaComponent implements OnInit, OnDestroy {
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGSVGElement>;

  // Inputs
  @Input() animation: 'none' | 'fadeIn' = 'fadeIn';
  @Input() width: number = 1280;
  @Input() height: number = 720;
  @Input() interactive: boolean = false;
  @Input() className: string = '';
  @Input() ariaLabel: string = 'Dafel Banda decorative element';
  @Input() reducedMotion: boolean = false;
  @Input() lazy: boolean = true;
  @Input() performance: 'low' | 'medium' | 'high' = 'medium';
  @Input() accessibilityConfig?: AccessibilityConfig;
  @Input() themeConfig?: ThemeConfig;
  @Input() performanceConfig?: PerformanceConfig;

  // Outputs
  @Output() hover = new EventEmitter<Event>();
  @Output() click = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  @Output() load = new EventEmitter<void>();
  @Output() error = new EventEmitter<Error>();

  // Signals
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = signal(isPlatformBrowser(this.platformId));
  private readonly instanceId = signal(this.generateInstanceId());
  private readonly isLoaded = signal(false);
  private readonly hasError = signal(false);

  // Computed properties
  readonly motionReduced = computed(() => 
    shouldReduceMotion({ 
      reducedMotion: this.reducedMotion, 
      accessibilityConfig: this.accessibilityConfig 
    })
  );

  readonly finalAnimation = computed(() => 
    this.motionReduced() ? 'none' : this.animation
  );

  readonly viewBox = computed(() => 
    `0 0 ${this.width} ${this.height}`
  );

  readonly componentClasses = computed(() => {
    const classes = [
      'dafel-banda',
      'dafel-banda--basic',
      this.className
    ];

    if (this.interactive) classes.push('dafel-banda--interactive');
    if (this.motionReduced()) classes.push('dafel-banda--reduced-motion');
    if (this.performance !== 'medium') classes.push(`dafel-banda--${this.performance}`);

    return classes.join(' ');
  });

  readonly componentStyles = computed(() => {
    const styles: Record<string, any> = {
      overflow: 'hidden'
    };

    // Apply theme styles
    if (this.themeConfig?.darkMode) {
      styles['filter'] = 'invert(1) hue-rotate(180deg)';
    }

    if (this.themeConfig?.highContrast) {
      styles['opacity'] = '0.9';
    }

    // Performance optimizations
    if (this.performance === 'high') {
      styles['will-change'] = 'transform, opacity';
      styles['transform'] = 'translateZ(0)';
    }

    return styles;
  });

  // Data
  readonly layerData = LAYER_DEFINITIONS;
  readonly gradientDefinitions = signal([]).asReadonly();
  readonly patternDefinitions = signal([]).asReadonly();
  readonly filterDefinitions = signal([]).asReadonly();

  constructor() {
    // Initialize definitions
    this.loadDefinitions();

    // Effects
    effect(() => {
      if (this.isBrowser() && this.isLoaded()) {
        this.setupPerformanceOptimizations();
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.setupIntersectionObserver();
      this.isLoaded.set(true);
    }
  }

  ngOnDestroy(): void {
    // Cleanup is handled automatically by Angular
  }

  // Methods
  private generateInstanceId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private loadDefinitions(): void {
    // Load definitions from shared types
    import('../../../shared/types').then(module => {
      this.gradientDefinitions = signal(module.GRADIENT_DEFINITIONS).asReadonly();
      this.patternDefinitions = signal(module.PATTERN_DEFINITIONS).asReadonly();
      this.filterDefinitions = signal(module.FILTER_DEFINITIONS).asReadonly();
    });
  }

  private setupIntersectionObserver(): void {
    if (!this.lazy || !this.isBrowser()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.isLoaded.set(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(this.svgElement.nativeElement);
  }

  private setupPerformanceOptimizations(): void {
    if (this.performance === 'high' && this.performanceConfig?.gpu) {
      const svg = this.svgElement.nativeElement;
      svg.style.willChange = 'transform, opacity';
      svg.style.transform = 'translateZ(0)';
    }
  }

  getTabIndex(): number | null {
    return this.interactive && this.accessibilityConfig?.focusable ? 
      this.accessibilityConfig.tabIndex || 0 : null;
  }

  getThemeColor(originalColor: string): string {
    if (!this.themeConfig?.colors) return originalColor;
    
    const colorMap: Record<string, string> = {
      '#D0E8F5': this.themeConfig.colors.primary || originalColor,
      '#5FD4C4': this.themeConfig.colors.secondary || originalColor,
      '#D5EDB8': this.themeConfig.colors.accent || originalColor,
    };
    
    return colorMap[originalColor] || originalColor;
  }

  getLayerClasses(layer: any): string {
    const classes = ['band-layer'];
    
    if (layer.hasGrid) classes.push('band-layer--has-grid');
    if (this.interactive) classes.push('band-layer--interactive');
    if (this.performance === 'low') classes.push('band-layer--optimized');
    
    return classes.join(' ');
  }

  getLayerStyles(layer: any): Record<string, any> {
    const styles: Record<string, any> = {};

    if (this.performance === 'low') {
      styles['shape-rendering'] = 'optimizeSpeed';
      styles['color-rendering'] = 'optimizeSpeed';
    }

    if (this.performance === 'high') {
      styles['will-change'] = 'transform, opacity';
    }

    if (this.interactive) {
      styles['cursor'] = 'pointer';
    }

    return styles;
  }

  getLayerFilter(layer: any): string | null {
    return this.performance === 'high' && layer.hasFilter ? 
      `url(#${layer.filter}-${this.instanceId()})` : null;
  }

  handleInteraction(event: Event): void {
    if (!this.interactive) return;
    
    switch (event.type) {
      case 'mouseenter':
      case 'mouseover':
        this.hover.emit(event);
        break;
      case 'click':
        this.click.emit(event);
        break;
      case 'focus':
        this.focus.emit(event);
        break;
    }
  }

  handleLoad(): void {
    this.isLoaded.set(true);
    this.load.emit();
  }

  handleError(event: Event): void {
    const error = new Error('SVG load error');
    this.hasError.set(true);
    console.error('DafelBanda component error:', error);
    this.error.emit(error);
  }

  trackByLayerId(index: number, layer: any): number {
    return layer.id;
  }

  // Public API
  get svgRef(): ElementRef<SVGSVGElement> {
    return this.svgElement;
  }

  get loaded(): boolean {
    return this.isLoaded();
  }

  get errored(): boolean {
    return this.hasError();
  }
}