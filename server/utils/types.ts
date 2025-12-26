/**
 * Discord API response to calling the `/api/users/@me` endpoint
*/
export type DiscordResponse = {
  id: string
  username: string
  avatar: string
  discriminator: string
  public_flags: number
  premium_type: number
  flags: number
  banner: any
  accent_color: number
  global_name: string
  avatar_decoration_data: any
  banner_color: string
  mfa_enabled: boolean
  locale: string
}

export type AniListQueryResponse = {
  data: {
    "Viewer": {
      name: string,
      id: number
    }
  }
};