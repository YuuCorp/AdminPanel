export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = `${process.env.YUUKO_API_URL}/api/v1/info/create-announcement`;
  return $fetch<{ announcement: string, date: Date }>(url, { method: "POST", body, headers: event.headers });
})
