<template>
    <div class="m-auto bg-background-200 h-screen w-screen p-2 md:p-8 flex flex-col items-center gap-4 font-inter">

        <div class="flex flex-col gap-4 m-auto w-fit p-4 rounded-lg border h-fit bg-card">
            <div class="flex text-center flex-col gap-1">
                <h3 class="font-semibold text-xl">Connect your account to Yuuko!</h3>
                <h5 class="text-sm text-muted-foreground">Discord and AniList</h5>
            </div>
            <csm-divider class="h-[2px] w-full bg-input rounded-full"></csm-divider>
            <div class="flex flex-col gap-2">
                <div id="discord" class="flex flex-row-reverse justify-between items-center">
                    <button @click="serviceButton('discord', user?.username)"
                        class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent">
                        {{ discordInfo.buttonText }}
                    </button>
                    <div class="flex items-center justify-end gap-1">
                        <Icon name="carbon:logo-discord" size="1rem" />
                        <p class="text-sm font-medium">{{ discordInfo.username }}</p>
                    </div>
                </div>
                <div id="anilist" class="flex flex-row-reverse justify-between items-center">
                    <button @click="serviceButton('anilist', user?.anilistUsername)"
                        class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent">
                        {{ anilistInfo.buttonText }}
                    </button>
                    <div class="flex items-center justify-end gap-1">
                        <Icon name="simple-icons:anilist" size="1rem" />
                        <p class="text-sm font-medium">{{ anilistInfo.username }}</p>
                    </div>
                </div>
            </div>
            <csm-divider class="h-[2px] w-full bg-input rounded-full"></csm-divider>
            <div class="flex flex-row-reverse">
                <button :disabled="!canSubmit" @click="submitUser"
                    class="duration-100 h-10 w-24 bg-primary rounded-md disabled:opacity-75 disabled:cursor-not-allowed text-sm font-semibold hover:bg-primary/90">
                    Connect
                    <Icon name="tabler:send" size="1rem" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { eq } from 'drizzle-orm';
import { toast } from 'vue-sonner'
const user = useUser();

const anilistInfo = computed(() => {
    return {
        buttonText: user.value?.anilistUsername ? "Log out" : "Log in",
        username: user.value?.anilistUsername ? user.value.anilistUsername : "Not logged in"
    }
})

const discordInfo = computed(() => {
    return {
        buttonText: user.value?.discordId ? "Log out" : "Log in",
        username: user.value?.discordId ? user.value.username : "Not logged in"
    }
})

async function serviceButton(service: "discord" | "anilist", checkValue: string | undefined) {
    const type = checkValue ? "logout" : "login";
    if (service === "discord") {
        if (type === "logout") await $fetch("/api/oauth/discord/logout", { method: "POST" });
        else window.location.href = "/api/oauth/discord";
    } else {
        if (type === "logout") await $fetch("/api/oauth/anilist/logout", { method: "POST" });
        else window.location.href = "/api/oauth/anilist";
    }
}
function executeToast(loading: string, toastPromise: ReturnType<typeof useYuukoAPI<"trigger">>) {
    return toast.promise(toastPromise, {
        loading,
        success: (data) => {
            return data.message;
        },
        error: (data: any) => {
            return data?.data.message || "An error occurred"
        },
    });
}

const canSubmit = computed(() => {
    return user.value?.discordId && user.value?.anilistUsername && user.value?.anilistToken
})

async function submitUser() {
    try {
        if (!canSubmit.value) return;
        const config = useRuntimeConfig();
        const apiURL = config.public.yuukoApiUrl;
        const promise = $fetch<{ message: string }>(`${apiURL}/api/v1/public/register`,
            {
                headers: { "authorization": user.value!.anilistToken! },
                body: { discordId: user.value!.discordId! }, method: "POST"
            }).finally(() => {
                setTimeout(() => {
                    executeToast("Wiping records...", $fetch("/api/auth/logout", { method: "POST" }));
                }, 500);
            });
        executeToast("Submitting...", promise)
    } catch (e) {
        console.error(e);
    }
}
</script>
