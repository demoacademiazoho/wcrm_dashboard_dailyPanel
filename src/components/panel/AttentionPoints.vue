<template>
  <Section id="sec-attention" title="Pontos de atenção" :count="points.length">
    <p v-if="!points.length" class="p-4 text-sm text-eq-muted">Sem pontos de atenção para este dia e filtros.</p>
    <div v-else class="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <button
        v-for="p in points"
        :key="p.id"
        type="button"
        :class="['cursor-pointer rounded-lg border border-l-[5px] border-eq-line px-3.5 py-2.5 text-left hover:shadow-md', p.tone === 'red' ? 'border-l-eq-red' : 'border-l-eq-orange']"
        @click="$emit('go', p.target)"
      >
        <div class="flex items-baseline gap-2">
          <b :class="['text-2xl font-extrabold', p.tone === 'red' ? 'text-eq-red' : 'text-eq-orange']">{{ p.count }}</b>
          <span class="text-sm font-bold text-eq-navy">{{ p.label }}</span>
        </div>
        <ul class="mt-1 text-xs text-eq-muted">
          <li v-for="line in p.lines" :key="line" class="truncate">{{ line }}</li>
          <li v-if="p.count > p.lines.length">+ {{ p.count - p.lines.length }}</li>
        </ul>
      </button>
    </div>
  </Section>
</template>

<script setup lang="ts">
import Section from '@/components/panel/Section.vue'

export interface AttentionPoint {
  id: string
  label: string
  count: number
  tone: 'orange' | 'red'
  lines: string[] // primeiros itens
  target: string
}

defineProps<{ points: AttentionPoint[] }>()
defineEmits<{ go: [target: string] }>()
</script>
