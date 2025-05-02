"use client";

import React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { usePercentChartDataDailyHourly } from '@/app/hooks/usePercentChartDataDailyHourly';
import { Log } from '@/app/types/Firebase/LogMySql';



import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

export interface HourlyChartDataPoint {
  hour: string;
  percent: number;
}

type Props = {
  logs: Log[];
  intersectionId: string;
  day: string;           
  onBack: () => void;    
};

const chartConfig = {
  percent: {
    label: 'Percentage',
    color: '#1D2022',
  },
} satisfies ChartConfig;

export function PercentChartDayHour({
  logs,
  intersectionId,
  day,
  onBack,
}: Props) {
  const data: HourlyChartDataPoint[] =
    usePercentChartDataDailyHourly(logs, intersectionId, day);

  return (
    <>
      <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
        <BarChart width={800} height={300} data={data}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="percent" fill="#1D2022" radius={4} />
        </BarChart>
      </ChartContainer>
    </>
  );
}
