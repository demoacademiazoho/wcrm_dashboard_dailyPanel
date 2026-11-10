<template>
  <div class="flex flex-col gap-1.5">
    <Label v-if="label" :required="required" :disabled="disabled">
      {{ label }}
    </Label>

    <div :class="['flex gap-x-5 gap-y-2', direction === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col']">
      <label
        v-for="option in options"
        :key="option.value"
        :class="[
          'inline-flex items-start gap-2.5 select-none',
          disabled || option.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
        ]"
      >
        <div class="relative mt-0.5 flex shrink-0">
          <input
            type="radio"
            :name="name"
            :value="option.value"
            :checked="modelValue === option.value"
            :disabled="disabled || option.disabled"
            class="peer sr-only"
            @change="$emit('update:modelValue', option.value)"
          />
          <div
            :class="[
              'flex size-5 items-center justify-center rounded-full border-2 transition-all duration-150',
              modelValue === option.value ? 'border-primary-500' : 'border-zinc-300 bg-white',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary-200',
            ]"
          >
            <span
              v-if="modelValue === option.value"
              class="size-2.5 rounded-full bg-primary-500"
            />
          </div>
        </div>

        <div class="flex flex-col gap-0.5">
          <span class="text-sm font-medium text-zinc-800">{{ option.label }}</span>
          <span v-if="option.description" class="text-xs text-zinc-500">{{ option.description }}</span>
        </div>
      </label>
    </div>

    <p v-if="error" class="flex items-center gap-1 text-xs text-red-600">
      <svg class="size-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z"
          clip-rule="evenodd"
        />
      </svg>
      {{ error }}
    </p>
    <p v-else-if="hint" class="text-xs text-zinc-500">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import Label from './Label.vue'

export interface RadioOption {
  label: string
  value: string | number
  description?: string
  disabled?: boolean
}

defineProps<{
  modelValue?: string | number
  name: string
  options: RadioOption[]
  label?: string
  direction?: 'vertical' | 'horizontal'
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
}>()

defineEmits<{
  'update:modelValue': [value: string | number]
}>()
</script>
