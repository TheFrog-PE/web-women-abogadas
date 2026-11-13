import { Page, expect } from '@playwright/test';

export type AppTab = 'inicio' | 'eventos' | 'miembros' | 'opentowork' | 'unete' | 'contenido' | 'login' | '404';

const TAB_LABELS: Record<string, string | RegExp> = {
  inicio: /inicio/i,
  eventos: /eventos/i,
  miembros: /miembros/i,
  opentowork: /open to work/i,
  contenido: /contenidos/i,
  unete: /únete a wic/i,
};

/**
 * Navigates to a specific top-level tab in the WIC Colombia SPA.
 * Automatically adapts between desktop navigation buttons and the mobile drawer toggle.
 */
export async function navigateToTab(page: Page, tab: AppTab) {
  // Check if we need special handling for login or 404
  if (tab === 'login') {
    await page.evaluate(() => {
      window.location.hash = '#admin';
    });
    await page.waitForTimeout(400);
    return;
  }

  if (tab === 'unete') {
    // Check if mobile hamburger is visible
    const mobileToggle = page.locator('button.mobile-menu-toggle');
    if (await mobileToggle.isVisible()) {
      await mobileToggle.click();
      await page.waitForTimeout(300);
      const drawer = page.locator('.mobile-drawer-menu');
      if (await drawer.isVisible()) {
        const cta = drawer.getByRole('button', { name: /únete a wic/i });
        if (await cta.isVisible()) {
          await cta.click();
        } else {
          await page.evaluate(() => { window.location.hash = '#unete'; });
        }
      } else {
        await page.evaluate(() => { window.location.hash = '#unete'; });
      }
    } else {
      const desktopCta = page.locator('button.desktop-cta-btn');
      if (await desktopCta.isVisible()) {
        await desktopCta.click();
      } else {
        await page.evaluate(() => { window.location.hash = '#unete'; });
      }
    }
    await page.waitForTimeout(400);
    return;
  }

  const label = TAB_LABELS[tab];
  if (!label) return;

  const mobileToggle = page.locator('button.mobile-menu-toggle');
  if (await mobileToggle.isVisible()) {
    await mobileToggle.click();
    await page.waitForTimeout(300);
    const drawerLink = page.locator('.mobile-drawer-menu').getByRole('button', { name: label });
    if (await drawerLink.isVisible()) {
      await drawerLink.click();
    }
  } else {
    const desktopLink = page.locator('.desktop-nav-menu').getByRole('button', { name: label });
    if (await desktopLink.isVisible()) {
      await desktopLink.click();
    }
  }

  await page.waitForTimeout(400);
}

/**
 * Navigates to the Eventos section and enters the detail view of an event (e.g. past breakfast event).
 */
export async function openPastEventDetail(page: Page) {
  await navigateToTab(page, 'eventos');
  await page.waitForTimeout(300);

  // If already viewing detail, verify
  const backBtn = page.getByRole('button', { name: /volver a eventos/i });
  if (await backBtn.isVisible()) {
    return;
  }

  // Look for event card button
  const detailBtn = page.getByRole('button', { name: /ver información completa|ver detalles del evento|ver reseña completa/i }).first();
  if (await detailBtn.isVisible()) {
    await detailBtn.click();
  } else {
    const card = page.locator('.card-hover:has-text("Desayuno WIC Colombia")').first();
    if (await card.isVisible()) {
      await card.click();
    }
  }

  await page.waitForTimeout(500);
  await expect(page.locator('.events-detail-grid')).toBeVisible();
}
