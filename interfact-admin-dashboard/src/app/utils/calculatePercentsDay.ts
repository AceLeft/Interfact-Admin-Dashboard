import { Log } from "../types/Firebase/LogMySql";

export interface DayDataPoint {
  day: string;
  percent: number; 
}

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const calculatePercentsByDay = (
  logs: Log[],
  intersectionId: string
): DayDataPoint[] => {
  const blockedLogs = logs.filter(
    (l) =>
      String(l.cameraid).trim() === String(intersectionId).trim() &&
      String(l.status).trim().toUpperCase() === "BLOCKED"
  );

  const blockedCounts = Array(7).fill(0);
  blockedLogs.forEach((log) => {
    const weekday = new Date(log.timestamp).getDay();
    blockedCounts[weekday]++;
  });

  const totalBlocked = blockedCounts.reduce((sum, c) => sum + c, 0);

  return daysOfWeek.map((dayName, idx) => ({
    day: dayName,
    percent:
      totalBlocked === 0
        ? 0
        : parseFloat(((blockedCounts[idx] / totalBlocked) * 100).toFixed(2)),
  }));
};
