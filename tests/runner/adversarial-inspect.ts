import { chromium } from '@playwright/test';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

interface ViewDef {
  id: string;
  name: string;
  navigate: (page: any) => Promise<void>;
}

const VIEWPORTS = [320, 340, 360, 375, 390, 414, 430];

const VIEWS: ViewDef[] = [
  {
    id: 'inicio',
    name: 'Inicio',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
    }
  },
  {
    id: 'eventos-list',
    name: 'Eventos (List)',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
      const toggle = page.locator('button.mobile-menu-toggle');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
        await page.locator('.mobile-drawer-menu button', { hasText: /eventos/i }).first().click();
      } else {
        await page.locator('.nav-link', { hasText: /eventos/i }).first().click();
      }
      await page.waitForTimeout(500);
    }
  },
  {
    id: 'eventos-detail-past',
    name: 'Eventos (Past Detail - Resumen & Memorias)',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
      const toggle = page.locator('button.mobile-menu-toggle');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
        await page.locator('.mobile-drawer-menu button', { hasText: /eventos/i }).first().click();
      } else {
        await page.locator('.nav-link', { hasText: /eventos/i }).first().click();
      }
      await page.waitForTimeout(500);
      const detailBtn = page.getByRole('button', { name: /ver información completa|ver detalles|ver reseña/i }).first();
      if (await detailBtn.isVisible()) {
        await detailBtn.click();
      } else {
        const card = page.locator('.card-hover', { hasText: /desayuno wic colombia/i }).first();
        if (await card.isVisible()) await card.click();
      }
      await page.waitForTimeout(600);
    }
  },
  {
    id: 'miembros',
    name: 'Miembros',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
      const toggle = page.locator('button.mobile-menu-toggle');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
        await page.locator('.mobile-drawer-menu button', { hasText: /miembros/i }).first().click();
      } else {
        await page.locator('.nav-link', { hasText: /miembros/i }).first().click();
      }
      await page.waitForTimeout(500);
    }
  },
  {
    id: 'opentowork',
    name: 'Open to Work',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
      const toggle = page.locator('button.mobile-menu-toggle');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
        await page.locator('.mobile-drawer-menu button', { hasText: /open to work/i }).first().click();
      } else {
        await page.locator('.nav-link', { hasText: /open to work/i }).first().click();
      }
      await page.waitForTimeout(500);
    }
  },
  {
    id: 'contenido',
    name: 'Contenidos',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
      const toggle = page.locator('button.mobile-menu-toggle');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
        await page.locator('.mobile-drawer-menu button', { hasText: /contenidos/i }).first().click();
      } else {
        await page.locator('.nav-link', { hasText: /contenidos/i }).first().click();
      }
      await page.waitForTimeout(500);
    }
  },
  {
    id: 'unete',
    name: 'Únete',
    navigate: async (page) => {
      await page.goto('http://localhost:5173');
      await page.waitForLoadState('domcontentloaded');
      const toggle = page.locator('button.mobile-menu-toggle');
      if (await toggle.isVisible()) {
        await toggle.click();
        await page.waitForTimeout(300);
        await page.locator('.mobile-drawer-menu button', { hasText: /únete a wic/i }).first().click();
      } else {
        await page.locator('button', { hasText: /únete a wic/i }).first().click();
      }
      await page.waitForTimeout(500);
    }
  },
  {
    id: 'login',
    name: 'Login (#admin)',
    navigate: async (page) => {
      await page.goto('http://localhost:5173/#admin');
      await page.waitForLoadState('domcontentloaded');
      await page.waitForTimeout(500);
    }
  }
];

