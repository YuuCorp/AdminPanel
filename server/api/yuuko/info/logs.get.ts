export default defineEventHandler(async (event) => {
  const url = `${process.env.YUUKO_API_URL}/api/v1/info/logs`;
  return await $fetch<Log[]>(url, { headers: event.headers })
})
