import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loading from '../components/Loading'

describe('Loading Component', () => {
  it('renders loading message', () => {
    render(<Loading />)
    
    expect(screen.getByText(/carregando/i)).toBeInTheDocument()
  })

  it('renders loading spinner', () => {
    render(<Loading />)
    
    // Assuming the Loading component has a spinner element
    const spinner = screen.getByRole('status') || screen.getByTestId('loading-spinner')
    expect(spinner).toBeInTheDocument()
  })
})
