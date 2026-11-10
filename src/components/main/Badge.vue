<template>
  <span
    :class="[
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
      variantClasses[variant ?? 'neutral'],
    ]"
  >
    <span v-if="dot" :class="['size-1.5 rounded-full', dotClasses[variant ?? 'neutral']]" />
    <slot />
  </span>
</template>

<script setup lang="ts">
type Variant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger'

defineProps<{
  variant?: Variant
  dot?: boolean
}>()

const variantClasses: Record<Variant, string> = {
  neutral: 'bg-zinc-100 text-zinc-600',
  primary: 'bg-primary-100 text-primary-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
}

const dotClasses: Record<Variant, string> = {
  neutral: 'bg-zinc-400',
  primary: 'bg-primary-500',
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  danger: 'bg-red-500',
}
</script>
