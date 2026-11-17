<template>
  <div class="eq-card flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2.5" role="group" aria-label="Legenda dos ícones">
    <span class="text-[11px] font-bold uppercase tracking-wider text-eq-muted">Legenda</span>
    <span v-for="k in FLAG_ORDER" :key="k" class="inline-flex items-center gap-2 text-xs text-eq-muted">
      <FlagIcon :kind="k" />
      <span><b class="text-eq-navy">{{ FLAGS[k].label }}</b> · {{ FLAGS[k].hint }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
import FlagIcon from '@/components/panel/FlagIcon.vue'
import { FLAGS, FLAG_ORDER } from '@/config/flags'
</script>
