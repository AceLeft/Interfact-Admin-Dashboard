// 'use client';
// import { useEffect, useState } from "react";
// import { useUserFeedback } from '@/app/hooks/useUserFeedback';


export default function requests() {

    // const userFeedback = useUserFeedback();
    // const [reports, setReports] = useState<Report[] | null>([]);
    // const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // const getRequests = (id: string): Request[] => {
    //     return userFeedback.flatMap((user) => {
    //       if (user.requests) {
    //         return user.reports.filter((report) => report.reportid === id);
    //       }
    //       return [];
    //     });
    // };

    // useEffect(() => {
    // if (userFeedback.length > 0 && id) {
    //     const fetchedReports = getReports(id);
    //     setReports(fetchedReports);
    // }
    // }, [userFeedback, id]);


    return(
        <div>
            <div className="request-main">
                <h1>Camera Requests</h1>
                <div className="request-container">
                    <div className="request-item shadow">
                        HIG1
                    </div>
                    <div className="request-item shadow">
                        STR1    
                    </div>
                    <div className="request-item shadow">
                        LUC1    
                    </div>
                </div>
            </div>
        </div>
    );

};