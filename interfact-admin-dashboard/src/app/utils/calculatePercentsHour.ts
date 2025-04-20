import { Log } from "../types/Firebase/LogMySql";

export interface ChartDataPoint {
  hour: string;
  percent: number;
}

const formatHourToAMPM = (hour: number): string => {
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${period}`;
};

export const calculatePercentsHour = (
  logs: Log[],
  intersectionId: string
): ChartDataPoint[] => {
  const percents: number[] = Array(24).fill(0);

  const filteredLogs = logs.filter((log) => log.cameraid === intersectionId);

  const logsByHour: Record<number, Log[]> = {};
  filteredLogs.forEach((log) => {
    const hour = new Date(log.timestamp).getHours();
    if (!logsByHour[hour]) {
      logsByHour[hour] = [];
    }
    logsByHour[hour].push(log);
  });

  for (const hourStr in logsByHour) {
    const hour = parseInt(hourStr, 10);
    const logsForHour = logsByHour[hour];
    const totalLogs = logsForHour.length;
    const blockedLogs = logsForHour.filter((log) => log.status === "BLOCKED").length;
    percents[hour] = totalLogs === 0 ? 0 : (blockedLogs / totalLogs) * 100;
  }

  return percents.map((percent, hour) => ({
    hour: formatHourToAMPM(hour),
    percent: parseFloat(percent.toFixed(2)),
  }));
};
