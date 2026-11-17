// Regras de apresentação do Painel do dia (só destacam; os valores vêm sempre do CRM)
import type { InspectionItem, LogisticsItem } from '@/interfaces/panel'

export const LOGISTICS_STATUS_COLOR: Record<string, string> = {
  Agendada: '#1F6FA8',
  'Em curso': '#FD7945',
  Concluída: '#1E9E5A',
  Falhada: '#D33F3F',
  Reagendada: '#6B7A90',
}

export const INSPECTION_STATUS_COLOR: Record<string, string> = {
  Pendente: '#6B7A90',
  'Em curso': '#FD7945',
  Aprovada: '#1E9E5A',
  'Aprovada com observações': '#1F6FA8',
  'Reprovada – Avaria': '#D33F3F',
}

export const statusColor = (status: string): string => LOGISTICS_STATUS_COLOR[status] ?? INSPECTION_STATUS_COLOR[status] ?? '#6B7A90'

const LOGISTICS_PENDING = ['Agendada', 'Reagendada']
const LOGISTICS_FINAL = ['Concluída', 'Falhada']
const INSPECTION_DONE = ['Aprovada', 'Aprovada com observações', 'Reprovada – Avaria']

export const isPending = (l: LogisticsItem) => LOGISTICS_PENDING.includes(l.status)
export const isLogisticsFinal = (l: LogisticsItem) => LOGISTICS_FINAL.includes(l.status)
export const isInspectionDone = (i: InspectionItem) => INSPECTION_DONE.includes(i.status)

// Fora de horas: ainda por fazer e a hora marcada já passou
export const isLate = (l: LogisticsItem, now = new Date()) => isPending(l) && new Date(l.scheduledAt) < now
export const missingVehicle = (l: LogisticsItem) => !isLogisticsFinal(l) && !l.vehicle

export const fmtTime = (iso: string): string => (iso ? new Date(iso).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' }) : '—')
