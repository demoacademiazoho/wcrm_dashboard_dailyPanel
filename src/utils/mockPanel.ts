// Dados fictícios para ver o painel fora do CRM (npm run dev). Nunca usados dentro do CRM.
import type { CrmUserRef, InspectionItem, LogisticsItem, OverdueItem, PanelData } from '@/interfaces/panel'
import { toZohoDate, toZohoDateTime } from '@/utils/dates'

export const MOCK_ME: CrmUserRef & { role: string } = { id: 'u1', full_name: 'João Silva', role: 'Logística' }
const USERS: CrmUserRef[] = [MOCK_ME, { id: 'u2', full_name: 'Carlos Mendes' }, { id: 'u3', full_name: 'Tiago Pinto' }, { id: 'u4', full_name: 'Rita Sousa' }]
const CLIENTS = ['Tecnoconstrói', 'Obras do Minho', 'Vale do Ave', 'Edifícios Vale', 'Casa & Obra']
const CITIES = ['Braga', 'Guimarães', 'Porto', 'Famalicão', 'Barcelos']
const VEHICLES = ['Carrinha 1', 'Carrinha 2', 'Camião grua']
const UNITS = ['PLT-001', 'MEX-002', 'GER-003', 'COM-004']

// Gerador determinístico por dia: o mesmo dia mostra sempre os mesmos dados
function rngFor(day: Date) {
  let seed = day.getFullYear() * 10000 + (day.getMonth() + 1) * 100 + day.getDate()
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296
    return seed / 4294967296
  }
}

export function mockPanelData(day: Date): PanelData {
  const rnd = rngFor(day)
  const pick = <T,>(a: T[]): T => a[Math.floor(rnd() * a.length)]!
  const now = new Date()
  const isToday = toZohoDate(day) === toZohoDate(now)
  const past = day < new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const at = (h: number, m: number) => new Date(day.getFullYear(), day.getMonth(), day.getDate(), h, m)

  const logistics: LogisticsItem[] = []
  const n = 6 + Math.floor(rnd() * 4)
  for (let i = 0; i < n; i++) {
    const when = at(pick([8, 9, 10, 11, 14, 15, 16, 17]), pick([0, 30]))
    const u = pick(USERS)
    const city = pick(CITIES)
    let status = 'Agendada'
    if (past || (isToday && when < now)) status = rnd() < 0.1 ? 'Falhada' : rnd() < 0.15 ? 'Agendada' : 'Concluída'
    if (isToday && Math.abs(when.getTime() - now.getTime()) < 90 * 60 * 1000 && status === 'Concluída') status = 'Em curso'
    logistics.push({
      id: `l${i}`,
      name: `LOG-${100 + i}`,
      type: rnd() < 0.5 ? 'Entrega' : 'Recolha',
      status,
      scheduledAt: toZohoDateTime(when),
      responsibleId: u.id,
      responsible: u.full_name,
      vehicle: rnd() < 0.15 && status === 'Agendada' ? '' : pick(VEHICLES),
      client: pick(CLIENTS),
      city,
      reservation: `RES-${200 + i}`,
      reservationId: `r${i}`,
    })
  }
  logistics.sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))

  const inspections: InspectionItem[] = []
  const ni = Math.floor(rnd() * 3) + 1
  for (let i = 0; i < ni; i++) {
    const when = at(pick([9, 10, 14, 16]), 0)
    const u = rnd() < 0.2 ? null : pick(USERS)
    inspections.push({
      id: `i${i}`,
      name: `INS-${30 + i}`,
      type: pick(['Pós-devolução', 'Pré-entrega', 'Periódica']),
      status: past || (isToday && when < now) ? pick(['Aprovada', 'Aprovada com observações', 'Reprovada – Avaria']) : 'Pendente',
      at: toZohoDateTime(when),
      inspectorId: u?.id ?? '',
      inspector: u?.full_name ?? '',
      unit: pick(UNITS),
      client: pick(CLIENTS),
      city: pick(CITIES),
      reservation: `RES-${180 + i}`,
      reservationId: `ri${i}`,
    })
  }
  inspections.sort((a, b) => a.at.localeCompare(b.at))

  const overdue: OverdueItem[] = [
    { id: 'o1', name: 'RES-0201', overdueDays: 3, endDate: toZohoDate(new Date(now.getTime() - 3 * 864e5)), client: 'Obras do Minho', clientId: 'a2', clientEntity: 'Accounts', status: 'Recolha agendada', ownerId: 'u2', owner: 'Carlos Mendes', city: 'Guimarães' },
    { id: 'o2', name: 'RES-0202', overdueDays: 1, endDate: toZohoDate(new Date(now.getTime() - 864e5)), client: 'Tecnoconstrói', clientId: 'a1', clientEntity: 'Accounts', status: 'Em aluguer', ownerId: 'u3', owner: 'Tiago Pinto', city: 'Braga' },
  ]
  return { logistics, inspections, overdue }
}

export { USERS as MOCK_USERS }
