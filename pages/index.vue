<template>
    <div
        class="m-auto bg-background-200 h-screen w-screen p-2 md:p-8 flex flex-col items-center gap-4 font-inter"
    >
        <div
            class="flex flex-col gap-4 m-auto w-fit p-4 rounded-lg border h-fit bg-card"
        >
            <div class="flex text-center flex-col gap-1">
                <h3 class="font-semibold text-xl">
                    Connect your accounts to Yuuko!
                </h3>
                <h5 class="text-sm text-muted-foreground">
                    Via Discord and AniList
                </h5>
            </div>

            <csm-divider
                class="h-[2px] w-full bg-input rounded-full"
            ></csm-divider>

            <div class="flex flex-col gap-2">
                <serviceUser
                    service-type="discord"
                    :username="user?.username"
                    @logout="refreshUser"
                />
                <serviceUser
                    service-type="anilist"
                    :username="user?.anilistUsername"
                    @logout="refreshUser"
                />
            </div>

            <csm-divider
                class="h-[2px] w-full bg-input rounded-full"
            ></csm-divider>

            <div class="flex flex-row-reverse">
                <button
                    :disabled="!canSubmit"
                    @click="submitUser"
                    class="duration-100 h-10 w-24 bg-primary rounded-md disabled:opacity-75 disabled:cursor-not-allowed text-sm font-semibold hover:bg-primary/90"
                >
                    Connect
                    <Icon name="tabler:send" size="1rem" />
                </button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
const user = useUser();

async function refreshUser() {
    const updatedUser = await $fetch<user | null>("/api/auth/me");
    user.value = updatedUser;
}

function executeToast(
    loading: string,
    toastPromise: ReturnType<typeof useYuukoAPI<"trigger">>
) {
    return toast.promise(toastPromise, {
        loading,
        success: (data) => {
            return data.message;
        },
        error: (data: any) => {
            return data?.data.message || "An error occurred";
        },
    });
}

const canSubmit = computed(() => {
    return (
        user.value?.discordId &&
        user.value?.anilistUsername &&
        user.value?.anilistToken
    );
});

async function submitUser() {
    if (!user.value)
        return toast.error(
            "There seems to be an issue with sending your information to Yuuko."
        );

    if (!user.value.discordId)
        return toast.error("No Discord ID found attached to user.");
    if (!user.value.anilistToken)
        return toast.error("No AniList token found attached to user.");

    try {
        if (!canSubmit.value) return;
        const config = useRuntimeConfig();
        const apiURL = config.public.yuukoApiUrl;

        const promise = $fetch<{ message: string }>(
            `${apiURL}/api/v1/public/register`,
            {
                headers: { Authorization: user.value.discordId },
                body: { token: user.value.anilistToken },
                method: "POST",
            }
        ).then((d) => {
            setTimeout(() => {
                executeToast(
                    "Wiping records...",
                    $fetch("/api/auth/logout", { method: "POST" })
                );
            }, 500);

            return d;
        });

        executeToast("Connecting...", promise);
    } catch (e) {
        console.error(e);
    }
}
</script>
