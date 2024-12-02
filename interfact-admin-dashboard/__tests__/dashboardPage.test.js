import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/dashboard/page.tsx'
import React from 'react'

// Mock useRouter:
jest.mock("next/navigation", () => ({
  useRouter() {
    jest.fn(() => ({
      push: jest.fn(),
      replace: jest.fn(),
    }))
  }
}));
 
describe('Home', () => {
  it('has no created intersections', () => {

    render(<Home />)
 
    const intersectionList = screen.getByText("showing 0 intersections", {exact: false})
 
    expect(intersectionList).toBeInTheDocument()
  })
  
})