import { test, expect } from '@playwright/test';

test.describe('EduReach chat UI', () => {
  test('opens chat and receives a knowledge-base response', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const chatButton = page.locator('button.fixed.bottom-6.right-6');
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    const input = page.getByPlaceholder('Ask a question...');
    await expect(input).toBeVisible();
    await input.fill('What courses do you offer?');

    const sendButton = page.locator('button', {
      has: page.locator('svg.lucide-send'),
    });
    await expect(sendButton).toBeVisible();
    await sendButton.click();

    await expect(page.locator('text=Based on the knowledge base')).toBeVisible({ timeout: 20000 });
  });

  test('blocks abusive input and shows safe fallback', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    await page.waitForLoadState('networkidle');

    const chatButton = page.locator('button.fixed.bottom-6.right-6');
    await expect(chatButton).toBeVisible();
    await chatButton.click();

    const input = page.getByPlaceholder('Ask a question...');
    await expect(input).toBeVisible();
    await input.fill('You are useless');

    const sendButton = page.locator('button', {
      has: page.locator('svg.lucide-send'),
    });
    await expect(sendButton).toBeVisible();
    await sendButton.click();

    await expect(page.locator('text=I’m here to help with college questions')).toBeVisible({ timeout: 10000 });
  });
});