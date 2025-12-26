<template>
    <div
        class="bg-background-200 h-screen w-screen p-2 md:p-8 flex flex-col items-center gap-4 font-jetbrains uppercase text-text-100"
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
                        useYuukoAPI('trigger', 'restart')
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
                        useYuukoAPI('trigger', 'wipe-logs')
                    )
                "
                button-text="Wipe Logs"
                icon="mdi:trash-can-outline"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
definePageMeta({
    middleware: ["protected"],
});

import { toast } from "vue-sonner";

const user = useUser();
const userAvatar = computed(() => {
    if (user.value)
        return `https://cdn.discordapp.com/avatars/${user.value?.discordId}/${user.value?.discordAvatar}.png`;
    else return "https://cdn.discordapp.com/embed/avatars/0.png";
});

const APIdata = await useYuukoAPI("info");

function executeToast(
    loading: string,
    toastPromise: ReturnType<typeof useYuukoAPI<"trigger">>
) {
    return toast.promise(toastPromise, {
        loading,
        success: (data) => {
            return data.message;
        },
        error: (data: any) => data.message || "An error occurred",
    });
}
</script>
