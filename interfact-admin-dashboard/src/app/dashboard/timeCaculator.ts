import { DateTime } from 'luxon';

function calculateDifferenceInMinutes(date: string): number {
    // const cameraTimestamp = "November 27, 2024 at 04:17:00PM UTC-4";
    let cameraTimestamp = date;
  
    try {
      //Parse the camera timestamp with UTC-4
      let parsedTime = DateTime.fromFormat(
        cameraTimestamp,
        "MMMM d, yyyy 'at' hh:mm:ssa 'UTC'Z", 
        { zone: "UTC-4" }
      );
  
      if (!parsedTime.isValid) {
        throw new Error("Invalid timestamp format");
      }

      //Convert parsed time to UTC
      let cameraTimeInUTC = parsedTime.toUTC();
        
      //Get the current time in UTC
      let currentTime = DateTime.now().toUTC();
      console.log(DateTime.now());
  
      //Calculate the difference in minutes
      let differenceInMinutes = currentTime.diff(cameraTimeInUTC, "minutes").minutes;

      return Math.round(differenceInMinutes) || 0;
    } catch (error) {
      console.error(error);
      console.error(cameraTimestamp);
      return 0;
    }
  };

  export default calculateDifferenceInMinutes;