import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import Home from '../src/app/dashboard/page.tsx';
import { useIntersections } from '../src/app/hooks/useIntersections';
import { useUserFeedback } from '../src/app/hooks/useUserFeedback';
import { describe } from 'node:test';
import { useLogs } from '../src/app/hooks/useLogs.ts';
import { main } from 'ts-node/dist/bin';

// Mock useRouter:
const mockPush = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
  }),
}));

// Mock useIntersections
jest.mock('../src/app/hooks/useIntersections', () => ({
  useIntersections: jest.fn(),
}));

// Mock useUserFeedback
jest.mock('../src/app/hooks/useUserFeedback', () => ({
  useUserFeedback: jest.fn(),
}));

jest.mock('../src/app/hooks/useLogs', () => ({
  useLogs: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  }),
)


const filterIntersectionData = [
  {
    id: '1',
    name: 'Intersection 1',
    status: 'OPEN',
    timestamp: new Date().toISOString(),
    imagepath: '/image1.jpg',
  },
  {
    id: '2',
    name: 'Intersection 2',
    status: 'BLOCKED',
    timestamp: new Date().toISOString(),
    imagepath: '/image2.jpg',
  },
  {
    id: '3',
    name: 'Intersection 3',
    status: 'MAINTENANCE',
    timestamp: new Date().toISOString(),
    imagepath: '/image3.jpg'
  }
];


describe('Default dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useLogs.mockReturnValue({logs: [], loading: false, error: null});
  });

  it('displays intersections correctly', () => {
    const intersectionsData = [
      {
        id: 'ELL1',
        name: 'Intersection 1',
        status: 'OPEN',
        timestamp: new Date().toISOString(),
        imagepath: '/image1.jpg',
      },
      {
        id: 'ELL2',
        name: 'Intersection 2',
        status: 'BLOCKED',
        timestamp: new Date().toISOString(),
        imagepath: '/image2.jpg',
      },
    ];

    useIntersections.mockReturnValue(intersectionsData);
    useUserFeedback.mockReturnValue([]);

    render(<Home />);

    intersectionsData.forEach((intersection) => {
      // Find the intersection container
      const intersectionItem = screen.getByText(intersection.name).closest('.intersection-item');

      expect(intersectionItem).toBeInTheDocument();

      const scopedQueries = within(intersectionItem);

      // Check for image classification and status in each item
      expect(scopedQueries.getByText('Image Classification |')).toBeInTheDocument();
      expect(scopedQueries.getByText(intersection.status)).toBeInTheDocument();

      // Check for an image within the item
      const image = scopedQueries.getByAltText(intersection.name);
      expect(image).toHaveAttribute('src', intersection.imagepath);
    });

    // Check correct amount of images are rendered
    const renderedImages = screen.getAllByRole('img');
    expect(renderedImages.length).toBe(intersectionsData.length);
  });


  it('has no created intersections', () => {
    useIntersections.mockReturnValue([]);
    useUserFeedback.mockReturnValue([]);

    render(<Home />);

    const intersectionList = screen.getByText('showing 0 intersections', { exact: false });

    expect(intersectionList).toBeInTheDocument();
  });


  it('displays the total number of problems reported in the last 30 days', () => {
    useIntersections.mockReturnValue([]);
    const userFeedbackData = [
      { reports: [{ logid: '1' }, { logid: '2' }] },
      { reports: [{ logid: '3' }] },
      { reports: [] },
    ];
    const logdata = [
      {
        logid: '1',
        cameraid: "", timestamp: "", filename: "",
        status: "", path: ""
      },
      {
        logid: '2',
        cameraid: "", timestamp: "", filename: "",
        status: "", path: ""
      },
      {
        logid: '3',
        cameraid: "", timestamp: "", filename: "",
        status: "", path: ""
      },
      {
        logid: '4',
        cameraid: "", timestamp: "", filename: "",
        status: "", path: ""
      },
    ]
    useUserFeedback.mockReturnValue(userFeedbackData);
    useLogs.mockReturnValue(logdata);
    
    render(<Home />);
  
    const problemsReportedText = screen.getByTestId("reports-amount");
    
    expect(problemsReportedText).toBeInTheDocument();
    expect(problemsReportedText.textContent).toBe("3");
  });
  
 });

function setUpForFilters() {
  useIntersections.mockReturnValue(filterIntersectionData);
  useUserFeedback.mockReturnValue([]);
  render(<Home />);
  // Open the filter options
  const filterButton = screen.getByText(/Filter/);
  fireEvent.click(filterButton);
}


