import { DateTime } from 'luxon';

function calculateDifferenceInMinutes(date: string): number {

    if (!date || typeof date !== 'string') {
      return 0;
    }

    // const cameraTimestamp = "November 27, 2024 at 04:17:00PM UTC-4";
    const cameraTimestamp = date;
  
    try {
      //Parse the camera timestamp with UTC-4
      let parsedTime = DateTime.fromFormat(
        cameraTimestamp,
        "MMMM d',' yyyy 'at' hh':'mm':'ssa 'UTC'Z", 
        { zone: "UTC-4" }
      );

      if (!parsedTime.isValid) {
        return NaN;
      }

      //Convert parsed time to UTC
      const cameraTimeInUTC = parsedTime.toUTC();
        
      //Get the current time in UTC
      const currentTime = DateTime.now().toUTC();
  
      //Calculate the difference in minutes
      const differenceInMinutes = currentTime.diff(cameraTimeInUTC, "minutes").minutes;

      return Math.round(differenceInMinutes) || 0;
    } catch (error) {
      console.error(error);
      return NaN;
    }
  };

  export default calculateDifferenceInMinutes;