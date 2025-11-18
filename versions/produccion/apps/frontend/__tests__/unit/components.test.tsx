import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { performance } from 'perf_hooks';

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: any) => (
    <img src={src} alt={alt} {...props} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

// Performance test utilities
const measurePerformance = async (testFn: () => Promise<void> | void) => {
  const startTime = performance.now();
  await testFn();
  const endTime = performance.now();
  return endTime - startTime;
};

describe('Component Performance Tests', () => {
  beforeEach(() => {
    // Clear any previous performance measurements
    performance.clearMarks();
    performance.clearMeasures();
  });

  describe('Button Component', () => {
    // Mock Button component for testing
    const Button = ({ children, onClick, loading = false }: any) => (
      <button 
        onClick={onClick} 
        disabled={loading}
        data-testid="button"
      >
        {loading ? 'Loading...' : children}
      </button>
    );

    it('should render quickly', async () => {
      const renderTime = await measurePerformance(() => {
        render(<Button>Test Button</Button>);
      });

      // Button should render in under 10ms
      expect(renderTime).toBeLessThan(10);
    });

    it('should handle rapid clicks efficiently', async () => {
      let clickCount = 0;
      const handleClick = () => {
        clickCount++;
      };

      render(<Button onClick={handleClick}>Click Me</Button>);
      const button = screen.getByTestId('button');

      // Measure time for 100 rapid clicks
      const clickTime = await measurePerformance(() => {
        for (let i = 0; i < 100; i++) {
          fireEvent.click(button);
        }
      });

      expect(clickCount).toBe(100);
      // 100 clicks should process in under 100ms
      expect(clickTime).toBeLessThan(100);
    });

    it('should not cause memory leaks with state updates', async () => {
      const TestComponent = () => {
        const [count, setCount] = React.useState(0);
        
        React.useEffect(() => {
          const interval = setInterval(() => {
            setCount(c => c + 1);
          }, 1);
          
          return () => clearInterval(interval);
        }, []);

        return <Button onClick={() => setCount(c => c + 1)}>{count}</Button>;
      };

      const { unmount } = render(<TestComponent />);
      
      // Let it run for a bit
      await waitFor(() => {
        expect(screen.getByTestId('button')).toHaveTextContent(/\d+/);
      });

      // Unmount should clean up without errors
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Modal Component', () => {
    const Modal = ({ isOpen, onClose, children }: any) => {
      if (!isOpen) return null;
      
      return (
        <div 
          data-testid="modal-overlay"
          onClick={onClose}
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0,
            background: 'rgba(0,0,0,0.5)' 
          }}
        >
          <div 
            data-testid="modal-content"
            onClick={e => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'white',
              padding: '20px'
            }}
          >
            {children}
          </div>
        </div>
      );
    };

    it('should open and close efficiently', async () => {
      let isOpen = false;
      const TestWrapper = () => {
        const [modalOpen, setModalOpen] = React.useState(isOpen);
        
        React.useEffect(() => {
          setModalOpen(isOpen);
        }, []);

        return (
          <>
            <button 
              data-testid="open-modal"
              onClick={() => {
                isOpen = true;
                setModalOpen(true);
              }}
            >
              Open Modal
            </button>
            <Modal 
              isOpen={modalOpen} 
              onClose={() => {
                isOpen = false;
                setModalOpen(false);
              }}
            >
              Modal Content
            </Modal>
          </>
        );
      };

      render(<TestWrapper />);

      // Measure modal open time
      const openTime = await measurePerformance(async () => {
        fireEvent.click(screen.getByTestId('open-modal'));
        await waitFor(() => {
          expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
        });
      });

      // Modal should open in under 50ms
      expect(openTime).toBeLessThan(50);

      // Measure modal close time
      const closeTime = await measurePerformance(async () => {
        fireEvent.click(screen.getByTestId('modal-overlay'));
        await waitFor(() => {
          expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
        });
      });

      // Modal should close in under 50ms
      expect(closeTime).toBeLessThan(50);
    });
  });

  describe('List Component Performance', () => {
    const ListItem = React.memo(({ item, onSelect }: any) => (
      <div 
        data-testid={`list-item-${item.id}`}
        onClick={() => onSelect(item)}
        style={{ padding: '10px', borderBottom: '1px solid #ccc' }}
      >
        {item.name}
      </div>
    ));

    const VirtualizedList = ({ items, onSelectItem }: any) => (
      <div data-testid="list-container" style={{ height: '400px', overflow: 'auto' }}>
        {items.map((item: any) => (
          <ListItem key={item.id} item={item} onSelect={onSelectItem} />
        ))}
      </div>
    );

    it('should handle large lists efficiently', async () => {
      const largeItems = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        name: `Item ${i}`
      }));

      let selectedItem = null;
      const handleSelect = (item: any) => {
        selectedItem = item;
      };

      // Measure rendering time for 1000 items
      const renderTime = await measurePerformance(() => {
        render(
          <VirtualizedList 
            items={largeItems} 
            onSelectItem={handleSelect} 
          />
        );
      });

      // Large list should render in under 200ms
      expect(renderTime).toBeLessThan(200);

      // Test interaction performance
      const interactionTime = await measurePerformance(async () => {
        fireEvent.click(screen.getByTestId('list-item-500'));
        await waitFor(() => {
          expect(selectedItem).toEqual({ id: 500, name: 'Item 500' });
        });
      });

      // Item selection should respond in under 20ms
      expect(interactionTime).toBeLessThan(20);
    });
  });

  describe('Form Component Performance', () => {
    const Form = ({ onSubmit }: any) => {
      const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
      });

      const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
          ...prev,
          [field]: e.target.value
        }));
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
      };

      return (
        <form onSubmit={handleSubmit} data-testid="performance-form">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange('name')}
            data-testid="name-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange('email')}
            data-testid="email-input"
          />
          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={handleChange('message')}
            data-testid="message-input"
          />
          <button type="submit" data-testid="submit-btn">Submit</button>
        </form>
      );
    };

    it('should handle rapid typing efficiently', async () => {
      let submittedData = null;
      const handleSubmit = (data: any) => {
        submittedData = data;
      };

      render(<Form onSubmit={handleSubmit} />);

      const nameInput = screen.getByTestId('name-input');

      // Measure typing performance
      const typingTime = await measurePerformance(() => {
        const longText = 'This is a very long name that someone might type rapidly';
        
        longText.split('').forEach((char, index) => {
          fireEvent.change(nameInput, {
            target: { value: longText.substring(0, index + 1) }
          });
        });
      });

      // Typing should be processed efficiently (under 100ms for 50 characters)
      expect(typingTime).toBeLessThan(100);
    });

    it('should validate forms without performance degradation', async () => {
      const FormWithValidation = ({ onSubmit }: any) => {
        const [errors, setErrors] = React.useState<Record<string, string>>({});
        const [formData, setFormData] = React.useState({
          email: '',
          password: ''
        });

        const validate = React.useCallback(() => {
          const newErrors: Record<string, string> = {};
          
          if (!formData.email.includes('@')) {
            newErrors.email = 'Invalid email';
          }
          
          if (formData.password.length < 8) {
            newErrors.password = 'Password too short';
          }
          
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
        }, [formData]);

        React.useEffect(() => {
          const timer = setTimeout(validate, 300);
          return () => clearTimeout(timer);
        }, [formData, validate]);

        return (
          <form data-testid="validation-form">
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              data-testid="email-field"
            />
            {errors.email && <span data-testid="email-error">{errors.email}</span>}
            
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              data-testid="password-field"
            />
            {errors.password && <span data-testid="password-error">{errors.password}</span>}
          </form>
        );
      };

      render(<FormWithValidation onSubmit={() => {}} />);

      const emailInput = screen.getByTestId('email-field');
      const passwordInput = screen.getByTestId('password-field');

      // Measure validation performance
      const validationTime = await measurePerformance(async () => {
        fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
        fireEvent.change(passwordInput, { target: { value: '123' } });
        
        // Wait for debounced validation
        await waitFor(() => {
          expect(screen.getByTestId('email-error')).toBeInTheDocument();
          expect(screen.getByTestId('password-error')).toBeInTheDocument();
        }, { timeout: 500 });
      });

      // Validation should complete within 400ms (including 300ms debounce)
      expect(validationTime).toBeLessThan(400);
    });
  });

  afterEach(() => {
    // Clean up any timers or subscriptions
    jest.clearAllTimers();
  });
});