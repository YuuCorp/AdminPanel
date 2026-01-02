<template>
    <div
        class="min-w-2/3 w-2/3 p-4 h-fit bg-yu-background-50 rounded-lg border border-yu-border-200 flex flex-col gap-3"
    >
        <h1 class="text-xl font-bold">Logs</h1>
        <Divider />
        <div v-if="logs" class="max-h-175 overflow-y-scroll">
            <div
                class="w-full normal-case flex gap-2"
                v-for="(log, idx) in logs"
            >
                <span class="text-text-200 select-none">{{
                    String(idx + 1).padStart(String(logs.length).length, "0")
                }}</span>
                <Divider vertical />
                <p>{{ log.date }}: {{ log.user }} ran {{ log.info }}</p>
            </div>
        </div>
        <p v-else>Something is seriously wrong</p>
    </div>
</template>

<script lang="ts" setup>
defineProps<{ logs: Log[] }>();
</script>
