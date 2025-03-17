import { Log } from '@/app/types/Firebase/LogMySql';

export const calculateAverageBlockageTime = (logs: Log[], intersectionId: string) => {

    const filteredLogs: Log[] = logs.filter((log: Log) => log.cameraid === intersectionId);
    //sort ascending order (oldest first)
    const sortedLogs = filteredLogs.slice().sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    const blockageDurations = [];
    let avgDuration = 0;
    let blockageStart = null;
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const log = sortedLogs[i];
      if (log.status === "BLOCKED" && blockageStart === null) {
        // Start of blockage
        blockageStart = new Date(log.timestamp);
      }
      if (blockageStart && log.status === "OPEN") {
        // End of blockage
        const blockageEnd = new Date(log.timestamp);
        const duration = (blockageEnd.getTime() - blockageStart.getTime()) / 60000; // minutes
        avgDuration += duration;
        blockageDurations.push(duration);
        blockageStart = null; // reset
      }
    }
    avgDuration = Math.round(avgDuration / blockageDurations.length * 100) / 100
    
    return avgDuration;
}

