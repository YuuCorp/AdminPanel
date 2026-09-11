<template>
    <div
        class="w-80 p-4 h-fit bg-yu-background-50 rounded-lg border border-yu-border-200 flex flex-col gap-4 shadow-sm"
    >
        <div class="flex flex-col gap-0.5">
            <h1 class="text-xl font-bold tracking-tight">Usage Stats</h1>
            <span class="text-xs text-text-200">
                {{ currentDate.month }} {{ currentDate.year }} &bull;
                {{ totalCommands }}
                {{ totalCommands === 1 ? "command" : "commands" }}
            </span>
        </div>

        <Divider />

        <div class="flex flex-col gap-2.5">
            <h2
                class="text-xs font-semibold uppercase tracking-wider text-text-200"
            >
                Top Commands
            </h2>

            <div v-if="topCommands.length" class="flex flex-col gap-2">
                <div
                    v-for="cmd in topCommands"
                    :key="cmd.name"
                    class="flex flex-col gap-1"
                >
                    <div class="flex justify-between items-center text-xs">
                        <span class="font-medium text-text-100 truncate"
                            >/{{ cmd.name }}</span
                        >
                        <span class="text-text-200 font-mono select-none">
                            {{ cmd.count }}
                            <span class="text-[10px] text-text-300"
                                >({{ getPercentage(cmd.count) }}%)</span
                            >
                        </span>
                    </div>

                    <div
                        class="w-full h-1.5 bg-yu-background-100 rounded-full overflow-hidden border border-yu-border-100"
                    >
                        <div
                            class="h-full bg-primary-500 rounded-full transition-all duration-300"
                            :style="{ width: `${getPercentage(cmd.count)}%` }"
                        />
                    </div>
                </div>
            </div>

            <p v-else class="text-xs text-text-300 italic">
                No command activity logged
            </p>
        </div>

        <Divider />

        <div class="flex flex-col gap-2.5">
            <h2
                class="text-xs font-semibold uppercase tracking-wider text-text-200"
            >
                Top Users
            </h2>

            <div v-if="topUsers.length" class="flex flex-col gap-2">
                <div
                    v-for="user in topUsers"
                    :key="user.name"
                    class="flex flex-col gap-1"
                >
                    <div class="flex justify-between items-center text-xs">
                        <span class="font-medium text-text-100 truncate">{{
                            user.name
                        }}</span>
                        <span class="text-text-200 font-mono select-none">
                            {{ user.count }}
                            <span class="text-[10px] text-text-300"
                                >({{ getPercentage(user.count) }}%)</span
                            >
                        </span>
                    </div>

                    <!-- Usage Bar -->
                    <div
                        class="w-full h-1.5 bg-yu-background-100 rounded-full overflow-hidden border border-yu-border-100"
                    >
                        <div
                            class="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            :style="{ width: `${getPercentage(user.count)}%` }"
                        />
                    </div>
                </div>
            </div>

            <p v-else class="text-xs text-text-300 italic">
                No active users found
            </p>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { LogsData } from "~/utils/types";

const props = defineProps<{
    logs: LogsData;
}>();

const currentDate = {
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear(),
};

const commandLogs = computed(() => {
    if (!props.logs || !Array.isArray(props.logs)) return [];
    return props.logs.filter((log) => log.meta?.type === "command");
});

const totalCommands = computed(() => commandLogs.value.length);

const topCommands = computed(() => {
    const counts = new Map<string, number>();

    for (const log of commandLogs.value) {
        if (log.meta && log.meta.type === "command") {
            const name = log.meta.command;
            counts.set(name, (counts.get(name) || 0) + 1);
        }
    }

    return Array.from(counts, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
});

const topUsers = computed(() => {
    const counts = new Map<string, number>();

    for (const log of commandLogs.value) {
        if (log.meta && log.meta.type === "command") {
            const user = log.meta.user;
            counts.set(user, (counts.get(user) || 0) + 1);
        }
    }

    return Array.from(counts, ([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);
});

const getPercentage = (count: number) => {
    if (!totalCommands.value) return 0;
    return Math.round((count / totalCommands.value) * 100);
};
</script>
