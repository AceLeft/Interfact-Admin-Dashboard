import { calculateHourlyScores } from "../src/app/utils/calculateHourlyScores[LEGACY]";
import { mockLogs } from "../__mocks__/mockData.ts";
import { expect } from "@jest/globals";


describe("Hourly Score Calcuator", () => {
    it("Returns all 0s if given no logs", () => {
        const result = calculateHourlyScores([], "");
        for(let hour in result){
            expect(result[hour]).toBe(0);
        }
    });

    it("Returns all 0s if given logs, but not for this intersection", () => {
        const result = calculateHourlyScores(mockLogs, "blah");
        for(let hour in result){
            expect(result[hour]).toBe(0);
        }
    });

    it("Returns a non-zero for a somewhat blocked intersection", () => {
        const sameTimeLogs = [    {
            logid: "0",
            cameraid: "SCORE",
            timestamp: "2025-01-12 04:12:23",
            filename: "",
            status: "BLOCKED",
            path: ""
        },
        {
            logid: "2",
            cameraid: "SCORE",
            timestamp: "2025-01-12 04:13:23",
            filename: "",
            status: "OPEN",
            path: ""
        },
        {
            logid: "1",
            cameraid: "SCORE",
            timestamp: "2025-01-13 04:12:23",
            filename: "",
            status: "BLOCKED",
            path: ""
        },{
            logid: "3",
            cameraid: "SCORE",
            timestamp: "2025-01-12 04:17:29",
            filename: "",
            status: "OPEN",
            path: ""
        },];
        const result = calculateHourlyScores(sameTimeLogs, "SCORE");
        
        for(let hour in result){
            if(hour == 4) {
                expect(result[hour]).toBeGreaterThan(0);
            }
            else{ 
                expect(result[hour]).toBe(0);
            }
        }
    });

    it("Normalizes the score when given many blocked logs", () => {
        let logs = [];
        for(let i = 0; i < 100; i++){
            logs.push({
                logid: "0",
                cameraid: "SCORE",
                timestamp: "2025-01-12 04:12:23",
                filename: "",
                status: "BLOCKED",
                path: ""
            });
            logs.push({
                logid: "0",
                cameraid: "SCORE",
                timestamp: "2025-01-12 05:12:23",
                filename: "",
                status: "OPEN",
                path: ""
            });
            if(i% 6 == 0){
                logs.push({
                    logid: "0",
                    cameraid: "SCORE",
                    timestamp: "2025-01-12 04:12:23",
                    filename: "",
                    status: "OPEN",
                    path: ""
                });
            };
        };

        const result = calculateHourlyScores(logs, "SCORE");
        
        for(let hour in result){
            if(hour == 4) {
                expect(result[hour]).toBe(10);
            }
            else{ 
                expect(result[hour]).toBe(0);
            }
        };

    });

});