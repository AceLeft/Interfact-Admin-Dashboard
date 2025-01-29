'use client';
// @ts-ignore
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useIntersections } from "../hooks/useIntersections";
import { useUserFeedback } from '../hooks/useUserFeedback';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import calculateDifferenceInMinutes from "./timeCaculator";


export default function Dashboard() {

    //------------------------------ Hooks -----------------------------

    // Hooks to get data or utilities
    const intersections = useIntersections();
    const userFeedback = useUserFeedback();
    const router = useRouter();

    // React Hooks handle the state of the const
    const [ isFiltering, setIsFiltering ] = useState<boolean | null>(null);
    const [ isFilterOpen, setIsFilterOpen ] = useState<boolean | null>(false);
    const [ isFilterBlocked, setIsFilterBlocked ] = useState<boolean | null>(false);
    const [ isFilterMaintenance, setIsFilterMaintenance ] = useState<boolean | null>(false);
    const [ intersectionsShown, setintersectionsShown] = useState<number | null>(0);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    //------------------------------------------------------------------




    //---------------------------- User Report & Intersection Elements -------------------------------

    // Total # of intersections
    const totalIntersections = intersections.length;

    // Calculates total # of reports from user feedback 
    const getTotalReports = userFeedback.reduce((total, user) => {
        return total + (user.reports ? user.reports.length : 0);
    }, 0);

    // Gets # of reports for an intersection id
    const getReportsForIntersection = (intersectionId: string) => {
        return userFeedback.reduce((total, user) => {
            if (user.reports) {
                const matchingReports = user.reports.filter((report) => report.reportid === intersectionId);
                return total + matchingReports.length;
                }
            return total;
            }, 0);
        };

    //------------------------------------------------------------------------------------------------




    //----------------------------------- Page Utility Elements --------------------------------------

    // Refreashes the page 
    const refreshPage = () => {
        // Refreash page key
        setRefreshKey((prevKey) => prevKey + 1); 
        // Reset the filters
        setIsFiltering(null)
        setIsFilterOpen(false)
        setIsFilterBlocked(false)
        setIsFilterMaintenance(false)
    };

    // Navigate to intersection page by the intersection id
    const navToIntersectionPage = (id: string) =>{
        router.push(`/Intersection/${id}`)
    }

    // Redirect component to Interfact.live
    const interfactLiveRedirect = () => {
        window.open('https://interfact.live/map', '_blank');
      };

    const goToAddCamera = () =>{
        router.push("/add_camera")
    }

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            // If the c key is pressed
            if (event.key.toLowerCase() === 'c') {
                // Redirect to add camera page
                router.push('/add_camera');
            }
        };
        // EventListener is needed for keydown events
        document.addEventListener('keydown', handleKeyPress);

        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [router]);

    //------------------------------------------------------------------------------------------------




    //----------------------------------- Filter Elements --------------------------------------------

    // Toggles the state of the filters
    const filterIntersections = () =>{
        // Toggles true or false
        setIsFiltering(!isFiltering) 
    } 

    // Handles filter options
    const filterOptions = (selectedOption: string) => {
        switch (selectedOption) {
            
            case 'Open':
                // If blocked filter is not active
                if(isFilterBlocked !== true || isFilterMaintenance !==true){
                    // Toggle filter to open
                    setIsFilterOpen(!isFilterOpen)
                }
                break;

            case 'Blocked':
                // If open filter is not active
                if(isFilterOpen !== true || isFilterMaintenance !==true){
                    // Toggles filter to blocked
                    setIsFilterBlocked(!isFilterBlocked)
                }
                break;
            
                case 'Maintenance':
                if(isFilterOpen !== true || isFilterBlocked !== true){
                    setIsFilterMaintenance(!isFilterMaintenance)
                }
                break;

            default:
                console.warn(`Unknown filter option: ${selectedOption}`);
                break;
        }
    };

    // Filters intersections based on applied filters
    const filteredIntersections = intersections.filter((item) => {
        // Shows open intersections only if the filter is applied
        if (isFilterOpen) return item.status === 'OPEN';

        // Shows only blocked intersections if the filter is applied
        if (isFilterBlocked) return item.status === 'BLOCKED';
        
        // Cameras under Maintenance
        if (isFilterMaintenance) return item.status === 'MAINTENANCE';
        return true; // No filters applied
    });

    // Updates # of intersections shown when filteredIntersections changes
    // setIntersectionsShown hook will run whenever filteredIntersections changes
    useEffect(() => {
        setintersectionsShown(filteredIntersections.length);
    }, [filteredIntersections]);
    
    //------------------------------------------------------------------------------------------------


    // Dashboard UI 
    return(
        <div>
            <div className="top-dashboard shadow">
                <div className="dash-main">
                    <div className="dash-main-1">Muncie, IN</div>
                    {/* <hr /> */}
                    <div className="dash-main-2">Total Intersections | <span>{totalIntersections}</span></div>
                    <div className="dash-main-3">Problems Reported (Last 30 days) | <span>{getTotalReports}</span></div>
                </div>

                {/* Open map view BUTTON */}
                <button onClick={interfactLiveRedirect} className='map-view'>Map View</button>
                {/* Refresh page BUTTON */}
                <button onClick={refreshPage} className='refresh-button'><FontAwesomeIcon icon={faArrowsRotate}/></button>
            </div>

            <div className="filter">
                    {/* Toggle filter bar BUTTON */}
                    <button onClick={filterIntersections} className='filter-1 shadow'><FontAwesomeIcon icon={faFilter}/> Filter</button>
                    
                    {/* Shows # of filtered intersections */}
                    <div className='filter-2'>showing {intersectionsShown} intersections</div>
            </div>

            {/* Toggles filterbar shadow based on if isFiltering is filtering */}
            <div className={`filter-bar shadow ${isFiltering ? '': 'hidden'}`}>
                <div className='blocked-open'>

                {/* Calls filterOptions() onClick, passes open or closed as string depending on the button that is pressed */ }

                <div onClick={() => filterOptions("Open")} className={isFilterOpen === false ? 'filter-option-open': 'filter-option-open-selected'}>OPEN</div>
                <div onClick={() => filterOptions("Blocked")} className={isFilterBlocked === false ? 'filter-option-blocked': 'filter-option-blocked-selected'}>BLOCKED</div>
                <div onClick={() => filterOptions("Maintenance")} className={isFilterMaintenance === false ? 'filter-option-maintenance': 'filter-option-maintenance-selected'}>UNDER MAINTENANCE</div>
                
                </div>
            </div>

            <div className="intersection-list">
                
                {Array.isArray(filteredIntersections) ? (
                    filteredIntersections.map((item) => (
                <div key={item.id} className="intersection-item shadow" onClick={() => navToIntersectionPage(item.id)}>
                    <div className="item-img-container">
                        <img src={item.imagepath} alt={item.name} />
                        <div className="item-reports">{getReportsForIntersection(item.id)}</div>
                        <div className="item-name">{item.name}</div>
                    </div>
                <div className="item-info-container">
                    <div className="item-last-update">
                        <span>Last Update | </span> {calculateDifferenceInMinutes(item.timestamp)} minutes ago
                    </div>
                    <div className="item-status">
                        <span>Image Classification | </span> {item.status}
                    </div>
                    <div className="item-down">
                        <span>Camera Status | </span> {calculateDifferenceInMinutes(item.timestamp) < 10 ? "Working" : "Not Working"}
                    </div>
                </div>
                <div
                    className={
                        calculateDifferenceInMinutes(item.timestamp) < 10 ? "good-indicator" : "bad-indicator"
                    }
                ></div>
        </div>
    ))) : (<div></div>)}

    {/* Add camera item in list */ }
                <div className='intersection-add shadow'>
                    <div onClick={goToAddCamera} className='fa-plus shadow'><FontAwesomeIcon icon={faPlus} size='3x'/></div>
                </div>
            </div>
        </div>
    );
}