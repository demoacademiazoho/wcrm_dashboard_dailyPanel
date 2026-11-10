<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  getMockData,
  getOverdueReservations,
  getTodayLogistics,
  type LogisticsItem,
  type OverdueItem,
} from '@/utils/dailyPanel'

const props = defineProps<{ mock?: boolean }>()

const logistics = ref<LogisticsItem[]>([])
const overdue = ref<OverdueItem[]>([])
const loading = ref(false)
const error = ref('')
const updatedAt = ref<Date | null>(null)
let timer: ReturnType<typeof setInterval> | undefined

const deliveries = computed(() => logistics.value.filter((l) => l.type === 'Entrega'))
const pickups = computed(() => logistics.value.filter((l) => l.type === 'Recolha'))

const todayLabel = new Date().toLocaleDateString('pt-PT', {
  weekday: 'long',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

function time(iso: string) {
  if (!iso) return '-'
  return new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })
}

function statusClass(status: string) {
  switch (status) {
    case 'Concluída':
      return 'bg-green-100 text-green-700'
    case 'Em curso':
      return 'bg-blue-100 text-blue-700'
    case 'Falhada':
      return 'bg-red-100 text-red-700'
    case 'Reagendada':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-zinc-100 text-zinc-600'
  }
}

function overdueClass(days: number) {
  return days >= 3 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
}

async function load() {
  loading.value = true
  error.value = ''
  try {
    if (props.mock) {
      const m = getMockData()
      logistics.value = m.logistics
      overdue.value = m.overdue
    } else {
      const [l, o] = await Promise.all([getTodayLogistics(), getOverdueReservations()])
      logistics.value = l
      overdue.value = o
    }
    updatedAt.value = new Date()
  } catch (e: any) {
    console.error('Painel do dia: erro ao ler o CRM', e)
    error.value = 'Não foi possível ler os dados do CRM. Verifica as permissões do teu perfil.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  load()
  timer = setInterval(load, 5 * 60 * 1000) // atualiza de 5 em 5 minutos
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="mx-auto flex max-w-6xl flex-col gap-5">
    <header class="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 class="text-2xl font-semibold text-zinc-800">Painel do dia</h1>
        <p class="text-sm capitalize text-zinc-500">{{ todayLabel }}</p>
      </div>
      <div class="flex items-center gap-3 text-xs text-zinc-500">
        <span v-if="mock" class="rounded bg-amber-100 px-2 py-1 font-medium text-amber-700">
          Dados fictícios (fora do CRM)
        </span>
        <span v-if="updatedAt">Atualizado às {{ time(updatedAt.toISOString()) }}</span>
        <button
          type="button"
          class="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
          :disabled="loading"
          @click="load"
        >
          {{ loading ? 'A atualizar...' : 'Atualizar' }}
        </button>
      </div>
    </header>

    <p v-if="error" class="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      {{ error }}
    </p>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div class="rounded-xl border border-zinc-200 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Entregas hoje</p>
        <p class="mt-1 text-3xl font-semibold text-primary-600">{{ deliveries.length }}</p>
      </div>
      <div class="rounded-xl border border-zinc-200 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Recolhas hoje</p>
        <p class="mt-1 text-3xl font-semibold text-primary-600">{{ pickups.length }}</p>
      </div>
      <div class="rounded-xl border border-zinc-200 bg-white p-4">
        <p class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Reservas em atraso</p>
        <p class="mt-1 text-3xl font-semibold text-red-600">{{ overdue.length }}</p>
      </div>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white">
      <h2 class="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700">
        Entregas e recolhas de hoje
      </h2>
      <p v-if="!logistics.length" class="p-4 text-sm text-zinc-400">
        Sem entregas nem recolhas agendadas para hoje.
      </p>
      <table v-else class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-zinc-400">
          <tr>
            <th class="px-4 py-2">Hora</th>
            <th class="px-4 py-2">Tipo</th>
            <th class="px-4 py-2">Reserva</th>
            <th class="px-4 py-2">Responsável</th>
            <th class="px-4 py-2">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="l in logistics" :key="l.id" class="border-t border-zinc-100">
            <td class="px-4 py-2 font-medium text-zinc-700">{{ time(l.scheduledAt) }}</td>
            <td class="px-4 py-2">{{ l.type }}</td>
            <td class="px-4 py-2">{{ l.reservation }}</td>
            <td class="px-4 py-2">{{ l.responsible }}</td>
            <td class="px-4 py-2">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="statusClass(l.status)">
                {{ l.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="rounded-xl border border-zinc-200 bg-white">
      <h2 class="border-b border-zinc-100 px-4 py-3 text-sm font-semibold text-zinc-700">
        Reservas em atraso
      </h2>
      <p v-if="!overdue.length" class="p-4 text-sm text-zinc-400">Nenhuma reserva em atraso.</p>
      <table v-else class="w-full text-left text-sm">
        <thead class="text-xs uppercase text-zinc-400">
          <tr>
            <th class="px-4 py-2">Reserva</th>
            <th class="px-4 py-2">Cliente</th>
            <th class="px-4 py-2">Fim previsto</th>
            <th class="px-4 py-2">Estado</th>
            <th class="px-4 py-2">Dias de atraso</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="o in overdue" :key="o.id" class="border-t border-zinc-100">
            <td class="px-4 py-2 font-medium text-zinc-700">{{ o.name }}</td>
            <td class="px-4 py-2">{{ o.client }}</td>
            <td class="px-4 py-2">{{ o.endDate }}</td>
            <td class="px-4 py-2">{{ o.status }}</td>
            <td class="px-4 py-2">
              <span class="rounded-full px-2 py-0.5 text-xs font-medium" :class="overdueClass(o.overdueDays)">
                {{ o.overdueDays }} dia(s)
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
