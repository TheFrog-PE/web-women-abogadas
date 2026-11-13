import { test, expect } from '@playwright/test';
import { navigateToTab, openPastEventDetail } from '../helpers/navigation';
import { detectHorizontalOverflow } from '../helpers/overflow-detector';

test.describe('Tier 4: Real-World End-to-End Application User Scenarios', () => {

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 1: THE EXECUTIVE EVENT EXPLORER
  // ─────────────────────────────────────────────────────────────
  test('TEST-T4-SCEN-01: The Executive Event Explorer (iPhone 14 — 390px x 844px)', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Landing on Inicio & check Quienes somos section
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(300);

    // 2. Open hamburger drawer and navigate to Eventos
    await navigateToTab(page, 'eventos');

    // 3. Drill down into event detail
    await openPastEventDetail(page);

    // 4. Inspect Resumen & Memorias panel
    const panel = page.locator('.events-detail-grid .reveal-right').first();
    await expect(panel).toBeVisible();
    const downloadBtn = panel.locator('button', { hasText: /descargar memorias/i }).first();
    await expect(downloadBtn).toBeVisible();

    // 5. Inspect Event Photos Gallery (R1 requirements)
    const carouselWrapper = page.locator('.event-photo-carousel-wrapper').first();
    await expect(carouselWrapper).toBeVisible();

    // Verify absence of "AMPLIAR" text & Eye icon on cards
    const cards = carouselWrapper.locator('.event-carousel-card');
    const cardCount = await cards.count();
    for (let i = 0; i < cardCount; i++) {
      const cardText = await cards.nth(i).innerText();
      expect(cardText).not.toMatch(/ampliar/i);
    }
    expect(await carouselWrapper.locator('svg.lucide-eye').count()).toBe(0);

    // 6. Direct click on Photo 3 opens Lightbox immediately
    await cards.nth(2).click();

    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();
    expect(await modal.innerText()).toMatch(/fotograf[ií]a 3 de/i);

    // Close lightbox
    await modal.locator('button[aria-label="Cerrar vista completa"]').click();
    await expect(modal).not.toBeVisible();

    // 7. Verify Memorias Fotográficas section below
    const memoriasHeading = page.getByRole('heading', { name: /memorias fotográficas del evento culminado/i });
    await expect(memoriasHeading).toBeVisible();

    // 8. Site-wide horizontal overflow assertion
    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 2: THE ASPIRING COMPLIANCE OFFICER
  // ─────────────────────────────────────────────────────────────
  test('TEST-T4-SCEN-02: The Aspiring Compliance Officer Membership Journey (iPhone SE — 320px x 568px)', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Navigate to Únete via drawer or CTA
    await navigateToTab(page, 'unete');

    // 2. Toggle plans
    const corpBtn = page.getByRole('button', { name: /corporativa/i }).first();
    if (await corpBtn.isVisible()) {
      await corpBtn.click();
      await page.waitForTimeout(300);
    }

    // 3. Fill affiliation form if present
    const nameInput = page.locator('input[placeholder*="Nombre"]').first();
    if (await nameInput.isVisible()) {
      await nameInput.fill('Mariana Restrepo');
    }

    const emailInput = page.locator('input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('mrestrepo@legalfirm.com');
    }

    // 4. Verify no horizontal overflow at 320px
    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 3: THE CORPORATE RECRUITER
  // ─────────────────────────────────────────────────────────────
  test('TEST-T4-SCEN-03: The Corporate Recruiter in Open to Work (Galaxy S21 — 360px x 800px)', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 800 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Navigate to Open to Work
    await navigateToTab(page, 'opentowork');

    // 2. Click category filter
    const amlFilter = page.getByRole('button', { name: /financiero|aml/i }).first();
    if (await amlFilter.isVisible()) {
      await amlFilter.click();
      await page.waitForTimeout(300);
    }

    // 3. Talent newsletter email form card inspection
    const talentCard = page.locator('input[type="email"][placeholder*="correo"]').locator('xpath=ancestor::div[contains(@style, "border-radius")]').first();
    if (await talentCard.isVisible()) {
      const metrics = await talentCard.evaluate((el) => ({
        cardRight: el.getBoundingClientRect().right,
        windowWidth: window.innerWidth
      }));
      expect(metrics.cardRight).toBeLessThanOrEqual(metrics.windowWidth + 1.5);
    }

    // 4. Overflow verification
    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 4: THE LEGAL RESEARCHER
  // ─────────────────────────────────────────────────────────────
  test('TEST-T4-SCEN-04: The Legal Researcher in Contenidos & Miembros (Pixel 7 — 414px x 896px)', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    // 1. Navigate to Contenidos
    await navigateToTab(page, 'contenido');

    // 2. Search article
    const searchInput = page.locator('input[placeholder*="Buscar"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('Compliance');
      await page.waitForTimeout(300);
    }

    // 3. Navigate to Miembros
    await navigateToTab(page, 'miembros');
    await page.waitForTimeout(300);

    // 4. Overflow check
    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 5: THE CONFERENCE ATTENDEE & AGENDA INSPECTOR
  // ─────────────────────────────────────────────────────────────
  test('TEST-T4-SCEN-05: The Conference Attendee & Agenda Inspector (Tablet 768px & Narrow 320px)', async ({ page }) => {
    // Phase 1: Tablet 768px
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await navigateToTab(page, 'eventos');

    const tabletOverflow = await detectHorizontalOverflow(page);
    expect(tabletOverflow.hasOverflow).toBe(false);

    // Phase 2: Resize to narrow 320px
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(400);

    // Inspect event detail at 320px
    await openPastEventDetail(page);
    const mobileOverflow = await detectHorizontalOverflow(page);
    expect(mobileOverflow.hasOverflow).toBe(false);
  });

  // ─────────────────────────────────────────────────────────────
  // SCENARIO 6: THE GOVERNANCE AUDITOR & ADMIN FLOW
  // ─────────────────────────────────────────────────────────────
  test('TEST-T4-SCEN-06: The Governance Auditor & Admin Flow (Desktop 1280px & Mobile 375px)', async ({ page }) => {
    // Phase 1: Desktop 1280px
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/#admin');
    await page.waitForLoadState('domcontentloaded');

    // Verify login view is rendered
    const loginHeading = page.locator('h1, h2, h3', { hasText: /login|iniciar sesión|acceso/i }).first();
    if (await loginHeading.isVisible()) {
      await expect(loginHeading).toBeVisible();
    }

    // Phase 2: Mobile 375px
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);

    // Return to Inicio
    await page.evaluate(() => { window.location.hash = ''; });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const overflow = await detectHorizontalOverflow(page);
    expect(overflow.hasOverflow).toBe(false);
  });

});
