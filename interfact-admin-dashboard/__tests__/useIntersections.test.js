
import { renderHook } from "@testing-library/react"
import {useIntersections} from "../src/app/hooks/useIntersections.ts"


describe("useIntersections", () => {
  it("should return the default input", async () => {
    const {result} = renderHook(()=> useIntersections());
    expect(result.current).toStrictEqual([])
    
  });
})