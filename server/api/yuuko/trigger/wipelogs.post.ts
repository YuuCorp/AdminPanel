export default defineEventHandler(async (event) => {
  const url = `${process.env.YUUKO_API_URL}/api/v1/trigger/wipe-logs`;
  return $fetch<{ message: string }>(url, { method: "POST", headers: event.headers });
})