async function run() {
  const baseURL = 'http://localhost:5173';
  let devServer: ChildProcess | null = null;

  let isServerUp = false;
  try {
    const res = await fetch(baseURL);
    if (res.ok || res.status < 500) isServerUp = true;
  } catch {
    isServerUp = false;
  }

  if (!isServerUp) {
    console.log(`Starting Vite server at ${baseURL}...`);
    devServer = spawn('npm', ['run', 'dev', '--', '--port', '5173'], {
      cwd: projectRoot,
      shell: true,
      stdio: 'ignore'
    });

    const waitStart = Date.now();
    while (Date.now() - waitStart < 20000) {
      try {
        const res = await fetch(baseURL);
        if (res.ok || res.status < 500) {
          isServerUp = true;
          break;
        }
      } catch {
        // wait
      }
      await new Promise((r) => setTimeout(r, 400));
    }
  }

  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const page = await browser.newPage();

  console.log('\n===============================================================');
  console.log('       ADVERSARIAL STRESS INSPECTION MATRIX (320px - 430px)');
  console.log('===============================================================\n');

  let totalTests = 0;
  let failedTests = 0;

  for (const vp of VIEWPORTS) {
    console.log(`\n--- VIEWPORT: ${vp}px ---`);
    await page.setViewportSize({ width: vp, height: 700 });

    for (const view of VIEWS) {
      totalTests++;
      await view.navigate(page);
      await page.waitForTimeout(300);

      const audit = await page.evaluate((width) => {
        const docScrollWidth = document.documentElement.scrollWidth;
        const bodyScrollWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const pageHasScrollbar = docScrollWidth > winWidth + 1.5 || bodyScrollWidth > winWidth + 1.5;

        const offenders: any[] = [];
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          const htmlEl = el as HTMLElement;
          if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK', 'NOSCRIPT', 'TITLE'].includes(htmlEl.tagName)) continue;
          const rect = htmlEl.getBoundingClientRect();
          const style = window.getComputedStyle(htmlEl);
          if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) continue;

          // Check if element spills past viewport boundary
          const spillsRight = rect.right > winWidth + 1.5;
          const overflowsWidth = htmlEl.scrollWidth > winWidth + 1.5;

          if (spillsRight || overflowsWidth) {
            // If it's a dedicated scroller itself (e.g. overflow-x: auto with width <= winWidth), that's fine
            if ((style.overflowX === 'auto' || style.overflowX === 'scroll') && rect.right <= winWidth + 1.5) {
              continue;
            }

            // Check if contained by an ancestor horizontal scroller or clip container
            let isContained = false;
            let p = htmlEl.parentElement;
            while (p && p !== document.body && p !== document.documentElement && p.id !== 'root') {
              const ps = window.getComputedStyle(p);
              if (ps.overflowX === 'auto' || ps.overflowX === 'scroll' || ps.overflowX === 'hidden' || ps.overflowX === 'clip') {
                const pr = p.getBoundingClientRect();
                if (pr.right <= winWidth + 1.5) {
                  isContained = true;
                  break;
                }
              }
              p = p.parentElement;
            }

            if (isContained) {
              continue;
            }

            offenders.push({
              tag: htmlEl.tagName.toLowerCase(),
              className: (htmlEl.className && typeof htmlEl.className === 'string') ? htmlEl.className.substring(0, 40) : '',
              id: htmlEl.id || '',
              rectRight: Math.round(rect.right),
              rectLeft: Math.round(rect.left),
              rectWidth: Math.round(rect.width),
              scrollWidth: htmlEl.scrollWidth,
              clientWidth: htmlEl.clientWidth,
              text: (htmlEl.innerText || '').substring(0, 35).replace(/\n/g, ' ')
            });
          }
        }

        return {
          winWidth,
          docScrollWidth,
          bodyScrollWidth,
          pageHasScrollbar,
          offendersCount: offenders.length,
          offenders: offenders.slice(0, 5)
        };
      }, vp);

      if (audit.pageHasScrollbar || audit.offendersCount > 0) {
        failedTests++;
        console.log(`  ❌ [FAIL] ${view.name.padEnd(25)} @ ${vp}px: docScroll=${audit.docScrollWidth}px, offenders=${audit.offendersCount}`);
        for (const off of audit.offenders) {
          console.log(`     ↳ <${off.tag} class="${off.className}"> rectRight=${off.rectRight}px, scrollW=${off.scrollWidth}px, text="${off.text}"`);
        }
      } else {
        console.log(`  ✓ [PASS] ${view.name.padEnd(25)} @ ${vp}px (clean, zero overflow)`);
      }
    }
  }

  await browser.close();
  if (devServer && devServer.pid) {
    try {
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', String(devServer.pid), '/f', '/t'], { stdio: 'ignore' });
      } else {
        devServer.kill('SIGTERM');
      }
    } catch {}
  }

  console.log('\n---------------------------------------------------------------');
  console.log(`TOTAL: ${totalTests} | PASSED: ${totalTests - failedTests} | FAILED: ${failedTests}`);
  console.log('---------------------------------------------------------------\n');

  if (failedTests > 0) process.exit(1);
  else process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
