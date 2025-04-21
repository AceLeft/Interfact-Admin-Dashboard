import { Log } from '@/app/types/Firebase/LogMySql';

export const calculateTotalBlocks = (logs: Log[], intersectionId: string): [number, number] => {
  if (logs.length === 0) return [0, 0];

  const now = Date.now();
  const oneDayAgo = now - 24 * 60 * 60 * 1000;
  const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;

  let blockedDayLogs = 0;
  let blockedWeekLogs = 0;

  logs.forEach((log) => {
    const logTime = new Date(log.timestamp).getTime();
    const isSameIntersection = log.cameraid === intersectionId;
    const isBlocked = log.status === "BLOCKED";

    if (!isSameIntersection || !isBlocked) return;

    if (logTime >= oneDayAgo && logTime <= now) {
      blockedDayLogs++;
    }
    if (logTime >= oneWeekAgo && logTime <= now) {
      blockedWeekLogs++;
    }
  });

  return [blockedDayLogs, blockedWeekLogs];
};
