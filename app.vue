<template>
  <NuxtLoadingIndicator color="#FFFFFF" />
  <NuxtPage />

  <Sonner expand theme="dark" rich-colors :duration=2500 />
</template>

<script lang="ts" setup>
const route = useRoute()

const title = computed(() => {
  if (route.name === 'index') return 'Auth'
  return route.name?.toString().toUpperCase()
})
useHead({ htmlAttrs: { class: 'dark' } })
useSeoMeta({
  title: `Yuuko - ${title.value}`,
  description: 'The auth page for Yuuko'
})
</script>
