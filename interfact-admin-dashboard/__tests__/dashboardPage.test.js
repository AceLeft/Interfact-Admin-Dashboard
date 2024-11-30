import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/dashboard/page.tsx'
import React from 'react'

 
describe('Home', () => {
  it('renders a filter for intersections', () => {
    render(<Home />)
 
    const intersectionList = screen.getByRole('Filter')
 
    expect(intersectionList).toBeInTheDocument()
  })
})