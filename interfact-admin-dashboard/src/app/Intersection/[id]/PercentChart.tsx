"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { Switch } from "@/components/ui/switch";
import { UploadSnapButton } from "@/components/UploadSnapButton";

import { PercentChartHour } from "@/components/PercentChartHour";
import { PercentChartDay } from "@/components/PercentChartDay";
import { PercentChartDayHour } from "@/components/PercentChartDayHour";
import { Log } from "@/app/types/Firebase/LogMySql";

type PercentChartProps = {
  logs: Log[];
  intersectionId: string;
  chartVersionPercent: boolean;
  onToggleVersion: (val: boolean) => void;
  onRefresh: () => void;
  snapshotChartData: any;
  selectedDay?: string | null;
  onSelectDay?: (day: string | null) => void;
};

export const PercentChart: React.FC<PercentChartProps> = ({
  logs,
  intersectionId,
  chartVersionPercent,
  onToggleVersion,
  onRefresh,
  snapshotChartData,
  selectedDay = null,
  onSelectDay = () => {},
}) => {
  if (!chartVersionPercent && selectedDay) {
    return (
      <div className="log-time-prediction shadow" style={{ position: 'relative' }}>
        <div className="log-time-prediction-header">
          <button
            onClick={() => {
              onSelectDay(null);
              onToggleVersion(false);
            }}
            className="text-sm mr-4">
            ← Back
          </button>
          <h1 className="flex-1">{selectedDay} Hourly Blocked %</h1>
          <button onClick={onRefresh} className="refresh-button ml-auto">
            <FontAwesomeIcon icon={faArrowsRotate} />
          </button>
        </div>
        <PercentChartDayHour
          logs={logs}
          intersectionId={intersectionId}
          day={selectedDay}
          onBack={() => {
            onSelectDay(null);
            onToggleVersion(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="log-time-prediction shadow" style={{ position: 'relative' }}>
      <div className="log-time-prediction-header">
        <h1 className="flex-1">
          {chartVersionPercent ? "Hourly Blocked %" : "Daily Blocked %"}
        </h1>
        <Switch checked={chartVersionPercent} onCheckedChange={onToggleVersion} />
        <button onClick={onRefresh} className="refresh-button mx-4">
          <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
        <UploadSnapButton data={snapshotChartData} />
      </div>

      {chartVersionPercent ? (
        <PercentChartHour logs={logs} intersectionId={intersectionId} />
      ) : (
        <PercentChartDay
          logs={logs}
          intersectionId={intersectionId}
          onBarClick={(day) => {
            onSelectDay(day);
            onToggleVersion(false);
          }}
        />
      )}
    </div>
  );
};
