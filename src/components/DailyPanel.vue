<template>
  <section class="mx-auto flex max-w-[1440px] flex-col gap-3">
    <!-- Roda de carga (a mesma do widget de orçamento) ao mudar de dia ou atualizar; a atualização automática é silenciosa -->
    <Loader :visible="busy" />
    <header class="flex flex-wrap items-center justify-between gap-3 pb-1">
      <div class="flex items-center gap-4">
        <!--<img :src="logo" alt="Equiply" class="h-9 w-auto" />-->
        <div class="h-[30px] w-px bg-eq-line" />
        <div>
          <h1 class="text-[22px] font-bold leading-tight">Painel do dia</h1>
          <p class="text-[12.5px] text-eq-muted">
            {{ dayLabel }}
            <span v-if="mock" class="ml-2 rounded bg-amber-100 px-1.5 py-0.5 font-semibold normal-case text-amber-700">Dados fictícios (fora do CRM)</span>
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3 text-xs text-eq-muted">
        <span v-if="updatedAt">Atualizado às {{ fmtTime(updatedAt.toISOString()) }}</span>
        <button type="button" class="cursor-pointer rounded-lg border border-eq-line bg-white px-3.5 py-2 text-sm font-bold text-eq-navy hover:border-eq-blue disabled:opacity-50" :disabled="loading" @click="load()">
          {{ loading ? 'A atualizar…' : 'Atualizar' }}
        </button>
      </div>
    </header>

    <FilterBar
      :filters="filters"
      :users="userOptions"
      :vehicles="vehicleOptions"
      :cities="cityOptions"
      @change="(patch) => Object.assign(filters, patch)"
      @clear="Object.assign(filters, emptyFilters())"
      @shift="shiftDay"
      @today="goToday"
    />

    <!-- Erro: não mostramos zeros quando a leitura falha -->
    <div v-if="error" class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-l-[5px] border-eq-line border-l-eq-red bg-white px-4 py-3" role="alert">
      <p class="text-sm">{{ error }}</p>
      <button type="button" class="cursor-pointer rounded-lg border border-eq-navy bg-eq-navy px-3.5 py-2 text-sm font-bold text-white hover:bg-eq-navy-dark" @click="load()">Tentar novamente</button>
    </div>


    <template v-if="data">
      <!-- Progresso do dia -->
      <section class="eq-card flex flex-wrap items-center gap-4 px-4 py-3" aria-label="Progresso do dia">
        <div class="min-w-[200px]">
          <b class="block text-sm">Progresso do dia</b>
          <small class="text-xs text-eq-muted">{{ progress.done }} de {{ progress.total }} operações concluídas ({{ progress.pct }}%)</small>
        </div>
        <div class="h-2.5 min-w-[160px] flex-1 overflow-hidden rounded-full bg-eq-line" role="progressbar" :aria-valuenow="progress.pct" aria-valuemin="0" aria-valuemax="100">
          <div class="h-full rounded-full bg-eq-green transition-[width] duration-300" :style="{ width: progress.pct + '%' }" />
        </div>
        <div class="text-right text-xs text-eq-muted">
          <b class="block text-sm text-eq-navy">{{ progress.running }} em curso</b>
          {{ progress.todo }} por iniciar
        </div>
      </section>

      <KpiCards :items="kpis" @go="goTo" />
      <AttentionPoints :points="attention" @go="goTo" />

    <!-- Legenda dos ícones das linhas (por cima das tabelas) -->
    <PanelLegend v-if="data" />
    
      <!-- Entregas e recolhas do dia -->
      <Section id="sec-logistics" title="Entregas e recolhas do dia" :count="logisticsRows.length">
        <template #actions>
          <div class="flex overflow-hidden rounded-lg border border-eq-line">
            <button v-for="t in TYPE_TABS" :key="t.value" type="button" :class="['cursor-pointer px-3 py-1.5 text-xs font-bold', typeTab === t.value ? 'bg-eq-navy text-white' : 'bg-white text-eq-muted hover:text-eq-blue']" @click="typeTab = t.value">{{ t.label }}</button>
          </div>
          <button type="button" :class="['cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-bold', onlyPending ? 'border-eq-navy bg-eq-navy text-white' : 'border-eq-line bg-white text-eq-muted']" @click="onlyPending = !onlyPending">Só pendentes</button>
        </template>
        <p v-if="!logisticsRows.length" class="p-6 text-center text-sm text-eq-muted">Sem registos para este dia e filtros.</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-[11px] uppercase tracking-wider text-eq-muted">
              <tr><th class="px-4 py-2">Hora</th><th class="px-4 py-2">Tipo</th><th class="px-4 py-2">Reserva</th><th class="px-4 py-2">Cliente</th><th class="px-4 py-2">Localidade</th><th class="px-4 py-2">Responsável</th><th class="px-4 py-2">Viatura</th><th class="px-4 py-2">Estado</th><th class="px-4 py-2" /></tr>
            </thead>
            <tbody>
              <tr v-for="l in logisticsRows" :key="l.id" class="border-t border-eq-line">
                <td class="px-4 py-2.5 font-bold">
                  {{ fmtTime(l.scheduledAt) }}
                  <FlagIcon v-if="isLate(l, nowRef)" kind="late" class="ml-1.5" />
                </td>
                <td class="px-4 py-2.5">{{ l.type }}</td>
                <td class="px-4 py-2.5"><a href="#" class="font-bold text-eq-blue hover:underline" @click.prevent="openRecord('Reservations', l.reservationId)">{{ l.reservation || '—' }}</a></td>
                <td class="px-4 py-2.5">{{ l.client || '—' }}</td>
                <td class="px-4 py-2.5">{{ l.city || '—' }}</td>
                <td class="px-4 py-2.5">{{ l.responsible || '—' }}</td>
                <td class="px-4 py-2.5">
                  <FlagIcon v-if="missingVehicle(l)" kind="noVehicle" />
                  <template v-else>{{ l.vehicle || '—' }}</template>
                </td>
                <td class="px-4 py-2.5"><span class="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" :style="{ backgroundColor: statusColor(l.status) }">{{ l.status }}</span></td>
                <td class="px-4 py-2.5 text-right"><button type="button" class="cursor-pointer rounded-lg border border-eq-line bg-white px-2.5 py-1 text-xs font-bold hover:border-eq-blue" @click="detail = logisticsDetail(l)">Ver detalhes</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <HourLoad :hours="hours" :current-hour="isToday ? nowRef.getHours() : null" />

      <!-- Reservas em atraso (situação atual, não depende do dia) -->
      <Section id="sec-overdue" title="Reservas em atraso" :count="overdueRows.length">
        <p v-if="!overdueRows.length" class="p-6 text-center text-sm text-eq-muted">Nenhuma reserva em atraso.</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-[11px] uppercase tracking-wider text-eq-muted">
              <tr><th class="px-4 py-2">Reserva</th><th class="px-4 py-2">Cliente</th><th class="px-4 py-2">Fim previsto</th><th class="px-4 py-2">Estado</th><th class="px-4 py-2">Dias de atraso</th><th class="px-4 py-2">Comercial</th><th class="px-4 py-2" /></tr>
            </thead>
            <tbody>
              <tr v-for="o in overdueRows" :key="o.id" class="border-t border-eq-line">
                <td class="px-4 py-2.5"><a href="#" class="font-bold text-eq-blue hover:underline" @click.prevent="openRecord('Reservations', o.id)">{{ o.name }}</a></td>
                <td class="px-4 py-2.5"><a v-if="o.clientId" href="#" class="hover:underline" @click.prevent="openRecord(o.clientEntity, o.clientId)">{{ o.client || '—' }}</a><template v-else>{{ o.client || '—' }}</template></td>
                <td class="px-4 py-2.5">{{ o.endDate }}</td>
                <td class="px-4 py-2.5">{{ o.status }}</td>
                <td class="px-4 py-2.5"><span :class="['rounded-full px-2.5 py-0.5 text-xs font-bold', o.overdueDays >= 3 ? 'bg-red-50 text-eq-red' : 'bg-orange-50 text-eq-orange']">{{ o.overdueDays }} dia(s)</span></td>
                <td class="px-4 py-2.5">{{ o.owner || '—' }}</td>
                <td class="px-4 py-2.5 text-right"><button type="button" class="cursor-pointer rounded-lg border border-eq-line bg-white px-2.5 py-1 text-xs font-bold hover:border-eq-blue" @click="detail = overdueDetail(o)">Ver detalhes</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>

      <!-- Inspeções do dia -->
      <Section id="sec-inspections" title="Inspeções do dia" :count="inspectionRows.length">
        <p v-if="!inspectionRows.length" class="p-6 text-center text-sm text-eq-muted">Sem registos para este dia e filtros.</p>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-[11px] uppercase tracking-wider text-eq-muted">
              <tr><th class="px-4 py-2">Hora</th><th class="px-4 py-2">Tipo</th><th class="px-4 py-2">Unidade</th><th class="px-4 py-2">Cliente</th><th class="px-4 py-2">Inspetor</th><th class="px-4 py-2">Estado</th><th class="px-4 py-2" /></tr>
            </thead>
            <tbody>
              <tr v-for="i in inspectionRows" :key="i.id" class="border-t border-eq-line">
                <td class="px-4 py-2.5 font-bold">{{ fmtTime(i.at) }}</td>
                <td class="px-4 py-2.5">{{ i.type }}</td>
                <td class="px-4 py-2.5">{{ i.unit || '—' }}</td>
                <td class="px-4 py-2.5">{{ i.client || '—' }}</td>
                <td class="px-4 py-2.5"><FlagIcon v-if="!i.inspector && !isInspectionDone(i)" kind="noInspector" /><template v-else>{{ i.inspector || '—' }}</template></td>
                <td class="px-4 py-2.5"><span class="rounded-full px-2.5 py-0.5 text-xs font-bold text-white" :style="{ backgroundColor: statusColor(i.status) }">{{ i.status }}</span></td>
                <td class="px-4 py-2.5 text-right"><button type="button" class="cursor-pointer rounded-lg border border-eq-line bg-white px-2.5 py-1 text-xs font-bold hover:border-eq-blue" @click="detail = inspectionDetail(i)">Ver detalhes</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </Section>
    </template>
    <p v-else-if="loading" class="p-6 text-center text-sm text-eq-muted">A ler os dados do CRM…</p>

    <DetailDrawer :detail="detail" @close="detail = null" @open="openRecord" />
  </section>
