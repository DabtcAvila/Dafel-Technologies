<!--
  Dafel Banda Vue 3 Component - Basic Implementation
  Production-ready SVG component with Composition API
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
    @error="handleError"
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

    <!-- Band Layers -->
    <BandLayer
      v-for="(layer, index) in layerData"
      :key="layer.id"
      :layer="layer"
      :index="index"
      :instance-id="instanceId"
      :animation="finalAnimation"
      :interactive="interactive"
      :performance="performance"
      @error="handleLayerError"
    />
  </svg>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive } from 'vue'
import { nanoid } from 'nanoid'
import { 
  DafelBandaProps, 
  LAYER_DEFINITIONS, 
  shouldReduceMotion 
} from '../../shared/types'
import SVGDefinitions from './components/SVGDefinitions.vue'
import BandLayer from './components/BandLayer.vue'

// Props with defaults
interface Props extends Partial<DafelBandaProps> {
  animation?: 'none' | 'fadeIn'
}

const props = withDefaults(defineProps<Props>(), {
  animation: 'fadeIn',
  width: 1280,
  height: 720,
  interactive: false,
  className: '',
  ariaLabel: 'Dafel Banda decorative element',
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
  isLoaded: false,
  hasError: false
})

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
  'dafel-banda--basic',
  {
    'dafel-banda--interactive': props.interactive,
    'dafel-banda--reduced-motion': motionReduced.value,
    [`dafel-banda--${props.performance}`]: props.performance !== 'medium',
  },
  props.className
])

const componentStyles = computed(() => ({
  overflow: 'hidden',
  ...applyThemeStyles(),
  ...(props.performance === 'high' && {
    willChange: 'transform, opacity',
    transform: 'translateZ(0)' // Force GPU acceleration
  })
}))

// Methods
const applyThemeStyles = () => {
  if (!props.themeConfig) return {}
  
  return {
    filter: props.themeConfig.darkMode ? 'invert(1) hue-rotate(180deg)' : undefined,
    opacity: props.themeConfig.highContrast ? 0.9 : undefined,
  }
}

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

const handleLoad = () => {
  state.isLoaded = true
  emit('load')
}

const handleError = () => {
  const error = new Error('SVG load error')
  state.hasError = true
  handleLayerError(error)
}

const handleLayerError = (error: Error) => {
  console.error('DafelBanda component error:', error)
  emit('error', error)
}

// Lifecycle
onMounted(() => {
  state.isLoaded = true
})

// Expose public API
defineExpose({
  svgElement: svgRef,
  isLoaded: computed(() => state.isLoaded),
  hasError: computed(() => state.hasError),
  instanceId
})
</script>

<style scoped>
.dafel-banda {
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

@media (prefers-reduced-motion: reduce) {
  .dafel-banda,
  .dafel-banda * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>