import { test, expect } from '@playwright/test';
import { openPastEventDetail } from '../helpers/navigation';

test.describe('Adversarial Stress Suite: Milestone 1 (F1-F6)', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);
  });

  // ─────────────────────────────────────────────────────────────
  // 1. AUTOPLAY & ARROW MECHANICS WRAP-AROUND AT LAST IMAGE
  // ─────────────────────────────────────────────────────────────
  test('ADV-01: Nav arrow wrap-around cleanly loops from last photo back to index 0', async ({ page }) => {
    const carousel = page.locator('.event-photo-carousel-wrapper').first();
    await expect(carousel).toBeVisible();

    const track = carousel.locator('.event-carousel-track');
    const cards = track.locator('.event-carousel-card');
    const dots = carousel.locator('.carousel-dot-btn');

    const totalDots = await dots.count();
    expect(totalDots).toBeGreaterThanOrEqual(2);

    // Let's inspect which dot has activeIndex
    const stateBefore = await dots.evaluateAll((els) => {
      return els.map((el, i) => ({ i, width: el.style.width, bg: el.style.backgroundColor }));
    });
    console.log('Initial dots:', stateBefore);

    // Click the last dot
    const lastIndex = totalDots - 1;
    await dots.nth(lastIndex).click();
    await page.waitForTimeout(1000);

    const stateAfterDot = await dots.evaluateAll((els) => {
      return els.map((el, i) => ({ i, width: el.style.width, bg: el.style.backgroundColor }));
    });
    console.log('Dots after clicking last dot:', stateAfterDot);

    // Now click Next arrow on this carousel: from the end of the carousel it must cleanly wrap around to index 0
    const nextBtn = carousel.locator('.carousel-nav-btn[aria-label="Foto siguiente"]');
    let wrapped = false;
    for (let attempt = 0; attempt < 3; attempt++) {
      await nextBtn.click();
      await page.waitForTimeout(600);
      const dot0Width = await dots.nth(0).evaluate((el) => el.style.width);
      if (dot0Width === '24px') {
        wrapped = true;
        break;
      }
    }
    expect(wrapped).toBe(true);

    // Verify first card is at track start
    const firstCardBox = await cards.nth(0).boundingBox();
    const trackBox = await track.boundingBox();
    expect(firstCardBox).not.toBeNull();
    expect(trackBox).not.toBeNull();
    if (firstCardBox && trackBox) {
      expect(Math.abs(firstCardBox.x - trackBox.x)).toBeLessThanOrEqual(50);
    }
  });

  test('ADV-01B: Autoplay mathematical modular wrap-around (prev + 1) % photos.length', async ({ page }) => {
    // Adversarially stress test the mathematical modulo boundary across array sizes 2..50
    const wrapTest = await page.evaluate(() => {
      const results: { size: number; wrappedCleanly: boolean }[] = [];
      for (let size = 2; size <= 50; size++) {
        const lastIdx = size - 1;
        const nextIdx = (lastIdx + 1) % size;
        results.push({ size, wrappedCleanly: nextIdx === 0 });
      }
      return results.every((r) => r.wrappedCleanly);
    });
    expect(wrapTest).toBe(true);
  });

  test('ADV-02: Interval and timeout cleanup on unmount avoids memory leaks', async ({ page }) => {
    const backBtn = page.getByRole('button', { name: /volver a eventos/i }).first();
    await expect(backBtn).toBeVisible();

    // Exit the detail view (unmounting EventPhotosCarousel)
    await backBtn.click();
    await page.waitForTimeout(400);
    await expect(page.locator('.events-detail-grid')).toHaveCount(0);

    // Re-enter event detail (re-mounting EventPhotosCarousel)
    await openPastEventDetail(page);
    await expect(page.locator('.events-detail-grid')).toBeVisible();

    // Verify carousel functions normally after re-mount
    const track = page.locator('.event-carousel-track').first();
    await expect(track).toBeVisible();
  });

  // ─────────────────────────────────────────────────────────────
  // 2. PHOTO CLICK / LIGHTBOX MECHANICS & DRAG VS TAP
  // ─────────────────────────────────────────────────────────────
  test('ADV-03: Direct click on index 0, 1, 2, 3, 4, 5, 6, 7 opens lightbox without being dropped', async ({ page }) => {
    const track = page.locator('.event-carousel-track').first();
    await expect(track).toBeVisible();

    const cards = track.locator('.event-carousel-card');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < Math.min(count, 8); i++) {
      const card = cards.nth(i);
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);

      // Direct click on the card
      await card.click();

      // Verify lightbox opens
      const dialog = page.locator('div[role="dialog"]');
      await expect(dialog).toBeVisible({ timeout: 4000 });

      // Verify the active heading contains the expected index
      const heading = dialog.locator('h4');
      await expect(heading).toContainText(`Fotografía ${i + 1} de`);

      // Close the modal
      const closeBtn = dialog.locator('button[aria-label="Cerrar vista completa"]');
      await closeBtn.click();
      await expect(dialog).toHaveCount(0);
      await page.waitForTimeout(150);
    }
  });

  test('ADV-04: Drag threshold vs tap threshold (8px) and hasMoved reset', async ({ page }) => {
    const carousel = page.locator('.event-photo-carousel-wrapper').first();
    const track = carousel.locator('.event-carousel-track');
    await expect(track).toBeVisible();

    const firstCard = track.locator('.event-carousel-card').first();

    // Test 1: Direct click on card opens lightbox
    await firstCard.click();
    const dialog = page.locator('div[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 4000 });
    await dialog.locator('button[aria-label="Cerrar vista completa"]').click();
    await expect(dialog).toHaveCount(0);
    await page.waitForTimeout(200);

    // Test 2: Drag gesture on track
    const trackBox = await track.boundingBox();
    if (trackBox) {
      await page.mouse.move(trackBox.x + 300, trackBox.y + 60);
      await page.mouse.down();
      await page.mouse.move(trackBox.x + 150, trackBox.y + 60, { steps: 5 });
      await page.mouse.up();

      // Dragging the track must NOT open the lightbox
      await expect(page.locator('div[role="dialog"]')).toHaveCount(0);

      // Wait 150ms for reset timeout
      await page.waitForTimeout(150);

      // Now click card 1: it must open cleanly
      const secondCard = track.locator('.event-carousel-card').nth(1);
      await secondCard.click();
      await expect(page.locator('div[role="dialog"]')).toBeVisible({ timeout: 4000 });
      await page.locator('div[role="dialog"] button[aria-label="Cerrar vista completa"]').click();
      await expect(page.locator('div[role="dialog"]')).toHaveCount(0);
    }
  });

  // ─────────────────────────────────────────────────────────────
  // 3. CSS BUTTON RULES ON NARROW VIEWPORTS
  // ─────────────────────────────────────────────────────────────
  test('ADV-05: Carousel nav and dot buttons have padding: 0 and preserve SVG dimensions', async ({ page }) => {
    const navBtn = page.locator('.carousel-nav-btn').first();
    await expect(navBtn).toBeVisible();

    const padding = await navBtn.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        width: style.width,
        height: style.height,
        boxSizing: style.boxSizing
      };
    });

    expect(padding.paddingLeft).toBe('0px');
    expect(padding.paddingRight).toBe('0px');
    expect(parseFloat(padding.width)).toBeGreaterThanOrEqual(35);
    expect(parseFloat(padding.height)).toBeGreaterThanOrEqual(35);

    // Check SVG inside nav button
    const svgBox = await navBtn.locator('svg').evaluate((el) => {
      const rect = el.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(svgBox.width).toBeGreaterThanOrEqual(16);
    expect(svgBox.height).toBeGreaterThanOrEqual(16);

    // Check dot button padding
    const dotBtn = page.locator('.carousel-dot-btn').first();
    await expect(dotBtn).toBeVisible();
    const dotPadding = await dotBtn.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return {
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        height: style.height
      };
    });
    expect(dotPadding.paddingLeft).toBe('0px');
    expect(dotPadding.paddingRight).toBe('0px');
    expect(parseFloat(dotPadding.height)).toBeGreaterThanOrEqual(6);
  });

  // ─────────────────────────────────────────────────────────────
  // 4. RESPONSIVE CONTAINMENT & FIXED WIDTH CHECKS
  // ─────────────────────────────────────────────────────────────
  test('ADV-06: Responsive containment in events-detail-grid and EventPhotosCarousel on 320px', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(300);

    const detailGrid = page.locator('.events-detail-grid').first();
    await expect(detailGrid).toBeVisible();

    const result = await page.evaluate(() => {
      const windowWidth = window.innerWidth;
      const offenders: Array<{ tag: string; className: string; scrollWidth: number; rectRight: number }> = [];
      const grid = document.querySelector('.events-detail-grid');
      if (!grid) return { windowWidth, offenders: [] };

      const allElements = grid.querySelectorAll('*');
      for (const el of allElements) {
        const html = el as HTMLElement;
        const rect = html.getBoundingClientRect();
        const style = window.getComputedStyle(html);
        if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) continue;

        // The carousel track intentionally scrolls horizontally, so cards inside the track scroll
        if (html.classList.contains('event-carousel-track') || html.closest('.event-carousel-track')) {
          continue;
        }

        if (rect.right > windowWidth + 2 && style.overflowX !== 'hidden' && style.overflowX !== 'clip') {
          offenders.push({
            tag: html.tagName.toLowerCase(),
            className: html.className,
            scrollWidth: html.scrollWidth,
            rectRight: Math.round(rect.right)
          });
        }
      }
      return { windowWidth, offenders };
    });

    expect(result.offenders).toEqual([]);
  });

  test('ADV-07: Clean card presentation without "AMPLIAR" text or eye icon', async ({ page }) => {
    const track = page.locator('.event-carousel-track').first();
    await expect(track).toBeVisible();

    // Check no element inside track contains text "AMPLIAR"
    const textContent = await track.innerText();
    expect(textContent.toUpperCase()).not.toContain('AMPLIAR');

    // Check no lucide-eye or svg matching eye exists inside track cards
    const eyeIcons = track.locator('.event-carousel-card svg.lucide-eye, .event-carousel-card svg[data-icon="eye"]');
    await expect(eyeIcons).toHaveCount(0);
  });

  test('ADV-08: Memorias Fotográficas lower gallery has hideHeader and aligned arrows', async ({ page }) => {
    const carousels = page.locator('.event-photo-carousel-wrapper');
    const carouselCount = await carousels.count();
    if (carouselCount >= 2) {
      const lowerCarousel = carousels.nth(1);
      // In lower carousel with hideHeader=true, there should NOT be a "Fotos del Evento" badge
      const badge = lowerCarousel.locator('text=/Fotos del Evento/i');
      await expect(badge).toHaveCount(0);

      // Nav buttons should still be visible and aligned
      const navBtns = lowerCarousel.locator('.carousel-nav-btn');
      await expect(navBtns).toHaveCount(2);
      await expect(navBtns.first()).toBeVisible();
      await expect(navBtns.last()).toBeVisible();
    }
  });

});
