import { useMemo } from "react";
import { Log } from "../types/Firebase/LogMySql";
import { calculatePercentsHour, ChartDataPoint } from "../utils/calculatePercentsHour";

export const usePercentChartDataHourly = (
  logs: Log[],
  intersectionId: string
): ChartDataPoint[] => {
  return useMemo(() => {
    return calculatePercentsHour(logs, intersectionId);
  }, [logs, intersectionId]);
};
