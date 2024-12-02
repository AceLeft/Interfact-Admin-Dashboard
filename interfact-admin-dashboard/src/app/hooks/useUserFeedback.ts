import { useState, useEffect } from "react";
import { UserFeedback } from "../types/Firebase/userFeedbackFB";
import { getUserFeedbackFB } from "../DAOs/Firebase/userFeedbackDAO";

export const useUserFeedback = () => {
    const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);

    useEffect(() => {
        // Use the DAO to fetch data
        const unsubscribe = getUserFeedbackFB(setUserFeedback);

        return () => unsubscribe();
    }, []);

    return userFeedback;
};
