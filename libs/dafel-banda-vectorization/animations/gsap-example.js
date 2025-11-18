/**
 * DAFEL BANDA BAJA - Ejemplos de Animación con GSAP
 *
 * Requiere: GSAP 3.12+ (https://greensock.com/gsap/)
 * CDN: <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
 *
 * Incluye:
 * 1. Animación de entrada escalonada (Stagger In)
 * 2. Loop infinito de ondas (Infinite Wave)
 * 3. Timeline compleja con múltiples efectos
 * 4. Animación basada en scroll (ScrollTrigger)
 * 5. Interacciones hover dinámicas
 * 6. Morphing de paths
 * 7. Animación de gradientes
 */

/* ============================================
   CONFIGURACIÓN INICIAL
   ============================================ */

// Registrar plugins si están disponibles
if (typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Clase principal para manejar animaciones
class DafelBandaAnimator {
  constructor(svgSelector = '.dafel-banda-animatable') {
    this.svg = document.querySelector(svgSelector);
    this.layers = gsap.utils.toArray('[data-layer]');
    this.timeline = null;

    if (!this.svg) {
      console.error('SVG no encontrado:', svgSelector);
      return;
    }

    this.init();
  }

  init() {
    // Configuración inicial de GSAP
    gsap.defaults({
      ease: 'power2.inOut',
      duration: 1
    });
  }

  /* ============================================
     ANIMACIÓN 1: ENTRADA ESCALONADA
     ============================================ */
  staggerIn(config = {}) {
    const {
      duration = 1.2,
      stagger = 0.15,
      ease = 'power3.out',
      y = 50,
      scale = 0.95
    } = config;

    gsap.set(this.layers, {
      opacity: 0,
      y: y,
      scale: scale
    });

    return gsap.to(this.layers, {
      opacity: (i, target) => parseFloat(target.getAttribute('opacity')) || 1,
      y: 0,
      scale: 1,
      duration: duration,
      stagger: stagger,
      ease: ease,
      clearProps: 'transform'
    });
  }

  /* ============================================
     ANIMACIÓN 2: ONDA HORIZONTAL INFINITA
     ============================================ */
  infiniteWave(config = {}) {
    const {
      amplitude = 10,
      speed = 4,
      verticalShift = 3
    } = config;

    this.layers.forEach((layer, index) => {
      const delay = index * 0.15;

      gsap.to(layer, {
        x: `+=${amplitude}`,
        y: `+=${verticalShift}`,
        duration: speed / 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: delay
      });
    });

    return this;
  }

  /* ============================================
     ANIMACIÓN 3: PULSACIÓN SUAVE
     ============================================ */
  pulse(config = {}) {
    const {
      scaleAmount = 1.02,
      opacityBoost = 0.15,
      duration = 3
    } = config;

    this.layers.forEach((layer, index) => {
      const baseOpacity = parseFloat(layer.getAttribute('opacity')) || 0.7;
      const delay = index * 0.2;

      const tl = gsap.timeline({ repeat: -1, delay: delay });

      tl.to(layer, {
        scale: scaleAmount,
        opacity: baseOpacity + opacityBoost,
        duration: duration / 2,
        ease: 'sine.inOut'
      })
      .to(layer, {
        scale: 1,
        opacity: baseOpacity,
        duration: duration / 2,
        ease: 'sine.inOut'
      });
    });

    return this;
  }

  /* ============================================
     ANIMACIÓN 4: TIMELINE COMPLEJA
     ============================================ */
  complexTimeline() {
    const tl = gsap.timeline({ paused: true });

    // Fase 1: Fade in escalonado
    tl.from(this.layers, {
      opacity: 0,
      y: 100,
      scale: 0.9,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // Fase 2: Wave coordinado
    tl.to(this.layers, {
      x: '-=15',
      y: '-=5',
      duration: 0.8,
      stagger: 0.05,
      ease: 'power2.inOut'
    }, '-=0.5');

    // Fase 3: Return to center con bounce
    tl.to(this.layers, {
      x: 0,
      y: 0,
      duration: 1.2,
      stagger: 0.05,
      ease: 'elastic.out(1, 0.5)'
    });

    // Fase 4: Grid shimmer en capas con cuadrícula
    const gridLayers = gsap.utils.toArray('[data-has-grid="true"]');
    tl.to(gridLayers, {
      opacity: '+=0.2',
      duration: 0.5,
      stagger: 0.1,
      yoyo: true,
      repeat: 1
    }, '-=0.5');

    this.timeline = tl;
    return tl;
  }

  /* ============================================
     ANIMACIÓN 5: SCROLL-BASED (ScrollTrigger)
     ============================================ */
  scrollAnimation(config = {}) {
    const {
      trigger = this.svg,
      start = 'top 80%',
      end = 'bottom 20%',
      scrub = 1
    } = config;

    if (typeof ScrollTrigger === 'undefined') {
      console.warn('ScrollTrigger plugin no está cargado');
      return this;
    }

    this.layers.forEach((layer, index) => {
      const depth = (index + 1) * 10;

      gsap.to(layer, {
        y: depth,
        scrollTrigger: {
          trigger: trigger,
          start: start,
          end: end,
          scrub: scrub,
          markers: false
        }
      });
    });

    return this;
  }

  /* ============================================
     ANIMACIÓN 6: HOVER INTERACTIVO
     ============================================ */
  setupHover(config = {}) {
    const {
      scaleAmount = 1.05,
      duration = 0.4,
      ease = 'power2.out'
    } = config;

    this.layers.forEach((layer) => {
      const baseOpacity = parseFloat(layer.getAttribute('opacity')) || 0.7;

      layer.addEventListener('mouseenter', () => {
        gsap.to(layer, {
          scale: scaleAmount,
          opacity: Math.min(baseOpacity + 0.2, 1),
          y: -5,
          duration: duration,
          ease: ease,
          filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
        });
      });

      layer.addEventListener('mouseleave', () => {
        gsap.to(layer, {
          scale: 1,
          opacity: baseOpacity,
          y: 0,
          duration: duration,
          ease: ease,
          filter: 'none'
        });
      });
    });

    return this;
  }

  /* ============================================
     ANIMACIÓN 7: GRADIENTE ANIMADO
     ============================================ */
  animateGradients(config = {}) {
    const { duration = 5, ease = 'sine.inOut' } = config;

    const gradients = gsap.utils.toArray('linearGradient, radialGradient');

    gradients.forEach((gradient) => {
      const stops = gradient.querySelectorAll('stop');

      gsap.to(stops, {
        attr: {
          offset: (i, target) => {
            const currentOffset = parseFloat(target.getAttribute('offset'));
            return `${(currentOffset + 10) % 110}%`;
          }
        },
        duration: duration,
        repeat: -1,
        ease: ease,
        stagger: 0.5
      });
    });

    return this;
  }

  /* ============================================
     ANIMACIÓN 8: GRID SHIMMER
     ============================================ */
  gridShimmer(config = {}) {
    const { duration = 2, stagger = 0.3 } = config;

    const gridPaths = gsap.utils.toArray('.band-grid-overlay .grid-lines');

    gsap.to(gridPaths, {
      opacity: 0.6,
      duration: duration / 2,
      yoyo: true,
      repeat: -1,
      stagger: stagger,
      ease: 'sine.inOut'
    });

    return this;
  }

  /* ============================================
     DESTRUIR ANIMACIONES
     ============================================ */
  destroy() {
    gsap.killTweensOf(this.layers);
    if (this.timeline) {
      this.timeline.kill();
    }
  }
}

/* ============================================
   EJEMPLOS DE USO RÁPIDO
   ============================================ */

// Función helper para inicialización rápida
const DafelBandaAnimations = {
  // Ejemplo 1: Entrada simple
  fadeIn: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    animator.staggerIn();
    return animator;
  },

  // Ejemplo 2: Wave infinito
  wave: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    animator.infiniteWave();
    return animator;
  },

  // Ejemplo 3: Pulse continuo
  pulse: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    animator.pulse();
    return animator;
  },

  // Ejemplo 4: Timeline completa
  timeline: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    const tl = animator.complexTimeline();
    tl.play();
    return animator;
  },

  // Ejemplo 5: Scroll parallax
  parallax: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    animator.scrollAnimation();
    return animator;
  },

  // Ejemplo 6: Hover + Wave
  interactive: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    animator.infiniteWave({ amplitude: 8, speed: 5 });
    animator.setupHover();
    return animator;
  },

  // Ejemplo 7: Entrada + Pulse + Grid
  premium: (selector = '.dafel-banda-animatable') => {
    const animator = new DafelBandaAnimator(selector);
    animator.staggerIn().then(() => {
      animator.pulse({ duration: 4 });
      animator.gridShimmer();
    });
    return animator;
  }
};

/* ============================================
   EXPORTAR PARA MÓDULOS ES6
   ============================================ */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DafelBandaAnimator, DafelBandaAnimations };
}

/* ============================================
   CÓDIGO DE EJEMPLO PARA HTML
   ============================================ */

/*
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12/dist/ScrollTrigger.min.js"></script>
</head>
<body>
  <div id="banda-container">
    <!-- Insertar animatable.svg aquí -->
  </div>

  <script src="gsap-example.js"></script>
  <script>
    // USO SIMPLE
    // Opción 1: Entrada con fade
    DafelBandaAnimations.fadeIn();

    // Opción 2: Wave infinito
    // DafelBandaAnimations.wave();

    // Opción 3: Timeline completo
    // DafelBandaAnimations.timeline();

    // Opción 4: Interactivo con hover
    // DafelBandaAnimations.interactive();

    // Opción 5: Premium (combo de efectos)
    // DafelBandaAnimations.premium();

    // USO AVANZADO
    // const animator = new DafelBandaAnimator('.dafel-banda-animatable');
    // animator.staggerIn({ duration: 1.5, stagger: 0.2 });
    // animator.infiniteWave({ amplitude: 12, speed: 3 });
    // animator.setupHover();
  </script>
</body>
</html>
*/
