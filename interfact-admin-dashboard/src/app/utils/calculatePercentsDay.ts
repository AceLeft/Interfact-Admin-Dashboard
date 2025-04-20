import { Log } from "../types/Firebase/LogMySql";

export interface DayDataPoint {
  day: string;
  percent: number;
}

const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const calculatePercentsByDay = (
  logs: Log[],
  intersectionId: string
): DayDataPoint[] => {
  const blockedCounts = Array(7).fill(0); // index 0 = Sunday

  const filteredLogs = logs.filter((log) => log.cameraid === intersectionId);

  filteredLogs.forEach((log) => {
    if (log.status === "BLOCKED") {
      const day = new Date(log.timestamp).getDay();
      blockedCounts[day]++;
    }
  });

  const totalBlocked = blockedCounts.reduce((sum, count) => sum + count, 0);

  return blockedCounts.map((count, dayIndex) => ({
    day: daysOfWeek[dayIndex],
    percent: totalBlocked === 0 ? 0 : parseFloat(((count / totalBlocked) * 100).toFixed(2)),
  }));
};