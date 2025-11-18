<!--
  Dafel Banda Animated Vue 3 Component
  Full-featured component with Vue Motion animations
-->

<template>
  <svg
    ref="svgRef"
    :width="width"
    :height="height"
    :viewBox="`0 0 ${width} ${height}`"
    xmlns="http://www.w3.org/2000/svg"
    :class="componentClasses"
    :style="componentStyles"
    :aria-label="ariaLabel"
    :role="accessibilityConfig?.role || 'img'"
    :tabindex="interactive && accessibilityConfig?.focusable ? accessibilityConfig.tabIndex || 0 : undefined"
    @mouseenter="handleInteraction"
    @click="handleInteraction"
    @focus="handleInteraction"
    @load="handleLoad"
    v-motion
    :initial="containerVariants.hidden"
    :enter="containerVariants.visible"
    :leave="containerVariants.hidden"
  >
    <!-- SVG Definitions -->
    <SVGDefinitions 
      :instance-id="instanceId"
      :theme-config="themeConfig"
    />

    <!-- Background -->
    <rect 
      :width="width" 
      :height="height" 
      :fill="themeConfig?.colors?.background || '#F8FBFD'" 
    />

    <!-- Animated Layers -->
    <g
      v-for="(layer, index) in layerData"
      :key="layer.id"
      :id="`layer-${layer.id}-${layer.name}-${instanceId}`"
      :class="getLayerClasses(layer)"
      :opacity="layer.opacity"
      :style="getLayerStyles(layer)"
      v-motion
      :initial="getLayerInitial(index)"
      :enter="getLayerEnter(layer, index)"
      :variants="layerVariants[finalAnimation]"
      :custom="getLayerCustomProps(layer, index)"
      @mouseenter="interactive ? (e: Event) => handleLayerInteraction(e, layer.id) : undefined"
      @click="interactive ? (e: Event) => handleLayerInteraction(e, layer.id) : undefined"
      @focus="interactive ? (e: Event) => handleLayerInteraction(e, layer.id) : undefined"
    >
      <!-- Base path -->
      <path
        :d="layer.path"
        :fill="`url(#${layer.gradient}-${instanceId})`"
        class="band-path"
      />

      <!-- Grid overlay -->
      <path
        v-if="layer.hasGrid"
        :d="layer.path"
        :fill="`url(#${layer.gridPattern}-${instanceId})`"
        class="band-grid-overlay"
      />
    </g>
  </svg>
</template>

<script setup lang="ts">
import { computed, ref, reactive, onMounted, watch } from 'vue'
import { useMotion } from '@vueuse/motion'
import { useIntersectionObserver } from '@vueuse/core'
import { nanoid } from 'nanoid'
import { 
  DafelBandaProps, 
  LAYER_DEFINITIONS, 
  shouldReduceMotion,
  getLayerDelay
} from '../../shared/types'
import SVGDefinitions from './components/SVGDefinitions.vue'

// Props
const props = withDefaults(defineProps<DafelBandaProps>(), {
  animation: 'fadeIn',
  width: 1280,
  height: 720,
  interactive: false,
  className: '',
  ariaLabel: 'Dafel Banda animated decorative element',
  reducedMotion: false,
  lazy: true,
  performance: 'medium'
})

// Emits
const emit = defineEmits<{
  hover: [event: Event]
  click: [event: Event]
  focus: [event: Event]
  load: []
  error: [error: Error]
}>()

// Template refs
const svgRef = ref<SVGSVGElement>()

// Reactive state
const state = reactive({
  instanceId: nanoid(),
  isVisible: false,
  isPlaying: false
})

// Intersection observer for visibility
const { stop } = useIntersectionObserver(
  svgRef,
  ([{ isIntersecting }]) => {
    state.isVisible = isIntersecting
  },
  { threshold: 0.3, rootMargin: '-100px' }
)

// Computed properties
const motionReduced = computed(() => 
  shouldReduceMotion({ 
    reducedMotion: props.reducedMotion, 
    accessibilityConfig: props.accessibilityConfig 
  })
)

const finalAnimation = computed(() => 
  motionReduced.value ? 'none' : props.animation
)

const layerData = computed(() => LAYER_DEFINITIONS)

const instanceId = computed(() => state.instanceId)

const componentClasses = computed(() => [
  'dafel-banda',
  'dafel-banda--animated',
  {
    'dafel-banda--interactive': props.interactive,
    'dafel-banda--reduced-motion': motionReduced.value,
    'dafel-banda--visible': state.isVisible,
    [`dafel-banda--${props.performance}`]: props.performance !== 'medium',
    [`dafel-banda--${finalAnimation.value}`]: finalAnimation.value !== 'none',
  },
  props.className
])

