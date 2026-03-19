import { dbGet, dbSet } from "./db";

export interface PageView {
  path: string;
  timestamp: string;
  userAgent?: string;
  referer?: string;
}

export interface AnalyticsSummary {
  totalViews: number;
  todayViews: number;
  thisWeekViews: number;
  thisMonthViews: number;
  topPages: { path: string; views: number }[];
  viewsByDay: { date: string; views: number }[];
  topReferers: { referer: string; count: number }[];
}

export async function trackPageView(view: PageView): Promise<void> {
  const views = await dbGet<PageView[]>("analytics", []);
  views.push(view);
  // Keep last 10,000 entries
  const trimmed = views.slice(-10000);
  await dbSet("analytics", trimmed);
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const views = await dbGet<PageView[]>("analytics", []);
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthAgo = new Date(now.getTime() - 30 * 86400000).toISOString();

  const todayViews = views.filter((v) => v.timestamp.startsWith(today)).length;
  const thisWeekViews = views.filter((v) => v.timestamp >= weekAgo).length;
  const thisMonthViews = views.filter((v) => v.timestamp >= monthAgo).length;

  const pageCounts: Record<string, number> = {};
  views.forEach((v) => { pageCounts[v.path] = (pageCounts[v.path] || 0) + 1; });
  const topPages = Object.entries(pageCounts)
    .map(([path, count]) => ({ path, views: count }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  const dayCounts: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 86400000).toISOString().split("T")[0];
    dayCounts[date] = 0;
  }
  views.filter((v) => v.timestamp >= monthAgo).forEach((v) => {
    const date = v.timestamp.split("T")[0];
    if (dayCounts[date] !== undefined) dayCounts[date]++;
  });
  const viewsByDay = Object.entries(dayCounts).map(([date, count]) => ({ date, views: count }));

  const refCounts: Record<string, number> = {};
  views.filter((v) => v.referer && !v.referer.includes("albansbarnyard")).forEach((v) => {
    try {
      const host = new URL(v.referer!).hostname;
      refCounts[host] = (refCounts[host] || 0) + 1;
    } catch { /* skip */ }
  });
  const topReferers = Object.entries(refCounts)
    .map(([referer, count]) => ({ referer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return { totalViews: views.length, todayViews, thisWeekViews, thisMonthViews, topPages, viewsByDay, topReferers };
}
