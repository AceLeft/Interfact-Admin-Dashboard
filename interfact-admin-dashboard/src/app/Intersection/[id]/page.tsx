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
import { collection, query, where, getDocs, deleteDoc, updateDoc} from 'firebase/firestore';
import { dbFB } from '../../../../FirebaseConfig';
import { useLogs } from '@/app/hooks/useLogs';
import { Log } from '@/app/types/Firebase/LogMySql';
import { debug } from 'console';

const IntersectionPage = () => {

    const userFeedback = useUserFeedback();
    const intersections = useIntersections();
    const { logs, loading, error } = useLogs();
    const params = useParams();
    const [reports, setReports] = useState<Report[] | null>([]);

    const [intersection, setIntersection] = useState<Intersection | null>(null);

    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    useEffect(() => {
        if (id) {
            const intersectionFound: Intersection | undefined = intersections.find((item) => item.id === id);
            if (intersectionFound) {
                setIntersection(intersectionFound)
            }
        }
    }, [id, intersections]);

    if (!id) {
    return <div>No valid ID provided.</div>;
    }

    const getReports = (): { logID: string }[] => {
        return userFeedback.flatMap(user => {
            if (Array.isArray(user.reports)) {
                return user.reports.map(logID => ({ logID: String(logID) }));
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
            // Determine the opposite status
            const newStatus = currentStatus === "BLOCKED" ? "OPEN" : "BLOCKED";
    
            // Send POST request to update status in MySQL
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
                return; // Exit early if status update fails
            }
    
            // Now proceed with the original logic (removing from Firebase user reports)
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
    
            // Now send the original confirmation request to `/api/report`
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
                    <div className='intersection-logs-list'>
                    {loading && <p>Loading logs...</p>}
                    {error && <p className="error">{error}</p>}
                    {intersection ? ( 
                        logs.length > 0 ? (
                            logs.filter(log => log.cameraid === intersection.id).length > 0 ? (
                                <div className="log-container">
                                    {logs
                                        .filter(log => log.cameraid === intersection.id)
                                        .map((log) => (
                                            <div key={log.logid} className="log-entry">
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
            
        </div>
    );
};

export default IntersectionPage;
