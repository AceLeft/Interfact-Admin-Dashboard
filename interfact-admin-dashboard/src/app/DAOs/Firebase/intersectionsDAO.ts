import { collection, onSnapshot } from "firebase/firestore";
import { dbFB } from "../../../../FirebaseConfig";
import { Intersection } from "../../types/Firebase/intersectionTypeFB";

export const getIntersectionsFB = (callback: (data: Intersection[]) => void) => {
    //data func called for each piece of data    
    const unsubscribe = onSnapshot(collection(dbFB, "intersections"), (snapshot) => {
        //param is a QuerySnapshot (collection of data)
        // snapshots.docs is all documents (QueryDocumentSnapshots) in the snapshot
        const data = snapshot.docs.map((doc) => {
            const docData = doc.data();
            //get the data, and turn it into an Intersection
            //(which is defined earlier in file)
            return {
                id: doc.id,
                name: docData.name,
                imagepath: docData.imagepath,
                latitude: docData.latitude,
                longitude: docData.longitude,
                status: docData.status,
                timestamp: docData.timestamp,
            } as Intersection;
        });
        //Then callback to the hook with data
        callback(data);
    });

    return unsubscribe;
};
