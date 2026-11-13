import { test, expect } from '@playwright/test';
import { detectHorizontalOverflow } from '../helpers/overflow-detector';
import { navigateToTab, openPastEventDetail } from '../helpers/navigation';

const MOBILE_VIEWPORTS = [
  { name: '320px (iPhone SE 1st)', width: 320, height: 568 },
  { name: '360px (Galaxy S21)', width: 360, height: 800 },
  { name: '375px (iPhone 8/SE)', width: 375, height: 667 },
  { name: '390px (iPhone 14)', width: 390, height: 844 },
  { name: '414px (Pixel 7)', width: 414, height: 896 },
  { name: '430px (iPhone 14 Pro Max)', width: 430, height: 932 },
];

const VIEWS: Array<{ id: string; label: string; setup: (page: any) => Promise<void> }> = [
  {
    id: 'inicio',
    label: 'Inicio (Landing Page)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'inicio');
    }
  },
  {
    id: 'eventos-list',
    label: 'Eventos (Directory List)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'eventos');
    }
  },
  {
    id: 'eventos-detail-past',
    label: 'Eventos (Past Event Detail - Resumen & Memorias)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await openPastEventDetail(page);
    }
  },
  {
    id: 'miembros',
    label: 'Miembros (Directory)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'miembros');
    }
  },
  {
    id: 'opentowork',
    label: 'Open to Work (Talent Network)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'opentowork');
    }
  },
  {
    id: 'contenido',
    label: 'Contenido (Articles & Search)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'contenido');
    }
  },
  {
    id: 'unete',
    label: 'Únete (Plans & Benefits Grid)',
    setup: async (page) => {
      await page.goto('/');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'unete');
    }
  },
  {
    id: 'login',
    label: 'Login (#admin Portal)',
    setup: async (page) => {
      await page.goto('/#admin');
      await page.waitForLoadState('domcontentloaded');
      await navigateToTab(page, 'login');
    }
  }
];

test.describe('Requirement R2: Systematic 48-Permutation Responsive Overflow Matrix', () => {

  for (const vp of MOBILE_VIEWPORTS) {
    test.describe(`Viewport ${vp.name} (${vp.width}x${vp.height})`, () => {

      for (const view of VIEWS) {
        test(`Zero horizontal overflow on [${view.label}] @ ${vp.width}px`, async ({ page }) => {
          await page.setViewportSize({ width: vp.width, height: vp.height });
          await view.setup(page);

          // Allow layout settling
          await page.waitForTimeout(400);

          const result = await detectHorizontalOverflow(page);
          expect(
            result.hasOverflow,
            `Overflow detected on view [${view.id}] at ${vp.width}px. ` +
            `Document scrollWidth ${result.maxScrollWidth}px exceeds viewport ${result.windowWidth}px. ` +
            `Offending elements: ${JSON.stringify(result.offenders, null, 2)}`
          ).toBe(false);
        });
      }

    });
  }

});