</template>

<script setup lang="ts">
/*
 * Painel do dia (MR-025). Lê do CRM (COQL) as entregas/recolhas e inspeções do dia escolhido e as reservas em atraso.
 * Filtros, indicadores, pontos de atenção e carga por hora são calculados no widget sobre os dados lidos.
 */
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import FilterBar from '@/components/panel/FilterBar.vue'
import KpiCards, { type PanelKpi } from '@/components/panel/KpiCards.vue'
import AttentionPoints, { type AttentionPoint } from '@/components/panel/AttentionPoints.vue'
import HourLoad, { type HourBucket } from '@/components/panel/HourLoad.vue'
import Section from '@/components/panel/Section.vue'
import FlagIcon from '@/components/panel/FlagIcon.vue'
import PanelLegend from '@/components/panel/PanelLegend.vue'
import Loader from '@/components/main/Loader.vue'
import DetailDrawer, { type PanelDetail } from '@/components/panel/DetailDrawer.vue'
import logo from '@/assets/equiply-logo.png'
import { getPanelData } from '@/utils/dailyPanel'
import { MOCK_USERS, mockPanelData } from '@/utils/mockPanel'
import { getAllUsers } from '@/utils/zohoFunctions'
import { addDays } from '@/utils/dates'
import { fmtTime, isInspectionDone, isLate, isLogisticsFinal, isPending, missingVehicle, statusColor } from '@/utils/panelRules'
import { emptyFilters, type CrmUserRef, type InspectionItem, type LogisticsItem, type OverdueItem, type PanelData } from '@/interfaces/panel'
import type { ZohoInterface } from '@/interfaces/zohoInterface'

