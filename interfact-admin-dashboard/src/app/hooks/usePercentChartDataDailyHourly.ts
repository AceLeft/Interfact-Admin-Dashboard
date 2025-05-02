import { useMemo } from "react";
import { Log } from "../types/Firebase/LogMySql";
import { calculateHourPercentsDay, ChartDataPoint } from "../utils/calculateHourPercentDay";

export const usePercentChartDataDailyHourly = (
  logs: Log[],
  intersectionId: string,
  day: string,

): ChartDataPoint [] => {
  return useMemo(
    () => calculateHourPercentsDay(logs, intersectionId, day),
    [logs, intersectionId, day]
  );
};
