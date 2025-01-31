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
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../FirebaseConfig';

const IntersectionPage = () => {

    const userFeedback = useUserFeedback();
    const intersections = useIntersections();
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

    const getReports = (id: string): Report[] => {
        return userFeedback.flatMap((user) => {
          if (user.reports) {
            return user.reports.filter((report) => report.reportid === id);
          }
          return [];
        });
      };

    useEffect(() => {
    if (userFeedback.length > 0 && id) {
        const fetchedReports = getReports(id);
        setReports(fetchedReports);
    }
    }, [userFeedback, id]);
      
    const confirmReport = async (url: string) =>{
        try {
            const response = await fetch('/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
      
            const data = await response.json();
            if (response.ok) {
                //Delete docs(reports) with the url
                const usersRef = collection(db, 'users');
                const snapshot = await getDocs(usersRef);

                const deletions: Promise<void>[] = [];
                snapshot.forEach(docSnap => {
                    const data = docSnap.data();
                    if (Array.isArray(data.reports)) {
                      const hasMatch = data.reports.some(r => r.reporturl === url);
                      if (hasMatch) {
                        deletions.push(deleteDoc(docSnap.ref));
                      }
                    }
                  });
                  await Promise.all(deletions);
                console.log(data.message);
            } else {
                console.error(data.message);
            }
          } catch (error) {
                console.error('Request failed:', error);
          }
    }

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
                    <h1>Reports Recieved <span>{reports?.length || "-"}</span></h1>
                    {reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                        <div key={`${report.reportid} ${index}`} data-testid="report">
                            <div className='report-container'>
                                <div className='report-item-1'>Image | <span>{report.reporturl}</span> 
                                    <br /> 
                                    <br />
                                    Classification | <span>{report.classification}</span>
                                    <hr />
                                    <div className='report-buttons-text'>Accept or deny report:</div>
                                    <div className='report-buttons'>
                                        <button className='report-positive' onClick={() => confirmReport(report.reporturl)}><FontAwesomeIcon icon={faThumbsUp}/></button>
                                        <button className='report-negative'><FontAwesomeIcon icon={faThumbsDown}/></button>
                                    </div>
                                </div>
                                <div className='report-image'>
                                    <img src={`/report-check/reported-images/${report.reporturl}`} alt="" />
                                    
                                </div>
                            </div>
                            
                        </div>
                    ))) : (<p>No reports found for this intersection.</p>)}
                </div>
                <div className='intersection-logs shadow'>
                    <h1>Camera Logs</h1>
                </div>
            </div>   
            
        </div>
    );
};

export default IntersectionPage;
