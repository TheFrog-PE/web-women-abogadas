import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('Build Verification & Production Bundle Smoke Test', () => {

  const projectRoot = path.resolve(__dirname, '../..');

  test('F14-01: "npm run build" executes cleanly with exit code 0', () => {
    let output = '';
    let exitCode = 0;
    try {
      output = execSync('npm run build', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 60000,
      });
    } catch (err: any) {
      exitCode = err.status ?? 1;
      output = (err.stdout ?? '') + '\n' + (err.stderr ?? '');
    }

    expect(exitCode, `Build failed with output:\n${output}`).toBe(0);
  });

  test('F14-02: dist/ directory contains valid index.html and assets', () => {
    const distPath = path.join(projectRoot, 'dist');
    expect(fs.existsSync(distPath), 'dist/ directory must exist after build').toBe(true);

    const indexPath = path.join(distPath, 'index.html');
    expect(fs.existsSync(indexPath), 'dist/index.html must exist').toBe(true);
    const indexStats = fs.statSync(indexPath);
    expect(indexStats.size, 'dist/index.html must be > 500 bytes').toBeGreaterThan(500);

    const assetsPath = path.join(distPath, 'assets');
    expect(fs.existsSync(assetsPath), 'dist/assets directory must exist').toBe(true);

    const assetFiles = fs.readdirSync(assetsPath);
    const hasJs = assetFiles.some((f) => f.endsWith('.js'));
    const hasCss = assetFiles.some((f) => f.endsWith('.css'));

    expect(hasJs, 'dist/assets must contain at least one .js bundle').toBe(true);
    expect(hasCss, 'dist/assets must contain at least one .css bundle').toBe(true);
  });

  test('F14-03: static linter oxlint completes without syntax errors', () => {
    let output = '';
    let exitCode = 0;
    try {
      output = execSync('npx oxlint', {
        cwd: projectRoot,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe'],
        timeout: 30000,
      });
    } catch (err: any) {
      exitCode = err.status ?? 1;
      output = (err.stdout ?? '') + '\n' + (err.stderr ?? '');
    }

    // oxlint exit code 0 indicates no critical syntax/type failure
    expect(exitCode, `oxlint failed with output:\n${output}`).toBe(0);
  });

});
