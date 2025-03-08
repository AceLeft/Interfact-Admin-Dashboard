import { useState, useEffect } from "react";
import { Log } from "../types/Firebase/LogMySql";

export const useLogs = () => {
    const [logs, setLogs] = useState<Log[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const response = await fetch("/api/logs");
                const data = await response.json();
                
                if (response.ok) {
                    // Convert the data into a Log object
                    console.log("DATA IS: " + JSON.stringify(data));
                    let dataAsLog = data.map( (dataobj: 
                        // Structure of mysql
                        { id: number, logid: number; cameraid: string; timestamp: string; 
                            filename: string; status: string; path: string }) => {
                        return {
                            logid: String(dataobj.logid),
                            cameraid: dataobj.cameraid,
                            timestamp: dataobj.timestamp,
                            filename: dataobj.filename,
                            status: dataobj.status,
                            path: dataobj.path
                        } as Log
                    })
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
        };

        fetchLogs();
    }, []);

    return { logs, loading, error };
};