export type Log = {
    date: string
    user: string
    info: string
}

export type Announcement = {
  id: number
  date: string
  createdAt: string
  updatedAt: string
  announcement: string
}

export type BotStats = {
    registered: number
    members: number
    servers: number
}

export type githubStats = {
    commits: number;
    stars: number;
    issues: number;
    lastCommit: string;
    lastUpdated: Date;
}