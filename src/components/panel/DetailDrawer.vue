<template>
  <Transition name="eq-scrim"><div v-if="detail" class="fixed inset-0 z-50 bg-eq-navy/35" @click="$emit('close')" /></Transition>
  <Transition name="eq-drawer">
    <aside v-if="detail" class="fixed inset-y-0 right-0 z-[60] flex w-[400px] max-w-full flex-col overflow-y-auto bg-white shadow-2xl" aria-label="Detalhe do registo">
      <header class="relative border-t-[5px] bg-eq-navy px-[18px] py-4 text-white" :style="{ borderTopColor: detail.color }">
        <small class="text-[11px] font-bold uppercase tracking-wider text-eq-light">{{ detail.kicker }}</small>
        <h3 class="mt-1 pr-8 text-lg font-bold">{{ detail.title }}</h3>
        <button type="button" class="absolute right-3 top-3 cursor-pointer text-2xl leading-none text-white" aria-label="Fechar" @click="$emit('close')">&times;</button>
      </header>
      <div class="flex flex-col gap-3 px-[18px] py-3.5">
        <span class="w-fit rounded-full px-3 py-0.5 text-xs font-bold text-white" :style="{ backgroundColor: detail.color }">{{ detail.status }}</span>
        <dl class="text-[13.5px]">
          <div v-for="[label, value] in detail.rows" :key="label" class="flex justify-between gap-3.5 border-b border-eq-line py-2">
            <dt class="flex-none text-eq-muted">{{ label }}</dt>
            <dd class="text-right font-semibold">{{ value || '—' }}</dd>
          </div>
        </dl>
        <button type="button" class="cursor-pointer rounded-[10px] border border-eq-navy bg-eq-navy px-3.5 py-2.5 text-sm font-bold text-white hover:bg-eq-navy-dark" @click="$emit('open', detail.entity, detail.id)">
          Abrir registo no CRM
        </button>
        <button v-if="detail.reservationId" type="button" class="cursor-pointer rounded-[10px] border border-eq-line bg-white px-3.5 py-2.5 text-sm font-bold hover:border-eq-blue" @click="$emit('open', 'Reservations', detail.reservationId)">
          Abrir reserva
        </button>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
export interface PanelDetail {
  id: string
  entity: string // API name do módulo para abrir no CRM
  kicker: string
  title: string
  status: string
  color: string
  rows: [string, string][]
  reservationId: string
}

defineProps<{ detail: PanelDetail | null }>()
defineEmits<{ close: []; open: [entity: string, id: string] }>()
</script>

<style>
.eq-scrim-enter-active, .eq-scrim-leave-active { transition: opacity 0.2s; }
.eq-scrim-enter-from, .eq-scrim-leave-to { opacity: 0; }
.eq-drawer-enter-active, .eq-drawer-leave-active { transition: transform 0.22s; }
.eq-drawer-enter-from, .eq-drawer-leave-to { transform: translateX(105%); }
</style>