const componentStyles = computed(() => ({
  overflow: 'hidden',
  ...(props.performance === 'high' && {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)'
  })
}))

// Animation variants
const containerVariants = computed(() => ({
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 50
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: props.animationConfig?.duration || 1200,
      ease: props.animationConfig?.easing || 'ease-out',
      staggerChildren: 100
    }
  }
}))

const layerVariants = computed(() => ({
  fadeIn: {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: (custom: any) => ({
      opacity: custom.baseOpacity,
      y: 0,
      scale: 1,
      transition: {
        duration: 1000,
        delay: custom.delay,
        ease: 'ease-out'
      }
    })
  },
  wave: {
    animate: (custom: any) => ({
      x: [-8, 8, -8],
      y: [-3, 3, -3],
      transition: {
        duration: props.animationConfig?.duration || 4000,
        delay: custom.delay,
        repeat: props.animationConfig?.repeat === false ? 0 : Infinity,
        ease: 'ease-in-out',
        repeatType: 'reverse'
      }
    })
  },
  pulse: {
    animate: (custom: any) => ({
      scale: [1, 1.02, 1],
      opacity: [
        custom.baseOpacity,
        Math.min(custom.baseOpacity + 0.15, 1),
        custom.baseOpacity
      ],
      transition: {
        duration: 3000,
        delay: custom.delay,
        repeat: props.animationConfig?.repeat === false ? 0 : Infinity,
        ease: 'ease-in-out'
      }
    })
  },
  interactive: {
    rest: { scale: 1, y: 0 },
    hover: (custom: any) => ({
      scale: 1.02,
      y: -2,
      opacity: Math.min(custom.baseOpacity + 0.1, 1),
      transition: {
        duration: 300,
        ease: 'ease-out'
      }
    }),
    tap: { scale: 0.98 }
  }
}))

// Methods
const getLayerClasses = (layer: any) => [
  'band-layer',
  {
    'band-layer--has-grid': layer.hasGrid,
    'band-layer--interactive': props.interactive
  }
]

const getLayerStyles = (layer: any) => ({
  cursor: props.interactive ? 'pointer' : 'default',
  ...(layer.hasFilter && props.performance === 'high' && {
    filter: `url(#${layer.filter}-${instanceId.value})`
  })
})

const getLayerInitial = (index: number) => {
  switch (finalAnimation.value) {
    case 'fadeIn':
      return 'hidden'
    default:
      return {}
  }
}

const getLayerEnter = (layer: any, index: number) => {
  switch (finalAnimation.value) {
    case 'fadeIn':
      return state.isVisible ? 'visible' : 'hidden'
    case 'wave':
    case 'pulse':
      return 'animate'
    case 'interactive':
      return props.interactive ? 'rest' : {}
    default:
      return {}
  }
}

const getLayerCustomProps = (layer: any, index: number) => ({
  baseOpacity: layer.opacity,
  delay: getLayerDelay(index),
  duration: 4000 - getLayerDelay(index),
  originalPath: layer.path
})

const handleInteraction = (event: Event) => {
  if (!props.interactive) return
  
  switch (event.type) {
    case 'mouseenter':
    case 'mouseover':
      emit('hover', event)
      break
    case 'click':
      emit('click', event)
      break
    case 'focus':
      emit('focus', event)
      break
  }
}

const handleLayerInteraction = (event: Event, layerId: number) => {
  if (!props.interactive) return
  
  switch (event.type) {
    case 'mouseenter':
      emit('hover', event)
      break
    case 'click':
      emit('click', event)
      break
    case 'focus':
      emit('focus', event)
      break
  }
}

const handleLoad = () => {
  emit('load')
}

// Watch for visibility changes to control animations
watch(() => state.isVisible, (isVisible) => {
  if (isVisible) {
    state.isPlaying = true
  }
})

// Cleanup
onMounted(() => {
  return () => {
    stop()
  }
})

// Expose public API
defineExpose({
  svgElement: svgRef,
  isVisible: computed(() => state.isVisible),
  isPlaying: computed(() => state.isPlaying),
  instanceId,
  play: () => { state.isPlaying = true },
  pause: () => { state.isPlaying = false },
  reset: () => { 
    state.isPlaying = false
    // Reset to initial state
  }
})
</script>

<style scoped>
.dafel-banda {
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
  .dafel-banda,
  .dafel-banda * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

@media (max-width: 768px) {
  .dafel-banda {
    max-height: 300px;
  }
}
</style>