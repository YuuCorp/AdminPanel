export default defineEventHandler(async (event) => {
  const baseURL = "http://localhost:3030/api/v1/info";
  const url = `${baseURL}/logs`;
  return await $fetch<Log[]>(url, { headers: event.headers })
})
