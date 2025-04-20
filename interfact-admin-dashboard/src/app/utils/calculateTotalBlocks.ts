import { Log } from '@/app/types/Firebase/LogMySql';

export const calculateTotalBlocks = (logs: Log[], intersectionId: string): [number, number] => {
    
  if (logs.length === 0) return [0, 0];

  // sort logs by timestamp to get the latest
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const latestTimestamp = new Date(sortedLogs[0].timestamp).getTime();
  // calculate milliseconds in day/week
  const oneDayAgo = latestTimestamp - 24 * 60 * 60 * 1000;
  const oneWeekAgo = latestTimestamp - 7 * 24 * 60 * 60 * 1000;

  let blockedDayLogs = 0;
  let blockedWeekLogs = 0;

  logs.forEach((log) => {
    const logTime = new Date(log.timestamp).getTime();
    const isSameIntersection = log.cameraid === intersectionId;
    const isBlocked = log.status === "BLOCKED";

    if (!isSameIntersection || !isBlocked) return;

    if (logTime >= oneDayAgo && logTime <= latestTimestamp) {
      blockedDayLogs++;
    }
    if (logTime >= oneWeekAgo && logTime <= latestTimestamp) {
      blockedWeekLogs++;
    }
  });

  return [blockedDayLogs, blockedWeekLogs];
};
