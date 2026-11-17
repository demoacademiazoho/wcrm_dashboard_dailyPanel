<template>
  <span :class="['inline-flex size-6 shrink-0 items-center justify-center rounded-md align-middle', tone]" role="img" :aria-label="meta.label" :title="meta.label">
    <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <template v-if="kind === 'late'">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2.5 2.5" />
        <path d="M5 3 2 6" />
        <path d="m22 6-3-3" />
      </template>
      <template v-else-if="kind === 'noVehicle'">
        <path d="M3 7h11v9H3z" />
        <path d="M14 10h4l3 3v3h-7" />
        <circle cx="7" cy="17.5" r="1.8" />
        <circle cx="17" cy="17.5" r="1.8" />
        <path d="M3 3l18 18" />
      </template>
      <template v-else>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        <path d="M3 3l18 18" />
      </template>
    </svg>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FLAGS, type FlagKind } from '@/config/flags'

const props = defineProps<{ kind: FlagKind }>()
const meta = computed(() => FLAGS[props.kind])
const tone = computed(() => (meta.value.tone === 'red' ? 'bg-red-50 text-eq-red' : 'bg-orange-50 text-eq-orange'))
</script>