describe("Dashboard filters", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('when Open filter is selected, only OPEN status intersections are displayed', () => {
    setUpForFilters();

    // Select OPEN filter using a custom matcher
    const openFilterOption = screen.getByText((content, element) => {
      return (
        content === 'OPEN' &&
        element.className.includes('filter-option-open')
      );
    });
    fireEvent.click(openFilterOption);

    // Verify that only OPEN status intersection is displayed
    expect(screen.getByText(filterIntersectionData[0].name)).toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[1].name)).not.toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[2].name)).not.toBeInTheDocument();
  });

  it('when Blocked filter is selected, only BLOCKED status intersections are displayed', () => {
    setUpForFilters();

    // Select BLOCKED filter
    const openFilterOption = screen.getByText((content, element) => {
      return (
        content === 'BLOCKED' &&
        element.className.includes('filter-option-blocked')
      );
    });
    fireEvent.click(openFilterOption);

    // Verify that only BLOCKED status intersection is displayed
    expect(screen.getByText(filterIntersectionData[1].name)).toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[2].name)).not.toBeInTheDocument();
  });

  it('when Maintenance filter is selected, only UNDER_MAINTENANCE status intersections are displayed', () => {
    setUpForFilters();

    // Select UNDER_MAINTENANCE filter
    const openFilterOption = screen.getByText((content, element) => {
      return (
        content === 'UNDER MAINTENANCE' &&
        element.className.includes('filter-option-maintenance')
      );
    });
    fireEvent.click(openFilterOption);

    // Verify that only UNDER_MAINTENANCE status intersection is displayed
    expect(screen.getByText(filterIntersectionData[2].name)).toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[0].name)).not.toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[1].name)).not.toBeInTheDocument();
  });

  it('when a second filter is selected, the other filters do not appear', () => {
    setUpForFilters();
    const maintenanceButton = screen.getByText((content, element) => {
      return (
        content === 'UNDER MAINTENANCE' &&
        element.className.includes('filter-option-maintenance')
      );
    });
    fireEvent.click(maintenanceButton);

    const openButton = screen.getByText((content, element) => {
      return (
        content === 'OPEN' &&
        element.className.includes('filter-option-open')
      );
    });
    fireEvent.click(openButton);

    // Verify that only OPEN status intersection is displayed
    expect(screen.getByText(filterIntersectionData[0].name)).toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[1].name)).not.toBeInTheDocument();
    expect(screen.queryByText(filterIntersectionData[2].name)).not.toBeInTheDocument();
  });
 });



describe("Dashboard navigation", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('clicking on the Map View button opens the correct URL', () => {
    useIntersections.mockReturnValue([]);
    useUserFeedback.mockReturnValue([]);

    // Mock window.open
    window.open = jest.fn();
    render(<Home />);
    const mapViewButton = screen.getByText('Map View');
    fireEvent.click(mapViewButton);

    expect(window.open).toHaveBeenCalledWith('https://interfact.live/map', '_blank');
  });

 });

 
 
describe("Dashboard popup behavior", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // LocalStorage cleared before each test
    localStorage.clear();
  });

  it('Popup is visible when popupFlag is not in localStorage', () => {
    render(<Home />);

    // Test if the popup is visible by scanning the screen for popup text
    const popup = screen.getByText('Keyboard Shortcuts');
    expect(popup).toBeInTheDocument();
  });

  it('shows the shortcuts when the popup is clicked', () => {
    render(<Home />);

    const popup = screen.getByText('Keyboard Shortcuts');
    expect(popup).toBeInTheDocument();
    fireEvent.click(popup);

    const shortcuts = screen.getByTestId("shortcuts-list");
    expect(shortcuts).toBeInTheDocument();
  })

  it('X button hides the popup & stores the flag in localStorage when clicked', () => {
    render(<Home />);

    const popup = screen.getByText('Keyboard Shortcuts');
    expect(popup).toBeInTheDocument();
    fireEvent.click(popup);

    // Click the X button to close the popup
    const closeButton = screen.getByText('X');
    fireEvent.click(closeButton);

    // Test that the popup is no longer visible after clicking the X button
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();

    // Test that the flag is in localStorage (setPopupFlag = false / the popup is not set)
    expect(localStorage.getItem('popupFlag')).toBe('false');
  });

  it('Popup is not visable after the X button is clicked and page is reloaded', () => {
    // Popup is already saved in localStorage
    localStorage.setItem('popupFlag', 'false');

    render(<Home />);
    expect(screen.queryByText('Keyboard Shortcuts')).not.toBeInTheDocument();
  });
 
});