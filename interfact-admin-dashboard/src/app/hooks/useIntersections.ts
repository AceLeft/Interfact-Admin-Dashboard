import { useState, useEffect } from "react";
import { getIntersectionsFB } from "../DAOs/Firebase/intersectionsDAO";
import { Intersection } from "../types/Firebase/intersectionTypeFB";

export const useIntersections = () => {
    const [intersections, setIntersections] = useState<Intersection[]>([]);

    useEffect(() => {
        // Use the DAO to fetch data
        const unsubscribe = getIntersectionsFB(setIntersections);

        return () => unsubscribe();
    }, []);

    return intersections;
};
