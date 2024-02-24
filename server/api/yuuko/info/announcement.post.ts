export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const baseURL = "http://localhost:3030/api/v1/info";
  const url = `${baseURL}/create-announcement`;
  return $fetch<{ announcement: string, date: Date }>(url, { method: "POST", body });
})
