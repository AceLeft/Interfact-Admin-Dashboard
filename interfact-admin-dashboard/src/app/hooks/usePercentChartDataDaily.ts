import { useMemo } from "react";
import { Log } from "../types/Firebase/LogMySql";
import { calculatePercentsByDay, DayDataPoint } from "../utils/calculatePercentsDay";

export const usePercentChartDataDaily = (
  logs: Log[],
  intersectionId: string
): DayDataPoint[] => {
  return useMemo(() => {
    return calculatePercentsByDay(logs, intersectionId);
  }, [logs, intersectionId]);
};
