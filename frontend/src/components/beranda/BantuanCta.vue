<script setup lang="ts">
import { MessageCircle, Phone } from 'lucide-vue-next'

/**
 * Pita ajakan berlatar biru tua dengan ilustrasi di kanan — setara blok
 * "Haven't found an answer to your question?" pada landing page Spike.
 */
</script>

<template>
  <section class="bg-canvas pb-20 pt-4">
    <div class="container">
      <div class="cta-band">
        <div class="relative z-10 max-w-[560px]">
          <h2 class="font-display text-[clamp(1.5rem,1rem+1.6vw,2.125rem)] font-extrabold leading-tight text-white">
            Belum menemukan jawaban atas pertanyaan Anda?
          </h2>

          <p class="mt-4 text-[1.0625rem] leading-relaxed text-secondary-light">
            Hubungi Hallo-UT atau kirim pertanyaan lewat surel — tim layanan kami
            menjawab pada hari kerja.
          </p>

          <div class="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="tel:1500024" class="btn btn-accent">
              <Phone :size="17" />
              Hubungi 1500024
            </a>

            <NuxtLink to="/faq" class="btn btn-outline-white">
              <MessageCircle :size="17" />
              Buka FAQ
            </NuxtLink>
          </div>
        </div>

        <!-- Ilustrasi kanan, dipotong lembut seperti karakter 3D pada Spike -->
        <img
          src="/images/hero-illustration.jpg"
          alt=""
          aria-hidden="true"
          class="pointer-events-none absolute -bottom-10 right-0 hidden w-[340px] rounded-2xl opacity-90 mix-blend-luminosity lg:block"
        >

        <div
          class="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-white/[.06]"
          aria-hidden="true"
        />
      </div>
    </div>
  </section>
</template>
