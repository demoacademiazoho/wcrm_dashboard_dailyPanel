<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useParamsStore } from '@/stores/params'
import { zohoInit } from './utils/zohoFunctions'
import WorkOrderForm from '@/components/WorkOrderForm.vue'
import CustomerList from '@/components/CustomerList.vue'
import ExamplesShowcase from '@/components/ExamplesShowcase.vue'
import ToastContainer from '@/components/main/ToastContainer.vue'
import NavBar from '@/components/main/NavBar.vue'
import Loader from '@/components/main/Loader.vue'
import Version from '@/components/main/Version.vue'
import type { NavPosition } from '@/components/main/NavBar.vue'
import { navItems } from '@/config/navItems'

const paramsStore = useParamsStore()
const loading = ref(true)

onMounted(async () => {
  await zohoInit()
  loading.value = false
})

// Toggle this to 'top' | 'left' | 'right'
const navPosition = ref<NavPosition>('top')
const activeNav = ref('examples')

const layoutClass = computed(() => (navPosition.value === 'top' ? 'flex-col' : 'flex-row'))
</script>

<template>
  <Loader :visible="loading" />
  <ToastContainer />
  <Version />

  <div :class="['flex h-screen overflow-hidden bg-zinc-100', layoutClass]">
    <NavBar v-model="activeNav" :position="navPosition" brand="AutoServ" :items="navItems" />
    <main class="flex flex-1 flex-col overflow-y-auto p-6">
      <WorkOrderForm v-if="activeNav === 'work-orders'" />
      <CustomerList v-else-if="activeNav === 'customers'" />
      <ExamplesShowcase v-else-if="activeNav === 'examples'" />
      <div v-else class="flex flex-1 items-center justify-center text-zinc-400 text-sm">
        Select a section from the nav.
      </div>
    </main>
  </div>

  <!-- Record context (dev helper) -->
  <!-- <div
    v-if="paramsStore.params.id"
    class="fixed top-4 right-4 z-40 w-72 rounded-xl border border-zinc-200 bg-white shadow-xl"
  >
    <div class="flex items-center gap-2 border-b border-zinc-100 px-4 py-2.5">
      <span class="size-2 rounded-full bg-primary-400 shrink-0" />
      <p class="text-xs font-semibold uppercase tracking-widest text-zinc-500">Record Context</p>
    </div>
    <pre class="overflow-auto p-4 text-xs leading-relaxed text-zinc-600 max-h-48">{{
      JSON.stringify(paramsStore.params, null, 2)
    }}</pre>
  </div> -->
</template>

<style scoped></style>
