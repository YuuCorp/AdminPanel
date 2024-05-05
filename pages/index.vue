<template>
    <div class="m-auto bg-background-200 h-screen w-screen p-2 md:p-8 flex flex-col items-center gap-4 font-inter">

        <div class="flex flex-col gap-4 m-auto w-fit p-4 rounded-lg border h-fit bg-card">
            <div class="flex text-center flex-col gap-1">
                <h3 class="font-semibold text-xl">Connect your account to Yuuko!</h3>
                <h5 class="text-sm text-muted-foreground">Discord and AniList</h5>
            </div>
            <csm-divider class="h-[2px] w-full bg-input rounded-full"></csm-divider>
            <div class="flex flex-col gap-2">
                <div class="flex justify-between items-center">
                    <button
                        class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent">Log
                        out</button>
                    <p class="text-sm font-medium">crackheadakira</p>
                </div>
                <div class="flex justify-between items-center">
                    <button
                        class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent">Log
                        in</button>
                    <p class="text-sm font-medium">Not logged in</p>
                </div>
            </div>
            <csm-divider class="h-[2px] w-full bg-input rounded-full"></csm-divider>
            <div class="flex flex-row-reverse">
                <button class="duration-100 h-10 w-24 bg-primary rounded-md text-sm font-semibold hover:bg-primary/90">
                    Submit</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// A new wondrous land.
</script>
