import { renderHook } from "@testing-library/react"
import {useUserFeedback} from "../src/app/hooks/useUserFeedback.ts"

describe("useUseFeedbakc", () => {
  it("should return the default input", async () => {
    const {result} = renderHook(()=> useUserFeedback());
    expect(result.current).toStrictEqual([])
    
  });
})