import { renderHook } from "@testing-library/react";
import {useLogs} from "../src/app/hooks/useLogs.ts";
import { expect, jest } from "@jest/globals";

// Suppress the console error
console.error = jest.fn();


describe("useLog", () => {
  it("returns a fail state when not connected", async () => {
    const {result} = renderHook(()=> useLogs());
    const { logs, loading, error} = result.current;
    expect(logs).toEqual([]);
    expect(error).toBe("Failed to fetch logs");
    expect(loading).toBe(false);
    expect(console.error).toBeCalled();
    
  });

  it("loads when to fetch is resolving", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ nothing: 1 }),
      }),
    );
    const {result} = renderHook(()=> useLogs());
    const { logs, loading, error} = result.current;
    expect(logs).toEqual([]);
    expect(error).toBe(null);
    expect(loading).toBe(true);
    expect(console.error).not.toBeCalled();
  });

})