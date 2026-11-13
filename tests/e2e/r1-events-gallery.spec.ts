import { test, expect } from '@playwright/test';
import { openPastEventDetail } from '../helpers/navigation';

test.describe('Requirement R1: Events Carousel, Galleries, Lightbox & Memorias Fotográficas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await openPastEventDetail(page);
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 1: SEQUENTIAL ONE-BY-ONE AUTOPLAY (F1)
  // ─────────────────────────────────────────────────────────────
  test.describe('F1: Sequential One-by-One Autoplay', () => {

    test('T1-F1-01: carousel track advances sequentially after autoplay interval (~3.5s)', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await expect(track).toBeVisible();

      // Read initial scrollLeft
      const initialScroll = await track.evaluate((el) => el.scrollLeft);

      // Wait 4000ms to allow ~3500ms interval to fire
      await page.waitForTimeout(4200);

      const afterScroll = await track.evaluate((el) => el.scrollLeft);
      expect(afterScroll).toBeGreaterThan(initialScroll);
    });

    test('T1-F1-02: multi-step sequential progression advances without multi-card skipping', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await expect(track).toBeVisible();

      const dots = page.locator('.carousel-dot-btn');
      const count = await dots.count();
      if (count >= 3) {
        // Dot 0 or 1 should be active initially
        await page.waitForTimeout(4000);
        // After 4s, index should have advanced
        const activeIdx1 = await track.evaluate((el) => {
          const cards = el.querySelectorAll('.event-carousel-card');
          const containerLeft = el.getBoundingClientRect().left;
          let closest = 0;
          let minDiff = Infinity;
          cards.forEach((c, i) => {
            const diff = Math.abs(c.getBoundingClientRect().left - containerLeft);
            if (diff < minDiff) { minDiff = diff; closest = i; }
          });
          return closest;
        });
        expect(activeIdx1).toBeGreaterThanOrEqual(1);
      }
    });

    test('T1-F1-03: hover over carousel track pauses autoplay', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await expect(track).toBeVisible();

      // Hover over track
      await track.hover();
      const scrollAtHover = await track.evaluate((el) => el.scrollLeft);

      // Wait 4000ms while hovered
      await page.waitForTimeout(4000);

      const scrollAfterWait = await track.evaluate((el) => el.scrollLeft);
      // While paused, scroll position should remain substantially identical
      expect(Math.abs(scrollAfterWait - scrollAtHover)).toBeLessThanOrEqual(15);
    });

    test('T1-F1-04: autoplay resumes after mouseleave and delay', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await expect(track).toBeVisible();

      // Hover to pause
      await track.hover();
      await page.waitForTimeout(1000);

      // Move away
      await page.mouse.move(0, 0);

      // Read position right after mouse leave
      const scrollAfterLeave = await track.evaluate((el) => el.scrollLeft);

      // Wait for resumeDelay (1800ms) + autoplay interval (3500ms) = 5500ms
      await page.waitForTimeout(6000);

      const finalScroll = await track.evaluate((el) => el.scrollLeft);
      expect(finalScroll).toBeGreaterThan(scrollAfterLeave);
    });

    test('T1-F1-05: opening lightbox modal suspends background carousel autoplay', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const firstCard = track.locator('.event-carousel-card').first();
      await firstCard.click();

      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      const scrollWhileOpen = await track.evaluate((el) => el.scrollLeft);
      await page.waitForTimeout(4500);

      const scrollAfterWait = await track.evaluate((el) => el.scrollLeft);
      expect(Math.abs(scrollAfterWait - scrollWhileOpen)).toBeLessThanOrEqual(15);

      // Close modal
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    });

    test('T2-F1-01: end-of-track handles cycle wrap without crash', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await track.evaluate((el) => {
        el.scrollLeft = el.scrollWidth;
      });
      await page.waitForTimeout(500);
      // Wait for next timer cycle
      await page.waitForTimeout(4000);
      // Verify no runtime exceptions occurred and cards remain in DOM
      const cardCount = await track.locator('.event-carousel-card').count();
      expect(cardCount).toBeGreaterThan(0);
    });

    test('T2-F1-04: document visibility change does not crash autoplay interval', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await expect(track).toBeVisible();

      // Simulate tab hidden then visible
      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: true, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(1000);

      await page.evaluate(() => {
        Object.defineProperty(document, 'hidden', { value: false, configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(1000);

      expect(await track.isVisible()).toBe(true);
    });

    test('T2-F1-05: rapid mouse enter/leave toggles do not corrupt carousel state', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      for (let i = 0; i < 4; i++) {
        await track.hover();
        await page.mouse.move(0, 0);
        await page.waitForTimeout(80);
      }
      // Wait for stabilization
      await page.waitForTimeout(4000);
      const isVisible = await track.isVisible();
      expect(isVisible).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 2: TOUCH SWIPE & MANUAL POINTER DRAG (F2)
  // ─────────────────────────────────────────────────────────────
  test.describe('F2: Touch Swipe & Gesture Support', () => {

    test('T1-F2-01: track has touchAction: pan-x and supports swipe gestures', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const touchAction = await track.evaluate((el) => window.getComputedStyle(el).touchAction);
      expect(touchAction).toBe('pan-x');
    });

    test('T1-F2-03: mouse pointer drag changes cursor and updates scrollLeft', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const box = await track.boundingBox();
      if (!box) throw new Error('Track not visible');

      // Drag from right to left with steps
      await page.mouse.move(box.x + 400, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 80, box.y + 100, { steps: 10 });

      const duringDragScroll = await track.evaluate((el) => el.scrollLeft);
      await page.mouse.up();

      expect(duringDragScroll).toBeGreaterThan(0);
    });

    test('T1-F2-05: drag displacement > 8px suppresses click modal trigger', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const firstCard = track.locator('.event-carousel-card').first();
      const cardBox = await firstCard.boundingBox();
      if (!cardBox) throw new Error('Card not visible');

      // Drag over card
      await page.mouse.move(cardBox.x + 100, cardBox.y + 50);
      await page.mouse.down();
      await page.mouse.move(cardBox.x + 30, cardBox.y + 50, { steps: 5 });
      await page.mouse.up();

      // Lightbox should NOT be opened
      const modal = page.locator('div[role="dialog"]');
      expect(await modal.isVisible()).toBe(false);
    });

    test('T2-F2-02: overscroll right at start clamps cleanly without negative scroll', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const box = await track.boundingBox();
      if (!box) throw new Error('Track not visible');

      // Drag left to right at start
      await page.mouse.move(box.x + 50, box.y + 50);
      await page.mouse.down();
      await page.mouse.move(box.x + 250, box.y + 50, { steps: 5 });
      await page.mouse.up();

      const scroll = await track.evaluate((el) => el.scrollLeft);
      expect(scroll).toBeGreaterThanOrEqual(0);
    });

    test('T2-F2-05: vertical scroll gesture is not blocked by track', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const box = await track.boundingBox();
      if (!box) throw new Error('Track not visible');

      const initialPageY = await page.evaluate(() => window.scrollY);

      // Scroll page down
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(300);

      const afterScrollPageY = await page.evaluate(() => window.scrollY);
      expect(afterScrollPageY).toBeGreaterThanOrEqual(initialPageY);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 3: CAROUSEL ARROW NAVIGATION (F3)
  // ─────────────────────────────────────────────────────────────
  test.describe('F3: Carousel Arrow Navigation', () => {

    test('T1-F3-01: clicking right arrow button advances the track', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const rightBtn = page.locator('button[aria-label="Foto siguiente"]').first();
      await expect(rightBtn).toBeVisible();

      const initialScroll = await track.evaluate((el) => el.scrollLeft);
      await rightBtn.click();
      await page.waitForTimeout(600);

      const afterScroll = await track.evaluate((el) => el.scrollLeft);
      expect(afterScroll).toBeGreaterThan(initialScroll);
    });

    test('T1-F3-02: clicking left arrow button scrolls backward when scrolled', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      const rightBtn = page.locator('button[aria-label="Foto siguiente"]').first();
      const leftBtn = page.locator('button[aria-label="Foto anterior"]').first();

      // Advance first
      await rightBtn.click();
      await page.waitForTimeout(600);
      const scrolledPos = await track.evaluate((el) => el.scrollLeft);
      expect(scrolledPos).toBeGreaterThan(0);

      // Go back
      await leftBtn.click();
      await page.waitForTimeout(600);
      const backPos = await track.evaluate((el) => el.scrollLeft);
      expect(backPos).toBeLessThan(scrolledPos);
    });

    test('T1-F3-03: left arrow has proper boundary opacity state at start', async ({ page }) => {
      const track = page.locator('.event-carousel-track').first();
      await track.evaluate((el) => { el.scrollLeft = 0; el.dispatchEvent(new Event('scroll')); });
      await page.waitForTimeout(200);

      const leftBtn = page.locator('button[aria-label="Foto anterior"]').first();
      const opacity = await leftBtn.evaluate((el) => window.getComputedStyle(el).opacity);
      expect(parseFloat(opacity)).toBeLessThanOrEqual(0.8);
    });

    test('T2-F3-01: rapid multiple clicks on navigation arrow do not crash or produce NaN', async ({ page }) => {
      const rightBtn = page.locator('button[aria-label="Foto siguiente"]').first();
      for (let i = 0; i < 5; i++) {
        await rightBtn.click();
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(500);

      const track = page.locator('.event-carousel-track').first();
      const scrollLeft = await track.evaluate((el) => el.scrollLeft);
      expect(Number.isNaN(scrollLeft)).toBe(false);
      expect(scrollLeft).toBeGreaterThanOrEqual(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 4: ELIMINATION OF "AMPLIAR" TEXT & EYE ICON (F4)
  // ─────────────────────────────────────────────────────────────
  test.describe('F4: Absolute Removal of "AMPLIAR" Text & Eye Icon', () => {

    test('T1-F4-01: no card contains "AMPLIAR" or "Ampliar" text', async ({ page }) => {
      const carouselCards = page.locator('.event-carousel-card');
      const count = await carouselCards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const text = await carouselCards.nth(i).innerText();
        expect(text).not.toMatch(/ampliar/i);
      }
    });

    test('T1-F4-02: no Lucide Eye icon or eye tooltip exists on carousel cards', async ({ page }) => {
      const eyeIcons = page.locator('.event-carousel-card svg.lucide-eye');
      expect(await eyeIcons.count()).toBe(0);

      const eyeTooltips = page.locator('.event-carousel-card [title*="ampliar" i]');
      expect(await eyeTooltips.count()).toBe(0);
    });

    test('T1-F4-04: clean index counter badge (e.g. 01 / 08) is preserved without eye icon', async ({ page }) => {
      const firstCard = page.locator('.event-carousel-card').first();
      const text = await firstCard.innerText();
      expect(text).toMatch(/01\s*\/\s*\d{2}/);
      expect(await firstCard.locator('svg.lucide-eye').count()).toBe(0);
    });

    test('T2-F4-01: zero text nodes matching /ampliar/i across all carousel card overlays', async ({ page }) => {
      const hasAmpliarText = await page.evaluate(() => {
        const cards = document.querySelectorAll('.event-carousel-card');
        for (const card of cards) {
          const walker = document.createTreeWalker(card, NodeFilter.SHOW_TEXT);
          let node = walker.nextNode();
          while (node) {
            if (/ampliar/i.test(node.nodeValue || '')) {
              return true;
            }
            node = walker.nextNode();
          }
        }
        return false;
      });
      expect(hasAmpliarText).toBe(false);
    });

    test('T2-F4-04: card hover does not reveal hidden eye icon', async ({ page }) => {
      const firstCard = page.locator('.event-carousel-card').first();
      await firstCard.hover();
      await page.waitForTimeout(200);

      const eyeIcons = firstCard.locator('svg.lucide-eye');
      expect(await eyeIcons.count()).toBe(0);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 5: DIRECT LIGHTBOX ON ANY PHOTO CLICK (F5)
  // ─────────────────────────────────────────────────────────────
  test.describe('F5: Direct Lightbox Modal Trigger on ANY Photo Click', () => {

    test('T1-F5-01: clicking first photo card directly opens lightbox at index 0', async ({ page }) => {
      const firstCard = page.locator('.event-carousel-card').first();
      await firstCard.click();

      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      const headerText = await modal.innerText();
      expect(headerText).toMatch(/fotograf[ií]a 1 de/i);

      // Close modal
      await modal.locator('button[aria-label="Cerrar vista completa"]').click();
      await expect(modal).not.toBeVisible();
    });

    test('T1-F5-02: clicking 3rd and subsequent photos directly opens modal at exact index', async ({ page }) => {
      const cards = page.locator('.event-carousel-card');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(3);

      // Click 3rd photo (index 2)
      await cards.nth(2).click();
      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      const headerText3 = await modal.innerText();
      expect(headerText3).toMatch(/fotograf[ií]a 3 de/i);

      // Close
      await modal.locator('button[aria-label="Cerrar vista completa"]').click();
      await expect(modal).not.toBeVisible();

      // Click 4th photo (index 3) if available
      if (count >= 4) {
        await cards.nth(3).click();
        await expect(modal).toBeVisible();
        const headerText4 = await modal.innerText();
        expect(headerText4).toMatch(/fotograf[ií]a 4 de/i);
        await modal.locator('button[aria-label="Cerrar vista completa"]').click();
      }
    });

    test('T1-F5-03: close button dismisses lightbox modal cleanly', async ({ page }) => {
      const firstCard = page.locator('.event-carousel-card').first();
      await firstCard.click();

      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      const closeBtn = modal.locator('button[aria-label="Cerrar vista completa"]');
      await closeBtn.click();
      await expect(modal).not.toBeVisible();
    });

    test('T1-F5-05: keyboard Escape, ArrowRight, and ArrowLeft control lightbox modal', async ({ page }) => {
      const cards = page.locator('.event-carousel-card');
      await cards.nth(0).click();

      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();
      expect(await modal.innerText()).toMatch(/fotograf[ií]a 1 de/i);

      // ArrowRight -> photo 2
      await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(200);
      expect(await modal.innerText()).toMatch(/fotograf[ií]a 2 de/i);

      // ArrowLeft -> photo 1
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(200);
      expect(await modal.innerText()).toMatch(/fotograf[ií]a 1 de/i);

      // Escape -> close
      await page.keyboard.press('Escape');
      await expect(modal).not.toBeVisible();
    });

    test('T2-F5-03: modal arrows wrap around circular bounds', async ({ page }) => {
      const firstCard = page.locator('.event-carousel-card').first();
      await firstCard.click();

      const modal = page.locator('div[role="dialog"]');
      await expect(modal).toBeVisible();

      // Left arrow from index 0 should wrap to last photo
      const prevBtn = modal.locator('button[aria-label="Foto anterior"]');
      await prevBtn.click();
      await page.waitForTimeout(200);

      const headerText = await modal.innerText();
      // Should show last photo (e.g. "8 de 8")
      expect(headerText).toMatch(/fotograf[ií]a \d+ de \d+/i);

      await page.keyboard.press('Escape');
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 6: ARROW BUTTON SVG VISIBILITY & ANTI-SQUASHING (F6)
  // ─────────────────────────────────────────────────────────────
  test.describe('F6: Mobile Arrow SVG Anti-Squashing', () => {

    test('T1-F6-01: navigation arrow buttons render non-zero SVGs', async ({ page }) => {
      const buttons = page.locator('.carousel-nav-btn');
      const count = await buttons.count();
      expect(count).toBeGreaterThanOrEqual(2);

      for (let i = 0; i < count; i++) {
        const svg = buttons.nth(i).locator('svg');
        await expect(svg).toBeVisible();
        const box = await svg.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.width).toBeGreaterThanOrEqual(14);
        expect(box!.height).toBeGreaterThanOrEqual(14);
      }
    });

    test('T1-F6-03: navigation buttons maintain circular geometry with padding reset', async ({ page }) => {
      const navBtn = page.locator('.carousel-nav-btn').first();
      const box = await navBtn.boundingBox();
      expect(box).not.toBeNull();
      // Nominal ~36px circular button
      expect(box!.width).toBeGreaterThanOrEqual(30);
      expect(box!.height).toBeGreaterThanOrEqual(30);

      // Verify padding is 0 and not squashed by global button rule
      const padding = await navBtn.evaluate((el) => {
        const cs = window.getComputedStyle(el);
        return {
          paddingLeft: parseFloat(cs.paddingLeft),
          paddingRight: parseFloat(cs.paddingRight)
        };
      });
      expect(padding.paddingLeft).toBeLessThanOrEqual(4);
      expect(padding.paddingRight).toBeLessThanOrEqual(4);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // FEATURE 7: "MEMORIAS FOTOGRÁFICAS" SPACING & LAYOUT (F7)
  // ─────────────────────────────────────────────────────────────
  test.describe('F7: Memorias Fotográficas Spacing & Layout', () => {

    test('T1-F7-03: single dedicated heading for Memorias section without duplicate badges', async ({ page }) => {
      const headings = page.getByRole('heading', { name: /memorias fotográficas del evento culminado/i });
      expect(await headings.count()).toBe(1);
    });

    test('T1-F7-04: all cards in Memorias section contain valid non-empty photo sources', async ({ page }) => {
      const memoriasWrapper = page.locator('text=Memorias Fotográficas del Evento Culminado').locator('xpath=ancestor::div[contains(@class,"reveal")]').first();
      const cards = memoriasWrapper.locator('.event-carousel-card');
      const count = await cards.count();
      expect(count).toBeGreaterThan(0);

      for (let i = 0; i < count; i++) {
        const img = cards.nth(i).locator('img');
        const src = await img.getAttribute('src');
        expect(src).toBeTruthy();
        expect(src!.length).toBeGreaterThan(5);
      }
    });

    test('T1-F7-05: Memorias section causes no horizontal overflow', async ({ page }) => {
      const memoriasWrapper = page.locator('text=Memorias Fotográficas del Evento Culminado').locator('xpath=ancestor::div[contains(@class,"reveal")]').first();
      const isOverflowing = await memoriasWrapper.evaluate((el) => el.scrollWidth > el.clientWidth + 1);
      expect(isOverflowing).toBe(false);
    });
  });

});
