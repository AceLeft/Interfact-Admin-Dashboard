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
                    setLogs(data);
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