declare const ZOHO: ZohoInterface

const props = defineProps<{ mock?: boolean }>()

const VEHICLES = ['Carrinha 1', 'Carrinha 2', 'Camião grua']
const TYPE_TABS = [
  { value: '', label: 'Todas' },
  { value: 'Entrega', label: 'Entregas' },
  { value: 'Recolha', label: 'Recolhas' },
]

const today = () => {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

const day = ref<Date>(today())
const data = ref<PanelData | null>(null)
const loading = ref(false)
const busy = ref(false) // mostra a roda de carga (só leituras pedidas pelo utilizador)
const error = ref('')
const updatedAt = ref<Date | null>(null)
const filters = reactive(emptyFilters())
const typeTab = ref('')
const onlyPending = ref(false)
const detail = ref<PanelDetail | null>(null)
const crmUsers = ref<CrmUserRef[]>([]) // operadores do CRM (combobox)
const nowRef = ref(new Date()) // atualizado a cada leitura (para "atrasada" e hora atual)
let timer: ReturnType<typeof setInterval> | undefined
let counter = 0 // identifica a leitura mais recente

const isToday = computed(() => day.value.getTime() === today().getTime())
const dayLabel = computed(() => {
  const t = day.value.toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })
  return t.charAt(0).toUpperCase() + t.slice(1) // só a 1.ª letra em maiúscula (o resto fica em minúsculas)
})

