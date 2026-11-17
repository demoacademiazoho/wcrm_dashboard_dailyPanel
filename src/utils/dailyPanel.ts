/**
 * Leitura (COQL) do Painel do dia. Campos confirmados no CRM (14/11/2026, getFields só leitura).
 * Entregas/Inspeções não têm cliente nem localidade próprios: vêm da Reserva (enrich).
 */
import type { ZohoInterface } from '@/interfaces/zohoInterface'
import type { InspectionItem, LogisticsItem, OverdueItem, PanelData } from '@/interfaces/panel'
import { toZohoDate, toZohoDateTime } from '@/utils/dates'

declare const ZOHO: ZohoInterface

const PAGE_SIZE = 200 // limite da COQL por pedido
const IN_LIMIT = 50 // HIPÓTESE: a COQL aceita no máximo 50 valores num "in"
const DEBUG = false // true = escreve na consola os pedidos

// Um lookup pode vir como texto, como { id, name } ou vazio
function lookupName(v: any): string {
  if (!v) return ''
  if (typeof v === 'string') return v
  return v.name || v.Name || v.full_name || ''
}

// Campos relacionados (ex.: Responsible.last_name) podem vir com a chave plana ou aninhada
function related(r: any, lookup: string, field: string): string {
  const v = r[`${lookup}.${field}`] ?? r[lookup]?.[field]
  return v ? String(v) : ''
}

const fullName = (r: any, lookup: string, first: string, last: string) =>
  `${related(r, lookup, first)} ${related(r, lookup, last)}`.trim() || lookupName(r[lookup])

async function coql(query: string): Promise<any[]> {
  if (DEBUG) console.log('[painel]', query)
  const res = await ZOHO.CRM.API.coql({ select_query: query })
  // Sem registos, a COQL pode devolver 204 (res vazio/undefined)
  return res?.data ?? []
}

// Em caso de erro, diz qual o módulo e a query que o CRM recusou (para se perceber logo qual campo falhou)
async function coqlAll(select: string, from: string, where: string, order: string): Promise<any[]> {
  const rows: any[] = []
  for (let offset = 0; ; offset += PAGE_SIZE) {
    const query = `select ${select} from ${from} where ${where} order by ${order} limit ${offset}, ${PAGE_SIZE}`
    if (DEBUG) console.log('[painel]', query)
    try {
      const res = await ZOHO.CRM.API.coql({ select_query: query })
      rows.push(...(res?.data ?? []))
      if (!res?.info?.more_records) break
    } catch (e) {
      console.error(`[painel] COQL recusada em ${from}:`, query, e)
      throw e
    }
  }
  return rows
}

const chunk = <T,>(a: T[], n: number): T[][] => Array.from({ length: Math.ceil(a.length / n) }, (_, i) => a.slice(i * n, i * n + n))

// Cliente (Empresa, senão Cliente) e localidade de cada Reserva
async function reservationInfo(ids: string[]): Promise<Map<string, { client: string; city: string }>> {
  const info = new Map<string, { client: string; city: string }>()
  for (const part of chunk([...new Set(ids.filter(Boolean))], IN_LIMIT)) {
    // Cliente e localidade são extras: se esta leitura falhar, o painel continua sem eles (e regista o erro)
    const rows = await coql(
      'select id, Delivery_Address_City, Account.Account_Name, Contact.First_Name, Contact.Last_Name ' +
        `from Reservations where id in (${part.map((i) => `'${i}'`).join(',')}) limit 0, ${IN_LIMIT}`,
    ).catch((e) => {
      console.error('[painel] Não foi possível ler cliente/localidade das reservas:', e)
      return [] as any[]
    })
    for (const r of rows) {
      info.set(r.id, {
        client: related(r, 'Account', 'Account_Name') || fullName(r, 'Contact', 'First_Name', 'Last_Name') || lookupName(r.Account),
        city: r.Delivery_Address_City ?? '',
      })
    }
  }
  return info
}

const dayRange = (day: Date): [string, string] => {
  const s = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 0, 0, 0)
  const e = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 23, 59, 59)
  return [toZohoDateTime(s), toZohoDateTime(e)]
}

