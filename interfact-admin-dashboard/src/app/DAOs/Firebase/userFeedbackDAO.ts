import { collection, onSnapshot } from "firebase/firestore";
import { dbFB } from "../../../../FirebaseConfig";
import { UserFeedback } from "../../types/Firebase/userFeedbackFB";

export const getUserFeedbackFB = (callback: (data: UserFeedback[]) => void) => {

    const unsubscribe = onSnapshot(collection(dbFB, "users"), (snapshot) => {
        const data = snapshot.docs.map(doc => {
            const docData = doc.data();

            return {
                id: doc.id,
                reports: Array.isArray(docData.reports) ? docData.reports : [],
                requests: Array.isArray(docData.requests) ? docData.requests : []
            } as UserFeedback;
        });

        callback(data);
    });

    return unsubscribe;
};
