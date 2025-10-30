<!--
  Band Layer Component for Vue
  Individual layer renderer with performance optimizations
-->

<template>
  <g
    :id="`layer-${layer.id}-${layer.name}-${instanceId}`"
    :class="layerClasses"
    :opacity="layer.opacity"
    :style="layerStyles"
    :filter="shouldUseFilter ? `url(#${layer.filter}-${instanceId})` : undefined"
    @error="handleError"
  >
    <!-- Base path -->
    <path
      :d="layer.path"
      :fill="`url(#${layer.gradient}-${instanceId})`"
      class="band-path"
      :vector-effect="shouldOptimizeRendering ? 'non-scaling-stroke' : undefined"
    />

    <!-- Grid overlay -->
    <path
      v-if="layer.hasGrid"
      :d="layer.path"
      :fill="`url(#${layer.gridPattern}-${instanceId})`"
      class="band-grid-overlay"
      :vector-effect="shouldOptimizeRendering ? 'non-scaling-stroke' : undefined"
    />
  </g>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { BandLayer as BandLayerType } from '../../../shared/types'

interface Props {
  layer: BandLayerType
  index: number
  instanceId: string
  animation: string
  interactive: boolean
  performance: 'low' | 'medium' | 'high'
}

const props = defineProps<Props>()

const emit = defineEmits<{
  error: [error: Error]
}>()

// Computed properties
const shouldUseFilter = computed(() => 
  props.performance === 'high' && props.layer.hasFilter
)

const shouldOptimizeRendering = computed(() => 
  props.performance === 'low'
)

const layerClasses = computed(() => [
  'band-layer',
  {
    'band-layer--has-grid': props.layer.hasGrid,
    'band-layer--has-filter': shouldUseFilter.value,
    'band-layer--interactive': props.interactive,
    'band-layer--optimized': shouldOptimizeRendering.value,
  }
])

const layerStyles = computed(() => ({
  ...(shouldOptimizeRendering.value && {
    shapeRendering: 'optimizeSpeed',
    colorRendering: 'optimizeSpeed',
  }),
  ...(props.performance === 'high' && {
    willChange: 'transform, opacity',
  }),
}))

// Methods
const handleError = () => {
  emit('error', new Error(`Failed to render layer ${props.layer.id}`))
}
</script>

<style scoped>
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

.band-layer--optimized .band-path,
.band-layer--optimized .band-grid-overlay {
  shape-rendering: optimizeSpeed;
  color-rendering: optimizeSpeed;
}
</style>