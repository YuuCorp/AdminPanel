<template>
    <div class=" w-2/3 p-4 h-fit bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
      <h1 class="text-xl font-bold">Logs</h1>
      <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>
      <div class="max-h-[700px] overflow-scroll">
        <div class="w-full normal-case flex gap-2" v-for="(log, idx) in typedLogs">
          <span class="text-text-200">{{ String(idx).padStart(String(typedLogs.length).length, "0") }}</span>
          <csm-divider class="min-h-full w-[2px] bg-accent"></csm-divider>
          <p>{{ log.date }}: {{ log.user }} ran {{ log.info }}</p>
        </div>
      </div>
  </div>
</template>

<script lang="ts" setup>
import botLogs from 'public/logs.json'
const typedLogs = botLogs as { date: string, user: string, info: string }[]
</script>