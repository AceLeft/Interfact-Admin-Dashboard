
import { renderHook } from "@testing-library/react"
import {useIntersections} from "../src/app/hooks/useIntersections.ts"
import { Firestore, getFirestore, query } from "firebase/firestore";
import { jest } from "@jest/globals";
import { mock } from "node:test";
import { mockFirebase, mockGoogleCloudFirestore } from "firestore-jest-mock";
import { mockCollection } from "firestore-jest-mock/mocks/firestore";




mockFirebase({
  database: {
    intersections: [
      {id:'1', name: 'test'}
    ]
  }
})

describe("useIntersections", () => {
  it("should return the mock input", async () => {

  


    const {result} = renderHook(()=> useIntersections());
    
    expect(mockCollection).toHveBeenCalledWith('intersections')
    expect(result.current).toBe({id:'1', name: 'test'})
    
  });
})