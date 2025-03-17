
'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { useIntersections } from "../hooks/useIntersections";
import { useUserFeedback } from '../hooks/useUserFeedback';
import { useLogs } from '../hooks/useLogs'; 
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import calculateDifferenceInMinutes from "../utils/dashboard/timeCaculator";
import { getReportsForIntersection } from "../utils/dashboard/getReportsForIntersection";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";
import { useIntersectionFilters } from "../hooks/useIntersectionFilters";

export default function Dashboard() {

    //------------------------------ Hooks -----------------------------

    // Hooks to get data or utilities
    const { logs, loading, error } = useLogs();
    const intersections = useIntersections();
    const userFeedback = useUserFeedback();
    const router = useRouter();

    // React Hooks handle the state of the const
    const [ isFiltering, setIsFiltering ] = useState<boolean | null>(null);
    const [ isFilterOpen, setIsFilterOpen ] = useState<boolean | null>(false);
    const [ isFilterBlocked, setIsFilterBlocked ] = useState<boolean | null>(false);
    const [ isFilterMaintenance, setIsFilterMaintenance ] = useState<boolean | null>(false);
    const [isFilterWorking, setIsFilterWorking] = useState<boolean | null>(false);
    const [isFilterNotWorking, setIsFilterNotWorking] = useState<boolean | null>(false);

    const [ intersectionsShown, setintersectionsShown] = useState<number | null>(0);
    const [refreshKey, setRefreshKey] = useState<number>(0);

    // Tab is hidden on default
    const [isShortcutTabExpanded, setIsShortcutTabExpanded] = useState(false);
    // Flag that controls popup visibility
    const [popupFlag, setPopupFlag] = useState(true);




    //---------------------------- User Report & Intersection Elements -------------------------------

    // Total # of intersections
    const totalIntersections = intersections.length;

    const getTotalReports = userFeedback.reduce((total, user) => {
        return total + (user.reports ? user.reports.length : 0);
    }, 0);

    //----------------------------------- Page Utility Elements --------------------------------------

    // Refreshes the page 
    const refreshPage = () => {
        // Refreash page key
        setRefreshKey((prevKey) => prevKey + 1); 
        // Reset the filters
        setIsFiltering(null)
        setIsFilterOpen(false)
        setIsFilterBlocked(false)
        setIsFilterMaintenance(false)
        setIsFilterWorking(false)
        setIsFilterNotWorking(false)
    };

    // Navigate to intersection page by the intersection id
    const navToIntersectionPage = (id: string) =>{
        router.push(`/Intersection/${id}`)
    }

    // Redirect component to Interfact.live
    const interfactLiveRedirect = () => {
        window.open('https://interfact.live/map', '_blank');
      };

    
    const tabToggle = () => setIsShortcutTabExpanded(!isShortcutTabExpanded);

    // ------------------------- Keyboard shortcuts -------------------------
    
    useKeyboardShortcuts();


    // ------------------------- Popup Close -------------------------

    useEffect(() => {
        // Check localStorage if the popup has been closed before
        const hasClosedPopup = localStorage.getItem('popupFlag');
        
        if (hasClosedPopup === 'false') {
            // Popup wont show if flag is false
            setPopupFlag(false);
        }}, []);

    //----------------------------------- Filter Elements --------------------------------------------

    const { filteredIntersections, filterOptions } = useIntersectionFilters(intersections);

    const toggleFilterBar = () => {
        setIsFiltering((prev) => !prev);
    };

    // Updates # of intersections shown when filteredIntersections changes
    // setIntersectionsShown hook will run whenever filteredIntersections changes
    useEffect(() => {
        setintersectionsShown(filteredIntersections.length);
    }, [filteredIntersections]);
    

    // Dashboard UI 
    return(
        <div>
            <div className="top-dashboard shadow">
                <div className="dash-main">
                    <div className="dash-main-1">Muncie, IN</div>
                    {/* <hr /> */}
                    <div className="dash-main-2">Total Intersections | <span>{totalIntersections}</span></div>
                    
                    <div className="dash-main-3" >Problems Reported | 
                        {/* The data-testid is necessary for testing */}
                        <span data-testid="reports-amount">{getTotalReports}</span></div>
                </div>

                {/* Open map view BUTTON */}
                <button onClick={interfactLiveRedirect} className='map-view'>Map View</button>
                {/* Refresh page BUTTON */}
                <button onClick={refreshPage} className='refresh-button' data-testid="refresh-button"><FontAwesomeIcon icon={faArrowsRotate}/></button>
            </div>

            <div className="filter">
                    {/* Toggle filter bar BUTTON */}
                    <button onClick={toggleFilterBar} className='filter-1 shadow'><FontAwesomeIcon icon={faFilter}/> Filter</button>
                    
                    {/* Shows # of filtered intersections */}
                    <div className='filter-2'>showing {intersectionsShown} intersections</div>
            </div>

            {/* Toggles filterbar shadow based on if isFiltering is filtering */}
            <div className={`filter-bar shadow ${isFiltering ? '': 'hidden'}`}>
                <div className='blocked-open'>

                {/* Calls filterOptions() onClick, passes open or closed as string depending on the button that is pressed */ }
                {/* Lines 286 & 292 for css sheet */ }
                <div onClick={() => filterOptions("Open")} className={isFilterOpen === false ? 'filter-option-open': 'filter-option-open-selected'}>OPEN</div>
                <div onClick={() => filterOptions("Blocked")} className={isFilterBlocked === false ? 'filter-option-blocked': 'filter-option-blocked-selected'}>BLOCKED</div>
                <div onClick={() => filterOptions("Maintenance")} className={isFilterMaintenance === false ? 'filter-option-maintenance': 'filter-option-maintenance-selected'}>UNDER MAINTENANCE</div>
                <div onClick={() => filterOptions("Operational")} className={isFilterWorking === false ? 'filter-option-working' : 'filter-option-working-selected'}>WORKING</div>
                <div onClick={() => filterOptions("Inactive")} className={isFilterNotWorking === false ? 'filter-option-inactive' : 'filter-option-inactive-selected'}>INACTIVE</div>

                </div>
            </div>

            <div className="intersection-list">
                
                {Array.isArray(filteredIntersections) ? (
                    filteredIntersections.map((item) => (
                <div key={item.id} className="intersection-item shadow" onClick={() => navToIntersectionPage(item.id)}>
                    <div className="item-img-container">
                        <img src={item.imagepath} alt={item.name} />
                        <div className="name-reports-container">
                            <div className="item-name">{item.name}</div>
                            <div className={getReportsForIntersection(item.id, userFeedback, logs) >= 1 ? "item-reports" : "no-item-reports"}> {getReportsForIntersection(item.id, userFeedback, logs) >= 1 ? getReportsForIntersection(item.id, userFeedback, logs) : ""}</div>
                        </div>
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
                        item.status === "MAINTENANCE" ? "maintenance-indicator" :calculateDifferenceInMinutes(item.timestamp) < 10 ? "good-indicator" : "bad-indicator"
                    }
                ></div>
        </div>
    ))) : (<div></div>)}

    {/* Hidden Tab to show keyboard shortcuts */}
    {popupFlag &&(
    <div className={`keyboard-shortcut-tab ${isShortcutTabExpanded ? 'expanded' : ''}`} onClick={tabToggle}>
        <div className="tab-content"> 
            {isShortcutTabExpanded ? (
                <div className="shortcut-list">

                    {/* x button to close the tab */}
                    <button className="close-btn" onClick={(e) => {
                         e.stopPropagation();
                         // Minimize Tab
                         setIsShortcutTabExpanded(false);
                         // localStorage saves value pairs in the browser. Is saved after browser close.
                         // Store the flag in localStorage to show x has been clicked previously
                         localStorage.setItem('popupFlag', 'false');
                         // Update flag to hide popup
                         setPopupFlag(false);
                    }}> X </button>

                    <h3>Keyboard Shortcuts</h3>
                        <ul data-testid="shortcuts-list">
                            <li><strong> R :</strong> Requests Page </li>
                        </ul>
                    </div>
            ) : (
                <span>Keyboard Shortcuts</span>
            )}
        </div>
    </div>
    )}
        </div>
    </div>
    );
}
