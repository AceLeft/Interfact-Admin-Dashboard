import { DateTime } from "luxon"
import calculateDifferenceInMinutes from "../src/app/dashboard/timeCaculator"

const mockcurrentTime = DateTime.fromISO("November 27, 2024 at 04:17:00PM UTC-4", {zone: "UTC-4"});


describe("Test time difference calculator", () => {
    //"November 27, 2024 at 04:17:00PM UTC-4"
    DateTime.now = jest.fn(() => mockcurrentTime);
    it("Returns 0 when the time is now", () => {
        let result = calculateDifferenceInMinutes("November 27, 2024 at 04:17:00PM UTC-4")
        expect(result).toBe(0);
    })
})