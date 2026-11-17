// Modelo de dados do Painel do dia

export interface LogisticsItem {
  id: string
  name: string
  type: 'Entrega' | 'Recolha' | string
  status: string
  scheduledAt: string // ISO 8601
  responsibleId: string
  responsible: string
  vehicle: string
  client: string // vem da Reserva (Empresa, senão Cliente)
  city: string
  reservation: string
  reservationId: string
}

export interface InspectionItem {
  id: string
  name: string
  type: string
  status: string
  at: string // ISO 8601
  inspectorId: string
  inspector: string
  unit: string
  client: string
  city: string
  reservation: string
  reservationId: string
}

export interface OverdueItem {
  id: string
  name: string
  overdueDays: number
  endDate: string
  client: string
  clientId: string
  clientEntity: 'Accounts' | 'Contacts'
  status: string
  ownerId: string
  owner: string // comercial
  city: string
}

export interface PanelData {
  logistics: LogisticsItem[]
  inspections: InspectionItem[]
  overdue: OverdueItem[] // situação atual (não depende do dia escolhido)
}

export interface PanelFilters {
  q: string
  responsibleId: string // Operador escolhido na combobox ('' = todos)
  vehicle: string
  city: string
}

export const emptyFilters = (): PanelFilters => ({ q: '', responsibleId: '', vehicle: '', city: '' })

export interface CrmUserRef {
  id: string
  full_name: string
}
