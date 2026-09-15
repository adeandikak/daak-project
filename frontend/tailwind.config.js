/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './src/layouts/**/*.vue',
    './src/pages/**/*.vue',
    './src/components/**/*.vue',
  ],
  /* `safelist` hanya bekerja untuk utility yang DIHASILKAN Tailwind — kelas
     buatan sendiri di @layer components (.badge-penting, .icon-box-blue)
     tidak bisa diselamatkan lewat sini. Karena itu kelas semacam itu selalu
     ditulis lengkap di kode, tidak pernah dirangkai saat runtime. */
  safelist: [],

  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { DEFAULT: '1200px' }, // Spike memakai maxWidth 1200px
    },
    extend: {
      colors: {
        // ── Warna merek UT — dipertahankan, selaraskan dengan tokens.css ──
        primary: {
          DEFAULT: '#003366', // UT Deep Blue
          hover: '#002952',
          light: '#E6EEF5',
        },
        secondary: {
          DEFAULT: '#0A4C85', // UT Mid Blue
          hover: '#004080',
          light: '#C0D4E6',
        },
        accent: {
          DEFAULT: '#FFCC00', // UT Gold
          hover: '#E6B800',
          light: '#FFF4C7',
          on: '#003366',
        },
        // ── Permukaan bergaya Spike: putih di atas sapuan biru-abu terang ──
        surface: '#FFFFFF',
        canvas: '#F5F8FC',
        'canvas-2': '#EFF3F9',
        // ── Teks ──
        ink: {
          DEFAULT: '#0F172A',
          muted: '#5A6A85', // Spike memakai abu kebiruan, bukan abu netral
          light: '#8A97AC',
        },
        // ── Garis rambut ──
        line: {
          DEFAULT: '#E6ECF4',
          subtle: '#F1F5F9',
        },
      },
      fontFamily: {
        // Spike memakai Plus Jakarta Sans untuk judul maupun isi
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '28px',
      },
      boxShadow: {
        // Bayangan Spike sangat lembut — mengambang, bukan menekan
        card: '0 1px 2px rgba(16,24,40,.04)',
        hover: '0 12px 40px -8px rgba(0,51,102,.14)',
        pop: '0 12px 40px -8px rgba(0,0,0,.08)',
        // .lp-header .login-shadow pada Spike
        glow: '0 4px 12px rgba(0,51,102,.30)',
        'glow-accent': '0 4px 14px rgba(255,204,0,.45)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      fontSize: {
        // Hero Spike jauh lebih besar daripada hero portal biasa
        hero: ['clamp(2.25rem, 1.1rem + 3.9vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        section: ['clamp(1.75rem, 1rem + 2vw, 2.5rem)', { lineHeight: '1.2', letterSpacing: '-0.02em' }],
        stat: ['clamp(2.25rem, 1.4rem + 2.6vw, 3.25rem)', { lineHeight: '1' }],
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up .5s cubic-bezier(0.22,1,0.36,1) both',
      },
      backgroundImage: {
        // Sapuan biru lembut di belakang hero (setara latar hero Spike)
        'grad-hero':
          'radial-gradient(900px 520px at 50% -10%, #E3ECF9 0%, transparent 60%),' +
          'radial-gradient(700px 400px at 12% 8%, #EAF1FB 0%, transparent 55%),' +
          'linear-gradient(180deg, #F5F8FC 0%, #FFFFFF 100%)',
      },
    },
  },
  plugins: [],
}
