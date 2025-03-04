import { Log } from "@/app/types/Firebase/LogMySql";

// So that testing doesn't *need* to know what strings are used, export
export const usedLogIds = ["01", "02", "03", "04", "05", "06"];

export const mockLogs : Log[] = [
    {
        logid: usedLogIds[0],
        cameraid: "TEST0",
        timestamp: "00:00",
        filename: "",
        status: "OPEN",
        path: ""
    },
    {
        logid: usedLogIds[1],
        cameraid: "TEST1",
        timestamp: "00:00",
        filename: "",
        status: "OPEN",
        path: ""
    },
    {
        logid: usedLogIds[2],
        cameraid: "TEST2",
        timestamp: "00:00",
        filename: "",
        status: "OPEN",
        path: ""
    },
    {
        logid: usedLogIds[3],
        cameraid: "REPEAT0",
        timestamp: "00:00",
        filename: "",
        status: "CLOSED",
        path: ""
    },
    {
        logid: usedLogIds[4],
        cameraid: "REPEAT0",
        timestamp: "00:00",
        filename: "",
        status: "OPEN",
        path: ""
    },
    {
        logid: usedLogIds[5],
        cameraid: "TEST0",
        timestamp: "00:02",
        filename: "",
        status: "CLOSED",
        path: ""
    },
];