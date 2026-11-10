/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ZohoInterface } from '@/interfaces/zohoInterface'

declare const ZOHO: ZohoInterface

// MR-025 - widget_DailyPanel: entregas/recolhas do dia e reservas em atraso.
// API names confirmados no CRM: Deliveries_Pickups e Reservations.

export interface LogisticsItem {
  id: string
  name: string
  type: string // Logistics_Type: Entrega | Recolha
  status: string // Logistics_Status
  scheduledAt: string // Scheduled_DateTime (ISO)
  responsible: string
  reservation: string
}

export interface OverdueItem {
  id: string
  name: string
  overdueDays: number
  endDate: string
  client: string
  status: string
}

// Devolve a data com o offset local no formato que o COQL aceita: 2026-11-10T00:00:00+00:00
function toCoqlDateTime(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  const off = -d.getTimezoneOffset()
  const sign = off >= 0 ? '+' : '-'
  const abs = Math.abs(off)
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` +
    `${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`
  )
}

// Um lookup pode vir como texto, como { id, name } ou vazio.
function lookupName(v: any): string {
  if (!v) return '-'
  if (typeof v === 'string') return v
  return v.name || v.Name || v.full_name || '-'
}

// Campos relacionados do COQL (ex.: Responsible.last_name) podem vir com a chave plana ou aninhada.
function relatedValue(r: any, lookup: string, field: string): string {
  const v = r[`${lookup}.${field}`] ?? r[lookup]?.[field]
  return v ? String(v) : ''
}

function fullName(r: any, lookup: string, first: string, last: string): string {
  const name = `${relatedValue(r, lookup, first)} ${relatedValue(r, lookup, last)}`.trim()
  return name || lookupName(r[lookup])
}

async function runCoql(query: string): Promise<any[]> {
  const res = await ZOHO.CRM.API.coql({ select_query: query })
  // Sem registos, o COQL pode devolver 204 (res vazio/undefined).
  return res?.data ?? []
}

export async function getTodayLogistics(): Promise<LogisticsItem[]> {
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  const end = new Date()
  end.setHours(23, 59, 59, 0)
  const query =
    'select id, Name, Logistics_Type, Logistics_Status, Scheduled_DateTime, ' +
    'Responsible.first_name, Responsible.last_name, Reservation.Name ' +
    'from Deliveries_Pickups ' +
    `where Scheduled_DateTime between '${toCoqlDateTime(start)}' and '${toCoqlDateTime(end)}' ` +
    'order by Scheduled_DateTime asc limit 200'
  const rows = await runCoql(query)
  return rows.map((r) => ({
    id: r.id,
    name: r.Name ?? '-',
    type: r.Logistics_Type ?? '-',
    status: r.Logistics_Status ?? '-',
    scheduledAt: r.Scheduled_DateTime ?? '',
    responsible: fullName(r, 'Responsible', 'first_name', 'last_name'),
    reservation: relatedValue(r, 'Reservation', 'Name') || lookupName(r.Reservation),
  }))
}

export async function getOverdueReservations(): Promise<OverdueItem[]> {
  const query =
    'select id, Name, Overdue_Days, End_Date, Contact.First_Name, Contact.Last_Name, Reservation_Status ' +
    'from Reservations ' +
    'where Is_Overdue = true ' +
    'order by Overdue_Days desc limit 200'
  const rows = await runCoql(query)
  // Is_Overdue e manual: so conta como atraso se o fim previsto ja passou (antes de hoje).
  const d = new Date()
  const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  return rows
    .filter((r) => r.End_Date && String(r.End_Date).substring(0, 10) < today)
    .map((r) => ({
      id: r.id,
      name: r.Name ?? '-',
      overdueDays: Number(r.Overdue_Days ?? 0),
      endDate: r.End_Date ?? '',
      client: fullName(r, 'Contact', 'First_Name', 'Last_Name'),
      status: r.Reservation_Status ?? '-',
    }))
}

// Dados fictícios só para ver o aspeto fora do CRM (npm run dev).
export function getMockData(): { logistics: LogisticsItem[]; overdue: OverdueItem[] } {
  const today = new Date()
  const at = (h: number, m = 0) => {
    const d = new Date(today)
    d.setHours(h, m, 0, 0)
    return d.toISOString()
  }
  return {
    logistics: [
      { id: '1', name: 'ER-001', type: 'Entrega', status: 'Agendada', scheduledAt: at(9), responsible: 'Ana Costa', reservation: 'RES-12' },
      { id: '2', name: 'ER-002', type: 'Recolha', status: 'Em curso', scheduledAt: at(11, 30), responsible: 'Rui Matos', reservation: 'RES-08' },
      { id: '3', name: 'ER-003', type: 'Entrega', status: 'Concluída', scheduledAt: at(14), responsible: 'Ana Costa', reservation: 'RES-15' },
      { id: '4', name: 'ER-004', type: 'Recolha', status: 'Falhada', scheduledAt: at(16), responsible: 'Rui Matos', reservation: 'RES-05' },
    ],
    overdue: [
      { id: '1', name: 'RES-03', overdueDays: 4, endDate: '2026-11-06', client: 'King (Sample)', status: 'Em aluguer' },
      { id: '2', name: 'RES-07', overdueDays: 1, endDate: '2026-11-09', client: 'Carolina Pinto', status: 'Recolha agendada' },
    ],
  }
}
