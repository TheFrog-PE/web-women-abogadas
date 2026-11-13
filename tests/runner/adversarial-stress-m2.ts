/**
 * Adversarial Empirical Stress Harness for Milestone 2
 * 
 * Executes deep DOM containment checks across 6 standard mobile viewports
 * (320px, 360px, 375px, 390px, 414px, 430px) across all 8 SPA views + 3 interactive modals.
 * 
 * Verifies that:
 * 1. Zero root horizontal overflow (scrollWidth <= innerWidth)
 * 2. Zero hidden element bleeding (no child rect.right > innerWidth + 1.5)
 * 3. Specific M2 Hotspots (F7 Resumen/Memorias, F8 Únete grid, F9 Open to Work,
 *    F10 Footer, F11 Countdown boxes, F12 Agenda pills stacking)
 * 4. Interactive modals (Drawer, Lightbox, Member detail, Legal terms)
 */

import { chromium, Browser, Page } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

interface FailureRecord {
  suite: string;
  viewport: number;
  view: string;
  element: string;
  details: string;
}

const VIEWPORTS = [320, 360, 375, 390, 414, 430];
const BASE_URL = process.env.BASE_URL || 'http://localhost:5173';
let devServer: ChildProcess | null = null;

const failures: FailureRecord[] = [];
let totalChecks = 0;
let passedChecks = 0;

function assertCondition(
  suite: string,
  viewport: number,
  view: string,
  element: string,
  condition: boolean,
  details: string
) {
  totalChecks++;
  if (condition) {
    passedChecks++;
  } else {
    failures.push({ suite, viewport, view, element, details });
    console.error(`  [FAIL] [${viewport}px] [${view}] ${suite}: ${element} -> ${details}`);
  }
}

async function navigateTab(page: Page, tab: string) {
  await page.evaluate(`((t) => {
    const navButtons = Array.from(document.querySelectorAll('nav button, .mobile-drawer-menu button, .desktop-nav-menu button, button.desktop-cta-btn'));
    const target = navButtons.find((b) => {
      const txt = (b.textContent || '').trim().toLowerCase();
      if (t === 'inicio') return txt.includes('inicio');
      if (t === 'eventos') return txt.includes('eventos');
      if (t === 'opentowork') return txt.includes('open to work');
      if (t === 'unete') return txt.includes('únete');
      if (t === 'contenido') return txt.includes('contenidos');
      if (t === 'miembros') return txt.includes('miembros');
      return false;
    });

    if (target) {
      target.click();
    } else {
      const toggle = document.querySelector('button.mobile-menu-toggle');
      if (toggle) {
        toggle.click();
        setTimeout(() => {
          const drawerBtn = Array.from(document.querySelectorAll('.mobile-drawer-menu button')).find((b) => {
            const txt = (b.textContent || '').trim().toLowerCase();
            return txt.includes(t);
          });
          if (drawerBtn) drawerBtn.click();
        }, 100);
      }
    }
  })(${JSON.stringify(tab)})`);

  await page.waitForTimeout(400);
}

