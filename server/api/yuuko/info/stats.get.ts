export default defineEventHandler(async (event) => {
    const url = `${process.env.YUUKO_API_URL}/api/v1/info/stats`;
    return await $fetch<BotStats>(url, { headers: event.headers })
})
