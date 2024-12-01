'use client';
import { useParams } from 'next/navigation';
import { useUserFeedback } from '@/app/hooks/useUserFeedback';
import { useIntersections } from '@/app/hooks/useIntersections';
import { useState, useEffect } from 'react';
import { Report } from '@/app/hooks/useUserFeedback';

const IntersectionPage = () => {

    const userFeedback = useUserFeedback();
    const intersections = useIntersections();
    const params = useParams();
    const [reports, setReports] = useState<Report[] | null>([]);
    //intersection db attributes
    const [intersectionId, setIntersectionId] = useState<string | null>(null);
    const [intersectionImagePath, setIntersectionImagePath] = useState<string | null>(null);
    const [intersectionLatitude, setIntersectionLatitude] = useState<number | null>(null);
    const [intersectionLongitude, setIntersectionLongitude] = useState<number | null>(null);
    const [intersectionName, setIntersectionName] = useState<string | null>(null);
    const [intersectionStatus, setIntersectionStatus] = useState<string | null>(null);
    const [intersectionTimestamp, setIntersectionTimestamp] = useState<string | null>(null);

    

    const id = Array.isArray(params.id) ? params.id[0] : params.id;


    useEffect(() => {
        if (id) {
            const intersectionID = intersections.find((item) => item.id === id);
            if (intersectionID) {
                setIntersectionId(intersectionID.id);
                setIntersectionImagePath(intersectionID.imagepath);
                setIntersectionLatitude(intersectionID.latitude);
                setIntersectionLongitude(intersectionID.longitude);
                setIntersectionName(intersectionID.name);
                setIntersectionStatus(intersectionID.status)
                setIntersectionTimestamp(intersectionID.timestamp)
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
      

    const handleClick = () =>{
        
        console.log(userFeedback)
    }

    return (
        <div>
            <div className='intersection-info'>
                <div className='intersection-info-left shadow'>
                    <h1 className='intersection-info-name shadow'>{intersectionName} <span>({id})</span></h1>
                    <img src={intersectionImagePath || "/no-image.webp"}/>
                </div>
                <div className='intersection-info-right shadow'>
                    <h1>Camera Details</h1>
                    <div>Id | <span>{intersectionId}</span></div>
                    <div>Imagepath | <span>{intersectionImagePath}</span></div>
                    <div>Latitude | <span>{intersectionLatitude}</span></div>
                    <div>Longitude | <span>{intersectionLongitude}</span></div>
                    <div>Name | <span>{intersectionName}</span></div>
                    <div>Status | <span>{intersectionStatus}</span></div>
                    <div>Timestamp | <span>{intersectionTimestamp}</span></div>
                </div>
            </div>
            <div className="intersection-info-2">
                <div className='intersection-reports shadow'>
                    <h1>Reports Recieved <span>{reports?.length || "-"}</span></h1>
                    {reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                        <div key={`${report.reportid} ${index}`}>
                            <div className='report-item-1'>Image | <a href={report.reporturl} target="_blank">{report.reporturl}</a> 
                                <br /> 
                                <br />
                                Classification | <span>BLOCKED</span>
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
