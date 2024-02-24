<template>
  <button @click="$emit('takeAction', apiPromise(props.buttonText))" class="bg-background-100 w-40 h-10 border border-accent rounded-lg uppercase font-medium text-sm flex items-center justify-center gap-2">
    <Icon :name="props.icon" class="text-yu-primary fill-yu-primary w-5 h-5"/>
    <p>{{ props.buttonText }}</p>
  </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
  buttonText: "Update Bot" | "Restart Bot" | "Wipe Logs" | "Announcement";
  icon: string;
}>();

const emits = defineEmits<{
  (e: 'takeAction', payload: Promise<any>): void
}>()

// Depending on the buttonText return a different promise
function apiPromise(buttonText: string) {
  switch(buttonText) {
    case "Update Bot":
      return useYuukoAPI("trigger", "update")
    case "Restart Bot":
      return useYuukoAPI("trigger", "restart")
    case "Wipe Logs":
      return useYuukoAPI("trigger", "wipelogs")
    case "Announcement":
      return Promise.resolve("Announcement")
  }
  return Promise.reject("Invalid button text")
}
</script>
