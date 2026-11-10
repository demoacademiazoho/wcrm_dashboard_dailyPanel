<template>
  <div class="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
    <div class="flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
      <slot name="icon">
        <svg class="size-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 13h6m-6-4h6m2 9H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V18a2 2 0 01-2 2z"
          />
        </svg>
      </slot>
    </div>

    <div class="flex flex-col gap-1">
      <p class="text-sm font-semibold text-zinc-700">{{ title }}</p>
      <p v-if="description" class="text-xs text-zinc-500 max-w-xs">{{ description }}</p>
    </div>

    <div v-if="$slots.action" class="mt-1">
      <slot name="action" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>
