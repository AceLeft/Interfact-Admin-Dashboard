import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../../FirebaseConfig";

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

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "intersections"), (snapshot) => {
            const data = snapshot.docs.map(doc => {
                const docData = doc.data();

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

            setIntersections(data);
        });

        return () => unsubscribe();
    }, []);

    return intersections;
};
