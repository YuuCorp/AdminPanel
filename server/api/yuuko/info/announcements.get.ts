export default defineEventHandler(async (event) => {
  const baseURL = "http://localhost:3030/api/v1/info";
  const url = `${baseURL}/announcements`;
  return await $fetch<Announcement[]>(url, { headers: event.headers })
})
