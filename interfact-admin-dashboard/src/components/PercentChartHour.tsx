"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { usePercentChartDataHourly } from "@/app/hooks/usePercentChartDataHourly";
import { Log } from "@/app/types/Firebase/LogMySql";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";


type Props = {
  logs: Log[];
  intersectionId: string;
};

const chartConfig = {
  percent: {
    label: "Percentage",
    color: "#1D2022", 
  },
} satisfies ChartConfig;

export function PercentChartHour({ logs, intersectionId }: Props) {
  const chartData = usePercentChartDataHourly(logs, intersectionId);

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart width={800} height={300} data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="hour"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="percent" fill="#1D2022" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
