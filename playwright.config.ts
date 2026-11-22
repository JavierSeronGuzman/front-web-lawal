import { defineConfig } from '@playwright/test';

// PRD 13: recorrido de la web nueva (dependencia de desarrollo; no va a producción).
// Requiere la web corriendo (npx ng serve) y el backend de dev. BASE_URL cambia el destino.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  reporter: 'list',
  use: {
    baseURL: process.env['BASE_URL'] || 'http://localhost:4200',
    channel: 'chrome',
  },
});
