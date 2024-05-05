<template>
  <div class="bg-background h-screen w-screen p-8 flex flex-col items-center justify-center gap-8 font-jetbrains uppercase text-text-100">
    <h1 class="text-9xl font-bold">{{ error?.statusCode }}</h1>
    <h2 v-if="error?.statusMessage" class="text-xl font-medium text-center">{{ error.statusMessage }}</h2>
    <h2 v-else class="text-xl font-medium text-center">Oops, seems like you've ran into an error...</h2>
    <a class="p-3 border border-accent rounded-lg" @click="handleError" href="https://yuuko.dev/">
      <button class="uppercase">Return home</button>
    </a>
  </div>
</template>
<script lang="ts" setup>
useHead({ htmlAttrs: { class: 'dark' } })
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError()
</script>
