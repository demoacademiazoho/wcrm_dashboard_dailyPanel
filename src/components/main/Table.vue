<template>
  <div class="overflow-hidden rounded-lg border border-zinc-200 bg-white">
    <div class="overflow-x-auto">
      <table class="w-full text-left text-sm">
        <thead>
          <tr class="border-b border-zinc-200 bg-zinc-50">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :class="[
                'px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500',
                alignClasses[column.align ?? 'left'],
                column.width ? column.width : '',
              ]"
            >
              {{ column.label }}
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-zinc-100">
          <tr v-if="loading">
            <td :colspan="columns.length" class="px-3 py-8 text-center text-sm text-zinc-400">
              Loading…
            </td>
          </tr>

          <tr v-else-if="rows.length === 0">
            <td :colspan="columns.length" class="p-0">
              <EmptyState :title="emptyTitle" :description="emptyDescription" />
            </td>
          </tr>

          <tr
            v-for="(row, index) in rows"
            v-else
            :key="rowKey ? (row[rowKey] as string) : index"
            :class="['transition-colors', clickableRows ? 'cursor-pointer hover:bg-zinc-50' : '']"
            @click="clickableRows ? $emit('rowClick', row) : undefined"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="['px-3 py-2 text-zinc-700', alignClasses[column.align ?? 'left']]"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="row[column.key]">
                {{ row[column.key] }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import EmptyState from './EmptyState.vue'

export interface TableColumn {
  key: string
  label: string
  align?: 'left' | 'center' | 'right'
  width?: string
}

withDefaults(
  defineProps<{
    columns: TableColumn[]
    rows: Record<string, unknown>[]
    rowKey?: string
    loading?: boolean
    clickableRows?: boolean
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    emptyTitle: 'No data',
    emptyDescription: 'There is nothing to show yet.',
  },
)

defineEmits<{
  rowClick: [row: Record<string, unknown>]
}>()

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}
</script>
