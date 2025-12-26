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
            <Textarea v-model:model-value="announcementData" placeholder="Our bot has been experiencing an unexpected hurdle..." />
            <p class="text-muted-foreground text-sm select-none">{{ remainingChars }} chars. remaining</p>
          </div>
        <DialogFooter>
          <Button v-if="!String(announcementData).length" disabled>Submit</Button>
          <DialogClose v-else>
            <Button type="submit" @click="submitAnnouncement">Submit</Button>
          </DialogClose>
        </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'submit:announcement', payload: Promise<any>): void
}>()

const announcementData = defineModel<string | number>({ default: '' });
const remainingChars = computed(() => 200 - String(announcementData.value).length);

function submitAnnouncement() {
  emits('submit:announcement', useYuukoAPI('info', "announcement", { announcement: String(announcementData.value), date: new Date().toISOString() }));
  announcementData.value = '';
}

</script>