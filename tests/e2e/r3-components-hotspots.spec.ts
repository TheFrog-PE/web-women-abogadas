import { test, expect } from '@playwright/test';
import { navigateToTab, openPastEventDetail } from '../helpers/navigation';

test.describe('Requirement R2: Component-Specific Layout Hotspots & Geometry Tests', () => {

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-01: "RESUMEN & MEMORIAS" PANEL & .events-detail-grid
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-01: Resumen & Memorias Panel', () => {

    test('Panel fits inside viewport without horizontal scroll at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const grid = page.locator('.events-detail-grid').first();
      await expect(grid).toBeVisible();

      // Check grid scrollWidth
      const gridMetrics = await grid.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        rectRight: el.getBoundingClientRect().right,
        windowWidth: window.innerWidth
      }));
      expect(gridMetrics.scrollWidth).toBeLessThanOrEqual(gridMetrics.clientWidth + 1.5);
      expect(gridMetrics.rectRight).toBeLessThanOrEqual(gridMetrics.windowWidth + 1.5);

      // Check Right Panel (.reveal-right)
      const panel = grid.locator('.reveal-right').first();
      await expect(panel).toBeVisible();
      const panelMetrics = await panel.evaluate((el) => ({
        scrollWidth: el.scrollWidth,
        clientWidth: el.clientWidth,
        rectRight: el.getBoundingClientRect().right,
        windowWidth: window.innerWidth
      }));
      expect(panelMetrics.scrollWidth).toBeLessThanOrEqual(panelMetrics.clientWidth + 1.5);
      expect(panelMetrics.rectRight).toBeLessThanOrEqual(panelMetrics.windowWidth + 1.5);

      // Check Download Button inside panel
      const downloadBtn = panel.locator('button', { hasText: /descargar memorias/i }).first();
      await expect(downloadBtn).toBeVisible();
      const btnMetrics = await downloadBtn.evaluate((el) => ({
        rectRight: el.getBoundingClientRect().right,
        panelRight: el.parentElement ? el.parentElement.getBoundingClientRect().right : window.innerWidth,
        windowWidth: window.innerWidth
      }));
      expect(btnMetrics.rectRight).toBeLessThanOrEqual(btnMetrics.windowWidth + 1.5);
    });

    test('Panel maintains containment across 360px and 390px viewports', async ({ page }) => {
      for (const w of [360, 390]) {
        await page.setViewportSize({ width: w, height: 750 });
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await openPastEventDetail(page);

        const panel = page.locator('.events-detail-grid .reveal-right').first();
        const metrics = await panel.evaluate((el) => ({
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          rectRight: el.getBoundingClientRect().right,
          windowWidth: window.innerWidth
        }));
        expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.clientWidth + 1.5);
        expect(metrics.rectRight).toBeLessThanOrEqual(metrics.windowWidth + 1.5);
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-02: ÚNETE BENEFITS GRID
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-02: Únete Benefits Grid', () => {

    test('Benefits grid cards wrap without exceeding viewport at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'unete');

      // Find benefit card container
      const heading = page.getByRole('heading', { name: /beneficios exclusivos/i });
      await expect(heading).toBeVisible();
      const benefitsContainer = heading.locator('xpath=ancestor::div[contains(@style, "margin")]').first();
      await expect(benefitsContainer).toBeVisible();

      // Check all card widths
      const cardBoxes = await benefitsContainer.locator('h3').all();
      expect(cardBoxes.length).toBeGreaterThan(0);

      const maxCardWidth = await benefitsContainer.evaluate((container) => {
        const cards = container.querySelectorAll('.card-hover, div[style*="border-radius"]');
        let maxWidth = 0;
        cards.forEach((c) => {
          const w = c.getBoundingClientRect().width;
          if (w > maxWidth) maxWidth = w;
        });
        return maxWidth;
      });

      // No card should enforce rigid 420px width on 320px screen
      expect(maxCardWidth).toBeLessThanOrEqual(320 + 1.5);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-03: OPEN TO WORK NEWSLETTER / TALENT FORM CARD
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-03: Open to Work Form Card Constraints', () => {

    test('Talent newsletter form card fits within 320px and 360px without input overflow', async ({ page }) => {
      for (const w of [320, 360]) {
        await page.setViewportSize({ width: w, height: 600 });
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await navigateToTab(page, 'opentowork');

        const card = page.locator('input[type="email"][placeholder*="correo"]').locator('xpath=ancestor::div[contains(@style, "border-radius")]').first();
        if (await card.isVisible()) {
          const metrics = await card.evaluate((el) => {
            const rect = el.getBoundingClientRect();
            const input = el.querySelector('input');
            const inputRect = input ? input.getBoundingClientRect() : null;
            return {
              cardRight: rect.right,
              inputRight: inputRect ? inputRect.right : 0,
              windowWidth: window.innerWidth
            };
          });
          expect(metrics.cardRight).toBeLessThanOrEqual(metrics.windowWidth + 1.5);
          expect(metrics.inputRight).toBeLessThanOrEqual(metrics.cardRight + 1.5);
        }
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-04: AGENDA PILLS ON NARROW SCREENS
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-04: Agenda Pills on Narrow Screens', () => {

    test('Agenda cards adapt cleanly without clipping on 320px viewport', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'eventos');

      const agendaCards = page.locator('.events-agenda-card');
      const count = await agendaCards.count();
      if (count > 0) {
        for (let i = 0; i < count; i++) {
          const isOverflowing = await agendaCards.nth(i).evaluate((el) => el.scrollWidth > el.clientWidth + 1.5);
          expect(isOverflowing).toBe(false);
        }
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-05: GLOBAL FOOTER MULTI-COLUMN GRID
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-05: Global Footer Multi-Column Grid', () => {

    test('Footer grid wraps into vertical stack without 8px leak at 320px', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();

      const footerMetrics = await footer.evaluate((el) => {
        const rect = el.getBoundingClientRect();
        return {
          scrollWidth: el.scrollWidth,
          clientWidth: el.clientWidth,
          rectRight: rect.right,
          windowWidth: window.innerWidth
        };
      });

      expect(footerMetrics.scrollWidth).toBeLessThanOrEqual(footerMetrics.clientWidth + 1.5);
      expect(footerMetrics.rectRight).toBeLessThanOrEqual(footerMetrics.windowWidth + 1.5);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-06: EVENT COUNTDOWN TIMER
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-06: Event Countdown Timer', () => {

    test('Countdown timer boxes fit within screen width at 320px and 360px', async ({ page }) => {
      for (const w of [320, 360]) {
        await page.setViewportSize({ width: w, height: 600 });
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await navigateToTab(page, 'eventos');

        // Look for countdown container
        const countdownBoxes = page.locator('text=DÍAS').locator('xpath=ancestor::div[contains(@style, "display: flex")]').first();
        if (await countdownBoxes.isVisible()) {
          const rect = await countdownBoxes.boundingBox();
          if (rect) {
            expect(rect.x + rect.width).toBeLessThanOrEqual(w + 2);
          }
        }
      }
    });
  });

  // ─────────────────────────────────────────────────────────────
  // RESP-ELEM-07: LEGAL AND CONTENT MODALS
  // ─────────────────────────────────────────────────────────────
  test.describe('RESP-ELEM-07: Legal & Content Modals', () => {

    test('Términos y Condiciones modal fits within 320px with responsive padding', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 568 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');

      // Scroll to footer and click Términos
      const termBtn = page.getByRole('button', { name: /términos y condiciones/i });
      if (await termBtn.isVisible()) {
        await termBtn.click();
        await page.waitForTimeout(300);

        const modal = page.locator('div[style*="fixed"][style*="z-index"]').locator('div[style*="background"]').first();
        if (await modal.isVisible()) {
          const box = await modal.boundingBox();
          if (box) {
            expect(box.width).toBeLessThanOrEqual(320);
          }
          // Close modal
          await page.keyboard.press('Escape');
        }
      }
    });
  });

});
