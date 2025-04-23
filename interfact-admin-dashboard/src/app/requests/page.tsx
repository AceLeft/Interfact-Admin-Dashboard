'use client';
import { useEffect, useState } from "react";
import { useUserFeedback } from '@/app/hooks/useUserFeedback';
import { RequestComponent } from "./requestComponent";


export default function requests() {

    const userFeedback = useUserFeedback();
    const [requests, setRequests] = useState<string[] | null>([]);

    const getRequests = (): string[] => {
        return userFeedback.flatMap(user => {
            if (Array.isArray(user.requests)) {
                return user.requests.filter((request : string) => {
                    return request
            });
            }
            return [];
        });
      };

    useEffect(() => {
    if (userFeedback.length > 0) {
        const fetchedRequests = getRequests();
        setRequests(fetchedRequests);
    }
    }, [userFeedback]);


    const test = () =>{
        console.log(requests)
    }

    
    return (
        <div>
            <div className="request-main">
                <h1>Camera Requests</h1>
                <div className="request-container">                    
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
                <button onClick={test}>TEST</button>
=======
                <div><h1>Camera Requests<span className='item-reports'>{requests?.length || " - "}</span></h1></div>

            </div>
                {requests && requests.length > 0 ? (
                            requests.map((request : string, index) => {
                              return (
                                <RequestComponent request={request} index={index}></RequestComponent>
                              );
                            })
                          ) : (
                            <div>No requests found.</div>
                          )}
        </div>
    );
};