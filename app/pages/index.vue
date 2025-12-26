<template>
    <div
        class="min-h-screen w-full bg-background font-inter flex flex-col items-center justify-center px-4"
    >
        <!-- Admin link (top right, only for admins) -->
        <div v-if="isAdmin" class="absolute top-4 right-4">
            <NuxtLink
                to="/panel"
                class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
            >
                <Icon name="mdi:shield-crown" class="w-4 h-4" />
                Admin Panel
            </NuxtLink>
        </div>

        <!-- Auth Card -->
        <div class="w-full max-w-sm">
            <div class="rounded-xl border bg-card p-6 shadow-lg">
                <div class="text-center mb-6">
                    <h1 class="font-semibold text-xl">
                        Connect to <span class="text-primary">Yuuko</span>
                    </h1>
                    <p class="text-sm text-muted-foreground mt-1">
                        Link your accounts to unlock personalized commands
                    </p>
                </div>

                <!-- Steps -->
                <div class="space-y-3 mb-6">
                    <AuthStep
                        :step="1"
                        service="discord"
                        label="Discord"
                        :username="user?.username"
                        :completed="!!user?.discordId"
                        @logout="refreshUser"
                    />
                    <AuthStep
                        :step="2"
                        service="anilist"
                        label="AniList"
                        :username="user?.anilistUsername"
                        :completed="!!user?.anilistUsername"
                        :disabled="!user?.discordId"
                        @logout="refreshUser"
                    />
                </div>

                <!-- Submit Button -->
                <Button
                    :disabled="!canSubmit"
                    @click="submitUser"
                    class="w-full"
                    size="lg"
                >
                    <span v-if="canSubmit">Complete Connection</span>
                    <span v-else class="text-muted-foreground"
                        >Connect both accounts to continue</span
                    >
                </Button>

                <!-- Success state hint -->
                <p
                    v-if="canSubmit"
                    class="text-xs text-center text-muted-foreground mt-3"
                >
                    Your accounts will be linked and you can close this page
                </p>
            </div>

            <!-- Footer links -->
            <div
                class="flex items-center justify-center gap-4 mt-6 text-xs text-muted-foreground"
            >
                <a
                    href="https://yuuko.dev"
                    target="_blank"
                    class="hover:text-foreground transition-colors"
                >
                    Website
                </a>
                <span class="text-muted-foreground/50">·</span>
                <a
                    href="https://discord.gg/DUCEj7vqKD"
                    target="_blank"
                    class="hover:text-foreground transition-colors"
                >
                    Discord
                </a>
                <span class="text-muted-foreground/50">·</span>
                <a
                    href="https://yuuko.dev/privacy"
                    target="_blank"
                    class="hover:text-foreground transition-colors"
                >
                    Privacy
                </a>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { toast } from "vue-sonner";
import { Button } from "@/components/ui/button";

const user = useUser();
const isAdmin = ref(false);

// Check admin status on mount
onMounted(async () => {
    if (user.value?.discordId) {
        const { isAdmin: admin } = await $fetch<{ isAdmin: boolean }>(
            "/api/auth/admin"
        );
        isAdmin.value = admin;
    }
});

async function refreshUser() {
    const updatedUser = await $fetch<user | null>("/api/auth/me");
    user.value = updatedUser;

    // Re-check admin status after user refresh
    if (updatedUser?.discordId) {
        const { isAdmin: admin } = await $fetch<{ isAdmin: boolean }>(
            "/api/auth/admin"
        );
        isAdmin.value = admin;
    } else {
        isAdmin.value = false;
    }
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
                toast.promise($fetch("/api/auth/logout", { method: "POST" }), {
                    loading: "Finishing up...",
                    success: "All done! You can close this page.",
                    error: "Something went wrong",
                });
            }, 500);

            return d;
        });

        toast.promise(promise, {
            loading: "Connecting your accounts...",
            success: (data: any) => data.message,
            error: (data: any) => data?.data?.message || "An error occurred",
        });
    } catch (e) {
        console.error(e);
    }
}
</script>
