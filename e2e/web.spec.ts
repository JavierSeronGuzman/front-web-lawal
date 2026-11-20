import { expect, Page, test } from '@playwright/test';

// PRD 13: Inicio, Catálogo con filtros, Ficha y Cotización a 375 px y 1440 px,
// sin scroll horizontal, con capturas en e2e/capturas/.
const ANCHOS = [375, 1440];

async function sinScrollHorizontal(page: Page) {
  const [sw, w] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
  expect(sw, 'scroll horizontal').toBeLessThanOrEqual(w);
}

async function captura(page: Page, nombre: string) {
  await page.screenshot({ path: `e2e/capturas/${nombre}.png`, fullPage: true });
}

for (const ancho of ANCHOS) {
  test.describe(`${ancho}px`, () => {
    test.use({ viewport: { width: ancho, height: ancho < 600 ? 812 : 900 } });

    test('recorrido: inicio, catálogo, ficha y cotización', async ({ page }) => {
      await page.addInitScript(() => {
        localStorage.removeItem('lawal-cotizacion-v1');
        (window as unknown as { __abierto: string[] }).__abierto = [];
        window.open = ((u: string) => {
          (window as unknown as { __abierto: string[] }).__abierto.push(String(u));
          return null;
        }) as typeof window.open;
      });

      await page.goto('/');
      await expect(page.getByRole('heading', { name: /Todo para tu obra/ })).toBeVisible();
      await page.waitForLoadState('networkidle');
      await sinScrollHorizontal(page);
      await captura(page, `inicio-${ancho}`);

      await page.goto('/catalog');
      await page.waitForLoadState('networkidle');
      const total = page.locator('app-tarjeta-familia');
      await expect(total.first()).toBeVisible();
      if (ancho < 600) {
        await page.getByRole('button', { name: /Filtrar/ }).click();
        const hoja = page.getByRole('dialog', { name: 'Filtrar' });
        await expect(hoja).toBeVisible();
        await captura(page, `catalogo-filtros-${ancho}`);
        await hoja.getByRole('switch').check();
        await expect(page).toHaveURL(/ofertas=1/);
        await hoja.getByRole('button', { name: /^Ver \d+ productos$/ }).click();
      } else {
        await page.locator('aside.filtros').getByRole('switch').check();
        await expect(page).toHaveURL(/ofertas=1/);
      }
      await page.goto('/catalog');
      await page.waitForLoadState('networkidle');
      await sinScrollHorizontal(page);
      await captura(page, `catalogo-${ancho}`);

      await total.first().locator('a.nombre').click();
      await expect(page).toHaveURL(/\/producto\/\d+-[a-z0-9-]+$/);
      await expect(page.getByText('Disponible · te confirmamos el stock al cotizar')).toBeVisible();
      await expect(page.getByText(/stock: \d/i)).toHaveCount(0);
      await sinScrollHorizontal(page);
      await captura(page, `ficha-${ancho}`);
      if (ancho < 600) await page.locator('.barra-comprar button.btn-azul').click();
      else await page.getByRole('button', { name: 'Agregar a la cotización' }).click();
      await expect(page.getByRole('status')).toContainText('Agregado a tu cotización');

      await page.getByRole('button', { name: 'Mi cotización' }).click();
      const panel = page.getByRole('dialog', { name: 'Tu cotización' });
      const enviar = panel.getByRole('button', { name: /Elige despacho o retiro|Enviar cotización/ });
      await expect(enviar).toBeDisabled();
      await panel.getByRole('radio', { name: 'Despacho a domicilio' }).click();
      await expect(panel.locator('[data-test="preview"]')).toContainText('Hola Lawal, quiero cotizar:');
      await sinScrollHorizontal(page);
      await captura(page, `cotizacion-${ancho}`);
      await panel.getByRole('button', { name: 'Enviar cotización por WhatsApp' }).click();
      const abiertos = await page.evaluate(() => (window as unknown as { __abierto: string[] }).__abierto);
      expect(abiertos.at(-1)).toMatch(/^https:\/\/wa\.me\/56967453739\?text=Hola%20Lawal/);
    });
  });
}

test('la ruta antigua /product redirige a /catalog', async ({ page }) => {
  await page.goto('/product');
  await expect(page).toHaveURL(/\/catalog$/);
});
