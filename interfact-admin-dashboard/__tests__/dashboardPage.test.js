import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import Home from '../src/app/dashboard/page.tsx';
import { useIntersections } from '../src/app/hooks/useIntersections';
import { useUserFeedback } from '../src/app/hooks/useUserFeedback';

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


describe('Home', () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
      { reports: [{ reportid: '1' }, { reportid: '2' }] },
      { reports: [{ reportid: '3' }] },
      { reports: [] },
    ];
    useUserFeedback.mockReturnValue(userFeedbackData);
  
    render(<Home />);
  
    const problemsReportedText = screen.getByText((content, element) => {
      return element.textContent === 'Problems Reported (Last 30 days) | 3';
    });
    
    expect(problemsReportedText).toBeInTheDocument();
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


  it('when Open filter is selected, only OPEN status intersections are displayed', () => {
    useIntersections.mockReturnValue(filterIntersectionData);
    useUserFeedback.mockReturnValue([]);

    render(<Home />);

    // Open the filter options
    const filterButton = screen.getByText(/Filter/);
    fireEvent.click(filterButton);

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
    useIntersections.mockReturnValue(filterIntersectionData);
    useUserFeedback.mockReturnValue([]);

    render(<Home />);

    // Open the filter options
    const filterButton = screen.getByText(/Filter/);
    fireEvent.click(filterButton);

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
    useIntersections.mockReturnValue(filterIntersectionData);
    useUserFeedback.mockReturnValue([]);

    render(<Home />);

    // Open the filter options
    const filterButton = screen.getByText(/Filter/);
    fireEvent.click(filterButton);

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


  it('clicking on the Add button navigates to /add_camera', () => {
    useIntersections.mockReturnValue([]);
    useUserFeedback.mockReturnValue([]);
  
    const { container } = render(<Home />);
  
    // Select the Add button using class name
    const addButton = container.querySelector('.fa-plus');
  
    expect(addButton).toBeInTheDocument();
  
    fireEvent.click(addButton);

    expect(mockPush).toHaveBeenCalledWith('/add_camera');
  });  


  it('should navigate to the add camera page when "c" is pressed', () => {
    render(<Home />);
 
     fireEvent.keyDown(document, {key: 'c'});
 
     expect(mockPush).toHaveBeenCalledWith('/add_camera');
   });
 });
