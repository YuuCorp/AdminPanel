<template>
  <div class="bg-background-200 h-screen w-screen p-8 flex flex-col items-center justify-center gap-4 font-jetbrains uppercase text-text-100">
    <img class="rounded-full h-10 border-2 border-accent absolute top-4 right-4" v-bind:src="userAvatar">

    <csm-bento class="flex w-full gap-4 justify-center">
      <LogView :logs="APIdata.logs" />
      <div class="flex flex-col min-h-full justify-between">
        <UsageData :logs="APIdata.logs" />
        <GithubStatistics v-if="bentoPage === 1" @page-change="changePage" :stats="githubStats" :current-page="bentoPage" />
        <TheAnnouncements v-else @page-change="changePage" :announcements="APIdata.announcements" :current-page="bentoPage" />
        <BotStatistics :stats="APIdata.stats" />
      </div>
    </csm-bento>
    <div class="flex w-full justify-center gap-2">
      <BotButton @click='executeToast("Updating...", useYuukoAPI("trigger", "update"))' button-text="Update Bot" icon="material-symbols:cloud-download-outline" />
      <BotButton @click='executeToast("Restarting...", useYuukoAPI("trigger", "restart"))' button-text="Restart Bot" icon="material-symbols:refresh-rounded" />
      <AnnouncementDialog @submit:announcement='(e) => executeToast("Uploading announcement...", e)' />
      <BotButton @click='executeToast("Wiping logs...", useYuukoAPI("trigger", "wipelogs"))' button-text="Wipe Logs" icon="mdi:trash-can-outline" />
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
const bentoPage = ref(1);

const APIdata = await useYuukoAPI("info");

const { repository } = await GqlStats({ owner: "YuuCorp", "name": "Yuuko", "first": 1})
const githubStats = makeStats(repository);

function makeStats(repo: typeof repository) {
  const commit = repo?.defaultBranchRef?.target;
  if(!repo || !commit || !("message" in commit)) return;

  return {
    commits: commit.history.totalCount,
    stars: repo.stargazerCount,
    issues: repo.issues.totalCount,
    lastCommit: commit.message,
    lastUpdated: new Date(commit.committedDate),
  }
}

function executeToast(loading: string, toastPromise: Promise<any>) {
  return toast.promise(toastPromise, {
    loading,
    success: (data) => {
      return data;
    },
    error: (data: any) => data.message || "An error occurred",
  });
}

function changePage(direction: string) {
  const dirValue = direction === "forward" ? 1 : -1;
  bentoPage.value = limitRange(1, 2, bentoPage.value + dirValue);
}
</script>
