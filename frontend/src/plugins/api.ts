import { setApiBaseUrl } from '~/composables/useApi'

/* Plugin berjalan sekali saat aplikasi start — di server maupun di klien —
   dan masih berada di dalam konteks Nuxt, jadi useRuntimeConfig() aman di sini. */
export default defineNuxtPlugin(() => {
  setApiBaseUrl(useRuntimeConfig().public.apiBase as string)
})
