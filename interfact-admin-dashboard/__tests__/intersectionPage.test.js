import '@testing-library/jest-dom';
import IntersectionsPage from '../src/app/Intersection/[id]/page.tsx'
import { useIntersections } from '../src/app/hooks/useIntersections.ts';
import { useUserFeedback } from '../src/app/hooks/useUserFeedback.ts';
import { beforeEach } from 'node:test';
import { useParams } from 'next/navigation.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useLogs } from '../src/app/hooks/useLogs.ts';


jest.mock('next/navigation', () => ({
    useParams: jest.fn(),
}))

jest.mock('../src/app/hooks/useUserFeedback.ts', () => ({
    useUserFeedback: jest.fn(),
  }));

jest.mock('../src/app/hooks/useIntersections.ts', () => ({
    useIntersections: jest.fn(),
}))

jest.mock('../src/app/hooks/useLogs.ts', () => ({
    useLogs: jest.fn(),
}))

global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([]),
    }),
)


const mockIntersections = [
    {
        id: 'TEST1',
        name: 'Street',
        imagepath: '/test.png',
        latitude: 100,
        longitude: 60,
        status: "blocked",
        timestamp: 4324234,
    },
    {
        id: 'TEST2',
        name: 'Road',
        imagepath: '/test.png',
        latitude: 324,
        longitude: 865,
        status: "blocked",
        timestamp: 2354252,
    }
];
const mockId = mockIntersections[0].id;

describe('IntersectionPage', () => {
    beforeEach(() =>{
        jest.clearAllMocks();
        useLogs.mockReturnValue({logs: [], loading: false, error: null});
    })

    it('sets interesection ID when a valid ID is found in Intersections', () => {
        useParams.mockReturnValue({id: mockId});
        useIntersections.mockReturnValue(mockIntersections);
        useLogs.mockReturnValue({logs: [], loading: false, error: null});
        useUserFeedback.mockReturnValue([]);
        let mockName = mockIntersections[0].name;

        render(<IntersectionsPage/>)
        
        expect(
            screen.getByRole('heading', { name: mockName +' (' + mockId + ')' })
          ).toBeInTheDocument();
    })

    it('Shows an error when given no ID', () => {
        useParams.mockReturnValue({id: []});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue([]);
        useLogs.mockReturnValue({logs: [], loading: false, error: null});

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
        useLogs.mockReturnValue({logs: [], loading: false, error: null});

        render(<IntersectionsPage/>)
        
        expect(screen.getAllByTestId("report").length).toBe(3);
    })

    it('displays no requests if none exist', () => {
        useParams.mockReturnValue({id: "fakeIntersection"});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);
        useLogs.mockReturnValue({logs: [], loading: false, error: null});

        render(<IntersectionsPage/>)
        
        expect(screen.getByText("No reports found for this intersection.")).toBeInTheDocument();
        expect(screen.queryByTestId("report")).not.toBeInTheDocument();
    })

    it('calls fetch when approve is pressed', () => {
        // This is as close to testing the db as I can get
        useParams.mockReturnValue({id: mockId});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);
        useLogs.mockReturnValue({logs: [], loading: false, error: null});

        render(<IntersectionsPage/>);
        const approveButton = screen.getAllByTestId("confirm")[0];
        expect(approveButton).not.toBeNull();
        fireEvent.click(approveButton);
        expect(fetch).toHaveBeenCalled();
    })
})
