<template>
    <div class="flex flex-row-reverse justify-between items-center">
        <button
            @click="serviceButton(serviceType, username)"
            class="duration-100 h-10 w-20 bg-background rounded-md text-sm font-medium border hover:bg-accent"
        >
            {{ buttonText }}
        </button>
        <div class="flex items-center justify-end gap-1">
            <Icon
                :name="
                    serviceType === 'anilist'
                        ? 'simple-icons:anilist'
                        : 'carbon:logo-discord'
                "
                size="1rem"
            />
            <p class="text-sm font-medium">
                {{ username ?? "Not logged in" }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";

const props = defineProps<{
    serviceType: "anilist" | "discord";
    username: string | undefined;
}>();

const emit = defineEmits<{
    (e: "logout"): void;
}>();

const buttonText = computed(() => {
    return props.username ? "Log out" : "Log in";
});

async function serviceButton(
    service: "discord" | "anilist",
    username: string | undefined
) {
    const type = username ? "logout" : "login";

    if (type === "login") {
        return (window.location.href = `/api/oauth/${service}`);
    } else if (type === "logout") {
        await $fetch(`/api/oauth/${service}/logout`, { method: "POST" });

        emit("logout");
        toast.success(`Successfully logged out of ${service}!`);
    }
}
</script>
