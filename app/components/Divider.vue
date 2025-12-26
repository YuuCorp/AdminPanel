<template>
    <csm-divider
        v-if="!vertical"
        class="h-0.5 w-full bg-yu-border-100 rounded-full"
    ></csm-divider>
    <csm-divider v-else class="min-h-full w-0.5 bg-yu-border-100"></csm-divider>
</template>

<script setup lang="ts">
defineProps<{
    vertical?: boolean;
}>();
</script>
