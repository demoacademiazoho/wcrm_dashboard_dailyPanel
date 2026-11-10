<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { zohoInit } from './utils/zohoFunctions'
import DailyPanel from '@/components/DailyPanel.vue'
import ToastContainer from '@/components/main/ToastContainer.vue'
import Loader from '@/components/main/Loader.vue'

const loading = ref(true)
// Fora do CRM (npm run dev) o Zoho nunca dispara o PageLoad: após 2 s usamos dados fictícios.
const mock = ref(false)

onMounted(async () => {
  const timeout = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 2000))
  const result = await Promise.race([zohoInit(), timeout])
  if (result === 'timeout' && import.meta.env.DEV) mock.value = true
  loading.value = false
})
</script>

<template>
  <Loader :visible="loading" />
  <ToastContainer />
  <main v-if="!loading" class="min-h-screen overflow-y-auto bg-zinc-100 p-6">
    <DailyPanel :mock="mock" />
  </main>
</template>
