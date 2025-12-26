<template>
    <div 
        class="flex items-center gap-3 p-3 rounded-lg border transition-colors"
        :class="[
            completed ? 'bg-primary/5 border-primary/20' : 'bg-muted/30',
            disabled ? 'opacity-50' : ''
        ]"
    >
        <!-- Step indicator -->
        <div 
            class="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium"
            :class="completed ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'"
        >
            <Icon v-if="completed" name="mdi:check" class="w-4 h-4" />
            <span v-else>{{ step }}</span>
        </div>

        <!-- Service icon and info -->
        <div class="flex items-center gap-2 flex-1 min-w-0">
            <Icon 
                :name="service === 'discord' ? 'carbon:logo-discord' : 'simple-icons:anilist'" 
                class="w-5 h-5 flex-shrink-0"
                :class="completed ? 'text-primary' : 'text-muted-foreground'"
            />
            <div class="min-w-0 flex-1">
                <p class="text-sm font-medium truncate">
                    {{ username || label }}
                </p>
                <p v-if="!username" class="text-xs text-muted-foreground">
                    Not connected
                </p>
            </div>
        </div>

        <!-- Action button -->
        <button
            @click="handleClick"
            :disabled="disabled"
            class="flex-shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors disabled:cursor-not-allowed"
            :class="[
                username 
                    ? 'bg-muted hover:bg-muted/80 text-muted-foreground' 
                    : 'bg-primary hover:bg-primary/90 text-primary-foreground',
                disabled ? 'opacity-50' : ''
            ]"
        >
            {{ username ? 'Disconnect' : 'Connect' }}
        </button>
    </div>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";

const props = defineProps<{
    step: number;
    service: "discord" | "anilist";
    label: string;
    username?: string;
    completed: boolean;
    disabled?: boolean;
}>();

const emit = defineEmits<{
    (e: "logout"): void;
}>();

async function handleClick() {
    if (props.disabled) return;

    if (props.username) {
        // Logout
        await $fetch(`/api/oauth/${props.service}/logout`, { method: "POST" });
        emit("logout");
        toast.success(`Disconnected from ${props.label}`);
    } else {
        // Login
        window.location.href = `/api/oauth/${props.service}`;
    }
}
</script>
