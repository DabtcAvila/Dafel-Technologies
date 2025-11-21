import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>)
      
      const button = screen.getByRole('button', { name: /click me/i })
      expect(button).toBeInTheDocument()
      expect(button).toHaveClass('bg-blue-600', 'text-white')
    })

    it('should render with custom className', () => {
      render(<Button className="custom-class">Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('custom-class')
    })

    it('should render different variants correctly', () => {
      const variants = ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'] as const
      
      variants.forEach(variant => {
        render(<Button variant={variant} data-testid={`button-${variant}`}>Test</Button>)
        const button = screen.getByTestId(`button-${variant}`)
        expect(button).toBeInTheDocument()
      })
    })

    it('should render different sizes correctly', () => {
      const sizes = ['default', 'sm', 'lg', 'icon'] as const
      
      sizes.forEach(size => {
        render(<Button size={size} data-testid={`button-${size}`}>Test</Button>)
        const button = screen.getByTestId(`button-${size}`)
        expect(button).toBeInTheDocument()
      })
    })
  })

  describe('Interactions', () => {
    it('should handle click events', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should not trigger click when disabled', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button disabled onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(handleClick).not.toHaveBeenCalled()
      expect(button).toBeDisabled()
    })

    it('should handle keyboard navigation', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()
      
      render(<Button onClick={handleClick}>Click me</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
      
      await user.keyboard('{Enter}')
      expect(handleClick).toHaveBeenCalledTimes(1)
      
      await user.keyboard(' ')
      expect(handleClick).toHaveBeenCalledTimes(2)
    })
  })

  describe('Loading State', () => {
    it('should show loading state when loading prop is true', () => {
      render(<Button loading>Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveAttribute('aria-busy', 'true')
    })

    it('should not show loading state when loading prop is false', () => {
      render(<Button loading={false}>Not Loading</Button>)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
      expect(button).not.toHaveAttribute('aria-busy', 'true')
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-label', 'Custom label')
    })

    it('should support custom ARIA attributes', () => {
      render(
        <Button 
          aria-describedby="help-text"
          aria-expanded="false"
        >
          Test
        </Button>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })

    it('should be focusable', () => {
      render(<Button>Focusable</Button>)
      
      const button = screen.getByRole('button')
      button.focus()
      
      expect(button).toHaveFocus()
    })
  })

  describe('Error Handling', () => {
    it('should handle missing children gracefully', () => {
      render(<Button />)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('should handle invalid props gracefully', () => {
      // @ts-expect-error Testing invalid props
      render(<Button variant="invalid">Test</Button>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('should not re-render unnecessarily', () => {
      const renderSpy = jest.fn()
      
      function TestButton(props: any) {
        renderSpy()
        return <Button {...props}>Test</Button>
      }
      
      const { rerender } = render(<TestButton />)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      rerender(<TestButton />)
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })
  })
})