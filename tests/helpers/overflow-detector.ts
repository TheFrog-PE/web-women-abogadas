import { Page } from '@playwright/test';

export interface OverflowResult {
  hasOverflow: boolean;
  maxScrollWidth: number;
  windowWidth: number;
  offenders: Array<{
    tag: string;
    id: string;
    className: string;
    scrollWidth: number;
    clientWidth: number;
    rectRight: number;
    windowWidth: number;
  }>;
}

/**
 * Evaluates whether the current page document or any visible child elements
 * exceed the window viewport width, violating the horizontal overflow invariant.
 */
export async function detectHorizontalOverflow(page: Page): Promise<OverflowResult> {
  return await page.evaluate(() => {
    const windowWidth = window.innerWidth;
    const docEl = document.documentElement;
    const body = document.body;

    const docScrollWidth = docEl.scrollWidth;
    const bodyScrollWidth = body ? body.scrollWidth : 0;
    const maxScrollWidth = Math.max(docScrollWidth, bodyScrollWidth);

    const offenders: Array<{
      tag: string;
      id: string;
      className: string;
      scrollWidth: number;
      clientWidth: number;
      rectRight: number;
      windowWidth: number;
    }> = [];

    const elements = document.querySelectorAll('*');
    for (const el of elements) {
      const htmlEl = el as HTMLElement;
      // Skip script, style, meta, head tags
      if (['SCRIPT', 'STYLE', 'META', 'HEAD', 'LINK', 'NOSCRIPT', 'TITLE'].includes(htmlEl.tagName)) {
        continue;
      }

      const rect = htmlEl.getBoundingClientRect();
      const style = window.getComputedStyle(htmlEl);

      // Only inspect visible elements
      if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) {
        continue;
      }

      // Check if element spills beyond right viewport boundary without internal clipping
      const spillsRight = rect.right > windowWidth + 1.5;
      const exceedsWidth = htmlEl.scrollWidth > windowWidth + 1.5;

      if ((spillsRight || exceedsWidth) && style.overflowX !== 'hidden' && style.overflowX !== 'clip' && style.overflowX !== 'auto') {
        offenders.push({
          tag: htmlEl.tagName.toLowerCase(),
          id: htmlEl.id || '',
          className: (htmlEl.className && typeof htmlEl.className === 'string') ? htmlEl.className.substring(0, 50) : '',
          scrollWidth: htmlEl.scrollWidth,
          clientWidth: htmlEl.clientWidth,
          rectRight: Math.round(rect.right),
          windowWidth
        });
      }
    }

    const hasOverflow = maxScrollWidth > windowWidth + 1.5 || offenders.length > 0;

    return {
      hasOverflow,
      maxScrollWidth,
      windowWidth,
      offenders: offenders.slice(0, 10)
    };
  });
}
