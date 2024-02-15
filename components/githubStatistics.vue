<template>
  <div v-if="props.stats" class="w-80 p-4 h-56 bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
    <div class="flex w-full justify-between items-center">
      <h1 class="text-lg font-bold">GitHub Statistics</h1>
      <div class="flex gap-1 items-center">
        <Icon @click="$emit('pageChange', 'back')" name="material-symbols:chevron-left" class="text-primary inline-block cursor-pointer"/>
        <p class="text-sm select-none">{{ props.currentPage }} / 2</p>
        <Icon @click="$emit('pageChange', 'forward')" name="material-symbols:chevron-right" class="text-primary inline-block cursor-pointer"/>
      </div>
    </div>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>

    <div class="flex justify-between gap-2">
      <div class="w-36">
        <h4 class="font-bold">Last commit</h4>
        <p class="text-text-200 text-sm truncate">{{ props.stats.lastCommit }}</p>
      </div>
      <div>
        <h4 class="font-bold">Last updated</h4>
        <p class="text-text-200 text-sm text-right">{{ timeAgo(props.stats.lastUpdated) }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <Icon name="tdesign:git-commit" class="text-primary w-5" />
        <p><span class="font-bold">{{ props.stats.commits }}</span> commits</p>
      </div>
      <div class="flex items-center gap-2">
        <Icon name="material-symbols:star" class="text-primary fill-primary w-5"/>
        <p><span class="font-bold">{{ props.stats.stars }}</span> stars</p>
      </div>
      <div class="flex items-center gap-2">
        <Icon name="tabler:circle-dot" class="text-primary w-5"/>
        <p><span class="font-bold">{{ props.stats.issues }}</span> open issues</p>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  currentPage: number;
  stats?: githubStats;
}>()

function timeAgo(time: Date): string {
    const seconds = Math.floor((new Date().getTime() - time.getTime()) / 1000);

    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };

    let counter: number;
    for (const [unit, secondsPerUnit] of Object.entries(intervals)) {
        counter = Math.floor(seconds / secondsPerUnit);
        if (counter > 0) {
            if (counter === 1) {
                return `${counter} ${unit} ago`;
            } else {
                return `${counter} ${unit}s ago`;
            }
        }
    }

    return 'Just now';
}

</script>