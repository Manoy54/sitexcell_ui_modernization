import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '.',
    testMatch: '*.spec.js',
    timeout: 30_000,
    expect: { timeout: 7_000 },
    workers: 1,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:4179',
        channel: 'msedge',
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command: 'php -S 127.0.0.1:4179 -t . co-siter_dashboard/tests/cositer-demo/router.php',
        cwd: process.cwd(),
        url: 'http://127.0.0.1:4179/sitexcell-cositer-login-prototype/',
        reuseExistingServer: true,
        stderr: 'ignore',
        timeout: 20_000,
    },
});
