"use client";

import { useParams } from 'next/navigation';
import { useUserFeedback } from '@/app/hooks/useUserFeedback';
import { useIntersections } from '@/app/hooks/useIntersections';
import { useState, useEffect } from 'react';
import { Intersection } from '@/app/types/Firebase/intersectionTypeFB';
import { useLogs } from '@/app/hooks/useLogs';
import { calculateTotalBlocks } from '@/app/utils/calculateTotalBlocks';
import { calculateAverageBlockageTime } from '@/app/utils/calculateAverageBlockageTime';
import { usePercentChartDataHourly } from '@/app/hooks/usePercentChartDataHourly';
import { usePercentChartDataDaily } from '@/app/hooks/usePercentChartDataDaily';
import { IntersectionData } from './IntersectionData';
import { ReportsWidget } from './ReportsWidget';
import { LogsWidget } from './LogsWidget';
import { BlockStats } from './BlockStats';
import { PercentChart } from './PercentChart';

const LOGS_PER_PAGE = 250;

const IntersectionPage = () => {
  const userFeedback = useUserFeedback();
  const intersections = useIntersections();
  const { logs, loading, error, refetch } = useLogs();
  const params = useParams();

  const [reports, setReports] = useState<string[] | null>([]);
  const [intersection, setIntersection] = useState<Intersection | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blockedDayTime, setBlockedDayTime] = useState<number>(0);
  const [blockedWeekTime, setBlockedWeekTime] = useState<number>(0);
  const [avgBlockTime, setAvgBlockTime] = useState<number>(0);
  const [chartVersionPercent, setChartVersionPercent] = useState<boolean>(true);

  // selectedDay remains until explicitly cleared by Back button
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const percentChartDataHourly = usePercentChartDataHourly(
    logs,
    intersection?.id || ''
  );
  const percentChartDataDaily = usePercentChartDataDaily(
    logs,
    intersection?.id || ''
  );

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  // toggle view without clearing selectedDay
  const handleToggleVersion = (val: boolean) => {
    setChartVersionPercent(val);
  };

  // Load data on mount
  useEffect(() => {
    if (typeof refetch === 'function') {
      refetch();
    }
  }, [refetch]);

  // Set intersection when id or intersections change
  useEffect(() => {
    if (id) {
      const found = intersections.find(item => item.id === id);
      if (found) setIntersection(found);
    }
  }, [id, intersections]);

  // Calculate block stats and user reports
  useEffect(() => {
    if (logs.length > 0 && intersection) {
      const [dayBlocks, weekBlocks] = calculateTotalBlocks(
        logs,
        intersection.id
      );
      setBlockedDayTime(dayBlocks);
      setBlockedWeekTime(weekBlocks);
      setAvgBlockTime(
        calculateAverageBlockageTime(logs, intersection.id)
      );

      const newReports = userFeedback.flatMap(u =>
        Array.isArray(u.reports)
          ? u.reports.filter(r =>
              logs.find(
                l => String(l.logid).trim() === String(r).trim()
              )?.cameraid === id
            )
          : []
      );
      setReports(newReports);

      setCurrentPage(1);
    }
  }, [logs, intersection, userFeedback, id]);

  // Async retrain data call
  const retrainData = async () => {
    await fetch('/api/python');
  };

  if (!id) return <div>No valid ID provided.</div>;

  // Filter & paginate logs
  const filteredLogs = intersection
    ? logs.filter(l => l.cameraid === intersection.id)
    : [];
  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);
  const currentLogs = filteredLogs.slice(
    (currentPage - 1) * LOGS_PER_PAGE,
    currentPage * LOGS_PER_PAGE
  );

  // Snapshot payload
  const snapshotData = {
    hourly: percentChartDataHourly.map(({ hour, percent }) => ({ label: hour, percent })),
    daily: percentChartDataDaily.map(({ day, percent }) => ({ label: day, percent })),
  };

  return (
    <>
      <IntersectionData intersection={intersection} id={id} />
      <div className='intersection-info-2'>
        <ReportsWidget
          reports={reports}
          logs={logs}
          retrainData={retrainData}
        />
        <LogsWidget
          intersection={intersection}
          logs={filteredLogs}
          loading={loading}
          error={error}
          currentLogs={currentLogs}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={page =>
            setCurrentPage(Math.max(1, Math.min(page, totalPages)))
          }
        />
      </div>
      <div className='intersection-info-3'>
        <BlockStats
          avgBlockTime={avgBlockTime}
          blockedDayTime={blockedDayTime}
          blockedWeekTime={blockedWeekTime}
        />
        <PercentChart
          logs={logs}
          intersectionId={intersection?.id || ''}
          chartVersionPercent={chartVersionPercent}
          onToggleVersion={handleToggleVersion}
          onRefresh={refetch}
          snapshotChartData={snapshotData}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
        />
      </div>
    </>
  );
};

export default IntersectionPage;
