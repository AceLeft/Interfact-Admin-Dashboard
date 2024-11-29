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
    const [imagePath, setImagePath] = useState<string | null>(null);
    const [intersectionName, setIntersectionName] = useState<string | null>(null);
    const id = Array.isArray(params.id) ? params.id[0] : params.id;


    useEffect(() => {
        if (id) {
            const intersectionID = intersections.find((item) => item.id === id);
            if (intersectionID) {
                setImagePath(intersectionID.imagepath);
                setIntersectionName(intersectionID.name)
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
                <div className='intersection-info-left'>
                    <h1 className='intersection-info-name'>{intersectionName} <span>({id})</span></h1>
                    <img src={imagePath || "/no-image.webp"}/>
                </div>
                <div className='intersection-info-right'>
                    reports:
                    {reports && reports.length > 0 ? (
                    reports.map((report, index) => (
                        <div key={`${report.reportid} ${index}`}>
                            <div>NEW REPORT:</div>
                            <div>{report.reporturl}</div>
                        </div>
                    ))) : (<p>No reports found for this intersection.</p>)}
                </div>
            </div>
            <div className="intersection-info-2">
                <div className='intersection-reports'>
                    <h1>Reports Recieved</h1>
                </div>
                <div className='intersection-logs'>
                    <h1>Camera Logs</h1>
                </div>
            </div>
            
            
            
        </div>
    );
};

export default IntersectionPage;
