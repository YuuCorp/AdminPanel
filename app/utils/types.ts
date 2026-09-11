export type BotStatsData = Awaited<
    ReturnType<typeof useYuukoAPI<"/api/v1/info/stats">>
>;
export type AnnouncementsData = Awaited<
    ReturnType<typeof useYuukoAPI<"/api/v1/info/announcements">>
>;
export type LogsData = Awaited<ReturnType<typeof useYuukoAPI<"/api/v1/info/logs">>>;

export type githubStats = {
    commits: number;
    stars: number;
    issues: number;
    lastCommit: string;
    lastUpdated: Date;
}