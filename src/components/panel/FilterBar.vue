<template>
  <section class="rounded-xl border border-eq-line bg-white px-4 py-3">
    <!-- Linha sempre visível: dia, pesquisa e botão que abre/fecha os restantes filtros -->
    <div class="flex flex-wrap items-end gap-4">
      <div class="flex flex-col gap-1">
        <span class="text-[11px] font-extrabold uppercase tracking-wider text-eq-muted">Dia</span>
        <div class="flex items-center gap-2">
          <div class="flex overflow-hidden rounded-lg bg-eq-navy">
            <button type="button" class="cursor-pointer px-3 py-2 text-white hover:bg-eq-navy-dark" aria-label="Dia anterior" @click="$emit('shift', -1)">&lsaquo;</button>
            <button type="button" class="cursor-pointer px-3 py-2 text-white hover:bg-eq-navy-dark" aria-label="Dia seguinte" @click="$emit('shift', 1)">&rsaquo;</button>
          </div>
          <button type="button" class="cursor-pointer rounded-lg border border-eq-line bg-white px-3.5 py-2 text-sm font-bold hover:border-eq-blue" @click="$emit('today')">Hoje</button>
        </div>
      </div>

      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-extrabold uppercase tracking-wider text-eq-muted">Operador</span>
        <select :class="SELECT" :value="filters.responsibleId" @change="emit('change', { responsibleId: val($event) })">
          <option value="">Todos os operadores</option>
          <option v-for="u in users" :key="u.id" :value="u.id">{{ u.full_name }}</option>
        </select>
      </label>

      <label class="flex flex-col gap-1">
        <span class="text-[11px] font-extrabold uppercase tracking-wider text-eq-muted">Pesquisar</span>
        <input
          type="search"
          :value="filters.q"
          placeholder="Reserva, cliente, unidade…"
          class="w-[min(300px,60vw)] rounded-lg border border-eq-line px-3 py-2 text-sm outline-none focus:border-eq-blue focus:ring-2 focus:ring-eq-blue/20"
          @input="emit('change', { q: ($event.target as HTMLInputElement).value })"
        />
      </label>

      <button type="button" class="flex h-9 min-w-[180px] flex-1 cursor-pointer items-center gap-2.5 text-left" :aria-expanded="open" aria-controls="eq-panel-filters" @click="open = !open">
        <h3 class="text-[13px] font-extrabold uppercase tracking-wider text-eq-navy">Filtros</h3>
        <span :class="['rounded-full px-2 text-[11px] font-extrabold', parts.length ? 'bg-eq-orange text-white' : 'bg-slate-300/70 text-eq-navy']">{{ parts.length }}</span>
        <span v-if="!open" class="flex-1 truncate text-xs text-eq-muted">{{ parts.length ? parts.join(' · ') : 'Sem filtros ativos' }}</span>
        <span class="ml-auto grid size-[30px] flex-none place-items-center rounded-lg border border-eq-line bg-white text-eq-navy hover:border-eq-blue hover:text-eq-blue" aria-hidden="true">
          <svg :class="['size-4 transition-transform duration-200', open ? '' : '-rotate-90']" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6" /></svg>
        </span>
      </button>
    </div>

    <!-- Painel recolhível (fechado por defeito) -->
    <div id="eq-panel-filters" :class="['grid transition-[grid-template-rows] duration-200', open ? 'mt-3 grid-rows-[1fr]' : 'grid-rows-[0fr]']">
      <div class="overflow-hidden">
        <div class="flex flex-wrap items-end gap-x-3.5 gap-y-3">
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-eq-muted">Viatura</span>
            <select :class="SELECT" :value="filters.vehicle" @change="emit('change', { vehicle: val($event) })">
              <option value="">Todas</option>
              <option v-for="v in vehicles" :key="v" :value="v">{{ v }}</option>
            </select>
          </label>
          <label class="flex flex-col gap-1">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-eq-muted">Localidade</span>
            <select :class="SELECT" :value="filters.city" @change="emit('change', { city: val($event) })">
              <option value="">Todas</option>
              <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
            </select>
          </label>
          <button type="button" class="cursor-pointer rounded-lg border border-eq-line bg-white px-3.5 py-2 text-sm font-semibold text-eq-muted hover:border-eq-blue hover:text-eq-blue" @click="$emit('clear')">Limpar filtros</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { CrmUserRef, PanelFilters } from '@/interfaces/panel'

const props = defineProps<{ filters: PanelFilters; users: CrmUserRef[]; vehicles: string[]; cities: string[] }>()
const emit = defineEmits<{ change: [patch: Partial<PanelFilters>]; clear: []; shift: [days: number]; today: [] }>()

const SELECT = 'min-w-[150px] rounded-lg border border-eq-line bg-white px-2.5 py-2 text-sm outline-none focus:border-eq-blue focus:ring-2 focus:ring-eq-blue/20'
const open = ref(false) // fechado por defeito
const val = (e: Event) => (e.target as HTMLSelectElement).value

// Resumo dos filtros ativos (aparece quando o painel está fechado)
const parts = computed(() => {
  const f = props.filters
  const out: string[] = []
  if (f.q) out.push(`"${f.q}"`)
  if (f.responsibleId) out.push(`Operador: ${props.users.find((u) => u.id === f.responsibleId)?.full_name ?? '—'}`)
  if (f.vehicle) out.push(`Viatura: ${f.vehicle}`)
  if (f.city) out.push(`Localidade: ${f.city}`)
  return out
})
</script>
