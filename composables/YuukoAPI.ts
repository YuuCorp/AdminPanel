type API_name = "info" | "trigger";

type API_type<T> =
  T extends "info" ? { logs: Log[], announcements: Announcement[], stats: BotStats } :
  T extends "trigger" ? { message: string } :
  never;

export async function useYuukoAPI<T extends API_name>(type: T): Promise<API_type<T>>
export async function useYuukoAPI<T extends API_name>(type: T, api_path: string): Promise<API_type<T>>;
export async function useYuukoAPI<T extends API_name>(type: T, api_path: string, body: any): Promise<API_type<T>>;
export async function useYuukoAPI<T extends API_name>(type: T, api_path?: string, body?: any): Promise<API_type<T>> {
  const user = unref(useUser());
  if (!user) throw new Error("User not logged in");
  const userHeader = { "Authorization": user.discordId };
  if (type === "info") {
    if (api_path && body) {
      const baseURL = "/api/yuuko/info";
      const url = `${baseURL}/${api_path}`;
      return $fetch<{ message: string }>(url, {
        method: "POST", headers: userHeader, body
      }) as Promise<API_type<T>>;
    } else {
      const logs = await $fetch("/api/yuuko/info/logs", { headers: userHeader })
      const announcements = await $fetch("/api/yuuko/info/announcements", { headers: userHeader })
      const stats = await $fetch("/api/yuuko/info/stats", { headers: userHeader })
      return { logs, announcements, stats } as API_type<T>;
    }
  } else {
    const baseURL = "/api/yuuko/trigger";
    const url = `${baseURL}/${api_path}`;
    return $fetch<{ message: string }>(url, { method: "POST", headers: userHeader }) as Promise<API_type<T>>;
  }
}