export async function getLogistics(day: Date): Promise<LogisticsItem[]> {
  const [from, to] = dayRange(day)
  const rows = await coqlAll(
    'id, Name, Logistics_Type, Logistics_Status, Scheduled_DateTime, Vehicle, Delivery_Address_City, ' +
      'Responsible.first_name, Responsible.last_name, Responsible.id, Reservation.Name, Reservation.id',
    'Deliveries_Pickups',
    `Scheduled_DateTime between '${from}' and '${to}'`,
    'Scheduled_DateTime asc',
  )
  const info = await reservationInfo(rows.map((r) => related(r, 'Reservation', 'id') || r.Reservation?.id))
  return rows.map((r) => {
    const reservationId = related(r, 'Reservation', 'id') || r.Reservation?.id || ''
    const i = info.get(reservationId)
    return {
      id: r.id,
      name: r.Name ?? '—',
      type: r.Logistics_Type ?? '—',
      status: r.Logistics_Status ?? '—',
      scheduledAt: r.Scheduled_DateTime ?? '',
      responsibleId: related(r, 'Responsible', 'id') || r.Responsible?.id || '',
      responsible: fullName(r, 'Responsible', 'first_name', 'last_name'),
      vehicle: r.Vehicle ?? '',
      client: i?.client ?? '',
      city: r.Delivery_Address_City || i?.city || '',
      reservation: related(r, 'Reservation', 'Name') || lookupName(r.Reservation),
      reservationId,
    }
  })
}

export async function getInspections(day: Date): Promise<InspectionItem[]> {
  const [from, to] = dayRange(day)
  const rows = await coqlAll(
    'id, Name, Inspection_Type, Inspection_Status, Inspection_DateTime, Inspector.first_name, Inspector.last_name, Inspector.id, ' +
      'Unit.Name, Reservation.Name, Reservation.id',
    'Inspections',
    `Inspection_DateTime between '${from}' and '${to}'`,
    'Inspection_DateTime asc',
  )
  const info = await reservationInfo(rows.map((r) => related(r, 'Reservation', 'id') || r.Reservation?.id))
  return rows.map((r) => {
    const reservationId = related(r, 'Reservation', 'id') || r.Reservation?.id || ''
    const i = info.get(reservationId)
    return {
      id: r.id,
      name: r.Name ?? '—',
      type: r.Inspection_Type ?? '—',
      status: r.Inspection_Status ?? '—',
      at: r.Inspection_DateTime ?? '',
      inspectorId: related(r, 'Inspector', 'id') || r.Inspector?.id || '',
      inspector: fullName(r, 'Inspector', 'first_name', 'last_name'),
      unit: related(r, 'Unit', 'Name') || lookupName(r.Unit),
      client: i?.client ?? '',
      city: i?.city ?? '',
      reservation: related(r, 'Reservation', 'Name') || lookupName(r.Reservation),
      reservationId,
    }
  })
}

export async function getOverdueReservations(): Promise<OverdueItem[]> {
  const rows = await coqlAll(
    'id, Name, Overdue_Days, End_Date, Reservation_Status, Delivery_Address_City, Account.Account_Name, Account.id, ' +
      'Contact.First_Name, Contact.Last_Name, Contact.id, Owner.first_name, Owner.last_name, Owner.id',
    'Reservations',
    'Is_Overdue = true',
    'Overdue_Days desc',
  )
  // Is_Overdue é manual: só conta como atraso se o fim previsto já passou (antes de hoje)
  const today = toZohoDate(new Date())
  return rows
    .filter((r) => r.End_Date && String(r.End_Date).slice(0, 10) < today)
    .map((r) => {
      const accountId = related(r, 'Account', 'id') || r.Account?.id || ''
      return {
        id: r.id,
        name: r.Name ?? '—',
        overdueDays: Number(r.Overdue_Days ?? 0),
        endDate: String(r.End_Date).slice(0, 10),
        client: related(r, 'Account', 'Account_Name') || fullName(r, 'Contact', 'First_Name', 'Last_Name') || lookupName(r.Account),
        clientId: accountId || related(r, 'Contact', 'id') || r.Contact?.id || '',
        clientEntity: accountId ? 'Accounts' : 'Contacts',
        status: r.Reservation_Status ?? '—',
        ownerId: related(r, 'Owner', 'id') || r.Owner?.id || '',
        owner: fullName(r, 'Owner', 'first_name', 'last_name'),
        city: r.Delivery_Address_City ?? '',
      }
    })
}

/** Lê tudo o que o painel mostra. Se uma leitura falhar, falha o conjunto (os valores não ficam a zero). */
export async function getPanelData(day: Date): Promise<PanelData> {
  const [logistics, inspections, overdue] = await Promise.all([getLogistics(day), getInspections(day), getOverdueReservations()])
  return { logistics, inspections, overdue }
}
