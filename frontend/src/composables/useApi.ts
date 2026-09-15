import axios from 'axios'

/* Instance axios tunggal untuk seluruh aplikasi.

   baseURL TIDAK dibaca di dalam interceptor. Template FE melakukannya lewat
   `useRuntimeConfig()` di interceptor — aman di sana karena template berjalan
   SPA. Pada SSR interceptor dijalankan setelah await, di luar konteks Nuxt,
   dan `useRuntimeConfig()` melempar "composable called outside of setup".
   Karena itu nilainya diisi sekali oleh plugins/api.ts saat aplikasi start. */
const api = axios.create({
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // httpOnly cookie dikirim otomatis bila nanti ada login
})

/** Dipanggil plugins/api.ts — satu-satunya tempat baseURL ditetapkan. */
export function setApiBaseUrl(baseURL: string) {
  api.defaults.baseURL = baseURL
}

// 401 → bersihkan data tampilan lalu arahkan ke login (belum dipakai portal publik)
api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401 && import.meta.client) {
      localStorage.removeItem('app_user')
      navigateTo('/login')
    }
    return Promise.reject(error)
  },
)

export function useApi() {
  return api
}

export default api
