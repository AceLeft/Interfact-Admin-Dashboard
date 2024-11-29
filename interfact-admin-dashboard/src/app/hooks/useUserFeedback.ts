import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";

export interface Report {
    reportid: string;
    reporturl: string;
  }

export interface UserFeedback {
    id: string;
    reports: Report[];
    requests: string[];
}


export const useUserFeedback = () => {
    const [userFeedback, setUserFeedback] = useState<UserFeedback[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const docData = doc.data();

                return {
                    id: doc.id,
                    reports: Array.isArray(docData.reports) ? docData.reports : [],
                    requests: Array.isArray(docData.requests) ? docData.requests : []
                } as UserFeedback;
            });

            setUserFeedback(data);
        });

        return () => unsubscribe(); 
    }, []);

    return userFeedback;
};
