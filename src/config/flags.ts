// Sinais de alerta do Painel do dia: ícone em vez de texto nas linhas; o significado está na legenda (PanelLegend)
export type FlagKind = 'late' | 'noVehicle' | 'noInspector'

export const FLAGS: Record<FlagKind, { label: string; hint: string; tone: 'red' | 'orange' }> = {
  late: { label: 'Atrasada', hint: 'a hora marcada já passou e ainda não foi feita', tone: 'red' },
  noVehicle: { label: 'Sem viatura', hint: 'ainda não tem viatura atribuída', tone: 'orange' },
  noInspector: { label: 'Sem inspetor', hint: 'ainda não tem inspetor atribuído', tone: 'orange' },
}

export const FLAG_ORDER: FlagKind[] = ['late', 'noVehicle', 'noInspector']
