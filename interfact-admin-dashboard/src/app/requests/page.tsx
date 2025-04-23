'use client';
import { useEffect, useState } from "react";
import { useUserFeedback } from '@/app/hooks/useUserFeedback';


type RequestWithCount = {
  name: string;
  count: number;
};

export default function Requests() {
  const userFeedback = useUserFeedback();
  const [requests, setRequests] = useState<RequestWithCount[]>([]);

  const getRequests = (): RequestWithCount[] => {
    const requestMap = new Map<string, number>();

    userFeedback.forEach(user => {
      if (Array.isArray(user.requests)) {
        user.requests.forEach((request: string) => {
          const trimmed = request.trim();
          if (trimmed) {
            requestMap.set(trimmed, (requestMap.get(trimmed) || 0) + 1);
          }
        });
      }
    });

    return Array.from(requestMap.entries())
    .map(([name, count]) => ({name, count,}))
    .sort((a, b) => b.count - a.count);
  };

  useEffect(() => {
    if (userFeedback.length > 0) {
      const fetchedRequests = getRequests();
      setRequests(fetchedRequests);
    }
  }, [userFeedback]);

  return (
    <div>
      <div className="request-main">
        <h1>Camera Requests<span className="item-reports"> {requests.length}</span></h1>
      </div>

      {requests.length > 0 ? (
        requests.map(({ name, count }, index) => (
          <div key={`${name}-${index}`} data-testid="request">
            <div className="request-container">
              <div className="request-item shadow">
                <div className="item-name">
                  {name} <span className="item-reports">{count}</span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div>No requests found.</div>
      )}
    </div>
  );
}