<template>
  <NuxtPage />
  <!--i wonder if that's a warcrime, most certainly somewhere -->
  <Sonner expand theme="dark" rich-colors :duration=2500 />
</template>

<script lang="ts" setup>
useHead({ htmlAttrs: { class: 'dark' } })
</script>
