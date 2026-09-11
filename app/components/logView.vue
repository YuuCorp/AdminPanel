<template>
    <div
        class="w-full max-w-5xl p-5 h-fit bg-yu-background-50 rounded-xl border border-yu-border-200 flex flex-col gap-4 font-mono text-sm shadow-sm"
    >
        <div
            class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
        >
            <div class="flex items-center gap-3">
                <h1 class="text-xl font-bold tracking-tight">System Logs</h1>
                <span
                    v-if="logs && logs.length"
                    class="px-2 py-0.5 text-xs font-semibold rounded-full bg-yu-background-100 text-text-200 border border-yu-border-100"
                >
                    {{ filteredLogs.length }} / {{ logs.length }}
                </span>
            </div>

            <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="Search message or meta..."
                    class="px-3 py-1.5 text-xs bg-yu-background-100 border border-yu-border-200 rounded-md focus:outline-none focus:border-primary-500 transition-colors w-full sm:w-48 text-text-100 placeholder:text-text-300"
                />

                <select
                    v-model="selectedLevel"
                    class="px-3 py-1.5 text-xs bg-yu-background-100 border border-yu-border-200 rounded-md focus:outline-none focus:border-primary-500 text-text-100 cursor-pointer"
                >
                    <option value="all">All Levels</option>
                    <option value="error">Error</option>
                    <option value="warn">Warn</option>
                    <option value="info">Info</option>
                    <option value="debug">Debug</option>
                    <option value="verbose">Verbose</option>
                    <option value="http">HTTP</option>
                    <option value="silly">Silly</option>
                </select>

                <select
                    v-model="selectedMetaType"
                    class="px-3 py-1.5 text-xs bg-yu-background-100 border border-yu-border-200 rounded-md focus:outline-none focus:border-primary-500 text-text-100 cursor-pointer"
                >
                    <option value="all">All Meta Types</option>
                    <option value="command">Command</option>
                    <option value="commandDebug">Command Debug</option>
                    <option value="event">Event</option>
                    <option value="graphql">GraphQL</option>
                    <option value="check">Check</option>
                    <option value="startup">Startup</option>
                    <option value="generic">Generic</option>
                </select>
            </div>
        </div>

        <Divider />

        <div
            v-if="logs && logs.length"
            class="max-h-150 overflow-y-auto flex flex-col divide-y divide-yu-border-100/50 rounded-lg border border-yu-border-100 bg-yu-background-100/30"
        >
            <div
                v-for="(log, idx) in filteredLogs"
                :key="idx"
                class="group px-3 py-2 flex flex-col gap-1.5 hover:bg-yu-background-100/70 transition-colors"
            >
                <div class="flex items-center gap-3 w-full">
                    <span
                        class="text-xs text-text-300 select-none w-8 text-right shrink-0"
                    >
                        {{
                            String(idx + 1).padStart(
                                String(filteredLogs.length).length,
                                "0",
                            )
                        }}
                    </span>

                    <span class="text-xs text-text-200 shrink-0">
                        {{ formatTimestamp(log.timestamp) }}
                    </span>

                    <span
                        class="px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider shrink-0 border"
                        :class="levelStyles[log.level] || levelStyles.info"
                    >
                        {{ log.level }}
                    </span>

                    <span
                        v-if="log.meta?.type"
                        class="px-1.5 py-0.5 text-[10px] font-semibold rounded bg-slate-800 text-slate-300 border border-slate-700 shrink-0"
                    >
                        {{ log.meta.type }}
                    </span>

                    <p class="text-text-100 truncate grow text-xs font-normal">
                        {{ log.message }}
                    </p>

                    <button
                        v-if="log.meta && Object.keys(log.meta).length"
                        @click="toggleExpand(idx)"
                        class="px-2 py-0.5 text-[11px] text-text-200 hover:text-text-100 bg-yu-background-200/50 hover:bg-yu-background-200 border border-yu-border-200 rounded transition-all shrink-0 cursor-pointer"
                    >
                        {{ expandedLogs.has(idx) ? "Hide Meta" : "Show Meta" }}
                    </button>
                </div>

                <div
                    v-if="expandedLogs.has(idx) && log.meta"
                    class="ml-11 mt-1 p-3 bg-black/40 border border-yu-border-200/60 rounded-md overflow-x-auto"
                >
                    <pre
                        class="text-xs text-emerald-400 font-mono leading-relaxed"
                        >{{ JSON.stringify(log.meta, null, 2) }}</pre
                    >
                </div>
            </div>

            <div
                v-if="filteredLogs.length === 0"
                class="p-8 text-center text-text-300 text-xs"
            >
                No log entries match your active filters.
            </div>
        </div>

        <div
            v-else
            class="p-8 text-center text-red-400 text-xs bg-red-950/20 border border-red-900/30 rounded-lg"
        >
            No logs returned from <code>/api/v1/info/logs</code>.
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed } from "vue";
import type { LogsData } from "~/utils/types";

const props = defineProps<{
    logs: LogsData;
}>();

const searchQuery = ref("");
const selectedLevel = ref<string>("all");
const selectedMetaType = ref<string>("all");

const expandedLogs = ref<Set<number>>(new Set());

const toggleExpand = (idx: number) => {
    if (expandedLogs.value.has(idx)) {
        expandedLogs.value.delete(idx);
    } else {
        expandedLogs.value.add(idx);
    }
};

const levelStyles = {
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    warn: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    http: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    verbose: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    debug: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    silly: "bg-pink-500/10 text-pink-400 border-pink-500/20",
};

const formatTimestamp = (ts?: string) => {
    if (!ts) return "--:--:--";

    const date = new Date(ts);
    return date.toLocaleTimeString([], {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
};

const filteredLogs = computed(() => {
    if (!props.logs || !Array.isArray(props.logs)) return [];

    return props.logs.filter((log) => {
        if (
            selectedLevel.value !== "all" &&
            log.level !== selectedLevel.value
        ) {
            return false;
        }

        if (selectedMetaType.value !== "all") {
            if (!log.meta || log.meta.type !== selectedMetaType.value) {
                return false;
            }
        }

        if (searchQuery.value.trim() !== "") {
            const query = searchQuery.value.toLowerCase();
            const messageMatch =
                log.message?.toLowerCase().includes(query) ?? false;
            const metaMatch = log.meta
                ? JSON.stringify(log.meta).toLowerCase().includes(query)
                : false;

            return messageMatch || metaMatch;
        }

        return true;
    });
});
</script>
