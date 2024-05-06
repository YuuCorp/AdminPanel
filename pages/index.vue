<template>
    <div class="m-auto bg-background-200 h-screen w-screen p-2 md:p-8 flex flex-col items-center gap-4 font-inter">

        <div class="flex flex-col gap-4 m-auto w-fit p-4 rounded-lg border h-fit bg-card">
            <div class="flex text-center flex-col gap-1">
                <h3 class="font-semibold text-xl">Connect your account to Yuuko!</h3>
                <h5 class="text-sm text-muted-foreground">Discord and AniList</h5>
            </div>
            <csm-divider class="h-[2px] w-full bg-input rounded-full"></csm-divider>
            <div class="flex flex-col gap-2">
                <div id="discord" class="flex justify-between items-center">
                    <button @click="serviceButton('discord', user?.username)"
                        class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent">
                        {{ discordInfo.buttonText }}
                    </button>
                    <p class="text-sm font-medium">{{ discordInfo.username }}</p>
                </div>
                <div id="anilist" class="flex justify-between items-center">
                    <button @click="serviceButton('anilist', user?.anilistUsername)"
                        class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent">
                        {{ anilistInfo.buttonText }}
                    </button>
                    <p class="text-sm font-medium">{{ anilistInfo.username }}</p>
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
const user = unref(useUser());
const anilistInfo = computed(() => {
    return {
        buttonText: user?.anilistUsername ? "Log out" : "Log in",
        username: user?.anilistUsername ? user.anilistUsername : "Not logged in"
    }
})

const discordInfo = computed(() => {
    return {
        buttonText: user?.discordId ? "Log out" : "Log in",
        username: user?.discordId ? user.username : "Not logged in"
    }
})

async function serviceButton(service: "discord" | "anilist", checkValue: string | undefined) {
    const logIn = (v: string | undefined) => v ? "logout" : "login";
    const type = logIn(checkValue);
    console.log(checkValue);
    if (service === "discord") {
        if (type === "logout") await $fetch("/api/oauth/discord/logout", { method: "POST" });
        else window.location.href = "/api/oauth/discord";
    } else {
        if (type === "logout") await $fetch("/api/oauth/anilist/logout", { method: "POST" });
        else window.location.href = "/api/oauth/anilist";
    }
}
</script>
