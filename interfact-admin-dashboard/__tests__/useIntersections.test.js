
import { renderHook } from "@testing-library/react"
import {useIntersections} from "../src/app/hooks/useIntersections.ts"
import { mockGoogleCloudFirestore } from "firestore-jest-mock";

mockGoogleCloudFirestore({
  database: {
    intersections: [
      {id:'1', name: 'test'}
    ]
  }
})

describe("useIntersections", () => {
  it("should return the default input", async () => {
    const {result} = renderHook(()=> useIntersections());
    expect(result.current).toStrictEqual([])
    
  });
})