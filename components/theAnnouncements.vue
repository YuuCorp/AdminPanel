<template>
  <div class="w-80 min-w-80 p-4 h-56 bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
    <div class="flex w-full justify-between items-center">
      <h1 class="text-lg font-bold">Announcements</h1>
      <div class="flex gap-1 items-center">
        <button>
          <Icon @click="$emit('pageChange', 'back')" name="material-symbols:chevron-left" class="text-yu-primary inline-block"/>
        </button>
        <p class="text-sm select-none">{{ currentPage }} / 2</p>
        <button>
          <Icon @click="$emit('pageChange', 'forward')" name="material-symbols:chevron-right" class="text-yu-primary inline-block"/>
        </button>
      </div>
    </div>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>
    <div class="flex w-full items-center justify-between">
      <h5 class="font-medium">{{ new Date(currentAnnouncement.date).toISOString().split('T')[0] }}</h5>
      <p class="text-text-200">{{ announcementsIdx + 1 }} / {{ announcements.length }}</p>
    </div>
    <p class="line-clamp-4">{{ currentAnnouncement.announcement }}</p>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  announcements: Announcement[];
  currentPage: number;
}>()

const emits = defineEmits<{
  (e: 'pageChange', payload: 'back' | 'forward'): void
}>()

const announcementsIdx = ref(0);
const currentAnnouncement = computed(() => props.announcements[announcementsIdx.value]);

const interval = setInterval(() => {
  announcementsIdx.value = limitRange(0, props.announcements.length, announcementsIdx.value + 1);
}, 3000);
</script>
