<template>
  <div class="w-80 min-w-80 p-4 h-fit bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
    <div class="flex w-full justify-between items-center">
      <h1 class="text-lg font-bold">Announcements</h1>
      <div class="flex gap-1 items-center">
        <Icon @click="$emit('pageChange', 'back')" name="material-symbols:chevron-left" class="text-primary inline-block cursor-pointer"/>
        <p class="text-sm select-none">{{ props.currentPage }} / 2</p>
        <Icon @click="$emit('pageChange', 'forward')" name="material-symbols:chevron-right" class="text-primary inline-block cursor-pointer"/>
      </div>
    </div>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>

  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  currentPage: number;
}>()
</script>