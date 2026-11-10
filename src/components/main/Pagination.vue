<template>
  <div class="flex items-center justify-between gap-4">
    <p class="text-xs text-zinc-500">
      Page <span class="font-medium text-zinc-700">{{ modelValue }}</span> of
      <span class="font-medium text-zinc-700">{{ pageCount }}</span>
    </p>

    <div class="flex items-center gap-1.5">
      <button
        type="button"
        :disabled="modelValue <= 1"
        class="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="go(modelValue - 1)"
      >
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        type="button"
        :disabled="modelValue >= pageCount"
        class="inline-flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-600 transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
        @click="go(modelValue + 1)"
      >
        <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: number
  totalItems: number
  pageSize: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const pageCount = computed(() => Math.max(1, Math.ceil(props.totalItems / props.pageSize)))

function go(page: number) {
  if (page < 1 || page > pageCount.value) return
  emit('update:modelValue', page)
}
</script>
