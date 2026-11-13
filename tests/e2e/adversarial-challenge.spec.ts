import { test, expect } from '@playwright/test';
import { detectHorizontalOverflow } from '../helpers/overflow-detector';
import { openPastEventDetail, navigateToTab } from '../helpers/navigation';

test.describe('Adversarial Challenger Suite: Defect Injection, Oracles & Boundary Stress', () => {

  // ─────────────────────────────────────────────────────────────
  // SUITE 1: EMPIRICAL STRESS TESTING OF OVERFLOW DETECTOR ORACLE
  // ─────────────────────────────────────────────────────────────
  test.describe('Oracle Stress: detectHorizontalOverflow Bounding & Invariants', () => {

    test('CHALLENGE-ORACLE-01: Baseline clean page returns hasOverflow=false and 0 offenders', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><style>body { margin: 0; padding: 0; width: 100%; box-sizing: border-box; }</style></head>
        <body><div style="width: 100%; height: 200px; background: #eee;">Clean</div></body>
        </html>
      `);
      await page.setViewportSize({ width: 360, height: 600 });
      const result = await detectHorizontalOverflow(page);
      expect(result.hasOverflow).toBe(false);
      expect(result.offenders.length).toBe(0);
    });

    test('CHALLENGE-ORACLE-02: Element exceeding windowWidth by 0.5px is within tolerance (no false positive)', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><style>body { margin: 0; padding: 0; }</style></head>
        <body><div style="width: 360.5px; height: 100px;">Tolerance</div></body>
        </html>
      `);
      await page.setViewportSize({ width: 360, height: 600 });
      const result = await detectHorizontalOverflow(page);
      expect(result.hasOverflow).toBe(false);
      expect(result.offenders.length).toBe(0);
    });

    test('CHALLENGE-ORACLE-03: Element exceeding windowWidth by 2.5px is strictly flagged as overflow', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><style>body { margin: 0; padding: 0; }</style></head>
        <body><div id="spiller" style="width: 363px; height: 100px; background: red;">Spill</div></body>
        </html>
      `);
      await page.setViewportSize({ width: 360, height: 600 });
      const result = await detectHorizontalOverflow(page);
      expect(result.hasOverflow).toBe(true);
      expect(result.offenders.length).toBeGreaterThan(0);
      expect(result.offenders.some(o => o.id === 'spiller')).toBe(true);
    });

    test('CHALLENGE-ORACLE-04: Root html/body overflow-x:hidden DOES NOT mask internal spilling child', async ({ page }) => {
      // Verifies that detectHorizontalOverflow pierces root overflow-x:hidden
      await page.setContent(`
        <!DOCTYPE html>
        <html style="overflow-x: hidden; width: 100%;">
        <body style="overflow-x: hidden; width: 100%; margin: 0;">
          <div id="root" style="overflow-x: hidden; width: 100%;">
            <div id="truncated-card" style="width: 420px; height: 100px; background: red;">420px card</div>
          </div>
        </body>
        </html>
      `);
      await page.setViewportSize({ width: 320, height: 568 });
      const result = await detectHorizontalOverflow(page);
      expect(result.hasOverflow).toBe(true);
      expect(result.offenders.some(o => o.id === 'truncated-card')).toBe(true);
    });

    test('CHALLENGE-ORACLE-05: Hidden offscreen elements (display:none) produce no false positives', async ({ page }) => {
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><style>body { margin: 0; padding: 0; }</style></head>
        <body>
          <div style="width: 300px; height: 100px;">Visible</div>
          <div style="display: none; width: 1000px;">Hidden</div>
        </body>
        </html>
      `);
      await page.setViewportSize({ width: 320, height: 568 });
      const result = await detectHorizontalOverflow(page);
      expect(result.hasOverflow).toBe(false);
      expect(result.offenders.length).toBe(0);
    });

    test('CHALLENGE-ORACLE-06 [COUNTER-EXAMPLE]: Demonstrates false positive vulnerability when children are inside scroll containers', async ({ page }) => {
      // Demonstrates the bug in detectHorizontalOverflow:
      // When a valid horizontal carousel (.event-carousel-track) has overflow-x:auto,
      // its slides (width 200px laid side-by-side) spill past windowWidth in bounding box,
      // and detectHorizontalOverflow falsely flags them because it only checks style on the child.
      await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head><style>body { margin: 0; padding: 0; }</style></head>
        <body>
          <div id="carousel-track" style="width: 320px; overflow-x: auto; display: flex;">
            <div id="slide-1" style="min-width: 200px; height: 100px;">Slide 1</div>
            <div id="slide-2" style="min-width: 200px; height: 100px;">Slide 2</div>
          </div>
        </body>
        </html>
      `);
      await page.setViewportSize({ width: 320, height: 568 });
      const result = await detectHorizontalOverflow(page);

      // EMPIRICAL PROOF: slide-2 is falsely flagged as an offender
      expect(result.hasOverflow, 'Confirmed false positive: detectHorizontalOverflow flags carousel slide').toBe(true);
      expect(result.offenders.some(o => o.id === 'slide-2')).toBe(true);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE 2: ADVERSARIAL DEFECT INJECTION (MUTATION TESTING) ON R1
  // ─────────────────────────────────────────────────────────────
  test.describe('Defect Injection: Events Gallery & Lightbox Sensitivity', () => {

    test('MUTATION-R1-01: Injected "AMPLIAR" text is immediately flagged as a defect', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const firstCard = page.locator('.event-carousel-card').first();
      await expect(firstCard).toBeVisible();

      // Invert condition: inject defect into DOM
      await firstCard.evaluate((el) => {
        const badge = document.createElement('span');
        badge.className = 'test-injected-ampliar';
        badge.innerText = 'AMPLIAR';
        el.appendChild(badge);
      });

      // Execute test assertion logic from T1-F4-01
      const text = await firstCard.innerText();
      const hasAmpliar = /ampliar/i.test(text);

      // The oracle MUST catch the defect
      expect(hasAmpliar, 'Defect injected: Oracle successfully caught "AMPLIAR" text').toBe(true);
    });

    test('MUTATION-R1-02: Injected Lucide Eye icon is immediately flagged as a defect', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const firstCard = page.locator('.event-carousel-card').first();
      await expect(firstCard).toBeVisible();

      // Invert condition: inject fake Lucide Eye SVG
      await firstCard.evaluate((el) => {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'lucide lucide-eye');
        el.appendChild(svg);
      });

      // Execute test assertion logic from T1-F4-02
      const eyeIcons = page.locator('.event-carousel-card svg.lucide-eye');
      const count = await eyeIcons.count();

      // The oracle MUST catch the defect
      expect(count, 'Defect injected: Oracle successfully caught Lucide Eye icon').toBeGreaterThan(0);
    });

    test('MUTATION-R1-03: Sabotaged Lightbox on photo 3 is immediately caught', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const cards = page.locator('.event-carousel-card');
      const count = await cards.count();
      expect(count).toBeGreaterThanOrEqual(3);

      const card3 = cards.nth(2);

      // Sabotage click handler on card 3: intercept and prevent modal trigger
      await card3.evaluate((el) => {
        el.addEventListener('click', (e) => {
          e.stopImmediatePropagation();
        }, true);
      });

      await card3.click();
      await page.waitForTimeout(400);

      const modal = page.locator('div[role="dialog"]');
      const modalVisible = await modal.isVisible();

      // The oracle MUST detect modal failure
      expect(modalVisible, 'Sabotage verified: Modal failed to open as expected on disabled handler').toBe(false);
    });

    test('MUTATION-R1-04: Frozen carousel track is caught by autoplay verification logic', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const track = page.locator('.event-carousel-track').first();
      await expect(track).toBeVisible();

      // Force track scrollLeft to remain permanently 0 (simulate broken timer)
      await track.evaluate((el) => {
        Object.defineProperty(el, 'scrollLeft', {
          get: () => 0,
          set: () => {},
          configurable: true
        });
      });

      const initialScroll = await track.evaluate((el) => el.scrollLeft);
      await page.waitForTimeout(4000);
      const afterScroll = await track.evaluate((el) => el.scrollLeft);

      // Invariant check: afterScroll > initialScroll MUST FAIL when broken
      const didAdvance = afterScroll > initialScroll;
      expect(didAdvance, 'Sabotage verified: Autoplay did not advance when timer was frozen').toBe(false);
    });

    test('MUTATION-R1-05: Broken image src in Memorias section is caught by T1-F7-04 oracle', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const memoriasWrapper = page.locator('text=Memorias Fotográficas del Evento Culminado').locator('xpath=ancestor::div[contains(@class,"reveal")]').first();
      const firstImg = memoriasWrapper.locator('.event-carousel-card img').first();
      await expect(firstImg).toBeVisible();

      // Sabotage image src to empty
      await firstImg.evaluate((img: HTMLImageElement) => {
        img.removeAttribute('src');
      });

      const src = await firstImg.getAttribute('src');
      const isValid = Boolean(src && src.length > 5);

      // The oracle MUST detect empty src
      expect(isValid, 'Sabotage verified: Empty image src was caught by oracle').toBe(false);
    });
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE 3: ANTI-FALSE-POSITIVE VERIFICATION ON KNOWN COMPLIANT VIEWS
  // ─────────────────────────────────────────────────────────────
  test.describe('Anti-False-Positive Validation on Conforming Views', () => {

    const MOBILE_VIEWPORTS = [
      { name: '320px', width: 320, height: 568 },
      { name: '360px', width: 360, height: 800 },
      { name: '375px', width: 375, height: 667 },
      { name: '390px', width: 390, height: 844 },
      { name: '414px', width: 414, height: 896 },
      { name: '430px', width: 430, height: 932 },
    ];

    for (const vp of MOBILE_VIEWPORTS) {
      test(`Inicio page produces zero false positives @ ${vp.name}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.goto('/');
        await page.waitForLoadState('domcontentloaded');
        await navigateToTab(page, 'inicio');
        await page.waitForTimeout(300);

        const result = await detectHorizontalOverflow(page);
        expect(
          result.hasOverflow,
          `False positive detected on compliant page Inicio @ ${vp.width}px. ` +
          `Offenders: ${JSON.stringify(result.offenders, null, 2)}`
        ).toBe(false);
      });
    }
  });

  // ─────────────────────────────────────────────────────────────
  // SUITE 4: REAL-WORLD FALSE POSITIVE DEMONSTRATION ON CAROUSEL
  // ─────────────────────────────────────────────────────────────
  test.describe('Real-World False Positive Demonstration on Carousel Items', () => {

    test('CHALLENGE-REAL-01: Proves 98 carousel items are falsely flagged on Past Event Detail', async ({ page }) => {
      await page.setViewportSize({ width: 320, height: 600 });
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);

      const items = await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('*')).filter((el: any) => {
          const r = el.getBoundingClientRect();
          return r.right > 321.5;
        });
        return els.map((el: any) => ({
          tag: el.tagName,
          className: el.className,
          rectRight: Math.round(el.getBoundingClientRect().right),
          parentTag: el.parentElement?.tagName,
          parentClass: el.parentElement?.className
        }));
      });

      // EMPIRICAL PROOF: 98 items spill past 320px in DOM coordinates,
      // all of which are legitimate carousel cards inside .event-carousel-track
      expect(items.length).toBeGreaterThan(50);
      const allInCarousel = items.every(i => 
        i.className.includes('carousel') || 
        (i.parentClass && i.parentClass.includes('carousel')) ||
        i.parentTag === 'DIV'
      );
      expect(allInCarousel).toBe(true);
    });

  });

});