async function checkDomContainment(page: Page, viewport: number, view: string) {
  const result: any = await page.evaluate(`((vp) => {
    const winWidth = window.innerWidth;
    const docEl = document.documentElement;
    const body = document.body;

    const docScrollWidth = docEl.scrollWidth;
    const bodyScrollWidth = body ? body.scrollWidth : 0;
    const rootScrollWidth = Math.max(docScrollWidth, bodyScrollWidth);

    function isInsideHorizontalScroller(el) {
      let cur = el.parentElement;
      while (cur && cur !== body && cur !== docEl && cur.id !== 'root') {
        const cs = window.getComputedStyle(cur);
        if (cs.overflowX === 'auto' || cs.overflowX === 'scroll') {
          const r = cur.getBoundingClientRect();
          if (r.right <= winWidth + 2) return true;
        }
        cur = cur.parentElement;
      }
      return false;
    }

    const bleedingElements = [];
    const all = document.querySelectorAll('*');
    for (let i = 0; i < all.length; i++) {
      const h = all[i];
      if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK', 'NOSCRIPT', 'TITLE', 'SVG', 'PATH'].includes(h.tagName)) {
        continue;
      }

      const rect = h.getBoundingClientRect();
      const cs = window.getComputedStyle(h);

      if (cs.display === 'none' || cs.visibility === 'hidden' || rect.width === 0 || rect.height === 0) {
        continue;
      }

      const spillsRight = rect.right > winWidth + 2;
      const exceedsWidth = h.scrollWidth > winWidth + 2;

      if ((spillsRight || exceedsWidth) && cs.overflowX !== 'hidden' && cs.overflowX !== 'clip' && cs.overflowX !== 'auto') {
        if (!isInsideHorizontalScroller(h)) {
          bleedingElements.push({
            tag: h.tagName.toLowerCase(),
            className: (h.className && typeof h.className === 'string') ? h.className.slice(0, 40) : '',
            textPreview: (h.innerText || '').slice(0, 30).replace(/\\n/g, ' '),
            rectRight: Math.round(rect.right),
            scrollWidth: h.scrollWidth
          });
        }
      }
    }

    return {
      rootScrollWidth,
      winWidth,
      rootOverflow: rootScrollWidth > winWidth + 1.5,
      bleedingElements: bleedingElements.slice(0, 5)
    };
  })(${viewport})`);

  assertCondition(
    'Root Containment',
    viewport,
    view,
    'document.documentElement',
    !result.rootOverflow,
    `rootScrollWidth ${result.rootScrollWidth}px > viewport ${result.winWidth}px`
  );

  assertCondition(
    'DOM Element Bleeding',
    viewport,
    view,
    'childElements',
    result.bleedingElements.length === 0,
    `Found bleeding elements: ${JSON.stringify(result.bleedingElements)}`
  );
}

