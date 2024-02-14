<template>
  <div class="w-80 p-4 h-fit bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
    <div class="flex w-full justify-between items-center">
      <h1 class="text-lg font-bold">GitHub Statistics</h1>
      <div class="flex gap-1 items-center">
        <LucideChevronLeft class="text-primary inline-block"/>
        <p class="text-sm select-none">1 / 2</p>
        <LucideChevronRight class="text-primary inline-block"/>
      </div>
    </div>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>

    <div class="flex justify-between gap-2">
      <div class="w-36">
        <h4 class="font-bold">Last commit</h4>
        <p class="text-text-200 text-sm truncate">{{ githubStats.lastCommit }}</p>
      </div>
      <div>
        <h4 class="font-bold">Last updated</h4>
        <p class="text-text-200 text-sm text-right">{{ timeAgo(githubStats.lastUpdated) }}</p>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-2">
        <LucideGitCommitHorizontal class="text-primary"/>
        <p><span class="font-bold">{{ githubStats.commits }}</span> commits</p>
      </div>
      <div class="flex items-center gap-2">
        <LucideStar class="text-primary fill-primary w-5"/>
        <p><span class="font-bold">{{ githubStats.stars }}</span> stars</p>
      </div>
      <div class="flex items-center gap-2">
        <LucideCircleDot class="text-primary w-5"/>
        <p><span class="font-bold">{{ githubStats.issues }}</span> open issues</p>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

const githubStats = {
  commits: 289,
  stars: 12,
  issues: 0,
  lastCommit: "Commit text goes here",
  lastUpdated: 1707675633,
}

function timeAgo(timestamp: number): string {
    const seconds: number = Math.floor((new Date().getTime() - new Date(timestamp * 1000).getTime()) / 1000);

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