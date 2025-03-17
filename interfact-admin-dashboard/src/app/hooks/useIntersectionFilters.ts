import { useState, useEffect } from "react";
import calculateDifferenceInMinutes from "../utils/dashboard/timeCaculator";

export const useIntersectionFilters = (intersections: any[]) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isFilterBlocked, setIsFilterBlocked] = useState(false);
  const [isFilterMaintenance, setIsFilterMaintenance] = useState(false);
  const [isFilterWorking, setIsFilterWorking] = useState(false);
  const [isFilterNotWorking, setIsFilterNotWorking] = useState(false);

  const filterOptions = (selectedOption: string) => {
    switch (selectedOption) {
      case "Open":
        if (!isFilterBlocked || !isFilterMaintenance) {
          setIsFilterOpen((prev) => !prev);
        }
        break;
      case "Blocked":
        if (!isFilterOpen || !isFilterMaintenance) {
          setIsFilterBlocked((prev) => !prev);
        }
        break;
      case "Maintenance":
        if (!isFilterOpen || !isFilterBlocked) {
          setIsFilterMaintenance((prev) => !prev);
        }
        break;
      case "Operational":
        if (!isFilterOpen || !isFilterBlocked || !isFilterMaintenance) {
          setIsFilterWorking((prev) => !prev);
        }
        break;
      case "Inactive":
        if (!isFilterOpen || !isFilterBlocked || !isFilterMaintenance) {
          setIsFilterNotWorking((prev) => !prev);
        }
        break;
      default:
        console.warn(`Unknown filter option: ${selectedOption}`);
        break;
    }
  };

  const filteredIntersections = intersections.filter((item) => {
    if (isFilterOpen) return item.status === "OPEN";
    if (isFilterBlocked) return item.status === "BLOCKED";
    if (isFilterMaintenance) return item.status === "MAINTENANCE";
    if (isFilterWorking) {
      if (calculateDifferenceInMinutes(item.timestamp) < 10) {
        return item.status === "OPERATIONAL";
      }
    }
    if (isFilterNotWorking) {
      if (calculateDifferenceInMinutes(item.timestamp) > 10) {
        return item.status === "INACTIVE";
      }
    }
    return true;
  });

  return { filteredIntersections, filterOptions };
};
