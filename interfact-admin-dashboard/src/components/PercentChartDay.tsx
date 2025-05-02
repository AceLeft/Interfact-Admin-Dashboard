"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePercentChartDataDaily } from "@/app/hooks/usePercentChartDataDaily";
import { Log } from "@/app/types/Firebase/LogMySql";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export interface DailyChartDataPoint {
  day: string;    
  percent: number;
}

type Props = {
  logs: Log[];
  intersectionId: string;
  onBarClick?: (day: string) => void;  
};

const chartConfig = {
  percent: {
    label: "Percentage",
    color: "#1D2022",
  },
} satisfies ChartConfig;

export function PercentChartDay({ logs, intersectionId, onBarClick }: Props) {
  const data: DailyChartDataPoint[] = usePercentChartDataDaily(logs, intersectionId);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart width={800} height={300} data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar
          dataKey="percent"
          fill="#1D2022"
          radius={4}
          onClick={(e: any) => {
            onBarClick?.(e.payload.day as string);
          }}
        />
      </BarChart>
    </ChartContainer>
  );
}
