import { useState, useEffect } from "react";
import { collection, CollectionReference, Firestore, getFirestore, onSnapshot } from "firebase/firestore";


export interface Intersection {
    id: string;
    name: string;
    imagepath: string;
    latitude: number;
    longitude: number;
    status: string;
    timestamp: string;
}

export const useIntersections = () => {
    const [intersections, setIntersections] = useState<Intersection[]>([]);
    const db = getFirestore();
    //runs every rerender
    useEffect(() => {
        //                               data                      func called for each piece of data     
        const unsubscribe = onSnapshot(collection(db, "intersections"), (snapshot) => {
            //param is a QuerySnapshot (collection of data)
            // snapshots.docs is all documents (QueryDocumentSnapshots) in the snapshot
            const data = snapshot.docs.map(doc => {
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
            //Then set this into the value
            setIntersections(data);
        });

        return () => unsubscribe();
    }, []);

    return intersections;
};
