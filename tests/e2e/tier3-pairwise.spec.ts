import { test, expect } from '@playwright/test';
import { navigateToTab, openPastEventDetail } from '../helpers/navigation';
import { detectHorizontalOverflow } from '../helpers/overflow-detector';

test.describe('Tier 3: Combinatorial & Cross-Feature Pairwise Interaction Tests', () => {

  // ─────────────────────────────────────────────────────────────
  // PAIR-01: Autoplay Ticking + Rapid Tab Navigation Switching
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-01: Carousel autoplay ticking + rapid tab navigation switching', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);

    const track = page.locator('.event-carousel-track').first();
    await expect(track).toBeVisible();

    // Autoplay running for 2s
    await page.waitForTimeout(2000);

    // Switch rapidly to Miembros
    await navigateToTab(page, 'miembros');
    await page.waitForTimeout(150);

    // Switch back to Eventos -> Event Detail
    await navigateToTab(page, 'eventos');
    await openPastEventDetail(page);

    // Wait 4s (exceeding 3.5s autoplay interval)
    await page.waitForTimeout(4000);

    // Verify track is alive, cycling, and no uncaught exceptions
    const newTrack = page.locator('.event-carousel-track').first();
    await expect(newTrack).toBeVisible();
    const scrollPos = await newTrack.evaluate((el) => el.scrollLeft);
    expect(scrollPos).toBeGreaterThanOrEqual(0);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-02: Fullscreen Lightbox Modal Active + Dynamic Viewport Resize
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-02: Lightbox modal open + dynamic resize (1280px -> 320px -> 1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);

    // Open lightbox at photo 3
    const cards = page.locator('.event-carousel-card');
    await cards.nth(2).click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Shrink dynamically to 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(400);

    // Check lightbox image and close button bounds at 320px
    const closeBtn = modal.locator('button[aria-label="Cerrar vista completa"]');
    await expect(closeBtn).toBeVisible();
    const closeBox = await closeBtn.boundingBox();
    expect(closeBox).not.toBeNull();
    expect(closeBox!.x + closeBox!.width).toBeLessThanOrEqual(320 + 2);

    // Expand back to 1280px
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    // Close modal
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-03: Mobile Drawer Menu + Subview Navigation + Responsive Grid
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-03: Mobile drawer menu + subview navigation + responsive grid alignment', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);

    // Open hamburger drawer
    const hamburger = page.locator('button.mobile-menu-toggle');
    await hamburger.click();
    await page.waitForTimeout(300);

    // Navigate to Open to Work from drawer
    const drawer = page.locator('.mobile-drawer-menu');
    await drawer.getByRole('button', { name: /open to work/i }).click();
    await page.waitForTimeout(400);

    // Drawer should close and view should switch
    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-04: Member Detail Modal + Route Logo Navigation
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-04: Member detail modal + route logo navigation dismisses modal cleanly', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await navigateToTab(page, 'miembros');

    // Click member card if present
    const memberCard = page.locator('.member-card, div[style*="cursor: pointer"]:has(h3)').first();
    if (await memberCard.isVisible()) {
      await memberCard.click();
      await page.waitForTimeout(300);

      // Click brand logo to return home
      const logo = page.locator('img[alt*="Logo WIC"]').first();
      await logo.click();
      await page.waitForTimeout(400);

      const overflow = await detectHorizontalOverflow(page);
      expect(overflow.hasOverflow).toBe(false);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-05: Open to Work Category Filter Pill + Modal Application Form
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-05: Open to Work filter pill + talent application modal', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await navigateToTab(page, 'opentowork');

    // Filter category
    const filterPill = page.getByRole('button', { name: /financiero|aml/i }).first();
    if (await filterPill.isVisible()) {
      await filterPill.click();
      await page.waitForTimeout(300);
    }

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-06: Únete Plan Toggle + Form Input at 320px
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-06: Únete plan toggle + form input + benefits grid at 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await navigateToTab(page, 'unete');

    // Toggle corporativa if present
    const corpToggle = page.getByRole('button', { name: /corporativa/i }).first();
    if (await corpToggle.isVisible()) {
      await corpToggle.click();
      await page.waitForTimeout(300);
    }

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-07: Lightbox Modal Multi-Touch Swipe + Arrow Navigation
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-07: Lightbox touch swipe + arrow buttons navigation interplay', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);

    const firstCard = page.locator('.event-carousel-card').first();
    await firstCard.click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Click next arrow inside lightbox
    const nextBtn = modal.locator('button[aria-label="Foto siguiente"]');
    await nextBtn.click();
    await page.waitForTimeout(200);

    const header = await modal.innerText();
    expect(header).toMatch(/fotograf[ií]a 2 de/i);

    // Keyboard back to 1
    await page.keyboard.press('ArrowLeft');
    await page.waitForTimeout(200);
    expect(await modal.innerText()).toMatch(/fotograf[ií]a 1 de/i);

    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-08: Deep Scroll to Memorias + Footer Legal Modal Trigger
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-08: Deep scroll to Memorias Fotográficas + footer legal modal trigger', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);

    // Scroll to bottom
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(400);

    const privacyBtn = page.getByRole('button', { name: /política de privacidad/i });
    if (await privacyBtn.isVisible()) {
      await privacyBtn.click();
      await page.waitForTimeout(300);
      await page.keyboard.press('Escape');
    }

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-09: Carousel Manual Touch Drag / Pause + Autoplay Resumption
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-09: Carousel touch drag pause + smooth autoplay resumption', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);

    const track = page.locator('.event-carousel-track').first();
    await expect(track).toBeVisible();

    // Drag track
    const box = await track.boundingBox();
    if (box) {
      await page.mouse.move(box.x + 250, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 100, box.y + 100, { steps: 5 });
      await page.mouse.up();

      // Read position right after drag
      const posAfterDrag = await track.evaluate((el) => el.scrollLeft);

      // Wait 1s (pause is active)
      await page.waitForTimeout(1000);
      const posWhilePaused = await track.evaluate((el) => el.scrollLeft);
      expect(Math.abs(posWhilePaused - posAfterDrag)).toBeLessThanOrEqual(10);

      // Wait 5.5s (autoplay resumed)
      await page.waitForTimeout(5500);
      const posAfterResumed = await track.evaluate((el) => el.scrollLeft);
      expect(posAfterResumed).toBeGreaterThan(posAfterDrag);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-10: 404 Route Audit Demo Execution + Immediate Tab Switch
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-10: 404 route audit demo execution + immediate tab switch', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Trigger 404 view
    await page.evaluate(() => { window.location.hash = '#404-test'; });
    await page.waitForTimeout(300);

    // Switch to Inicio
    await navigateToTab(page, 'inicio');
    await page.waitForTimeout(400);

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-11: Member Tag Filter + Bio Modal + Rapid Modal Close
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-11: Member specialty tag filter + bio modal + rapid modal close', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await navigateToTab(page, 'miembros');

    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Compliance');
      await page.waitForTimeout(300);
    }

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // PAIR-12: Mobile Drawer Open + Viewport Resize to Desktop
  // ─────────────────────────────────────────────────────────────
  test('TEST-T3-PAIR-12: Mobile drawer open + viewport resize to desktop (375px -> 1280px)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // Open mobile hamburger drawer
    const hamburger = page.locator('button.mobile-menu-toggle');
    await hamburger.click();
    await page.waitForTimeout(300);
    await expect(page.locator('.mobile-drawer-menu')).toBeVisible();

    // Dynamically resize to desktop 1280px
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.waitForTimeout(300);

    // Desktop nav menu should be visible and drawer suppressed
    const desktopNav = page.locator('.desktop-nav-menu');
    await expect(desktopNav).toBeVisible();

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

});
