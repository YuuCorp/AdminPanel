type API_name = "info" | "trigger";

type API_type<T> =
  T extends "info" ? { logs: Log[], announcements: Announcement[], stats: BotStats } :
  T extends "trigger" ? { message: string } :
  never;

export async function useYuukoAPI<T extends API_name>(type: T): Promise<API_type<T>>
export async function useYuukoAPI<T extends API_name>(type: T, api_path: string): Promise<API_type<T>>;
export async function useYuukoAPI<T extends API_name>(type: T, api_path: string, body: any): Promise<API_type<T>>;
export async function useYuukoAPI<T extends API_name>(type: T, api_path?: string, body?: any): Promise<API_type<T>> {
  const config = useRuntimeConfig();
  const apiURL = config.public.yuukoApiUrl;
  const user = unref(useUser());
  if (!user) throw new Error("User not logged in");
  const userHeader = { "Authorization": user.discordId };
  if (type === "info") {
    if (api_path && body) {
      return $fetch<{ message: string }>(`${apiURL}/api/v1/info/create-announcement`, {
        method: "POST", headers: userHeader, body
      }) as Promise<API_type<T>>;
    } else {
      const logs = await $fetch<Log[]>(`${apiURL}/api/v1/info/logs`, { headers: userHeader })
      const announcements = await $fetch<Announcement[]>(`${apiURL}/api/v1/info/announcements`, { headers: userHeader })
      const stats = await $fetch<BotStats>(`${apiURL}/api/v1/info/stats`, { headers: userHeader })
      return { logs, announcements, stats } as API_type<T>;
    }
  } else {
    const url = `${apiURL}/api/v1/trigger/${api_path}`;
    return $fetch<{ message: string }>(url, { method: "POST", headers: userHeader }) as Promise<API_type<T>>;
  }
}