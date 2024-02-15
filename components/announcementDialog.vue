<template>
    <Dialog>
      <DialogTrigger>
        <BotButton button-text="Announcement" icon="mdi:megaphone-outline" />
      </DialogTrigger>
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Make an announcement!</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-end space-x-2 gap-2">
            <Textarea @update:model-value="updateAnnouncement" placeholder="Our bot has been experiencing an unexpected hurdle..." />
            <p class="text-muted-foreground text-sm select-none">{{ remainingChars }} chars. remaining</p>
          </div>
        <DialogFooter>
          <DialogClose>
            <Button type="submit" @click="$emit('submit:announcement', String(announcementData))">Submit</Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
const announcementData = ref<string | number>("");
const remainingChars = computed(() => 200 - String(announcementData.value).length);

const emits = defineEmits<{
  (e: 'submit:announcement', payload: string): void
}>()

function updateAnnouncement(event: string | number) {
  announcementData.value = event;
}
</script>