'use client';
import { useParams } from 'next/navigation';
import { useUserFeedback } from '@/app/hooks/useUserFeedback';
import { useIntersections } from '@/app/hooks/useIntersections';
import { useState, useEffect } from 'react';
import { Report } from '@/app/types/Firebase/reportFB';
import { Intersection } from '@/app/types/Firebase/intersectionTypeFB';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { faThumbsDown } from '@fortawesome/free-solid-svg-icons';
import { collection, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { dbFB } from '../../../../FirebaseConfig';
import { useLogs } from '@/app/hooks/useLogs';
import { calculateHourlyScores, HourlyScores } from '@/app/utils/calculateHourlyScores';
import { Log } from '@/app/types/Firebase/LogMySql';

const LOGS_PER_PAGE = 250;

const IntersectionPage = () => {
  const userFeedback = useUserFeedback();
  const intersections = useIntersections();
  const { logs, loading, error } = useLogs();
  const params = useParams();
  const [reports, setReports] = useState<Report[] | null>([]);
  const [hourlyScores, setHourlyScores] = useState<HourlyScores>({});
  const [hoveredHour, setHoveredHour] = useState<number | null>(null);
  const [hoveredPeriod, setHoveredPeriod] = useState<"AM" | "PM" | null>(null);
  const [intersection, setIntersection] = useState<Intersection | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blockedTime, setBlockedTime] = useState<number>(1);

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

  // Reset page when logs or intersection change
  useEffect(() => {
    setCurrentPage(1);
  }, [intersection, logs]);

  if (!id) {
    return <div>No valid ID provided.</div>;
  }

  const getReports = (): { logID: string }[] => {
    return userFeedback.flatMap((user) => {
      if (Array.isArray(user.reports)) {
        return user.reports.map((logID) => ({ logID: String(logID) }));
      }
      return [];
    });
  };

  useEffect(() => {
    if (userFeedback.length > 0 && logs.length > 0) {
      setReports(getReports());
    }
  }, [userFeedback, logs]);

  const confirmReport = async (url: string, logID: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "BLOCKED" ? "OPEN" : "BLOCKED";
      const updateStatusResponse = await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logid: logID, status: newStatus }),
      });

      const updateStatusData = await updateStatusResponse.json();

      if (updateStatusResponse.ok) {
        console.log(`Status updated to ${newStatus} for logID: ${logID}`);
      } else {
        console.error("Error updating status:", updateStatusData.message);
        return;
      }

      const usersRef = collection(dbFB, 'users');
      const snapshot = await getDocs(usersRef);
      const updates = snapshot.docs.map(async (docSnap) => {
        const userData = docSnap.data();
        if (Array.isArray(userData.reports)) {
          const filteredReports = userData.reports.filter(report => String(report) !== String(logID));
          if (filteredReports.length !== userData.reports.length) {
            return updateDoc(docSnap.ref, { reports: filteredReports });
          }
        }
      });

      await Promise.all(updates);
      console.log(`Report ${logID} removed from users' reports`);

      const confirmResponse = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        console.error("Error confirming report:", confirmData.message);
      }
    } catch (error) {
      console.error('Request failed:', error);
    }
  };

  const denyReport = async (logID: string) => {
    try {
      const usersRef = collection(dbFB, 'users');
      const snapshot = await getDocs(usersRef);
      const updates = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        if (Array.isArray(data.reports)) {
          const filteredReports = data.reports.filter(report => String(report) !== String(logID));
          if (filteredReports.length !== data.reports.length) {
            return updateDoc(docSnap.ref, { reports: filteredReports });
          }
        }
        return null;
      });
      await Promise.all(updates);
      console.log(`Reports with logID ${logID} removed.`);
    } catch (error) {
      console.error('Error removing report:', error);
    }
  };

  const getTimeColor = (score: number): string => {
    if (score <= 1) return 'green';
    switch (score) {
      case 2: return '#FA9E9E';
      case 3: return '#F87777';
      case 4: return '#F76464';
      case 5: return '#F65151';
      case 6: return '#F53D3D';
      case 7: return '#F42A2A';
      case 8: return '#F31616';
      case 9: return '#E90C0C';
      case 10: return '#C20A0A';
      default: return 'green';
    }
  };

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
            reports.map((report, index) => {
              const logItem = logs.find(log => String(log.logid).trim() === String(report.logID).trim());
              return (
                <div key={`${report.logID}-${index}`} data-testid="report">
                  <div className='report-container'>
                    {logItem ? (
                      <div className='report-item-1'>
                        <div className="log-row"><span className="log-label">Log ID:</span> {logItem.logid}</div>
                        <div className="log-row"><span className="log-label">Camera ID:</span> {logItem.cameraid}</div>
                        <div className="log-row"><span className="log-label">Timestamp:</span> {new Date(logItem.timestamp).toLocaleString()}</div>
                        <div className="log-row"><span className="log-label">Filename:</span> {logItem.filename}</div>
                        <div className="log-row"><span className="log-label">Status:</span> {logItem.status}</div>
                        <div className="log-row"><span className="log-label">Path:</span> {logItem.path}</div>
                      </div>
                    ) : (
                      <p style={{ color: 'red' }}>No matching log found for logID: {report.logID}</p>
                    )}
                    <div className='report-buttons-text'>Confirm or deny report:</div>
                    <div className="report-container2">
                      <div className='report-buttons'>
                        <button className='report-positive' onClick={() => logItem?.filename ? confirmReport(logItem.filename, logItem.logid, logItem.status) : console.warn("Filename is undefined")} data-testid="confirm">
                          <FontAwesomeIcon icon={faThumbsUp} />
                        </button>
                        <button className='report-negative' onClick={() => logItem?.logid ? denyReport(logItem.logid) : console.warn("Filename is undefined")} data-testid="deny">
                          <FontAwesomeIcon icon={faThumbsDown} />
                        </button>
                      </div>
                      <div className="report-img">
                        <img src={`/report-check/reported-images/${logItem?.filename}`} alt="" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No reports found for this intersection.</p>
          )}
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
            <div>Total Time Blocked: {blockedTime} minutes (Last 24 hours)</div>
        </div>
        <div className='log-time-prediction shadow' style={{ position: 'relative' }}>
          {(() => {
            const times = [
              "12:00", "1:00", "2:00", "3:00", "4:00", "5:00",
              "6:00", "7:00", "8:00", "9:00", "10:00", "11:00"
            ];
            return (
              <>
                <div className="time-container">
                  <div className='time-am'>
                    <h1>PM</h1>
                    <div className="times-row">
                      {times.map((time, idx) => {
                        const actualHour = idx + 12;
                        return (
                          <div
                            key={`pm-${time}`}
                            className="time"
                            onMouseEnter={() => { setHoveredHour(actualHour); setHoveredPeriod("PM"); }}
                            onMouseLeave={() => { setHoveredHour(null); setHoveredPeriod(null); }}
                            style={{
                              color: hourlyScores[actualHour] !== undefined
                                ? getTimeColor(hourlyScores[actualHour])
                                : 'inherit'
                            }}>
                            <strong>{time}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="time-pm">
                    <h1>AM</h1>
                    <div className="times-row">
                      {times.map((time, idx) => {
                        const actualHour = idx;
                        return (
                          <div
                            key={`am-${time}`}
                            className="time"
                            onMouseEnter={() => { setHoveredHour(actualHour); setHoveredPeriod("AM"); }}
                            onMouseLeave={() => { setHoveredHour(null); setHoveredPeriod(null); }}
                            style={{
                              color: hourlyScores[actualHour] !== undefined
                                ? getTimeColor(hourlyScores[actualHour])
                                : 'inherit'
                            }}>
                            <strong>{time}</strong>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
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
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default IntersectionPage;