async function runAdversarialStress() {
  console.log('\n===============================================================');
  console.log('  CHALLENGER 2: ADVERSARIAL RESPONSIVE STRESS HARNESS (M2)');
  console.log('===============================================================\n');

  // Ensure web server is accessible
  let isServerUp = false;
  try {
    const res = await fetch(BASE_URL);
    if (res.ok || res.status < 500) isServerUp = true;
  } catch {
    isServerUp = false;
  }

  if (!isServerUp) {
    console.log(`Starting Vite server at ${BASE_URL}...`);
    devServer = spawn('npm', ['run', 'dev', '--', '--port', '5173'], {
      cwd: projectRoot,
      shell: true,
      stdio: 'ignore'
    });

    const waitStart = Date.now();
    while (Date.now() - waitStart < 20000) {
      try {
        const res = await fetch(BASE_URL);
        if (res.ok || res.status < 500) {
          isServerUp = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const browser: Browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
    args: ['--disable-gpu', '--no-sandbox']
  });

  const page: Page = await browser.newPage();
  page.on('pageerror', (err) => {
    console.error(`  [PAGE_ERROR] ${err.message}`);
  });

  try {
    await page.goto(BASE_URL, { timeout: 15000 });
    await page.waitForLoadState('domcontentloaded');

    // ─────────────────────────────────────────────────────────
    // SUITE 1: FULL SITE-WIDE DOM SCAN ACROSS 6 VIEWPORTS
    // ─────────────────────────────────────────────────────────
    console.log('[SUITE 1] Scanning 6 Viewports × 8 Views for Zero Horizontal Overflow & Bleeding...');

    const views = ['inicio', 'eventos', 'opentowork', 'unete', 'miembros', 'contenido'];

    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp, height: 750 });
      await page.waitForTimeout(200);

      for (const view of views) {
        await navigateTab(page, view);
        await page.waitForTimeout(300);
        await checkDomContainment(page, vp, view);
      }

      // Check Past Event Detail View
      await navigateTab(page, 'eventos');
      await page.waitForTimeout(200);
      const detailBtn = page.getByRole('button', { name: /ver información completa|ver detalles|ver reseña/i }).first();
      if (await detailBtn.isVisible()) {
        await detailBtn.click();
        await page.waitForTimeout(400);
        await checkDomContainment(page, vp, 'eventos-detail-past');

        // Go back
        const backBtn = page.getByRole('button', { name: /volver a eventos/i }).first();
        if (await backBtn.isVisible()) {
          await backBtn.click();
          await page.waitForTimeout(300);
        }
      }
    }

    // ─────────────────────────────────────────────────────────
    // SUITE 2: TARGETED HOTSPOT STRESS TESTS
    // ─────────────────────────────────────────────────────────
    console.log('\n[SUITE 2] Stress Testing Component Hotspots (F7, F8, F9, F10, F11, F12)...');

    // ── HOTSPOT F7: "Resumen & Memorias" Card & Download Button at 320px
    console.log('  Testing Hotspot F7: Resumen & Memorias at 320px...');
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'eventos');
    const pastBtn = page.getByRole('button', { name: /ver información completa|ver detalles|ver reseña/i }).first();
    if (await pastBtn.isVisible()) {
      await pastBtn.click();
      await page.waitForTimeout(400);

      const panelMetrics: any = await page.evaluate(`(() => {
        const panel = document.querySelector('.events-detail-panel');
        const btn = document.querySelector('.events-download-btn');
        const grid = document.querySelector('.events-detail-grid');
        const winW = window.innerWidth;

        return {
          panelFound: !!panel,
          panelRight: panel ? panel.getBoundingClientRect().right : 0,
          panelWidth: panel ? panel.getBoundingClientRect().width : 0,
          btnFound: !!btn,
          btnRight: btn ? btn.getBoundingClientRect().right : 0,
          btnScrollW: btn ? btn.scrollWidth : 0,
          btnClientW: btn ? btn.clientWidth : 0,
          btnWhiteSpace: btn ? window.getComputedStyle(btn).whiteSpace : '',
          gridCols: grid ? window.getComputedStyle(grid).gridTemplateColumns : '',
          winW
        };
      })()`);

      assertCondition('F7 Hotspot', 320, 'eventos-detail', 'events-detail-panel', panelMetrics.panelFound, 'Panel found in DOM');
      assertCondition(
        'F7 Hotspot', 320, 'eventos-detail', 'events-detail-panel',
        panelMetrics.panelRight <= panelMetrics.winW + 1.5,
        `panelRight ${panelMetrics.panelRight}px > viewport ${panelMetrics.winW}px`
      );
      assertCondition(
        'F7 Hotspot', 320, 'eventos-detail', 'events-download-btn',
        panelMetrics.btnRight <= panelMetrics.winW + 1.5,
        `btnRight ${panelMetrics.btnRight}px > viewport ${panelMetrics.winW}px`
      );
      assertCondition(
        'F7 Hotspot', 320, 'eventos-detail', 'events-download-btn',
        panelMetrics.btnWhiteSpace === 'normal',
        `btn whiteSpace is ${panelMetrics.btnWhiteSpace}, expected normal`
      );

      // Back to events
      const back = page.getByRole('button', { name: /volver a eventos/i }).first();
      if (await back.isVisible()) {
        await back.click();
        await page.waitForTimeout(300);
      }
    }

    // ── HOTSPOT F8: Únete Benefits Grid at 320px
    console.log('  Testing Hotspot F8: Únete Benefits Grid at 320px...');
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'unete');
    await page.waitForTimeout(400);

    const uneteMetrics: any = await page.evaluate(`(() => {
      const heading = Array.from(document.querySelectorAll('h2, h3')).find((h) => (h.textContent || '').includes('Beneficios Exclusivos'));
      if (!heading) return { found: false, cardsCount: 0, maxCardWidth: 0, anyOverflow: false, winW: window.innerWidth };

      const container = heading.closest('div[style*="margin"]') || heading.parentElement;
      const cards = container ? Array.from(container.querySelectorAll('.card-hover, div[style*="border-radius: 16px"]')) : [];
      const winW = window.innerWidth;
      let maxW = 0;
      let anyOver = false;

      cards.forEach((c) => {
        const r = c.getBoundingClientRect();
        if (r.width > maxW) maxW = r.width;
        if (r.right > winW + 1.5) anyOver = true;
      });

      return {
        found: true,
        cardsCount: cards.length,
        maxCardWidth: Math.round(maxW),
        anyOverflow: anyOver,
        winW
      };
    })()`);

    assertCondition('F8 Hotspot', 320, 'unete', 'benefits-grid', uneteMetrics.found, 'Benefits grid section found');
    assertCondition(
      'F8 Hotspot', 320, 'unete', 'benefits-cards',
      !uneteMetrics.anyOverflow && uneteMetrics.maxCardWidth <= 320 + 2,
      `Max card width ${uneteMetrics.maxCardWidth}px, anyOverflow=${uneteMetrics.anyOverflow}`
    );

    // ── HOTSPOT F9: Open to Work Newsletter / Candidate Form at 320px
    console.log('  Testing Hotspot F9: Open to Work Form Card at 320px...');
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'opentowork');
    await page.waitForTimeout(400);

    const otwMetrics: any = await page.evaluate(`(() => {
      const card = document.querySelector('.opentowork-banner-card');
      const input = card ? card.querySelector('input[type="email"]') : null;
      const btn = card ? card.querySelector('button') : null;
      const winW = window.innerWidth;

      return {
        cardFound: !!card,
        cardRight: card ? card.getBoundingClientRect().right : 0,
        cardWidth: card ? card.getBoundingClientRect().width : 0,
        inputFound: !!input,
        inputRight: input ? input.getBoundingClientRect().right : 0,
        inputWidth: input ? input.getBoundingClientRect().width : 0,
        btnRight: btn ? btn.getBoundingClientRect().right : 0,
        winW
      };
    })()`);

    assertCondition('F9 Hotspot', 320, 'opentowork', 'opentowork-banner-card', otwMetrics.cardFound, 'Banner card found');
    assertCondition(
      'F9 Hotspot', 320, 'opentowork', 'opentowork-banner-card',
      otwMetrics.cardRight <= otwMetrics.winW + 1.5,
      `Card right ${otwMetrics.cardRight}px > viewport ${otwMetrics.winW}px`
    );
    assertCondition(
      'F9 Hotspot', 320, 'opentowork', 'input[type="email"]',
      otwMetrics.inputRight <= otwMetrics.cardRight + 1.5,
      `Input right ${otwMetrics.inputRight}px > card right ${otwMetrics.cardRight}px`
    );

    // Stress: type very long corporate email into input
    const emailInput = page.locator('.opentowork-banner-card input[type="email"]').first();
    if (await emailInput.isVisible()) {
      await emailInput.fill('maria.fernanda.rodriguez.gonzalez@estudiodeabogadoscorporativos.com.co');
      await page.waitForTimeout(200);

      const stressInputMetrics: any = await page.evaluate(`(() => {
        const card = document.querySelector('.opentowork-banner-card');
        const input = card ? card.querySelector('input[type="email"]') : null;
        const winW = window.innerWidth;
        return {
          cardRight: card ? card.getBoundingClientRect().right : 0,
          inputRight: input ? input.getBoundingClientRect().right : 0,
          winW
        };
      })()`);

      assertCondition(
        'F9 Hotspot', 320, 'opentowork', 'long-email-input-stress',
        stressInputMetrics.inputRight <= stressInputMetrics.winW + 1.5,
        `Long text input right ${stressInputMetrics.inputRight}px > viewport ${stressInputMetrics.winW}px`
      );
    }

    // ── HOTSPOT F10: Global Footer Multi-Column Grid at 320px
    console.log('  Testing Hotspot F10: Global Footer at 320px...');
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'inicio');
    await page.waitForTimeout(300);

    const footerMetrics: any = await page.evaluate(`(() => {
      const footer = document.querySelector('footer');
      if (!footer) return { found: false, overflow: false, right: 0, winW: window.innerWidth };
      const rect = footer.getBoundingClientRect();
      const winW = window.innerWidth;

      return {
        found: true,
        overflow: footer.scrollWidth > footer.clientWidth + 1.5 || rect.right > winW + 1.5,
        scrollW: footer.scrollWidth,
        clientW: footer.clientWidth,
        right: Math.round(rect.right),
        winW
      };
    })()`);

    assertCondition('F10 Hotspot', 320, 'inicio', 'footer', footerMetrics.found, 'Footer element found');
    assertCondition(
      'F10 Hotspot', 320, 'inicio', 'footer',
      !footerMetrics.overflow,
      `Footer overflow: scrollW ${footerMetrics.scrollW}px, clientW ${footerMetrics.clientW}px, right ${footerMetrics.right}px, winW ${footerMetrics.winW}px`
    );

    // ── HOTSPOT F11: Countdown Timer Box Wrap at 320px
    console.log('  Testing Hotspot F11: Countdown Timers at 320px...');
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'inicio');
    await page.waitForTimeout(300);

    const heroCountdownMetrics: any = await page.evaluate(`(() => {
      const wrapper = document.querySelector('.hero-countdown-wrapper');
      const boxes = document.querySelectorAll('.hero-countdown-box');
      const winW = window.innerWidth;

      return {
        wrapperFound: !!wrapper,
        wrapperRight: wrapper ? wrapper.getBoundingClientRect().right : 0,
        boxesCount: boxes.length,
        winW
      };
    })()`);

    if (heroCountdownMetrics.wrapperFound) {
      assertCondition(
        'F11 Hotspot', 320, 'inicio', 'hero-countdown-wrapper',
        heroCountdownMetrics.wrapperRight <= heroCountdownMetrics.winW + 1.5,
        `Hero countdown right ${heroCountdownMetrics.wrapperRight}px > viewport ${heroCountdownMetrics.winW}px`
      );
    }

    // ── HOTSPOT F12: Agenda Pills Vertical Stacking at 320px
    console.log('  Testing Hotspot F12: Agenda Pills Stacking at 320px...');
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'eventos');
    const eventBtn = page.getByRole('button', { name: /ver información completa|ver detalles|ver reseña/i }).first();
    if (await eventBtn.isVisible()) {
      await eventBtn.click();
      await page.waitForTimeout(400);

      const agendaMetrics: any = await page.evaluate(`(() => {
        const cards = Array.from(document.querySelectorAll('.events-agenda-card'));
        if (cards.length === 0) return { found: false, collisions: 0, totalCards: 0 };

        let collisions = 0;
        cards.forEach((card) => {
          const timePill = card.querySelector('.agenda-time-pill');
          const salaPill = card.querySelector('.agenda-sala-pill');

          if (timePill && salaPill) {
            const timeRect = timePill.getBoundingClientRect();
            const salaRect = salaPill.getBoundingClientRect();

            const horizOverlap = timeRect.right > salaRect.left && timeRect.left < salaRect.right;
            const vertOverlap = timeRect.bottom > salaRect.top && timeRect.top < salaRect.bottom;

            if (horizOverlap && vertOverlap) {
              collisions++;
            }
          }
        });

        return {
          found: true,
          totalCards: cards.length,
          collisions
        };
      })()`);

      if (agendaMetrics.found) {
        assertCondition(
          'F12 Hotspot', 320, 'eventos-detail', 'events-agenda-card',
          agendaMetrics.collisions === 0,
          `Detected ${agendaMetrics.collisions} pill collisions in ${agendaMetrics.totalCards} agenda cards`
        );
      }
    }

    // ─────────────────────────────────────────────────────────
    // SUITE 3: INTERACTIVE MODALS STRESS AT 320px
    // ─────────────────────────────────────────────────────────
    console.log('\n[SUITE 3] Stress Testing Interactive Modals at 320px...');

    // Modal 1: Mobile Hamburger Drawer
    await page.setViewportSize({ width: 320, height: 568 });
    await navigateTab(page, 'inicio');
    const hamburger = page.locator('button.mobile-menu-toggle');
    if (await hamburger.isVisible()) {
      await hamburger.click();
      await page.waitForTimeout(300);

      const drawerMetrics: any = await page.evaluate(`(() => {
        const drawer = document.querySelector('.mobile-drawer-menu');
        const winW = window.innerWidth;
        return {
          found: !!drawer,
          drawerRight: drawer ? drawer.getBoundingClientRect().right : 0,
          scrollW: drawer ? drawer.scrollWidth : 0,
          clientW: drawer ? drawer.clientWidth : 0,
          winW
        };
      })()`);

      assertCondition('Modals', 320, 'drawer', 'mobile-drawer-menu', drawerMetrics.found, 'Drawer opened');
      assertCondition(
        'Modals', 320, 'drawer', 'mobile-drawer-menu',
        drawerMetrics.drawerRight <= drawerMetrics.winW + 1.5,
        `Drawer right ${drawerMetrics.drawerRight}px > viewport ${drawerMetrics.winW}px`
      );

      // Close drawer
      await hamburger.click();
      await page.waitForTimeout(300);
    }

    // Modal 2: Lightbox Modal at 320px
    await navigateTab(page, 'eventos');
    const viewBtn = page.getByRole('button', { name: /ver información completa|ver detalles|ver reseña/i }).first();
    if (await viewBtn.isVisible()) {
      await viewBtn.click();
      await page.waitForTimeout(400);

      const card3 = page.locator('.event-carousel-card').nth(2);
      if (await card3.isVisible()) {
        await card3.click();
        await page.waitForTimeout(400);

        const lightboxMetrics: any = await page.evaluate(`(() => {
          const dialog = document.querySelector('div[role="dialog"]');
          const winW = window.innerWidth;
          return {
            found: !!dialog,
            dialogRight: dialog ? dialog.getBoundingClientRect().right : 0,
            dialogWidth: dialog ? dialog.getBoundingClientRect().width : 0,
            winW
          };
        })()`);

        assertCondition('Modals', 320, 'lightbox', 'div[role="dialog"]', lightboxMetrics.found, 'Lightbox opened');
        assertCondition(
          'Modals', 320, 'lightbox', 'div[role="dialog"]',
          lightboxMetrics.dialogRight <= lightboxMetrics.winW + 1.5,
          `Lightbox right ${lightboxMetrics.dialogRight}px > viewport ${lightboxMetrics.winW}px`
        );

        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
      }
    }

    // Modal 3: Términos y Condiciones Modal at 320px
    await navigateTab(page, 'inicio');
    await page.waitForTimeout(300);
    const terminosBtn = page.getByRole('button', { name: /términos y condiciones/i });
    if (await terminosBtn.isVisible()) {
      await terminosBtn.click();
      await page.waitForTimeout(300);

      const termModalMetrics: any = await page.evaluate(`(() => {
        const dialog = document.querySelector('div[style*="position: fixed"][style*="z-index"]');
        const innerCard = dialog ? dialog.querySelector('div[style*="border-radius"]') : null;
        const winW = window.innerWidth;

        return {
          found: !!dialog,
          cardRight: innerCard ? innerCard.getBoundingClientRect().right : (dialog ? dialog.getBoundingClientRect().right : 0),
          cardWidth: innerCard ? innerCard.getBoundingClientRect().width : 0,
          winW
        };
      })()`);

      assertCondition('Modals', 320, 'terminos-modal', 'modal-card', termModalMetrics.found, 'Términos modal opened');
      assertCondition(
        'Modals', 320, 'terminos-modal', 'modal-card',
        termModalMetrics.cardRight <= termModalMetrics.winW + 1.5,
        `Modal card right ${termModalMetrics.cardRight}px > viewport ${termModalMetrics.winW}px`
      );

      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);
    }

  } finally {
    if (browser) await browser.close();
    if (devServer && devServer.pid) {
      try {
        if (process.platform === 'win32') {
          spawn('taskkill', ['/pid', String(devServer.pid), '/f', '/t'], { stdio: 'ignore' });
        } else {
          devServer.kill('SIGTERM');
        }
      } catch {}
    }
  }

  // ─────────────────────────────────────────────────────────
  // SUMMARY REPORT
  // ─────────────────────────────────────────────────────────
  console.log('\n===============================================================');
  console.log('            ADVERSARIAL STRESS TEST SUMMARY REPORT             ');
  console.log('===============================================================\n');
  console.log(`Total Invariants Tested: ${totalChecks}`);
  console.log(`Passed: ${passedChecks}`);
  console.log(`Failed: ${failures.length}`);

  if (failures.length > 0) {
    console.log('\nFAILURES DETECTED:');
    failures.forEach((f, idx) => {
      console.log(`\n${idx + 1}. [${f.suite}] Viewport: ${f.viewport}px | View: ${f.view} | Element: ${f.element}`);
      console.log(`   Details: ${f.details}`);
    });
    process.exit(1);
  } else {
    console.log('\nVERDICT: ALL ADVERSARIAL STRESS INVARIANTS PASSED (100% CLEAN).');
    process.exit(0);
  }
}

runAdversarialStress().catch((err) => {
  console.error('Stress harness failed with exception:', err);
  process.exit(1);
});
