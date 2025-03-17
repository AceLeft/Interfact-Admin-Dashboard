'use client';
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useUserFeedback } from '@/app/hooks/useUserFeedback';


export default function requests() {

    const userFeedback = useUserFeedback();
    const params = useParams();
    const [requests, setRequests] = useState<string[] | null>([]);
    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const getRequests = (id : string): string[] => {
        return userFeedback.flatMap(user => {
            if (Array.isArray(user.requests)) {
                return user.requests.filter((request : string) => {
                    return request === id
            });
            }
            return [];
        });
      };

    useEffect(() => {
    if (userFeedback.length > 0 && id) {
        const fetchedRequests = getRequests(id);
        setRequests(fetchedRequests);
    }
    }, [userFeedback, id]);


    return (
        <div>
            <div className="request-main">
                <h1>Camera Requests</h1>
                <div className="request-container">
                    <div className="request-item shadow">
                        <div className="item-name">JEF1 
                        </div>
                        <div className="item-reports">4</div>
                        </div>
                    <div className="request-item shadow">
                        <div className="item-name">MON1 
                        </div>
                        <div className="item-reports">3</div>
                        </div>
                    <div className="request-item shadow">
                        <div className="item-name">ELL1 
                        </div>
                        <div className="item-reports">1</div>
                        </div>
                </div>
            </div>
        </div>
    );
    
    
    
    

};