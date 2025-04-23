import { renderHook, act, waitFor } from "@testing-library/react";
import { useLogs } from "../src/app/hooks/useLogs.ts";
import { expect, jest } from "@jest/globals";

console.error = jest.fn();

describe("useLogs", () => {
  it("returns a fail state when not connected", async () => {
    const { result } = renderHook(() => useLogs());

    // Trigger the fetch() call inside the hook
    act(() => {
      result.current.refetch();
    });

    // Wait for loading to go back to false
    await waitFor(() => expect(result.current.loading).toBe(false));

    const { logs, loading, error } = result.current;
    expect(logs).toEqual([]);
    expect(error).toBe("Failed to fetch logs");
    expect(loading).toBe(false);
    expect(console.error).toBeCalled();
  });

  it("loads logs on successful fetch", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      })
    );

    const { result } = renderHook(() => useLogs());

    act(() => {
      result.current.refetch();
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const { logs, loading, error } = result.current;
    expect(logs).toEqual([]);    // empty array mapped
    expect(error).toBeNull();
    expect(loading).toBe(false);
    expect(console.error).not.toBeCalled();
  });
});
