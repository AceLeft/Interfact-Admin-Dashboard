'use client';
import { useParams } from 'next/navigation';
import { useUserFeedback } from '@/app/hooks/useUserFeedback';
import { useIntersections } from '@/app/hooks/useIntersections';
import { useState, useEffect } from 'react';
import { Intersection } from '@/app/types/Firebase/intersectionTypeFB';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { useLogs } from '@/app/hooks/useLogs';
import { calculateHourlyScores, HourlyScores } from '@/app/utils/calculateHourlyScores';
import { Log } from '@/app/types/Firebase/LogMySql';
import { calculateTotalBlocks } from '@/app/utils/calculateTotalBlocks';
import { calculateAverageBlockageTime } from '@/app/utils/calculateAverageBlockageTime';
import { deleteFromDB } from '@/app/DAOs/Firebase/intersectionsDAO';
import { confirmReport } from '@/app/utils/intersection/confirmReport';
import { denyReport } from '@/app/utils/intersection/denyReport';
import { getTimeColor } from '@/app/utils/intersection/getTimeColor';
import { ReportComponent } from './reportComponent';


const LOGS_PER_PAGE = 250;

const IntersectionPage = () => {
  const userFeedback = useUserFeedback();
  const intersections = useIntersections();
  const { logs, loading, error } = useLogs();
  const params = useParams();
  const [reports, setReports] = useState<string[] | null>([]);
  const [hourlyScores, setHourlyScores] = useState<HourlyScores>({});
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [hoveredPeriod, setHoveredPeriod] = useState<"AM" | "PM" | null>(null);
  const [intersection, setIntersection] = useState<Intersection | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blockedDayTime, setBlockedDayTime] = useState<number>(1);
  const [blockedWeekTime, setBlockedWeekTime] = useState<number>(1);
  const [avgBlockTime, setAvgBlockTime] = useState<number>(1);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  useEffect(() => {
    if (id) {
      const intersectionFound: Intersection | undefined = intersections.find((item) => item.id === id);
      if (intersectionFound) {
        setIntersection(intersectionFound);
      }
    }
  }, [id, intersections]);

  useEffect(() => {
    if (logs.length > 0 && intersection) {
      const scores: HourlyScores = calculateHourlyScores(logs, intersection.id);
      setHourlyScores(scores);
    }
  }, [logs, intersection]);

  useEffect(() => {
    if (logs.length > 0 && intersection) {
      const [blockedDayTime, blockedWeekTime] = calculateTotalBlocks(logs, intersection.id);
      setBlockedDayTime(blockedDayTime);
      setBlockedWeekTime(blockedWeekTime);
    }
  }, [logs, intersection]);

  useEffect(() => {
    if (logs.length > 0 && intersection) {
      const avgBlock = calculateAverageBlockageTime(logs, intersection.id);
      setAvgBlockTime(avgBlock)
    }
  }, [logs, intersection]);

  // Reset page when logs or intersection change
  useEffect(() => {
    setCurrentPage(1);
  }, [intersection, logs]);

  if (!id) {
    return <div>No valid ID provided.</div>;
  }

  const getReports = (): string[] => {
    return userFeedback.flatMap(user => {
        if (Array.isArray(user.reports)) {
            return user.reports.filter((reportLog : string) => {
                // Only get reports for THIS intersection
                
                const logItem = logs.find(log => String(log.logid).trim() === String(reportLog).trim());
                return logItem?.cameraid === id
        });
        }
        return [];
    });
  };

  const retrainData = async () => { 
    await fetch('/api/python', { method: 'GET',});
  };



  useEffect(() => {
    if (userFeedback.length > 0 && logs.length > 0) {
      setReports(getReports());
    }
  }, [userFeedback, logs]);



  // Filter logs for the current intersection
  const filteredLogs = intersection ? logs.filter(log => log.cameraid === intersection.id) : [];
  const totalPages = Math.ceil(filteredLogs.length / LOGS_PER_PAGE);
  const currentLogs = filteredLogs.slice((currentPage - 1) * LOGS_PER_PAGE, currentPage * LOGS_PER_PAGE);

  return (
    <div>
      <div className='intersection-info'>
        <div className='intersection-info-left shadow'>
          <h1 className='intersection-info-name shadow'>{intersection ? intersection.name : ""} <span>({id})</span></h1>
          <img src={intersection ? intersection.imagepath || "/no-image.webp" : "/no-image.webp" }/>
        </div>
        <div className='intersection-info-right shadow'>
          <h1>Camera Details</h1>
          <div>Id | <span>{intersection ? intersection.id : ""}</span></div>
          <div>Imagepath | <span>{intersection ? intersection.imagepath : ""}</span></div>
          <div>Latitude | <span>{intersection ? intersection.latitude : ""}</span></div>
          <div>Longitude | <span>{intersection ? intersection.longitude : ""}</span></div>
          <div>Name | <span>{intersection ? intersection.name : ""}</span></div>
          <div>Status | <span>{intersection ? intersection.status : ""}</span></div>
          <div>Timestamp | <span>{intersection ? intersection.timestamp : ""}</span></div>
        </div>
      </div>
      <div className="intersection-info-2">
        <div className='intersection-reports shadow'>
          <h1>Reports Received <span>{reports?.length || "-"}</span></h1>
          {reports && reports.length > 0 ? (
            reports.map((report : string, index) => {
              const logItem = logs.find(log => String(log.logid).trim() === String(report).trim());
              return (
                <ReportComponent report={report} logItem={logItem} index={index}></ReportComponent>
              );
            })
          ) : (
            <p>No reports found for this intersection.</p>
          )}
          <button onClick={retrainData}>Retrain data</button>
        </div>
        <div className='intersection-logs shadow'>
          <h1>Camera Logs</h1>
          <div className='pagination-controls'>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className='p-button-1'>
              Previous
            </button>
            <span className='p-span'>Page {currentPage} of {totalPages} </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className='p-button-1'>
              Next
            </button>
          </div>
          <div className='intersection-logs-list'>
            {loading && <p>Loading logs...</p>}
            {error && <p className="error">{error}</p>}
            {intersection ? (
              logs.length > 0 ? (
                filteredLogs.length > 0 ? (
                  <div className="log-container">
                    {currentLogs.map((log, index) => (
                      <div key={index} className="log-entry">
                        <div className="log-row"><span className="log-label">Log ID:</span> {log.logid}</div>
                        <div className="log-row"><span className="log-label">Camera ID:</span> {log.cameraid}</div>
                        <div className="log-row"><span className="log-label">Timestamp:</span> {new Date(log.timestamp).toLocaleString()}</div>
                        <div className="log-row"><span className="log-label">Filename:</span> {log.filename}</div>
                        <div className="log-row"><span className="log-label">Status:</span> {log.status}</div>
                        <div className="log-row"><span className="log-label">Path:</span> {log.path}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p>No logs available for this intersection.</p>
                )
              ) : (
                <p>No logs available.</p>
              )
            ) : (
              <p>Loading intersection data...</p>
            )}
          </div>
        </div>
      </div>
      <div className='intersection-info-3'>
        <div className='log-overall-time shadow'>
        <div className='total-block-time'><h1>Average Time Blocked:</h1> <h2>{avgBlockTime} minutes</h2></div>
            <div className='total-block-time'><h1>Total Time Blocked (Last 24 hours):</h1> <h2>{blockedDayTime} minutes</h2></div>
            <div className='total-block-time'><h1>Total Time Blocked (Last Week):</h1> <h2>{blockedWeekTime} minutes</h2></div>
        </div>
        <div className='log-time-prediction shadow' style={{ position: 'relative' }}>
          {(() => {
            const times = [
              "12:00", "1:00", "2:00", "3:00", "4:00", "5:00",
              "6:00", "7:00", "8:00", "9:00", "10:00", "11:00"
            ];
            return (
              <>
              <div className="score-display">
                  {hoveredHour !== null && hourlyScores[hoveredHour] !== undefined ? (
                    <p>
                      {hoveredHour < 12 ? times[hoveredHour] : times[hoveredHour - 12]}{" "}
                      {hoveredHour < 12 ? "AM" : "PM"} has a blocked score of [ {hourlyScores[hoveredHour]} ]
                    </p>
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </div>
                <div className="time-container">
                  <div className='time-am'>
                    <div className="times-row">
                      {times.map((time, idx) => {
                        const actualHour = idx + 12;
                        const minHeight = 55;
                        const maxHeight = 230;
                        const score = hourlyScores[actualHour];
                        const normalizedHeight = minHeight + (score / 9) * (maxHeight - minHeight);
                        const heightPx = `${normalizedHeight}px`;
                        return (
                          <div
                            key={`pm-${time}`}
                            className="time"
                            onMouseEnter={() => { setHoveredHour(actualHour); setHoveredPeriod("PM"); }}
                            onMouseLeave={() => { setHoveredHour(null); setHoveredPeriod(null); }}
                            style={{
                              borderColor: hourlyScores[actualHour] !== undefined
                                ? getTimeColor(hourlyScores[actualHour])
                                : 'inherit',
                              height: hourlyScores[actualHour] !== undefined
                              ? heightPx
                              : 'auto'
                            }}>
                            <div className='time-text'>
                              <strong>{time}</strong>
                              <strong>PM</strong>
                            </div>
                          </div>
                        );
                      })}
                      <div className='separate-bar'></div>
                      {times.map((time, idx) => {
                        const actualHour = idx;
                        const minHeight = 55;
                        const maxHeight = 230;
                        const score = hourlyScores[actualHour];
                        const normalizedHeight = minHeight + (score / 9) * (maxHeight - minHeight);
                        const heightPx = `${normalizedHeight}px`;
                        return (
                          <div
                            key={`am-${time}`}
                            className="time"
                            onMouseEnter={() => { setHoveredHour(actualHour); setHoveredPeriod("AM"); }}
                            onMouseLeave={() => { setHoveredHour(null); setHoveredPeriod(null); }}
                            style={{
                              borderColor: hourlyScores[actualHour] !== undefined
                                ? getTimeColor(hourlyScores[actualHour])
                                : 'inherit',
                              height: hourlyScores[actualHour] !== undefined
                                ? heightPx
                                : 'auto'
                            }}>
                            <div className='time-text'>
                              <strong>{time}</strong>
                              <strong>AM</strong>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="time-pm">
                    <div className="times-row">
                      
                    </div>
                  </div>
                </div>
                
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default IntersectionPage;
