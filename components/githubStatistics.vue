<template>
  <div class="w-80 p-4 h-fit bg-background-100 rounded-lg border border-accent flex flex-col gap-3">
    <h1 class="text-xl font-bold">Statistics</h1>
    <csm-divider class="h-[2px] w-full bg-accent rounded-full"></csm-divider>

    <div class="flex flex-col gap-1">
      <div class="flex items-center gap-1">
        <LucideUser class="text-primary inline-block"/>
        <p><span class="font-bold">48</span> registered users</p>
      </div>

      <div class="flex items-center gap-1">
        <LucideUsers class="text-primary inline-block"/>
        <p><span class="font-bold">21.4K</span> members</p>
      </div>

      <div class="flex items-center gap-1">
        <LucideBuilding class="text-primary inline-block"/>
        <p><span class="font-bold">114</span> servers</p>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>

</script>