<template>
    <div
        v-if="APIdata"
        class="bg-yu-background-200 h-screen w-screen p-2 md:p-8 flex flex-col items-center gap-4 font-jetbrains text-text-100"
    >
        <img
            class="rounded-full h-10 border-2 border-accent absolute top-4 right-4"
            v-bind:src="userAvatar"
        />

        <csm-bento
            class="flex w-full flex-wrap md:flex-nowrap gap-4 justify-center m-auto"
        >
            <LogView class="w-fit" :logs="APIdata.logs" />
            <div class="flex flex-col justify-between">
                <UsageData :logs="APIdata.logs" />
                <TheAnnouncements :announcements="APIdata.announcements" />
                <BotStatistics :stats="APIdata.stats" />
            </div>
        </csm-bento>
        <div class="flex flex-wrap w-fit justify-center gap-2 m-auto">
            <BotButton
                @click="
                    executeToast(
                        'Restarting...',
                        useYuukoAPI('/api/v1/trigger/restart', {}),
                    )
                "
                button-text="Restart Bot"
                icon="material-symbols:refresh-rounded"
            />
            <AnnouncementDialog
                @submit:announcement="
                    (e) => executeToast('Uploading announcement...', e)
                "
            />
            <BotButton
                @click="
                    executeToast(
                        'Wiping logs...',
                        useYuukoAPI('/api/v1/trigger/wipe-logs', {}),
                    )
                "
                button-text="Wipe Logs"
                icon="mdi:trash-can-outline"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
import type { AnnouncementsData, BotStatsData, LogsData } from "~/utils/types";

const user = useUser(); // <-- keep the ref
const APIdata = ref<{
    stats: BotStatsData;
    announcements: AnnouncementsData;
    logs: LogsData;
} | null>(null);

const userAvatar = computed(() => {
    if (user.value)
        return `https://cdn.discordapp.com/avatars/${user.value?.discordId}/${user.value?.discordAvatar}.png`;
    else return "https://cdn.discordapp.com/embed/avatars/0.png";
});

function executeToast<T extends { message?: string }>(
    loading: string,
    toastPromise: Promise<T>,
) {
    return toast.promise(toastPromise, {
        loading,
        success: (data: any) => {
            return data.message;
        },
        error: (data: any) => data.message || "An error occurred",
    });
}

onBeforeMount(async () => {
    if (!user.value) {
        user.value = await $fetch<user | null>("/api/auth/me");
    }

    const [stats, announcements, logs] = await Promise.all([
        useYuukoAPI("/api/v1/info/stats"),
        useYuukoAPI("/api/v1/info/announcements"),
        useYuukoAPI("/api/v1/info/logs"),
    ]);

    APIdata.value = { stats, announcements, logs };
});
</script>
