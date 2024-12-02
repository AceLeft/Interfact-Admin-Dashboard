import { DateTime } from "luxon"
import calculateDifferenceInMinutes from "../src/app/dashboard/timeCaculator"

const mockCurrentTime = DateTime.fromFormat("November 27, 2024 at 04:17:00PM UTC-4","MMMM d',' yyyy 'at' hh':'mm':'ssa 'UTC'Z", {zone: "UTC-4"});


describe("Test time difference calculator", () => {
    //"November 27, 2024 at 04:17:00PM UTC-4"
    //Mock current time to somethign controllable
    DateTime.now = jest.fn(() => mockCurrentTime);

    it("Returns 0 when the time is now", () => {
        let result = calculateDifferenceInMinutes("November 27, 2024 at 04:17:00PM UTC-4")
        expect(result).toBe(0);
    })

    it("Returns 1 when time is one minute earlier", () => {
        let result = calculateDifferenceInMinutes("November 27, 2024 at 04:16:00PM UTC-4")
        expect(result).toBe(1);
    })
})