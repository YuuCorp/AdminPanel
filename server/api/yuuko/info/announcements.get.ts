export default defineEventHandler(async (event) => {
  const url = `${process.env.YUUKO_API_URL}/api/v1/info/announcements`;
  return await $fetch<Announcement[]>(url, { headers: event.headers })
})