// --- filtros ---
const norm = (t: string) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
const match = (q: string, parts: (string | undefined)[]) => !q || norm(parts.filter(Boolean).join(' ')).includes(q)

const q = computed(() => norm(filters.q.trim()))
const okPerson = (id: string) => !filters.responsibleId || id === filters.responsibleId
const okCity = (c: string) => !filters.city || c === filters.city

const logisticsBase = computed(() =>
  (data.value?.logistics ?? []).filter(
    (l) => okPerson(l.responsibleId) && okCity(l.city) && (!filters.vehicle || l.vehicle === filters.vehicle) && match(q.value, [l.name, l.reservation, l.client, l.city, l.responsible, l.vehicle, l.type]),
  ),
)
// A viatura só existe em Entregas/Recolhas: com esse filtro ativo, Inspeções não se aplicam
const inspectionBase = computed(() =>
  filters.vehicle
    ? []
    : (data.value?.inspections ?? []).filter((i) => okPerson(i.inspectorId) && okCity(i.city) && match(q.value, [i.name, i.unit, i.reservation, i.client, i.inspector, i.type])),
)
const overdueRows = computed(() =>
  filters.vehicle
    ? []
    : (data.value?.overdue ?? []).filter((o) => okPerson(o.ownerId) && okCity(o.city) && match(q.value, [o.name, o.client, o.owner, o.status])),
)

const logisticsRows = computed(() =>
  logisticsBase.value.filter((l) => (!typeTab.value || l.type === typeTab.value) && (!onlyPending.value || isPending(l) || l.status === 'Em curso')),
)
const inspectionRows = computed(() => inspectionBase.value)

