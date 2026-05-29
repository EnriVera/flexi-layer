/**
 * Playwright integration tests for flexi-modal
 * Tests browser-based interactions that unit tests cannot cover
 */

import { test, expect } from '@playwright/test';

test.describe('flexi-modal integration', () => {
  test('opens modal on show() method', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    // Get the modal element
    const modal = page.locator('flexi-modal').first();
    
    // Initially closed - check open property is not set
    await expect(modal).not.toHaveAttribute('open', '');
    
    // Call show() method via evaluate
    await modal.evaluate((el: any) => el.show());
    
    // Should be open
    await expect(modal).toHaveAttribute('open', '');
  });

  test('closes modal on hide() method', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    
    // Open first
    await modal.evaluate((el: any) => { el.open = true; });
    await expect(modal).toHaveAttribute('open', '');
    
    // Hide
    await modal.evaluate((el: any) => el.hide());
    await expect(modal).not.toHaveAttribute('open', '');
  });

  test('has correct DOM structure when open', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => el.open = true);
    
    // Wait for render
    await page.waitForTimeout(100);
    
    // Check shadow root contains dialog
    const dialog = modal.locator('.dialog');
    await expect(dialog).toBeVisible();
  });

  test('dialog has role dialog', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => el.open = true);
    await page.waitForTimeout(100);
    
    const dialog = modal.locator('.dialog');
    await expect(dialog).toHaveAttribute('role', 'dialog');
  });

  test('dialog has aria-modal true', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => el.open = true);
    await page.waitForTimeout(100);
    
    const dialog = modal.locator('.dialog');
    await expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  test('close button exists in header', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => el.open = true);
    await page.waitForTimeout(100);
    
    const closeBtn = modal.locator('.close-button');
    await expect(closeBtn).toBeVisible();
  });

  test('close button has aria-label', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => el.open = true);
    await page.waitForTimeout(100);
    
    const closeBtn = modal.locator('.close-button');
    await expect(closeBtn).toHaveAttribute('aria-label', 'Close modal');
  });

  test('applies size class correctly', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    // Test lg size
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => { 
      el.open = true; 
      el.size = 'lg'; 
    });
    await page.waitForTimeout(100);
    
    const dialog = modal.locator('.dialog');
    await expect(dialog).toHaveClass(/lg/);
  });

  test('shows loading overlay when loading is true', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => { 
      el.open = true; 
      el.loading = true; 
    });
    await page.waitForTimeout(100);
    
    const loading = modal.locator('.loading-overlay');
    await expect(loading).toBeVisible();
  });

  test('hides header when noHeader is true', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => { 
      el.open = true; 
      el.noHeader = true; 
    });
    await page.waitForTimeout(100);
    
    const header = modal.locator('.header');
    await expect(header).not.toBeVisible();
  });

  test('hides footer when noFooter is true', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => { 
      el.open = true; 
      el.noFooter = true; 
    });
    await page.waitForTimeout(100);
    
    const footer = modal.locator('.footer');
    await expect(footer).not.toBeVisible();
  });

  test('close button click closes modal', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    // Use the basic-modal which is visible and openable
    const modal = page.locator('#basic-modal');
    await modal.evaluate((el: any) => el.open = true);
    await page.waitForTimeout(100);
    
    // Click close button via evaluate to work around shadow DOM issues
    await modal.evaluate((el: any) => {
      const shadow = el.shadowRoot;
      const btn = shadow?.querySelector('.close-button') as HTMLButtonElement;
      btn?.click();
    });
    
    await page.waitForTimeout(200);
    await expect(modal).not.toHaveAttribute('open', '');
  });

  test('renders title correctly', async ({ page }) => {
    await page.goto('./demo/index.html');
    
    const modal = page.locator('flexi-modal').first();
    await modal.evaluate((el: any) => { 
      el.open = true; 
      el.title = 'My Modal Title'; 
    });
    await page.waitForTimeout(100);
    
    const title = modal.locator('.header-title');
    await expect(title).toHaveText('My Modal Title');
  });
});