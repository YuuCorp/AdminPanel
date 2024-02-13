<template>
  <div class="bg-background-200 h-screen w-screen p-8 font-jetbrains uppercase text-text-100">
    <csm-bento class="flex w-full gap-4 justify-center">
      <LogView />
      <div class="flex flex-col min-h-full justify-between">
        <UsageData />
        <GithubStatistics />
        <BotStatistics />
      </div>
    </csm-bento>
  </div>
</template>
