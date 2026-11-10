<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      leave-active-class="transition-all duration-150 ease-in"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm p-4"
        @mousedown.self="closeOnBackdrop ? close() : undefined"
      >
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          leave-active-class="transition-all duration-150 ease-in"
          enter-from-class="opacity-0 scale-95 translate-y-2"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-2"
        >
          <div
            v-if="modelValue"
            :class="[
              'w-full rounded-xl bg-white shadow-xl overflow-hidden flex flex-col max-h-[90vh]',
              sizeClasses[size ?? 'md'],
            ]"
            role="dialog"
            aria-modal="true"
          >
            <!-- Header -->
            <div
              v-if="title || $slots.header"
              class="flex items-center justify-between gap-4 border-b border-zinc-100 px-5 py-4 shrink-0"
            >
              <slot name="header">
                <h3 class="text-sm font-semibold text-zinc-800">{{ title }}</h3>
              </slot>

              <button
                v-if="closeOnBackdrop !== false"
                type="button"
                class="shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600"
                @click="close"
              >
                <svg class="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Body -->
            <div class="overflow-y-auto p-5">
              <slot />
            </div>

            <!-- Footer -->
            <div
              v-if="$slots.footer"
              class="flex items-center justify-end gap-2 border-t border-zinc-100 px-5 py-3 shrink-0"
            >
              <slot name="footer" />
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
type Size = 'sm' | 'md' | 'lg' | 'xl'

withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    size?: Size
    closeOnBackdrop?: boolean
  }>(),
  {
    closeOnBackdrop: true,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
}>()

function close() {
  emit('update:modelValue', false)
  emit('close')
}

const sizeClasses: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}
</script>