// Opções dos filtros: só o que existe nos dados lidos
const distinct = (values: string[]) => [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt'))
// Operadores: todos os utilizadores ativos do CRM; se não der para os ler, só os que aparecem nos dados
const userOptions = computed<CrmUserRef[]>(() => {
  if (crmUsers.value.length) return crmUsers.value
  const map = new Map<string, string>()
  for (const l of data.value?.logistics ?? []) if (l.responsibleId) map.set(l.responsibleId, l.responsible)
  for (const i of data.value?.inspections ?? []) if (i.inspectorId) map.set(i.inspectorId, i.inspector)
  for (const o of data.value?.overdue ?? []) if (o.ownerId) map.set(o.ownerId, o.owner)
  return [...map].map(([id, full_name]) => ({ id, full_name })).sort((a, b) => a.full_name.localeCompare(b.full_name, 'pt'))
})
const vehicleOptions = computed(() => distinct([...VEHICLES, ...(data.value?.logistics ?? []).map((l) => l.vehicle)]))
const cityOptions = computed(() => distinct([...(data.value?.logistics ?? []).map((l) => l.city), ...(data.value?.inspections ?? []).map((i) => i.city), ...(data.value?.overdue ?? []).map((o) => o.city)]))

// --- indicadores ---
const progress = computed(() => {
  const ops = [...logisticsBase.value.map((l) => ({ done: l.status === 'Concluída', running: l.status === 'Em curso' })), ...inspectionBase.value.map((i) => ({ done: isInspectionDone(i), running: i.status === 'Em curso' }))]
  const total = ops.length
  const done = ops.filter((o) => o.done).length
  const running = ops.filter((o) => o.running).length
  return { total, done, running, todo: total - done - running, pct: total ? Math.round((done / total) * 100) : 0 }
})

const byType = (t: string) => logisticsBase.value.filter((l) => l.type === t)
const kpis = computed<PanelKpi[]>(() => {
  const dl = byType('Entrega')
  const pk = byType('Recolha')
  const running = logisticsBase.value.filter((l) => l.status === 'Em curso').length + inspectionBase.value.filter((i) => i.status === 'Em curso').length
  const noVehicle = logisticsBase.value.filter(missingVehicle).length
  const maxDays = Math.max(0, ...overdueRows.value.map((o) => o.overdueDays))
  const split = (a: LogisticsItem[]) => `${a.filter((l) => l.status === 'Concluída').length} concluídas · ${a.filter((l) => isPending(l)).length} por fazer`
  return [
    { id: 'delivery', label: isToday.value ? 'Entregas hoje' : 'Entregas', value: dl.length, hint: split(dl), tone: 'blue', target: 'sec-logistics' },
    { id: 'pickup', label: isToday.value ? 'Recolhas hoje' : 'Recolhas', value: pk.length, hint: split(pk), tone: 'blue', target: 'sec-logistics' },
    { id: 'running', label: 'Em curso agora', value: running, hint: 'entregas, recolhas e inspeções', tone: 'orange', target: 'sec-logistics' },
    { id: 'novehicle', label: 'Sem viatura', value: noVehicle, hint: noVehicle ? 'por atribuir' : 'tudo atribuído', tone: 'orange', target: 'sec-logistics' },
    { id: 'overdue', label: 'Reservas em atraso', value: overdueRows.value.length, hint: maxDays ? `a maior com ${maxDays} dia(s)` : 'nenhuma em atraso', tone: 'red', target: 'sec-overdue' },
  ]
})

const lineOf = (l: LogisticsItem) => `${fmtTime(l.scheduledAt)} · ${l.type} · ${l.reservation || l.name}`
const attention = computed<AttentionPoint[]>(() => {
  const out: AttentionPoint[] = []
  const nv = logisticsBase.value.filter(missingVehicle)
  if (nv.length) out.push({ id: 'nv', label: 'Sem viatura', count: nv.length, tone: 'orange', lines: nv.slice(0, 3).map(lineOf), target: 'sec-logistics' })
  const late = logisticsBase.value.filter((l) => isLate(l, nowRef.value))
  if (late.length) out.push({ id: 'late', label: 'Fora de horas', count: late.length, tone: 'red', lines: late.slice(0, 3).map(lineOf), target: 'sec-logistics' })
  if (overdueRows.value.length) out.push({ id: 'od', label: 'Reservas em atraso', count: overdueRows.value.length, tone: 'red', lines: overdueRows.value.slice(0, 3).map((o) => `${o.name} · ${o.client}`), target: 'sec-overdue' })
  const ni = inspectionBase.value.filter((i) => !i.inspector && !isInspectionDone(i))
  if (ni.length) out.push({ id: 'ni', label: 'Inspeções sem inspetor', count: ni.length, tone: 'orange', lines: ni.slice(0, 3).map((i) => `${fmtTime(i.at)} · ${i.unit}`), target: 'sec-inspections' })
  return out
})

const hours = computed<HourBucket[]>(() => {
  const buckets: HourBucket[] = Array.from({ length: 11 }, (_, k) => ({ hour: 8 + k, delivery: 0, pickup: 0, inspection: 0 }))
  const at = (h: number) => buckets[Math.min(Math.max(h, 8), 18) - 8]!
  for (const l of logisticsBase.value) at(new Date(l.scheduledAt).getHours())[l.type === 'Entrega' ? 'delivery' : 'pickup']++
  for (const i of inspectionBase.value) at(new Date(i.at).getHours()).inspection++
  return buckets
})

// --- detalhe e navegação ---
const logisticsDetail = (l: LogisticsItem): PanelDetail => ({
  id: l.id,
  entity: 'Deliveries_Pickups',
  kicker: `${l.type} · ${l.name}`,
  title: l.client || l.reservation || l.name,
  status: l.status,
  color: statusColor(l.status),
  reservationId: l.reservationId,
  rows: [['Hora', fmtTime(l.scheduledAt)], ['Reserva', l.reservation], ['Cliente', l.client], ['Localidade', l.city], ['Operador', l.responsible], ['Viatura', l.vehicle]],
})
const inspectionDetail = (i: InspectionItem): PanelDetail => ({
  id: i.id,
  entity: 'Inspections',
  kicker: `Inspeção · ${i.name}`,
  title: i.unit || i.name,
  status: i.status,
  color: statusColor(i.status),
  reservationId: i.reservationId,
  rows: [['Hora', fmtTime(i.at)], ['Tipo', i.type], ['Unidade', i.unit], ['Reserva', i.reservation], ['Cliente', i.client], ['Inspetor', i.inspector]],
})
const overdueDetail = (o: OverdueItem): PanelDetail => ({
  id: o.id,
  entity: 'Reservations',
  kicker: `Reserva · ${o.name}`,
  title: o.client || o.name,
  status: o.status,
  color: '#D33F3F',
  reservationId: '',
  rows: [['Fim previsto', o.endDate], ['Dias de atraso', String(o.overdueDays)], ['Localidade', o.city], ['Comercial', o.owner]],
})

function openRecord(entity: string, id: string) {
  if (!id || props.mock) return
  ZOHO.CRM.UI.Record.open({ Entity: entity, RecordID: id, target: '_blank' })
}

function goTo(target: string) {
  document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function shiftDay(n: number) {
  day.value = addDays(day.value, n)
  load()
}

function goToday() {
  day.value = today()
  load()
}

// --- leitura ---
async function load(silent = false) {
  const current = ++counter
  loading.value = true
  busy.value = !silent
  error.value = ''
  try {
    if (props.mock) await new Promise((r) => setTimeout(r, 600)) // simula a latência do CRM
    const result = props.mock ? mockPanelData(day.value) : await getPanelData(day.value)
    if (current !== counter) return // chegou uma leitura mais recente
    data.value = result
    updatedAt.value = nowRef.value = new Date()
  } catch (e) {
    console.error('Painel do dia: erro ao ler o CRM', e)
    if (current === counter) error.value = 'Não foi possível ler os dados do CRM. Verifica as permissões do teu perfil e tenta novamente.'
  } finally {
    if (current === counter) loading.value = busy.value = false
  }
}

// A combobox simula o operador: não se usa o utilizador atual nem as suas permissões
async function loadOperators() {
  if (props.mock) {
    crmUsers.value = MOCK_USERS
    return
  }
  try {
    const users = await getAllUsers('ActiveUsers')
    crmUsers.value = users.map((u: any) => ({ id: u.id, full_name: u.full_name })).sort((a, b) => a.full_name.localeCompare(b.full_name, 'pt'))
  } catch (e) {
    console.error('Painel do dia: não foi possível ler os utilizadores do CRM', e)
  }
}

onMounted(() => {
  loadOperators()
  load()
  timer = setInterval(() => load(true), 5 * 60 * 1000) // atualiza de 5 em 5 minutos
})
onUnmounted(() => clearInterval(timer))
</script>
