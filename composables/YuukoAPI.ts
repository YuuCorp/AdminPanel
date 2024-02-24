type API_name = "info" | "trigger";

type API_type<T> = 
  T extends "info" ? { logs: Log[], announcements: Announcement[], stats: BotStats } :
  T extends "trigger" ? Promise<any> :
  never;

export async function useYuukoAPI<T extends API_name>(type: T): Promise<API_type<T>>
export async function useYuukoAPI<T extends API_name>(type: T, api_path: string): Promise<API_type<T>>;
export async function useYuukoAPI<T extends API_name>(type: T, api_path: string, body: any): Promise<API_type<T>>;
export async function useYuukoAPI<T extends API_name>(type: T, api_path?: string, body?: any): Promise<API_type<T>> {
  if(type === "info") {
    if (api_path && body) {
      const baseURL = "/api/yuuko/info";
      const url = `${baseURL}/${api_path}`;
      return $fetch<{ message: string }>(url, { method: "POST", body }) as API_type<T>;
    } else {
      const logs = await $fetch("/api/yuuko/info/logs")
      const announcements = await $fetch("/api/yuuko/info/announcements")
      const stats = await $fetch("/api/yuuko/info/stats")
      return { logs, announcements, stats } as API_type<T>;
    }
  } else {
    const baseURL = "/api/yuuko/trigger";
    const url = `${baseURL}/${api_path}`;
    return $fetch<{ message: string }>(url, { method: "POST" }) as API_type<T>;
  }
}