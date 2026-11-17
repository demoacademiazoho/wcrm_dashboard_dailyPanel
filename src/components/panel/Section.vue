<template>
  <section :id="id" class="eq-card overflow-hidden">
    <header class="flex flex-wrap items-center gap-3 px-4 py-3">
      <button type="button" class="flex cursor-pointer items-center gap-2.5 text-left" :aria-expanded="open" @click="open = !open">
        <h2 class="text-[15px] font-bold text-eq-navy">{{ title }}</h2>
        <span class="rounded-full bg-eq-navy px-2 text-[11px] font-extrabold text-white">{{ count }}</span>
        <svg :class="['size-4 text-eq-navy transition-transform duration-200', open ? '' : '-rotate-90']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      <div class="ml-auto flex items-center gap-2"><slot name="actions" /></div>
    </header>
    <div v-show="open" class="border-t border-eq-line">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{ id: string; title: string; count: number }>()
const open = ref(true)
</script>
