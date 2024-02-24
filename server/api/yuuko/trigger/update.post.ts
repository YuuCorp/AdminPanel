export default defineEventHandler(async (event) => {
  const baseURL = "http://localhost:3030/api/v1/trigger";
  const url = `${baseURL}/update`;
  return $fetch<BotStats>(url, { method: "POST" });
})
