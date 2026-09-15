// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  /* Template FE memakai `ssr: false` karena isinya panel admin di balik login.
     Portal DAAK adalah halaman publik yang perlu terbaca mesin pencari, jadi
     SSR DIBIARKAN MENYALA. Selebihnya konfigurasi mengikuti template. */
  ssr: true,

  /* Portal publik tetap SSR demi mesin pencari. Area staf tidak perlu
     terindeks, dan merendernya di klien membuat cookie sesi ikut terkirim
     otomatis — jauh lebih sederhana daripada meneruskan header cookie ke
     axios saat SSR. */
  routeRules: {
    '/dasbor/**': { ssr: false },
  },

  // Source directory
  srcDir: 'src/',

  // Runtime config — diakses via useRuntimeConfig()
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3020',
      /* Catatan akun uji di halaman masuk. Default mengikuti mode build, jadi
         build produksi tidak pernah menampilkannya kecuali sengaja dinyalakan. */
      tampilkanAkunDemo: process.env.NUXT_PUBLIC_AKUN_DEMO === 'true' || process.env.NODE_ENV !== 'production',
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  // Auto-import komponen tanpa awalan folder: HeroSection.vue -> <HeroSection />
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  /* CSS global. tokens.css = variabel desain (warna, font, radius);
     tailwind.css = lapisan komponen (.btn, .badge, .card, ...).
     Gaya khusus modul ditaruh di berkas sendiri per modul dan didaftarkan
     di sini — jangan ditumpuk ke tailwind.css. */
  css: [
    '~/assets/css/tokens.css',
    '~/assets/css/tailwind.css',
  ],

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  vite: {
    server: {
      proxy: {
        '/api': {
          target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3020',
          changeOrigin: true,
        },
        '/uploads': {
          target: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3020',
          changeOrigin: true,
        },
      },
    },
  },

  typescript: {
    strict: true,
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'DAAK UT — Direktorat Administrasi Akademik dan Kemahasiswaan',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content:
            'Portal layanan pusat administrasi akademik dan kemahasiswaan Universitas Terbuka: registrasi terintegrasi, kelulusan, kemahasiswaan, kalender akademik, dan FAQ.',
        },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'id_ID' },
        { property: 'og:site_name', content: 'DAAK Universitas Terbuka' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/logo-daak.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})
