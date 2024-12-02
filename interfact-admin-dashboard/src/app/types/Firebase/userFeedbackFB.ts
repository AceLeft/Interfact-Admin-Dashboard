import { Report } from "./reportFB";
 
export interface UserFeedback {
    id: string;
    reports: Report[];
    requests: string[];
}
