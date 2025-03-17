import { Log } from '@/app/types/Firebase/LogMySql';

export interface HourlyScores {
  [hour: number]: number;
}

export const calculateHourlyScores = (logs: Log[], intersectionId: string): HourlyScores => {
  //initialize scores for each hour (0 to 23)
  const scores: HourlyScores = {};
  for (let hour = 0; hour < 24; hour++) {
    scores[hour] = 0;
  }

  //filter logs for intersection
  const filteredLogs: Log[] = logs.filter((log: Log) => log.cameraid === intersectionId);

  //group logs by hour
  const logsByHour: Record<number, Log[]> = {};
  filteredLogs.forEach((log: Log) => {
    const hour: number = new Date(log.timestamp).getHours();
    if (!logsByHour[hour]) {
      logsByHour[hour] = [];
    }
    logsByHour[hour].push(log);
  });

  //compute the blocked ratio per hour and determine min and max ratios
  const hourRatios: Record<number, number> = {};
  let minRatio = Infinity;
  let maxRatio = -Infinity;

  for (const hourStr in logsByHour) {
    const hour: number = parseInt(hourStr, 10);
    const logsForHour: Log[] = logsByHour[hour];
    const totalLogs: number = logsForHour.length;
    const blockedLogs: number = logsForHour.filter((log: Log) => log.status === "BLOCKED").length;
    const ratio: number = totalLogs > 0 ? blockedLogs / totalLogs : 0;
    hourRatios[hour] = ratio;
    if (ratio < minRatio) {
      minRatio = ratio;
    }
    if (ratio > maxRatio) {
      maxRatio = ratio;
    }
  }

  //compare each hour's ratio to the overall min/max and normalize to a score between 1 and 10
  for (let hour = 0; hour < 24; hour++) {
    //0 if no logs
    const ratio = (hourRatios[hour] !== undefined) ? hourRatios[hour] : 0;
    if (maxRatio === minRatio || minRatio === Infinity) {
      //if all hours have the same ratio or no logs
      
      scores[hour] = Math.floor(ratio * 10);
    } else {
      // Normalize the ratio to yield a value between 0 and 1
      const normalized = (ratio - minRatio) / (maxRatio - minRatio);
      
      scores[hour] = Math.floor(normalized * 10);
    }
  }
  return scores;
};
