<template>
  <button @click="$emit('takeAction', normalize(props.buttonText))" class="bg-background-100 w-40 h-10 border border-accent rounded-lg uppercase font-medium text-sm flex items-center justify-center gap-2">
    <Icon :name="props.icon" class="text-yu-primary fill-yu-primary w-5 h-5"/>
    <p>{{ props.buttonText }}</p>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  buttonText: string;
  icon: string;
}>();

function normalize(text: string) {
  return text.toLowerCase().replaceAll(" ", '_');
}
</script>
