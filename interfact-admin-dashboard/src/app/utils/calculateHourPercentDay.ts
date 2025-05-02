import { Log } from "../types/Firebase/LogMySql";

export interface ChartDataPoint {
  hour: string;
  percent: number;
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const formatHourToAMPM = (hour: number): string => {
  const period = hour < 12 ? "AM" : "PM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12} ${period}`;
};

export const calculateHourPercentsDay = (
  logs: Log[],
  intersectionId: string,
  day: string,          
): ChartDataPoint[] => {
  // Convert weekday name 
  const targetDayIndex = WEEKDAYS.indexOf(day);
  if (targetDayIndex === -1) {
    throw new Error(`Invalid weekday "${day}". Use one of: ${WEEKDAYS.join(", ")}`);
  }

  // filter logs by cameraid AND weekday
  const filtered = logs.filter((log) => {
    if (log.cameraid !== intersectionId) return false;
    const logDate = new Date(log.timestamp);
    return logDate.getDay() === targetDayIndex;
  });

  // group filtered logs by hour
  const countsByHour: Record<number, { total: number; blocked: number }> = {};
  filtered.forEach((log) => {
    const hr = new Date(log.timestamp).getHours();
    if (!countsByHour[hr]) {
      countsByHour[hr] = { total: 0, blocked: 0 };
    }
    countsByHour[hr].total += 1;
    if (log.status === "BLOCKED") {
      countsByHour[hr].blocked += 1;
    }
  });

  return Array.from({ length: 24 }, (_, hour) => {
    const { total = 0, blocked = 0 } = countsByHour[hour] || {};
    const pct = total > 0 ? (blocked / total) * 100 : 0;
    return {
      hour: formatHourToAMPM(hour),
      percent: parseFloat(pct.toFixed(2)),
    };
  });
};
