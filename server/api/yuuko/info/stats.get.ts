export default defineEventHandler(async (event) => {
    const baseURL = "http://localhost:3030/api/v1/info";
    const url = `${baseURL}/stats`;
    return await $fetch<BotStats>(url)
})
