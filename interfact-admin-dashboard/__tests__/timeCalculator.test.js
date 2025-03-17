import { DateTime } from "luxon"
import calculateDifferenceInMinutes from "../src/app/utils/dashboard/timeCaculator"

  const mockCurrentTime = DateTime.fromFormat(
    "November 27, 2024 at 04:17:00PM UTC-4",
    "MMMM d',' yyyy 'at' hh':'mm':'ssa 'UTC'Z",
    { zone: "UTC-4" }
  );

  describe("Test time difference calculator", () => {
    beforeAll(() => {
      // Mock DateTime.now to return a controllable time
      DateTime.now = jest.fn(() => mockCurrentTime);
    });
  
    it("Returns 0 when the time is now", () => {
      const result = calculateDifferenceInMinutes("November 27, 2024 at 04:17:00PM UTC-4");
      expect(result).toBe(0);
    });
  
    it("Returns 1 when time is one minute earlier", () => {
      const result = calculateDifferenceInMinutes("November 27, 2024 at 04:16:00PM UTC-4");
      expect(result).toBe(1);
    });
  
    it("Returns NaN for incorrect format", () => {
      const result = calculateDifferenceInMinutes("Nov 27, 2024 4:16 UTC-4");
      expect(result).toBeNaN();
    });
  
    it("Returns negative difference for a future timestamp", () => {
      const result = calculateDifferenceInMinutes("November 27, 2024 at 04:18:00PM UTC-4");
      expect(result).toBe(-1);
    });
  
    it("Handles empty string input gracefully", () => {
      const result = calculateDifferenceInMinutes("");
      expect(result).toBe(0);
    });
  
    it("Returns 60 when the time is one hour earlier", () => {
      const result = calculateDifferenceInMinutes("November 27, 2024 at 03:17:00PM UTC-4");
      expect(result).toBe(60);
    });
  
    it("Returns the correct difference for a timestamp from the previous day", () => {
      const result = calculateDifferenceInMinutes("November 26, 2024 at 04:17:00PM UTC-4");
      expect(result).toBe(1440); // 24 hours * 60 minutes
    });
  
    it("Returns NaN for a non-date string", () => {
      const result = calculateDifferenceInMinutes("not a date");
      expect(result).toBeNaN();
    });
  
    it("Handles timestamps without the 'UTC-4' timezone correctly", () => {
      const result = calculateDifferenceInMinutes("November 27, 2024 at 04:17:00PM");
      expect(result).toBeNaN();
    });
  });