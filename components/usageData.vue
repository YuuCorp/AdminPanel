<template>
  <div
    class="w-80 p-4 h-fit bg-background-100 rounded-lg border border-accent flex flex-col gap-3"
  >
    <h1 class="text-xl font-bold">
      Usage <span class="text-base text-text-200">for February, 2024</span>
    </h1>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>

    <div class="flex flex-col">
      <h2 class="text-lg font-medium">Top 3 most used commands</h2>
      <div
        class="w-full flex justify-between"
        v-for="command in commandUsage.slice(0, 3)"
      >
        <p>{{ command.name }}</p>
        <span class="font-medium select-none"
          >{{ command.count }} / {{ totalCommands }}</span
        >
      </div>
    </div>

    <div class="flex flex-col">
      <h2 class="text-lg font-medium">Top 3 users</h2>
      <div
        class="w-full flex justify-between"
        v-for="command in usageByUser.slice(0, 3)"
      >
        <p>{{ command.name }}</p>
        <span class="font-medium select-none"
          >{{ command.count }} / {{ totalCommands }}</span
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps<{
  logs: Log[];
}>();

const totalCommands = props.logs.length;
const commandUsage = calculateUsageByField(props.logs, "info");
const usageByUser = calculateUsageByField(props.logs, "user");

function calculateUsageByField(
  typedLogs: Log[],
  field: keyof Log
) {
  return typedLogs
    .reduce((acc, log) => {
      const value = log[field];
      const index = acc.findIndex((c) => c.name === value);
      if (index === -1) {
        acc.push({ name: value, count: 1 });
      } else {
        acc[index].count++;
      }
      return acc;
    }, [] as { name: string; count: number }[])
    .sort((a, b) => b.count - a.count);
}
</script>
