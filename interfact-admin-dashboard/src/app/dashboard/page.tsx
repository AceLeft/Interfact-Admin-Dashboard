'use client';
// @ts-ignore
import { DateTime } from 'luxon';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useIntersections } from "../hooks/useIntersections";
import { useUserFeedback } from '../hooks/useUserFeedback';
import { db } from "../../../FirebaseConfig";
import { collection } from 'firebase/firestore';


export default function Home() {

    const intersections = useIntersections();
    const userFeedback = useUserFeedback();

    

    const getTotalReports = userFeedback.reduce((total, user) => {
        return total + (user.reports ? user.reports.length : 0);
      }, 0);

    const getTotalIntersections = userFeedback.reduce((total, Intersections) => {
    return total + (intersections ? intersections.length : 0);
    }, 0);

    const getReportsForIntersection = (intersectionId: string) => {
        return userFeedback.reduce((total, user) => {
            if (user.reports) {
            const matchingReports = user.reports.filter(
                (report) => report.reportid === intersectionId
            );
            return total + matchingReports.length;
            }
            return total;
        }, 0);
    };

    //Used for debuging incoming data
    // const displayIntersections = () =>{
    //     console.log(intersections)
    // }
    // const displayUserFeedback = () =>{
    //     console.log(userFeedback)
    // }

    const interfactLiveRedirect = () => {
        window.open('https://interfact.live/map', '_blank');
      };

    const calculateDifferenceInMinutes = (date: string): number => {
        // const cameraTimestamp = "November 27, 2024 at 04:17:00PM UTC-4";
        const cameraTimestamp = date;
      
        try {
          //Parse the camera timestamp with UTC-4
          const parsedTime = DateTime.fromFormat(
            cameraTimestamp,
            "MMMM d, yyyy 'at' hh:mm:ssa 'UTC'Z", 
            { zone: "UTC-4" }
          );
      
          if (!parsedTime.isValid) {
            throw new Error("Invalid timestamp format");
          }

          //Convert parsed time to UTC
          const cameraTimeInUTC = parsedTime.toUTC();
          console.log("Camera time in UTC:", cameraTimeInUTC.toISO()); // Debug log
      
          //Get the current time in UTC
          const currentTime = DateTime.now().toUTC();
          console.log("Current time in UTC:", currentTime.toISO()); // Debug log
      
          //Calculate the difference in minutes
          const differenceInMinutes = currentTime.diff(cameraTimeInUTC, "minutes").toObject().minutes;
      
          console.log("Difference in minutes:", Math.round(differenceInMinutes)); // Final log
          return Math.round(differenceInMinutes) || 0;
        } catch (error) {
          console.error(error);
          return 0;
        }
      };
      
    return(
        <div>
            <div className="top-dashboard shadow">
                <div className="dash-main">
                    <div className="dash-main-1">Muncie, IN</div>
                    {/* <hr /> */}
                    <div className="dash-main-2">• Total Intersections: {getTotalIntersections}</div>
                    <div className="dash-main-3">• Problems Reported (Last 30 days): {getTotalReports}</div>
                </div>
                <button onClick={interfactLiveRedirect} className='map-view'>Map View</button>
                <button className='refresh-button'><FontAwesomeIcon icon={faArrowsRotate}/></button>
            </div>
            <div className="filter">
                    <button className='filter-1 shadow'><FontAwesomeIcon icon={faFilter}/> Filter</button>
                    <div className='filter-2'>showing {getTotalIntersections} intersections</div>
            </div>
            <div className="intersection-list">
                <div className="intersection-list">
                
                    {intersections.map((item) => (
                        <div key={item.id} className="intersection-item shadow">
                            <div className="item-img-container">
                                <img src={item.imagepath} alt={item.name} />
                                <div className="item-reports">{getReportsForIntersection(item.id)}</div>
                                <div className="item-name">{item.name}</div>
                            </div>
                            <div className="item-info-container">
                                <div className="item-last-update"><span>Last Update | </span> {calculateDifferenceInMinutes(item.timestamp)} minutes ago</div>
                                <div className="item-status"><span>Image Classification | </span> {item.status}</div>
                                <div className='item-down'><span>Camera Status | </span> WORKING</div>  
                            </div>
                            <div className={calculateDifferenceInMinutes(item.timestamp) < 10 ? "good-indicator": "bad-indicator"}></div>
                        </div>
                    ))}
                    <div className='intersection-add shadow'>
                        <div className='fa-plus shadow'><FontAwesomeIcon icon={faPlus} size='3x'/></div>
                    </div>
                </div>
                
            </div>
        </div>
    );
}