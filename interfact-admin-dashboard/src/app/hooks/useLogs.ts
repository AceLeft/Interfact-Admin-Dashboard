import { useState, useCallback } from "react";
import { Log } from "../types/Firebase/LogMySql";

export const useLogs = () => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res  = await fetch("/api/logs");
      const data = await res.json();

      if (res.ok) {
        const mapped: Log[] = data.map((d: any) => ({
          logid:     String(d.logid),
          cameraid:  d.cameraid,
          timestamp: d.timestamp,
          filename:  d.filename,
          status:    d.status,
          path:      d.path
        }));
        setLogs(mapped);
      } else {
        setError(data.error || "Failed to fetch logs");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logs,
    loading,
    error,
    refetch: fetchLogs
  };
};
