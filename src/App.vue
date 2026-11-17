<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { zohoInit } from './utils/zohoFunctions'
import DailyPanel from '@/components/DailyPanel.vue'
import ToastContainer from '@/components/main/ToastContainer.vue'
import Loader from '@/components/main/Loader.vue'

const loading = ref(true)
// Fora do CRM (npm run dev) o Zoho nunca dispara o PageLoad: após 2 s usamos dados fictícios.
const mock = ref(false)

// Na Página inicial o CRM dá ao widget uma altura fixa e este fica com scroll interno.
// Pedimos ao CRM para ajustar a altura da moldura ao conteúdo (HIPÓTESE: ZOHO.CRM.UI.Resize
// é aceite em componentes da Página inicial; se não for, o pedido é ignorado sem erro).
let observer: ResizeObserver | undefined
let lastHeight = 0
function fitFrame() {
  const height = Math.ceil(document.body.scrollHeight)
  if (Math.abs(height - lastHeight) < 4) return
  lastHeight = height
  try {
    ;(window as any).ZOHO?.CRM?.UI?.Resize?.({ height: String(height), width: '100%' })?.catch?.(() => {})
  } catch { /* fora do CRM */ }
}

onMounted(async () => {
  const timeout = new Promise<'timeout'>((resolve) => setTimeout(() => resolve('timeout'), 2000))
  // se o SDK nem sequer carregou (ZOHO indefinido), tratamos como se tivesse esgotado o tempo
  const result = await Promise.race([zohoInit().catch(() => 'timeout' as const), timeout])
  if (result === 'timeout' && import.meta.env.DEV) mock.value = true
  loading.value = false
  observer = new ResizeObserver(fitFrame)
  observer.observe(document.body)
})
onBeforeUnmount(() => observer?.disconnect())
</script>

<template>
  <Loader :visible="loading" />
  <ToastContainer />
  <main v-if="!loading" class="bg-eq-bg p-4 text-eq-navy">
    <DailyPanel :mock="mock" />
  </main>
</template>
