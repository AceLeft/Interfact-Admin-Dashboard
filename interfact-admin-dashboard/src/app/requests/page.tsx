'use client';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useUserFeedback } from '@/app/hooks/useUserFeedback';


export default function requests() {

    // const userFeedback = useUserFeedback();
    // const params = useParams();
    // const [requests, setRequests] = useState<string[] | null>([]);
    // const id = Array.isArray(params.id) ? params.id[0] : params.id;

    // const getRequests = (id: string): Request[] => {
    //     return userFeedback.flatMap((user) => {
    //       if (user.requests) {
    //         return user.requests.filter((request) => request.reportid === id);
    //       }
    //       return [];
    //     });
    // };

    // useEffect(() => {
    // if (userFeedback.length > 0 && id) {
    //     const fetchedRequests = getRequests(id);
    //     setRequests(fetchedRequests);
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