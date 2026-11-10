<template>
  <div class="flex flex-col gap-1.5">
    <Label v-if="label" :html-for="id" :required="required" :disabled="disabled">
      {{ label }}
    </Label>

    <div
      :class="[
        'flex items-stretch rounded-lg border bg-white transition-all duration-150',
        'focus-within:ring-2 focus-within:ring-offset-0',
        error
          ? 'border-red-400 focus-within:border-red-500 focus-within:ring-red-200'
          : 'border-zinc-300 focus-within:border-primary-500 focus-within:ring-primary-100',
        disabled ? 'cursor-not-allowed bg-zinc-50' : '',
      ]"
    >
      <!-- Country / dial code segment -->
      <div class="relative shrink-0">
        <select
          :disabled="disabled"
          :value="countryCode"
          :class="[
            'h-full appearance-none rounded-l-lg border-0 border-r bg-zinc-50 py-2.5 pl-3 pr-7 text-sm',
            'outline-none transition-colors duration-150',
            error ? 'border-red-300' : 'border-zinc-300',
            disabled ? 'cursor-not-allowed text-zinc-400' : 'cursor-pointer text-zinc-700 hover:bg-zinc-100',
          ]"
          @change="onCountryChange"
        >
          <option v-for="country in countries" :key="country.iso" :value="country.iso">
            {{ country.flag }} {{ country.dialCode }}
          </option>
        </select>

        <span class="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-zinc-400">
          <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      <!-- Number segment -->
      <input
        :id="id"
        type="tel"
        inputmode="tel"
        :value="modelValue"
        :placeholder="placeholder ?? selectedCountry?.example"
        :disabled="disabled"
        :required="required"
        class="w-full min-w-0 flex-1 rounded-r-lg border-0 bg-transparent px-3.5 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed disabled:text-zinc-400"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
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
import { computed } from 'vue'
import Label from './Label.vue'
import { countries } from '@/config/countries'

const props = withDefaults(
  defineProps<{
    modelValue?: string
    countryCode?: string
    id?: string
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    error?: string
    hint?: string
  }>(),
  {
    countryCode: 'US',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'update:countryCode': [value: string]
}>()

const selectedCountry = computed(() => countries.find((c) => c.iso === props.countryCode))

function onCountryChange(event: Event) {
  emit('update:countryCode', (event.target as HTMLSelectElement).value)
}
</script>
