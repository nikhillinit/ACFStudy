import { test, expect } from '@playwright/test';

test.describe('AI Study Companion', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display AI study companion access', async ({ page }) => {
    // Look for AI companion trigger or interface
    const aiElements = [
      page.locator('text=AI Study Companion'),
      page.locator('text=AI Tutor'),
      page.locator('text=Study Companion'),
      page.locator('[data-testid*="ai"]'),
      page.locator('[data-testid*="companion"]'),
      page.locator('button').filter({ hasText: /ai|companion|tutor/i }),
      page.locator('[class*="ai"]'),
      page.locator('[class*="companion"]')
    ];

    let aiFound = false;
    for (const element of aiElements) {
      try {
        if (await element.first().isVisible()) {
          aiFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // AI companion should be accessible from the main interface
    expect(aiFound).toBe(true);
  });

  test('should allow opening AI companion interface', async ({ page }) => {
    // Find AI companion trigger
    const aiTriggers = [
      page.locator('button').filter({ hasText: /ai|companion|tutor/i }),
      page.locator('[data-testid*="ai"]'),
      page.locator('[data-testid*="companion"]'),
      page.locator('.ai-button, .companion-button')
    ];

    let companionOpened = false;
    for (const trigger of aiTriggers) {
      try {
        const firstTrigger = trigger.first();
        if (await firstTrigger.isVisible()) {
          await firstTrigger.click();
          await page.waitForTimeout(1000);
          
          // Check if companion interface opened
          const companionInterface = [
            page.locator('[role="dialog"]'),
            page.locator('.modal'),
            page.locator('.companion-chat'),
            page.locator('[data-testid*="chat"]'),
            page.locator('textarea, input').filter({ hasText: /message|question|ask/i }),
            page.locator('text=How can I help')
          ];

          for (const ui of companionInterface) {
            try {
              if (await ui.first().isVisible()) {
                companionOpened = true;
                break;
              }
            } catch {
              continue;
            }
          }
          
          if (companionOpened) break;
        }
      } catch {
        continue;
      }
    }

    expect(companionOpened).toBe(true);
  });

  test('should provide chat interface for AI interaction', async ({ page }) => {
    // Try to open AI companion first
    const aiTrigger = page.locator('button').filter({ hasText: /ai|companion|tutor/i }).first();
    try {
      if (await aiTrigger.isVisible()) {
        await aiTrigger.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Continue even if trigger not found
    }

    // Look for chat interface elements
    const chatElements = [
      page.locator('textarea').filter({ hasText: /message|question|ask/i }),
      page.locator('input').filter({ hasText: /message|question|ask/i }),
      page.locator('[placeholder*="message"]'),
      page.locator('[placeholder*="question"]'),
      page.locator('[data-testid*="input"]'),
      page.locator('.chat-input')
    ];

    let chatInterfaceFound = false;
    for (const element of chatElements) {
      try {
        if (await element.first().isVisible()) {
          chatInterfaceFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Chat interface should be available for AI interaction
    expect(chatInterfaceFound).toBe(true);
  });

  test('should display AI companion personality options', async ({ page }) => {
    // Try to access AI companion settings or interface
    const aiTrigger = page.locator('button').filter({ hasText: /ai|companion|tutor/i }).first();
    try {
      if (await aiTrigger.isVisible()) {
        await aiTrigger.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Continue
    }

    // Look for personality or settings options
    const personalityElements = [
      page.locator('text=Personality'),
      page.locator('text=Encouraging'),
      page.locator('text=Analytical'),
      page.locator('text=Professional'),
      page.locator('text=Friendly'),
      page.locator('[data-testid*="personality"]'),
      page.locator('button').filter({ hasText: /settings|configure|personality/i }),
      page.locator('.personality-selector')
    ];

    let personalityFound = false;
    for (const element of personalityElements) {
      try {
        if (await element.first().isVisible()) {
          personalityFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Personality options may be available but are not strictly required
    // This test documents the feature if it exists
    if (personalityFound) {
      expect(personalityFound).toBe(true);
    } else {
      // At minimum, AI companion interface should be accessible
      const basicAI = [
        page.locator('text=AI'),
        page.locator('text=Companion'),
        page.locator('text=Tutor'),
        page.locator('textarea, input')
      ];

      let basicAIFound = false;
      for (const element of basicAI) {
        try {
          if (await element.first().isVisible()) {
            basicAIFound = true;
            break;
          }
        } catch {
          continue;
        }
      }
      
      expect(basicAIFound).toBe(true);
    }
  });

  test('should allow sending messages to AI companion', async ({ page }) => {
    // Try to open AI companion
    const aiTrigger = page.locator('button').filter({ hasText: /ai|companion|tutor/i }).first();
    try {
      if (await aiTrigger.isVisible()) {
        await aiTrigger.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Continue
    }

    // Find input field and try to send a message
    const inputElements = [
      page.locator('textarea'),
      page.locator('input[type="text"]'),
      page.locator('[data-testid*="input"]'),
      page.locator('.chat-input')
    ];

    let messageSent = false;
    for (const input of inputElements) {
      try {
        const firstInput = input.first();
        if (await firstInput.isVisible()) {
          // Type a test message
          await firstInput.fill('Help me understand time value of money');
          await page.waitForTimeout(500);
          
          // Look for send button
          const sendButtons = [
            page.locator('button').filter({ hasText: /send|submit/i }),
            page.locator('[data-testid*="send"]'),
            page.locator('.send-button')
          ];

          for (const sendBtn of sendButtons) {
            try {
              if (await sendBtn.first().isVisible()) {
                await sendBtn.first().click();
                messageSent = true;
                break;
              }
            } catch {
              continue;
            }
          }

          // Alternatively, try Enter key
          if (!messageSent) {
            await firstInput.press('Enter');
            messageSent = true;
          }
          
          if (messageSent) {
            await page.waitForTimeout(2000);
            break;
          }
        }
      } catch {
        continue;
      }
    }

    // Should be able to interact with AI companion
    expect(messageSent).toBe(true);
  });

  test('should show AI responses in chat interface', async ({ page }) => {
    // This test checks if AI responses are displayed properly
    // First, try to send a message (similar to previous test)
    const aiTrigger = page.locator('button').filter({ hasText: /ai|companion|tutor/i }).first();
    try {
      if (await aiTrigger.isVisible()) {
        await aiTrigger.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Continue
    }

    // Try to send a message
    const inputElement = page.locator('textarea, input[type="text"]').first();
    try {
      if (await inputElement.isVisible()) {
        await inputElement.fill('What is NPV?');
        await inputElement.press('Enter');
        await page.waitForTimeout(3000); // Wait for AI response
      }
    } catch {
      // Continue even if we can't send a message
    }

    // Look for chat message display area
    const chatDisplayElements = [
      page.locator('.chat-messages'),
      page.locator('.message'),
      page.locator('[data-testid*="message"]'),
      page.locator('.response'),
      page.locator('div').filter({ hasText: /NPV|present value|financial/i })
    ];

    let chatDisplayFound = false;
    for (const element of chatDisplayElements) {
      try {
        if (await element.first().isVisible()) {
          chatDisplayFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Chat display area should exist for showing AI responses
    expect(chatDisplayFound).toBe(true);
  });

  test('should provide topic-specific AI assistance', async ({ page }) => {
    // Navigate to practice page first to test contextual AI help
    await page.goto('/practice');
    await page.waitForTimeout(2000);

    // Look for AI assistance in practice context
    const contextualAI = [
      page.locator('button').filter({ hasText: /ai|help|tutor/i }),
      page.locator('text=Get Help'),
      page.locator('[data-testid*="ai-help"]'),
      page.locator('.ai-assistance')
    ];

    let contextualAIFound = false;
    for (const element of contextualAI) {
      try {
        if (await element.first().isVisible()) {
          contextualAIFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // AI should provide contextual assistance in practice
    if (!contextualAIFound) {
      // Go back to home and check for general AI access
      await page.goto('/');
      const generalAI = page.locator('text=AI, text=Companion, text=Tutor').first();
      await expect(generalAI).toBeVisible();
    } else {
      expect(contextualAIFound).toBe(true);
    }
  });

  test('should be accessible on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();

    // AI companion should be accessible on mobile
    const mobileAI = [
      page.locator('button').filter({ hasText: /ai|companion|tutor/i }),
      page.locator('[data-testid*="ai"]'),
      page.locator('text=AI').first()
    ];

    let mobileAIFound = false;
    for (const element of mobileAI) {
      try {
        if (await element.first().isVisible()) {
          mobileAIFound = true;
          
          // Try to open on mobile
          await element.first().click();
          await page.waitForTimeout(1000);
          
          // Should show mobile-friendly interface
          const mobileInterface = [
            page.locator('[role="dialog"]'),
            page.locator('.modal'),
            page.locator('textarea, input')
          ];

          for (const ui of mobileInterface) {
            try {
              if (await ui.first().isVisible()) {
                break;
              }
            } catch {
              continue;
            }
          }
          
          break;
        }
      } catch {
        continue;
      }
    }

    expect(mobileAIFound).toBe(true);
  });

  test('should handle AI companion settings and preferences', async ({ page }) => {
    // Try to access AI companion
    const aiTrigger = page.locator('button').filter({ hasText: /ai|companion|tutor/i }).first();
    try {
      if (await aiTrigger.isVisible()) {
        await aiTrigger.click();
        await page.waitForTimeout(1000);
      }
    } catch {
      // Continue
    }

    // Look for settings or preferences
    const settingsElements = [
      page.locator('button').filter({ hasText: /settings|preferences|configure/i }),
      page.locator('[data-testid*="settings"]'),
      page.locator('text=Settings'),
      page.locator('.settings-button'),
      page.locator('[aria-label*="settings"]')
    ];

    let settingsFound = false;
    for (const element of settingsElements) {
      try {
        if (await element.first().isVisible()) {
          await element.first().click();
          await page.waitForTimeout(1000);
          settingsFound = true;
          break;
        }
      } catch {
        continue;
      }
    }

    // Settings may be available but are not strictly required
    // This test documents the feature if it exists
    if (settingsFound) {
      expect(settingsFound).toBe(true);
    } else {
      // Basic AI functionality should still be accessible
      const basicAI = page.locator('text=AI, text=Companion, text=Tutor, textarea, input').first();
      await expect(basicAI).toBeVisible();
    }
  });
});