import '@testing-library/jest-dom';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import Cities from '../src/app/cities/page.tsx'
import { useIntersections } from '../src/app/hooks/useIntersections';
import { describe } from 'node:test';

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



describe('Muncie tab', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('show correct number of intersections', () => {
    // Value doesnt matter, just how many
    const intersectionsData = [{},{},{}];

    useIntersections.mockReturnValue(intersectionsData);

    render(<Cities />);

    expect(screen.getByText('Intersections | ' + intersectionsData.length)).toBeInTheDocument();
  });

  it('shows 0 intersections if none', () => {
    useIntersections.mockReturnValue([]);
    render(<Cities />);
    expect(screen.getByText('Intersections | 0')).toBeInTheDocument();
  });

  it('navigates to dashboard', () => {
    render(<Cities />);
    const muncie = screen.getByText('Muncie');
    expect(muncie).toBeInTheDocument();
    fireEvent.click(muncie);

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  })
});