<template>
  <section class="grid grid-cols-2 gap-2.5 lg:grid-cols-5">
    <button
      v-for="k in items"
      :key="k.id"
      type="button"
      :class="['flex cursor-pointer flex-col gap-1 rounded-xl border border-l-[5px] border-eq-line bg-white px-3.5 py-3 text-left transition-shadow hover:shadow-md', TONE[k.tone]]"
      :title="`Ir para ${k.label}`"
      @click="$emit('go', k.target)"
    >
      <span class="text-[11px] font-extrabold uppercase tracking-wider text-eq-muted">{{ k.label }}</span>
      <b :class="['text-3xl font-extrabold leading-none', VALUE[k.tone]]">{{ k.value }}</b>
      <small class="text-xs text-eq-muted">{{ k.hint }}</small>
    </button>
  </section>
</template>

<script setup lang="ts">
export interface PanelKpi {
  id: string
  label: string
  value: number
  hint: string
  tone: 'blue' | 'orange' | 'red'
  target: string // id da secção para onde o clique leva
}

defineProps<{ items: PanelKpi[] }>()
defineEmits<{ go: [target: string] }>()

const TONE = { blue: 'border-l-eq-blue', orange: 'border-l-eq-orange', red: 'border-l-eq-red' } as const
const VALUE = { blue: 'text-eq-navy', orange: 'text-eq-orange', red: 'text-eq-red' } as const
</script>
