<template>
  <NuxtPage />
  <Sonner theme="dark" rich-colors :duration=2500 />
</template>

<script lang="ts" setup>
useHead({ htmlAttrs: { class: 'dark' } })
</script>
