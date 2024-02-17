<template>
  <div class="bg-background-200 h-screen w-screen p-8 flex flex-col items-center justify-center gap-4 font-jetbrains uppercase text-text-100">
    <img class="rounded-full h-10 border-2 border-accent absolute top-4 right-4" v-bind:src="userAvatar">

    <csm-bento class="flex w-full gap-4 justify-center">
      <LogView />
      <div class="flex flex-col min-h-full justify-between">
        <UsageData />
        <GithubStatistics v-if="bentoPage === 1" @page-change="changePage" :stats="githubStats" :current-page="bentoPage" />
        <TheAnnouncements v-else @page-change="changePage" :current-page="bentoPage" />
        <BotStatistics />
      </div>
    </csm-bento>
    <div class="flex w-full justify-center gap-2">
      <BotButton @take-action='executeToast("Updating...", "Bot has been successfully updated!")' button-text="Update Bot" icon="material-symbols:cloud-download-outline" />
      <BotButton @take-action='executeToast("Restarting...", "Bot has been restarted!")' button-text="Restart Bot" icon="material-symbols:refresh-rounded" />
      <AnnouncementDialog @submit:announcement='executeToast("Uploading announcement...", "Announcement was successful!")' />
      <BotButton @take-action='executeToast("Wiping logs...", "Successfully wiped all logs!")' button-text="Wipe Logs" icon="mdi:trash-can-outline" />
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

function executeToast(loading: string, title: string) {
  const promise = new Promise<string>((resolve, reject) => {
    setTimeout(() => {
      resolve(title);
    }, 2000);
  });

  return toast.promise(promise, {
    loading,
    success: (data) => {
      return data;
    },
    error: (data: any) => 'Error',
  });
}

function changePage(direction: string) {
  const dirValue = direction === "forward" ? 1 : -1;
  bentoPage.value = limitRange(1, 2, bentoPage.value + dirValue);
}
</script>
