export default defineEventHandler(async (event) => {
  const baseURL = "http://localhost:3030/api/v1/trigger";
  const url = `${baseURL}/wipe-logs`;
  return $fetch<{ message: string }>(url, { method: "POST", headers: event.headers });
})
