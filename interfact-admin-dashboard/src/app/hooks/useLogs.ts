import { useState, useCallback } from "react";
import { Log } from "../types/Firebase/LogMySql";

export const useLogs = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/logs");
            const data = await response.json();

            if (response.ok) {
                console.log("DATA IS: " + JSON.stringify(data));
                const dataAsLog: Log[] = data.map((dataobj: {
                    id: number; logid: number; cameraid: string; timestamp: string;
                    filename: string; status: string; path: string;
                }) => ({
                    logid: String(dataobj.logid),
                    cameraid: dataobj.cameraid,
                    timestamp: dataobj.timestamp,
                    filename: dataobj.filename,
                    status: dataobj.status,
                    path: dataobj.path
                }));

                setLogs(dataAsLog);
            } else {
                setError(data.error || "Failed to fetch logs");
            }
        } catch (err) {
            console.error("Error fetching logs:", err);
            setError("Failed to fetch logs");
        } finally {
            setLoading(false);
        }
    }, []);

    return { logs, loading, error, refetch: fetchLogs };
};
