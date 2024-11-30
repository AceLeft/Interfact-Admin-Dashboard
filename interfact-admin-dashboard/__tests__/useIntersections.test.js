
import { renderHook } from "@testing-library/react"
import {useIntersections} from "../src/app/hooks/useIntersections.ts"
import { collection, CollectionReference, Firestore } from "firebase/firestore";




describe("useIntersections", () => {
  it("should return initial value for intersections", async () => {
    const database = collection(new Firestore, "nothing");
    //doesn't work

    const {result} = renderHook(()=> useIntersections(database));
    
    const {intersections} = result.current;

    expect(intersections).toBe([]);
    
  });
})