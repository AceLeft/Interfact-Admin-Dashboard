import { Log } from '@/app/types/Firebase/LogMySql';

export const calculateTotalBlocks = (logs: Log[], intersectionId: string) => {

    const dayLogs = logs.slice(0, 1440);
    const weekLogs = logs.slice(0, 1440 * 7);

    const filteredDayLogs: Log[] = dayLogs.filter((log: Log) => log.cameraid === intersectionId);
    const blockedDayLogs: number = filteredDayLogs.filter((log: Log) => log.status === "BLOCKED").length;

    const filteredWeekLogs: Log[] = weekLogs.filter((log: Log) => log.cameraid === intersectionId);
    const blockedWeekLogs: number = filteredWeekLogs.filter((log: Log) => log.status === "BLOCKED").length;

    return [blockedDayLogs, blockedWeekLogs];
}
