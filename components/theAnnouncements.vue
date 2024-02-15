<template>
  <div class="w-80 min-w-80 p-4 h-56 bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
    <div class="flex w-full justify-between items-center">
      <h1 class="text-lg font-bold">Announcements</h1>
      <div class="flex gap-1 items-center">
        <Button>
          <Icon @click="$emit('pageChange', 'back')" name="material-symbols:chevron-left" class="text-primary inline-block cursor-pointer"/>
        </Button>
        <p class="text-sm select-none">{{ props.currentPage }} / 2</p>
        <Button>
          <Icon @click="$emit('pageChange', 'forward')" name="material-symbols:chevron-right" class="text-primary inline-block cursor-pointer"/>
        </Button>
      </div>
    </div>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>
    <div class="flex w-full items-center justify-between">
      <h5 class="font-medium">{{ new Date(currentAnnouncement.date*1000).toISOString().split('T')[0] }}</h5>
      <p class="text-text-200">{{ announcementsIdx + 1 }} / {{ announcements.length }}</p>
    </div>
    <p class="line-clamp-4">{{ currentAnnouncement.text }}</p>
  </div>
</template>

<script lang="ts" setup>
import announcements from "../data/announcements.json"

const props = defineProps<{
  currentPage: number;
}>()

const announcementsIdx = ref(0);
const currentAnnouncement = computed(() => announcements[announcementsIdx.value]);

const interval = setInterval(() => {
  announcementsIdx.value = limitRange(0, announcements.length, announcementsIdx.value + 1);
}, 3000);
</script>