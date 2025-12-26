<template>
    <button
        class="bg-yu-background-50 w-40 h-10 border cursor-pointer transition-colors duration-75 hover:bg-yu-background-100 border-yu-border-200 rounded-lg uppercase font-medium text-sm flex items-center justify-center gap-2"
    >
        <Icon
            :name="props.icon"
            class="text-yu-primary fill-yu-primary w-5 h-5"
        />
        <p>{{ props.buttonText }}</p>
    </button>
</template>

<script lang="ts" setup>
const props = defineProps<{
    buttonText: string;
    icon: string;
}>();
</script>
