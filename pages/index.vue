<template>
  <div
    class="bg-background-200 h-screen w-screen p-8 flex flex-col items-center justify-center gap-4 font-jetbrains uppercase text-text-100">
    <img class="rounded-full h-10 border-2 border-accent absolute top-4 right-4" v-bind:src="userAvatar">

    <csm-bento class="flex w-full gap-4 justify-center">
      <LogView :logs="APIdata.logs" />
      <div class="flex flex-col min-h-full justify-between">
        <UsageData :logs="APIdata.logs" />
        <TheAnnouncements :announcements="APIdata.announcements" />
        <BotStatistics :stats="APIdata.stats" />
      </div>
    </csm-bento>
    <div class="flex w-full justify-center gap-2">
      <BotButton @click='executeToast("Restarting...", useYuukoAPI("trigger", "restart"))' button-text="Restart Bot"
        icon="material-symbols:refresh-rounded" />
      <AnnouncementDialog @submit:announcement='(e) => executeToast("Uploading announcement...", e)' />
      <BotButton @click='executeToast("Wiping logs...", useYuukoAPI("trigger", "wipe-logs"))' button-text="Wipe Logs"
        icon="mdi:trash-can-outline" />
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  middleware: ['protected']
})

import { toast } from 'vue-sonner'

const user = useAuthenticatedUser()
const userAvatar = computed(() => `https://cdn.discordapp.com/avatars/${user.value.discordId}/${user.value.discordAvatar}.png`)

const APIdata = await useYuukoAPI("info");

function executeToast(loading: string, toastPromise: ReturnType<typeof useYuukoAPI<"trigger">>) {
  return toast.promise(toastPromise, {
    loading,
    success: (data) => {
      return data.message;
    },
    error: (data: any) => data.message || "An error occurred",
  });
}
</script>
