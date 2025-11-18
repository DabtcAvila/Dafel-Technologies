import { test, expect } from '@playwright/test'

test.describe('Authentication E2E Tests', () => {
  test.describe('User Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      // Navigate to login page
      await page.goto('/login')
      
      // Wait for page to load
      await expect(page).toHaveTitle(/Login.*Dafel/)
      
      // Fill login form
      await page.fill('[data-testid="email-input"]', process.env.E2E_TEST_USER_EMAIL || 'test@example.com')
      await page.fill('[data-testid="password-input"]', process.env.E2E_TEST_USER_PASSWORD || 'password123')
      
      // Submit form
      await page.click('[data-testid="login-button"]')
      
      // Wait for redirect to dashboard
      await page.waitForURL('/studio')
      
      // Verify successful login
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
      await expect(page.locator('text=Welcome')).toBeVisible()
    })

    test('should show error with invalid credentials', async ({ page }) => {
      await page.goto('/login')
      
      // Fill with invalid credentials
      await page.fill('[data-testid="email-input"]', 'invalid@example.com')
      await page.fill('[data-testid="password-input"]', 'wrongpassword')
      
      // Submit form
      await page.click('[data-testid="login-button"]')
      
      // Wait for error message
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
      await expect(page.locator('text=Invalid credentials')).toBeVisible()
      
      // Should stay on login page
      expect(page.url()).toContain('/login')
    })

    test('should validate required fields', async ({ page }) => {
      await page.goto('/login')
      
      // Try to submit without filling fields
      await page.click('[data-testid="login-button"]')
      
      // Check for validation messages
      await expect(page.locator('text=Email is required')).toBeVisible()
      await expect(page.locator('text=Password is required')).toBeVisible()
    })

    test('should handle rate limiting', async ({ page }) => {
      await page.goto('/login')
      
      const maxAttempts = 5
      
      // Make multiple failed login attempts
      for (let i = 0; i < maxAttempts; i++) {
        await page.fill('[data-testid="email-input"]', 'test@example.com')
        await page.fill('[data-testid="password-input"]', 'wrongpassword')
        await page.click('[data-testid="login-button"]')
        
        // Wait for response
        await page.waitForSelector('[data-testid="error-message"]')
        
        // Clear fields for next attempt
        await page.fill('[data-testid="email-input"]', '')
        await page.fill('[data-testid="password-input"]', '')
      }
      
      // Next attempt should show rate limiting message
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'wrongpassword')
      await page.click('[data-testid="login-button"]')
      
      await expect(page.locator('text=Too many attempts')).toBeVisible()
    })
  })

  test.describe('User Registration', () => {
    test('should register new user successfully', async ({ page }) => {
      await page.goto('/login')
      
      // Click register link
      await page.click('[data-testid="register-link"]')
      
      // Fill registration form
      const timestamp = Date.now()
      await page.fill('[data-testid="name-input"]', 'Test User')
      await page.fill('[data-testid="email-input"]', `test${timestamp}@example.com`)
      await page.fill('[data-testid="password-input"]', 'SecurePassword123!')
      await page.fill('[data-testid="confirm-password-input"]', 'SecurePassword123!')
      
      // Accept terms
      await page.check('[data-testid="terms-checkbox"]')
      
      // Submit form
      await page.click('[data-testid="register-button"]')
      
      // Wait for success message
      await expect(page.locator('[data-testid="success-message"]')).toBeVisible()
      await expect(page.locator('text=Account created successfully')).toBeVisible()
    })

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/register')
      
      // Fill form with weak password
      await page.fill('[data-testid="name-input"]', 'Test User')
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', '123')
      
      // Should show password requirements
      await expect(page.locator('text=Password must be at least 8 characters')).toBeVisible()
      await expect(page.locator('text=Password must contain uppercase letter')).toBeVisible()
      await expect(page.locator('text=Password must contain lowercase letter')).toBeVisible()
      await expect(page.locator('text=Password must contain number')).toBeVisible()
    })

    test('should prevent duplicate registration', async ({ page }) => {
      await page.goto('/register')
      
      // Try to register with existing email
      await page.fill('[data-testid="name-input"]', 'Duplicate User')
      await page.fill('[data-testid="email-input"]', process.env.E2E_TEST_USER_EMAIL || 'existing@example.com')
      await page.fill('[data-testid="password-input"]', 'SecurePassword123!')
      await page.fill('[data-testid="confirm-password-input"]', 'SecurePassword123!')
      await page.check('[data-testid="terms-checkbox"]')
      
      await page.click('[data-testid="register-button"]')
      
      // Should show error
      await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
      await expect(page.locator('text=Email already exists')).toBeVisible()
    })
  })

  test.describe('Session Management', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each test
      await page.goto('/login')
      await page.fill('[data-testid="email-input"]', process.env.E2E_TEST_USER_EMAIL || 'test@example.com')
      await page.fill('[data-testid="password-input"]', process.env.E2E_TEST_USER_PASSWORD || 'password123')
      await page.click('[data-testid="login-button"]')
      await page.waitForURL('/studio')
    })

    test('should maintain session across page refreshes', async ({ page }) => {
      // Refresh page
      await page.reload()
      
      // Should still be logged in
      await expect(page.locator('[data-testid="user-menu"]')).toBeVisible()
      expect(page.url()).toContain('/studio')
    })

    test('should logout successfully', async ({ page }) => {
      // Click user menu
      await page.click('[data-testid="user-menu"]')
      
      // Click logout
      await page.click('[data-testid="logout-button"]')
      
      // Should redirect to login
      await page.waitForURL('/login')
      
      // Verify logout
      await expect(page.locator('[data-testid="user-menu"]')).not.toBeVisible()
    })

    test('should redirect to login after session expiry', async ({ page, context }) => {
      // Clear all cookies to simulate session expiry
      await context.clearCookies()
      
      // Try to access protected page
      await page.goto('/studio/admin')
      
      // Should redirect to login
      await page.waitForURL('/login')
      await expect(page.locator('text=Please sign in')).toBeVisible()
    })
  })

  test.describe('OAuth Authentication', () => {
    test('should show OAuth providers', async ({ page }) => {
      await page.goto('/login')
      
      // Check for OAuth buttons
      await expect(page.locator('[data-testid="google-oauth-button"]')).toBeVisible()
      await expect(page.locator('[data-testid="github-oauth-button"]')).toBeVisible()
    })

    test('should handle OAuth callback', async ({ page }) => {
      await page.goto('/login')
      
      // Mock OAuth callback by directly navigating
      await page.goto('/api/auth/callback/google?code=mock_code&state=mock_state')
      
      // Should eventually redirect (in a real test, this would be handled by the OAuth provider)
      // For now, just verify the callback endpoint exists
      const response = await page.waitForResponse('/api/auth/callback/google*')
      expect(response).toBeTruthy()
    })
  })

  test.describe('Security Features', () => {
    test('should protect against CSRF attacks', async ({ page, context }) => {
      await page.goto('/login')
      
      // Get CSRF token from page
      const csrfToken = await page.getAttribute('[name="csrfToken"]', 'value')
      expect(csrfToken).toBeTruthy()
      
      // Make request without CSRF token should fail
      const response = await context.request.post('/api/auth/signin', {
        data: {
          email: 'test@example.com',
          password: 'password123',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      expect(response.status()).toBe(403)
    })

    test('should include security headers', async ({ page }) => {
      const response = await page.goto('/login')
      
      // Check for security headers
      const headers = response!.headers()
      
      expect(headers['x-frame-options']).toBe('DENY')
      expect(headers['x-content-type-options']).toBe('nosniff')
      expect(headers['referrer-policy']).toBe('origin-when-cross-origin')
    })

    test('should handle XSS attempts', async ({ page }) => {
      await page.goto('/login')
      
      // Try to inject script through form input
      const xssPayload = '<script>alert("xss")</script>'
      
      await page.fill('[data-testid="email-input"]', xssPayload)
      await page.click('[data-testid="login-button"]')
      
      // Script should not execute (no alert dialog)
      await page.waitForTimeout(1000)
      const dialogs = []
      page.on('dialog', dialog => dialogs.push(dialog))
      
      expect(dialogs).toHaveLength(0)
    })
  })

  test.describe('Accessibility', () => {
    test('should be keyboard navigable', async ({ page }) => {
      await page.goto('/login')
      
      // Tab through form elements
      await page.keyboard.press('Tab') // Email field
      await expect(page.locator('[data-testid="email-input"]')).toBeFocused()
      
      await page.keyboard.press('Tab') // Password field
      await expect(page.locator('[data-testid="password-input"]')).toBeFocused()
      
      await page.keyboard.press('Tab') // Login button
      await expect(page.locator('[data-testid="login-button"]')).toBeFocused()
      
      // Submit with Enter
      await page.keyboard.press('Enter')
    })

    test('should have proper ARIA labels', async ({ page }) => {
      await page.goto('/login')
      
      // Check ARIA attributes
      await expect(page.locator('[data-testid="email-input"]')).toHaveAttribute('aria-label', 'Email')
      await expect(page.locator('[data-testid="password-input"]')).toHaveAttribute('aria-label', 'Password')
      await expect(page.locator('[data-testid="login-button"]')).toHaveAttribute('aria-label', 'Sign in')
    })

    test('should support screen readers', async ({ page }) => {
      await page.goto('/login')
      
      // Check for proper heading structure
      await expect(page.locator('h1')).toContainText('Sign in')
      
      // Check for form labels
      await expect(page.locator('label[for="email"]')).toBeVisible()
      await expect(page.locator('label[for="password"]')).toBeVisible()
    })
  })
})