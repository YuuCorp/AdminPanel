<template>
    <div class="rounded-lg border bg-card/50 p-4 text-center space-y-2">
        <div class="flex justify-center">
            <Icon :name="icon" class="w-6 h-6 text-primary" />
        </div>
        <h3 class="font-medium text-sm">{{ title }}</h3>
        <p class="text-xs text-muted-foreground leading-relaxed">{{ description }}</p>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    icon: string;
    title: string;
    description: string;
}>();
</script>
