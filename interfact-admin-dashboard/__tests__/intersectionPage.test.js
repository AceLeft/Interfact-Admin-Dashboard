import '@testing-library/jest-dom';
import IntersectionsPage from '../src/app/Intersection/[id]/page.tsx'
import { useIntersections } from '../src/app/hooks/useIntersections.ts';
import { useUserFeedback } from '../src/app/hooks/useUserFeedback.ts';
import { beforeEach } from 'node:test';
import { useParams } from 'next/navigation.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';


jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}))

jest.mock('../src/app/hooks/useUserFeedback.ts', () => ({
    useUserFeedback: jest.fn(),
  }));

jest.mock('../src/app/hooks/useIntersections.ts', () => ({
    useIntersections: jest.fn(),
}))

global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ test: 100 }),
    }),
)


const mockId = 'ELL1'
const mockIntersections = [
    {
        id: 'ELL1',
        name: 'Elliot',
        imagepath: '/test.png',
        latitude: 100,
        longitude: 60,
        status: "blocked",
        timestamp: 4324234,
    },
    {
        id: 'BET1',
        name: 'Bethel',
        imagepath: '/test.png',
        latitude: 324,
        longitude: 865,
        status: "blocked",
        timestamp: 2354252,
    }
];

describe('IntersectionPage', () => {
    beforeEach(() =>{
        jest.clearAllMocks();
    })

    it('sets interesection ID when a valid ID is found in Intersections', () => {
        useParams.mockReturnValue({id: mockId});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue([]);

        render(<IntersectionsPage/>)
        
        expect(
            screen.getByRole('heading', { name: /Elliot \(ELL1\)/ })
          ).toBeInTheDocument();
    })

    it('Shows an error when given no ID', () => {
        useParams.mockReturnValue({id: []});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue([]);

        render(<IntersectionsPage/>)
        
        expect(screen.getByText("No valid ID provided.")).toBeInTheDocument();
    })
})

// An array of UserFeedbacks
const mockUserFeedback = [
    {
        id: "John Doe",
        // An array of reports
        reports: [
            {
                classification: "OPEN",
                reportid: mockId,
                reporturl: ""
            },
            {
                classification: "CLOSED",
                reportid: "JAM3",
                reporturl: ""
            },  
        ],
        requests: []
    },

    {
        id: "Sam Samuel",
        reports: [
            {
                classification: "OPEN",
                reportid: "LOG5",
                reporturl: ""
            },
            {
                classification: "CLOSED",
                reportid: mockId,
                reporturl: ""
            }, 
            {
                classification: "CLOSED",
                reportid: mockId,
                reporturl: ""
            },  
        ],
        requests: []
    }
]

describe("Requests", () => {
    it('displays only requests for the correct intersection', () => {
        useParams.mockReturnValue({id: mockId});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);

        render(<IntersectionsPage/>)
        
        expect(screen.getAllByTestId("report").length).toBe(3);
    })

    it('displays no requests if none exist', () => {
        useParams.mockReturnValue({id: "fakeIntersection"});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);

        render(<IntersectionsPage/>)
        
        expect(screen.getByText("No reports found for this intersection.")).toBeInTheDocument();
        expect(screen.queryByTestId("report")).not.toBeInTheDocument();
    })

    it('calls fetch when approve is pressed', () => {
        // This is as close to testing the db as I can get
        useParams.mockReturnValue({id: mockId});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);

        render(<IntersectionsPage/>);
        const approveButton = screen.getAllByTestId("confirm")[0];
        expect(approveButton).not.toBeNull();
        fireEvent.click(approveButton);
        expect(fetch).toHaveBeenCalled();
    })
})
