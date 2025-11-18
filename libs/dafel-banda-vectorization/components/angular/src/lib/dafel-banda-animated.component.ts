/**
 * Dafel Banda Animated Angular Component
 * Full-featured component with Angular Animations
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
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger,
  group,
  AnimationBuilder,
  AnimationFactory,
  AnimationPlayer
} from '@angular/animations';
import { 
  DafelBandaProps, 
  LAYER_DEFINITIONS, 
  shouldReduceMotion,
  getLayerDelay
} from '../../../shared/types';

@Component({
  selector: 'dafel-banda-animated',
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
      [@containerAnimation]="animationState()"
      (@containerAnimation.start)="onAnimationStart()"
      (@containerAnimation.done)="onAnimationEnd()"
      (mouseenter)="handleInteraction($event)"
      (click)="handleInteraction($event)"
      (focus)="handleInteraction($event)"
      (load)="handleLoad()"
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
      </defs>

      <!-- Background -->
      <rect 
        [attr.width]="width" 
        [attr.height]="height" 
        [attr.fill]="themeConfig?.colors?.background || '#F8FBFD'" 
      />

      <!-- Animated Layers -->
      <g
        *ngFor="let layer of layerData; trackBy: trackByLayerId; let i = index"
        [id]="'layer-' + layer.id + '-' + layer.name + '-' + instanceId()"
        [class]="getLayerClasses(layer)"
        [attr.opacity]="layer.opacity"
        [style]="getLayerStyles(layer)"
        [attr.filter]="getLayerFilter(layer)"
        [@layerAnimation]="getLayerAnimationState(i)"
        (@layerAnimation.start)="onLayerAnimationStart(i)"
        (@layerAnimation.done)="onLayerAnimationEnd(i)"
        (mouseenter)="interactive ? handleLayerInteraction($event, layer.id) : undefined"
        (click)="interactive ? handleLayerInteraction($event, layer.id) : undefined"
        (focus)="interactive ? handleLayerInteraction($event, layer.id) : undefined"
      >
        <!-- Base path -->
        <path
          [attr.d]="layer.path"
          [attr.fill]="'url(#' + layer.gradient + '-' + instanceId() + ')'"
          class="band-path"
        />

        <!-- Grid overlay -->
        <path
          *ngIf="layer.hasGrid"
          [attr.d]="layer.path"
          [attr.fill]="'url(#' + layer.gridPattern + '-' + instanceId() + ')'"
          class="band-grid-overlay"
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

    .dafel-banda--animated {
      transition: all 0.3s ease;
    }

    .dafel-banda--interactive {
      cursor: pointer;
    }

    .band-layer {
      transition: all 0.3s ease;
    }

    .band-layer--interactive:hover {
      opacity: 1 !important;
    }

    .band-path {
      vector-effect: non-scaling-stroke;
    }

    .band-grid-overlay {
      pointer-events: none;
    }

    .dafel-banda--reduced-motion,
    .dafel-banda--reduced-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
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
  animations: [
    // Container animation
    trigger('containerAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'scale(0.95) translateY(50px)'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'scale(1) translateY(0)'
      })),
      transition('hidden => visible', [
        animate('1200ms ease-out')
      ]),
      transition('visible => hidden', [
        animate('600ms ease-in')
      ])
    ]),

    // Layer animations
    trigger('layerAnimation', [
      // Fade In
      state('fadeIn-hidden', style({
        opacity: 0,
        transform: 'translateY(30px) scale(0.95)'
      })),
      state('fadeIn-visible', style({
        opacity: '{{ opacity }}',
        transform: 'translateY(0) scale(1)'
      }), { params: { opacity: 1 } }),
      transition('fadeIn-hidden => fadeIn-visible', [
        animate('{{ duration }}ms {{ delay }}ms ease-out')
      ], { params: { duration: 1000, delay: 0 } }),

      // Wave
      state('wave', style({
        transform: 'translate({{ x }}px, {{ y }}px)'
      }), { params: { x: 0, y: 0 } }),
      transition('* => wave', [
        animate('{{ duration }}ms ease-in-out', keyframes([
          style({ transform: 'translate(-8px, -3px)', offset: 0 }),
          style({ transform: 'translate(8px, 3px)', offset: 0.5 }),
          style({ transform: 'translate(-8px, -3px)', offset: 1 })
        ]))
      ], { params: { duration: 4000 } }),

      // Pulse
      state('pulse', style({
        transform: 'scale({{ scale }})',
        opacity: '{{ opacity }}'
      }), { params: { scale: 1, opacity: 1 } }),
      transition('* => pulse', [
        animate('3000ms ease-in-out', keyframes([
          style({ transform: 'scale(1)', opacity: '{{ baseOpacity }}', offset: 0 }),
          style({ transform: 'scale(1.02)', opacity: '{{ maxOpacity }}', offset: 0.5 }),
          style({ transform: 'scale(1)', opacity: '{{ baseOpacity }}', offset: 1 })
        ]))
      ], { params: { baseOpacity: 1, maxOpacity: 1 } }),

      // Interactive
      state('interactive-rest', style({
        transform: 'scale(1) translateY(0)'
      })),
      state('interactive-hover', style({
        transform: 'scale(1.02) translateY(-2px)',
        opacity: '{{ hoverOpacity }}'
      }), { params: { hoverOpacity: 1 } }),
      transition('interactive-rest => interactive-hover', [
        animate('300ms ease-out')
      ]),
      transition('interactive-hover => interactive-rest', [
        animate('300ms ease-in')
      ])
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DafelBandaAnimatedComponent implements OnInit, OnDestroy {
  @ViewChild('svgElement', { static: true }) svgElement!: ElementRef<SVGSVGElement>;

  // Inputs
  @Input() animation: 'fadeIn' | 'wave' | 'pulse' | 'interactive' | 'scroll' | 'morphing' | 'none' = 'fadeIn';
  @Input() width: number = 1280;
  @Input() height: number = 720;
  @Input() interactive: boolean = false;
  @Input() className: string = '';
  @Input() ariaLabel: string = 'Dafel Banda animated decorative element';
  @Input() reducedMotion: boolean = false;
  @Input() lazy: boolean = true;
  @Input() performance: 'low' | 'medium' | 'high' = 'medium';
  @Input() animationConfig?: any;
  @Input() accessibilityConfig?: any;
  @Input() themeConfig?: any;

  // Outputs
  @Output() hover = new EventEmitter<Event>();
  @Output() click = new EventEmitter<Event>();
  @Output() focus = new EventEmitter<Event>();
  @Output() load = new EventEmitter<void>();
  @Output() error = new EventEmitter<Error>();
  @Output() animationStart = new EventEmitter<void>();
  @Output() animationEnd = new EventEmitter<void>();

  // Signals
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = signal(isPlatformBrowser(this.platformId));
  private readonly instanceId = signal(this.generateInstanceId());
  private readonly isVisible = signal(false);
  private readonly isPlaying = signal(false);
  private readonly animationPlayers = signal<AnimationPlayer[]>([]);

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

  readonly animationState = computed(() => 
    this.isVisible() ? 'visible' : 'hidden'
  );

  readonly componentClasses = computed(() => {
    const classes = [
      'dafel-banda',
      'dafel-banda--animated',
      this.className
    ];

    if (this.interactive) classes.push('dafel-banda--interactive');
    if (this.motionReduced()) classes.push('dafel-banda--reduced-motion');
    if (this.isVisible()) classes.push('dafel-banda--visible');
    if (this.performance !== 'medium') classes.push(`dafel-banda--${this.performance}`);
    if (this.finalAnimation() !== 'none') classes.push(`dafel-banda--${this.finalAnimation()}`);

    return classes.join(' ');
  });

  readonly componentStyles = computed(() => {
    const styles: Record<string, any> = {
      overflow: 'hidden'
    };

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

  private intersectionObserver?: IntersectionObserver;

  constructor(private animationBuilder: AnimationBuilder) {
    this.loadDefinitions();

    effect(() => {
      if (this.isBrowser() && this.isVisible()) {
        this.startAnimations();
      }
    });
  }

  ngOnInit(): void {
    if (this.isBrowser()) {
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.stopAllAnimations();
  }

  // Methods
  private generateInstanceId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private loadDefinitions(): void {
    import('../../../shared/types').then(module => {
      this.gradientDefinitions = signal(module.GRADIENT_DEFINITIONS).asReadonly();
      this.patternDefinitions = signal(module.PATTERN_DEFINITIONS).asReadonly();
      this.filterDefinitions = signal(module.FILTER_DEFINITIONS).asReadonly();
    });
  }

  private setupIntersectionObserver(): void {
    if (!this.lazy) {
      this.isVisible.set(true);
      return;
    }

    this.intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        this.isVisible.set(entry.isIntersecting);
      },
      { threshold: 0.3, rootMargin: '-100px' }
    );

    this.intersectionObserver.observe(this.svgElement.nativeElement);
  }

  private startAnimations(): void {
    if (this.motionReduced() || this.finalAnimation() === 'none') return;

    this.isPlaying.set(true);
    this.createCustomAnimations();
  }

  private createCustomAnimations(): void {
    const animation = this.finalAnimation();
    
    if (animation === 'wave' || animation === 'pulse') {
      this.layerData.forEach((layer, index) => {
        const element = this.svgElement.nativeElement.querySelector(`#layer-${layer.id}-${layer.name}-${this.instanceId()}`);
        if (!element) return;

        const animationFactory = this.createLayerAnimation(animation, layer, index);
        const player = animationFactory.create(element);
        
        player.play();
        this.animationPlayers.update(players => [...players, player]);
      });
    }
  }

  private createLayerAnimation(animationType: string, layer: any, index: number): AnimationFactory {
    const delay = getLayerDelay(index);
    const duration = this.animationConfig?.duration || 4000;

    switch (animationType) {
      case 'wave':
        return this.animationBuilder.build([
          style({ transform: 'translate(0, 0)' }),
          animate(`${duration}ms ${delay}ms ease-in-out`, keyframes([
            style({ transform: 'translate(-8px, -3px)', offset: 0 }),
            style({ transform: 'translate(8px, 3px)', offset: 0.5 }),
            style({ transform: 'translate(-8px, -3px)', offset: 1 })
          ]))
        ]);

      case 'pulse':
        return this.animationBuilder.build([
          animate(`3000ms ${delay}ms ease-in-out`, keyframes([
            style({ 
              transform: 'scale(1)', 
              opacity: layer.opacity, 
              offset: 0 
            }),
            style({ 
              transform: 'scale(1.02)', 
              opacity: Math.min(layer.opacity + 0.15, 1), 
              offset: 0.5 
            }),
            style({ 
              transform: 'scale(1)', 
              opacity: layer.opacity, 
              offset: 1 
            })
          ]))
        ]);

      default:
        return this.animationBuilder.build([]);
    }
  }

  private stopAllAnimations(): void {
    this.animationPlayers().forEach(player => {
      player.destroy();
    });
    this.animationPlayers.set([]);
    this.isPlaying.set(false);
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
    
    return classes.join(' ');
  }

  getLayerStyles(layer: any): Record<string, any> {
    const styles: Record<string, any> = {
      cursor: this.interactive ? 'pointer' : 'default'
    };

    if (layer.hasFilter && this.performance === 'high') {
      styles['filter'] = `url(#${layer.filter}-${this.instanceId()})`;
    }

    return styles;
  }

  getLayerFilter(layer: any): string | null {
    return this.performance === 'high' && layer.hasFilter ? 
      `url(#${layer.filter}-${this.instanceId()})` : null;
  }

  getLayerAnimationState(index: number): string {
    const animation = this.finalAnimation();
    const layer = this.layerData[index];

    switch (animation) {
      case 'fadeIn':
        return this.isVisible() ? 'fadeIn-visible' : 'fadeIn-hidden';
      case 'wave':
        return 'wave';
      case 'pulse':
        return 'pulse';
      case 'interactive':
        return 'interactive-rest';
      default:
        return '';
    }
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

  handleLayerInteraction(event: Event, layerId: number): void {
    if (!this.interactive) return;
    
    this.handleInteraction(event);
  }

  handleLoad(): void {
    this.load.emit();
  }

  onAnimationStart(): void {
    this.animationStart.emit();
  }

  onAnimationEnd(): void {
    this.animationEnd.emit();
  }

  onLayerAnimationStart(index: number): void {
    // Layer-specific animation start logic
  }

  onLayerAnimationEnd(index: number): void {
    // Layer-specific animation end logic
  }

  trackByLayerId(index: number, layer: any): number {
    return layer.id;
  }

  // Public API
  play(): void {
    this.isVisible.set(true);
    this.startAnimations();
  }

  pause(): void {
    this.stopAllAnimations();
  }

  reset(): void {
    this.stopAllAnimations();
    this.isVisible.set(false);
  }
}