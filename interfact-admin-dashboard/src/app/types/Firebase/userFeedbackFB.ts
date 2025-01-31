import { Report } from "./reportFB";
 
export interface UserFeedback {
    //id of the User
    id: string;
    reports: Report[];
    requests: string[];
}
