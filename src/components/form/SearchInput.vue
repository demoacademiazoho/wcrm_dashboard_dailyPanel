<template>
  <div class="relative self-start">
    <span class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400">
      <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
      </svg>
    </span>

    <input
      :value="modelValue"
      type="text"
      :placeholder="placeholder ?? 'Search...'"
      :disabled="disabled"
      :class="[
        'w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 text-sm text-zinc-900',
        'placeholder:text-zinc-400 outline-none transition-all duration-150',
        'focus:border-primary-500 focus:ring-2 focus:ring-primary-100',
        modelValue ? 'pr-9' : 'pr-3.5',
        disabled ? 'cursor-not-allowed bg-zinc-50 text-zinc-400' : 'hover:border-zinc-400',
      ]"
      @input="onInput"
    />

    <button
      v-if="modelValue"
      type="button"
      class="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-600"
      @click="$emit('update:modelValue', '')"
    >
      <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  modelValue?: string
  placeholder?: string
  debounce?: number
  disabled?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
}>()

let timer: ReturnType<typeof setTimeout>

function onInput(e: Event) {
  const value = (e.target as HTMLInputElement).value
  emit('update:modelValue', value)

  if (props.debounce) {
    clearTimeout(timer)
    timer = setTimeout(() => emit('search', value), props.debounce)
  } else {
    emit('search', value)
  }
}
</script>
