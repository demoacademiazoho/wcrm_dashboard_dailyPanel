<template>
  <div class="flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-100 to-primary-200 text-primary-400">
    <svg :class="iconClass ?? 'size-6'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="1.5"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconClass?: string
}>()
</script>
