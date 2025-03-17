import '@testing-library/jest-dom';
import IntersectionsPage from '../src/app/Intersection/[id]/page.tsx'
import { useIntersections } from '../src/app/hooks/useIntersections.ts';
import { useUserFeedback } from '../src/app/hooks/useUserFeedback.ts';
import { beforeEach } from 'node:test';
import { useParams } from 'next/navigation.js';
import { fireEvent, render, screen } from '@testing-library/react';
import { expect } from '@jest/globals';
import { useLogs } from '../src/app/hooks/useLogs.ts';
import { mockLogs, mockUserFeedback, mockIntersections } from '../__mocks__/mockData.ts';


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

global.fetch = jest.fn((endpoint, object) => {
    if(endpoint == "/api/log"){
        Promise.resolve({
            json: () => Promise.resolve([]),
            ok: true,
        })
    }
    if(endpoint == "/api/report"){
        Promise.resolve({
            json: () => Promise.resolve([]),
            ok: true
        })
    }
    
})



const mockId = mockIntersections[0].id;

describe('IntersectionPage', () => {
    beforeEach(() =>{
        jest.clearAllMocks();
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




describe("Reports", () => {
    it('displays only reports for the correct intersection', () => {
        useParams.mockReturnValue({id: "TEST2"});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);
        useLogs.mockReturnValue({logs: mockLogs, loading: false, error: null});

        render(<IntersectionsPage/>)
        
        expect(screen.getAllByTestId("report").length).toBe(1);
    })

    it('displays no reports if none exist', () => {
        useParams.mockReturnValue({id: "fakeIntersection"});
        useIntersections.mockReturnValue(mockIntersections);
        useUserFeedback.mockReturnValue(mockUserFeedback);
        useLogs.mockReturnValue({logs: mockLogs, loading: false, error: null});

        render(<IntersectionsPage/>)
        
        expect(screen.getByText("No reports found for this intersection.")).toBeInTheDocument();
        expect(screen.queryByTestId("report")).not.toBeInTheDocument();
    })


  
})
