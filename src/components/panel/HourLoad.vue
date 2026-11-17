<template>
  <Section id="sec-hours" title="Carga por hora" :count="total">
    <div class="px-4 pb-3 pt-4">
      <div class="flex h-36 items-end gap-2" role="img" aria-label="Operações por hora do dia">
        <div v-for="h in hours" :key="h.hour" class="flex flex-1 flex-col items-center justify-end gap-1">
          <div class="flex w-full max-w-9 flex-col-reverse overflow-hidden rounded-t" :title="`${h.hour}h: ${h.delivery} entregas, ${h.pickup} recolhas, ${h.inspection} inspeções`">
            <div class="bg-eq-navy" :style="{ height: px(h.delivery) }" />
            <div class="bg-eq-light" :style="{ height: px(h.pickup) }" />
            <div class="bg-eq-orange" :style="{ height: px(h.inspection) }" />
          </div>
          <span :class="['text-[11px]', h.hour === currentHour ? 'font-extrabold text-eq-orange' : 'text-eq-muted']">{{ String(h.hour).padStart(2, '0') }}h</span>
        </div>
      </div>
      <ul class="mt-2 flex gap-4 text-xs text-eq-muted">
        <li class="flex items-center gap-1.5"><i class="block size-2.5 rounded-sm bg-eq-navy" />Entregas</li>
        <li class="flex items-center gap-1.5"><i class="block size-2.5 rounded-sm bg-eq-light" />Recolhas</li>
        <li class="flex items-center gap-1.5"><i class="block size-2.5 rounded-sm bg-eq-orange" />Inspeções</li>
      </ul>
    </div>
  </Section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Section from '@/components/panel/Section.vue'

export interface HourBucket {
  hour: number
  delivery: number
  pickup: number
  inspection: number
}

const props = defineProps<{ hours: HourBucket[]; currentHour: number | null }>()

const total = computed(() => props.hours.reduce((s, h) => s + h.delivery + h.pickup + h.inspection, 0))
const max = computed(() => Math.max(1, ...props.hours.map((h) => h.delivery + h.pickup + h.inspection)))
const px = (n: number) => `${(n / max.value) * 120}px`
</script>
