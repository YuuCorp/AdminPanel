<template>
    <NuxtLoadingIndicator color="#FFFFFF" />
    <NuxtPage />

    <Toaster expand theme="dark" rich-colors :duration="2500" />
</template>

<script lang="ts" setup>
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";

const route = useRoute();

const title = computed(() => {
    if (route.name === "index") return "Auth";
    return route.name?.toString().toUpperCase();
});
useHead({
    htmlAttrs: { class: "dark" },
    link: [{ rel: "icon", type: "image/x-icon", href: "/yuuko.ico" }],
});
useSeoMeta({
    title: `Yuuko - ${title.value}`,
    ogUrl: "https://auth.yuuko.dev",
    description: "Sign in to AniList via Yuuko to access personalized commands",
    ogTitle: `Yuuko - ${title.value}`,
    ogDescription:
        "Sign in to AniList via Yuuko to access personalized commands",
    ogImage: "/banner.png",
});
</script>
