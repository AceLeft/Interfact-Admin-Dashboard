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


    const intersections = useIntersections();
    const userFeedback = useUserFeedback();
    const router = useRouter();

    const [ isFiltering, setIsFiltering ] = useState<boolean | null>(null);
    const [ isFilterOpen, setIsFilterOpen ] = useState<boolean | null>(false);
    const [ isFilterBlocked, setIsFilterBlocked ] = useState<boolean | null>(false);

    const [ intersectionsShown, setintersectionsShown] = useState<number | null>(0);

    const [refreshKey, setRefreshKey] = useState<number>(0);

    const getTotalReports = userFeedback.reduce((total, user) => {
        return total + (user.reports ? user.reports.length : 0);
    }, 0);

    const totalIntersections = intersections.length;

    const refreshPage = () => {
        setRefreshKey((prevKey) => prevKey + 1); 
        setIsFiltering(null)
        setIsFilterOpen(false)
        setIsFilterBlocked(false)
    };

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

    const navToIntersectionPage = (id: string) =>{
        router.push(`/Intersection/${id}`)
    }

    const filterIntersections = () =>{
        setIsFiltering(!isFiltering) 
    } 

    const filterOptions = (selectedOption: string) => {
        switch (selectedOption) {
            
            case 'Open':
                if(isFilterBlocked !== true){
                    setIsFilterOpen(!isFilterOpen)
                }
                break;

            case 'Blocked':
                if(isFilterOpen !== true){
                    setIsFilterBlocked(!isFilterBlocked)
                }
                break;

            default:
                console.warn(`Unknown filter option: ${selectedOption}`);
                break;
        }
    };

    const filteredIntersections = intersections.filter((item) => {
        if (isFilterOpen) return item.status === 'OPEN';
        if (isFilterBlocked) return item.status === 'BLOCKED';
        return true; // No filters applied
    });

    useEffect(() => {
        setintersectionsShown(filteredIntersections.length);
    }, [filteredIntersections]);
    

    const interfactLiveRedirect = () => {
        window.open('https://interfact.live/map', '_blank');
      };

    const goToAddCamera = () =>{
        router.push("/add_camera")
    }

    
      
    return(
        <div>
            <div className="top-dashboard shadow">
                <div className="dash-main">
                    <div className="dash-main-1">Muncie, IN</div>
                    {/* <hr /> */}
                    <div className="dash-main-2">Total Intersections | <span>{totalIntersections}</span></div>
                    <div className="dash-main-3">Problems Reported (Last 30 days) | <span>{getTotalReports}</span></div>
                </div>
                <button onClick={interfactLiveRedirect} className='map-view'>Map View</button>
                <button onClick={refreshPage} className='refresh-button'><FontAwesomeIcon icon={faArrowsRotate}/></button>
            </div>
            <div className="filter">
                    <button onClick={filterIntersections} className='filter-1 shadow'><FontAwesomeIcon icon={faFilter}/> Filter</button>
                    <div className='filter-2'>showing {intersectionsShown} intersections</div>
            </div>

            <div className={`filter-bar shadow ${isFiltering ? '': 'hidden'}`}>
                <div className='blocked-open'>

                {/* Calls filterOptions() onClick, passes open or closed as string depending on the button that is pressed */ }

                <div onClick={() => filterOptions("Open")} className={isFilterOpen === false ? 'filter-option-open': 'filter-option-open-selected'}>OPEN</div>
                    <div onClick={() => filterOptions("Blocked")} className={isFilterBlocked === false ? 'filter-option-blocked': 'filter-option-blocked-selected'}>BLOCKED</div>

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