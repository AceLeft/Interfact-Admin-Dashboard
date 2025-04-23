import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { Switch } from '@/components/ui/switch';
import { UploadSnapButton } from '@/components/UploadSnapButton';
import { PercentChartHour } from '@/components/PercentChartHour';
import { PercentChartDay } from '@/components/PercentChartDay';

type PercentChartProps = {
  logs: any[];
  intersectionId: string;
  chartVersionPercent: boolean;
  onToggleVersion: (val: boolean) => void;
  onRefresh: () => void;
  snapshotChartData: any;
};

export const PercentChart: React.FC<PercentChartProps> = ({ logs, intersectionId, chartVersionPercent, onToggleVersion, onRefresh, snapshotChartData }) => (
  <div className='log-time-prediction shadow' style={{ position: 'relative' }}>
    <div className='log-time-prediction-header'>
      <h1>{chartVersionPercent ? 'Hourly Blocked Percentage' : 'Daily Blocked Percentage'}</h1>
      <Switch checked={chartVersionPercent} onCheckedChange={onToggleVersion} />
      <button onClick={onRefresh} className='refresh-button'>
        <FontAwesomeIcon icon={faArrowsRotate} />
      </button>
      <UploadSnapButton data={snapshotChartData} />
    </div>
    {chartVersionPercent ? (
      <PercentChartHour logs={logs} intersectionId={intersectionId} />
    ) : (
      <PercentChartDay logs={logs} intersectionId={intersectionId} />
    )}
  </div>
);
