import { test, expect } from '@playwright/test';

test.describe('Homepage - Acme Layout', () => {
  test('Desktop: 3-column layout with sidebars', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const leftSidebar = page.locator('aside[data-section="Categorías de Tendencia"]');
    await expect(leftSidebar).toBeVisible();
    await expect(leftSidebar.locator('text=Taladros')).toBeVisible();

    const rightSidebar = page.locator('aside[data-section="Productos de Moda"]');
    await expect(rightSidebar).toBeVisible();
    await expect(rightSidebar.locator('text=Tool Crib')).toBeVisible();

    const desktopMain = page.locator('.hidden.lg\\:block');
    await expect(desktopMain.locator('text=4 d').first()).toBeVisible();
    await expect(desktopMain.locator('text=4JULY')).toBeVisible();
  });

  test('Desktop: sidebars have clickable category and product links', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const catLinks = page.locator('aside[data-section="Categorías de Tendencia"] a');
    expect(await catLinks.count()).toBeGreaterThanOrEqual(8);
    const firstHref = await catLinks.first().getAttribute('href');
    expect(firstHref).toContain('/categoria/');

    const prodLinks = page.locator('aside[data-section="Productos de Moda"] a[href*="/producto/"]');
    expect(await prodLinks.count()).toBeGreaterThanOrEqual(4);
  });

  test('Mobile: sidebars hidden, mobile sections visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const leftSidebar = page.locator('aside[data-section="Categorías de Tendencia"]');
    await expect(leftSidebar).not.toBeVisible();

    const rightSidebar = page.locator('aside[data-section="Productos de Moda"]');
    await expect(rightSidebar).not.toBeVisible();

    await expect(page.locator('section[data-section="Categorías de Tendencia Móvil"]')).toBeVisible();
    await expect(page.locator('section[data-section="Las Mejores Ofertas de Hoy"]')).toBeVisible();
    await expect(page.locator('section[data-section="Productos de Moda Móvil"]')).toBeVisible();
    await expect(page.locator('section[data-section="Categorías Principales"]')).toBeVisible();
    await expect(page.locator('section[data-section="Comprar por Marca"]')).toBeVisible();
    await expect(page.locator('section[data-section="Explorar Productos"]')).toBeVisible();
  });

  test('Mobile: horizontal scrolling category menu is present', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mobileContainer = page.locator('.lg\\:hidden');
    const menu = mobileContainer.locator('.overflow-x-auto').first();
    await expect(menu).toBeVisible();

    const menuLinks = menu.locator('a');
    expect(await menuLinks.count()).toBeGreaterThanOrEqual(6);

    const scrollWidth = await menu.evaluate(el => el.scrollWidth);
    const clientWidth = await menu.evaluate(el => el.clientWidth);
    expect(scrollWidth).toBeGreaterThan(clientWidth);

    await expect(menu.locator('text=Todas las Herramientas')).toBeVisible();
  });

  test('Mobile: hero above 2-col banners, Tool Crib bar below', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const mobileContainer = page.locator('.lg\\:hidden');

    // Hero text visible
    await expect(mobileContainer.locator('text=4 d').first()).toBeVisible();

    // 2-col banners: EGO and LIQUIDACIÓN
    await expect(mobileContainer.locator('text=EGO').first()).toBeVisible();
    await expect(mobileContainer.locator('text=LIQUIDACI').first()).toBeVisible();

    // Tool Crib mobile bar
    await expect(page.locator('[data-section="Tool Crib Móvil"]')).toBeVisible();
    await expect(page.locator('[data-section="Tool Crib Móvil"]').locator('text=Tool Crib')).toBeVisible();

    // Trending categories with view counts
    const trendSection = page.locator('section[data-section="Categorías de Tendencia Móvil"]');
    await expect(trendSection).toBeVisible();
    // Scroll into view and check content
    await trendSection.scrollIntoViewIfNeeded();
    await expect(trendSection.locator('text=18.8K')).toBeVisible();
    await expect(trendSection.locator('text=17.3K')).toBeVisible();
  });

  test('Mobile: trending categories 2-col grid', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const section = page.locator('section[data-section="Categorías de Tendencia Móvil"]');
    await expect(section).toBeVisible();

    const grid = section.locator('.grid');
    await expect(grid).toBeVisible();
    const cols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    expect(cols.split(' ').length).toBe(2);
  });

  test('Mobile: horizontal scroll carousels are present', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const dealsScroll = page.locator('section[data-section="Las Mejores Ofertas de Hoy"] .overflow-x-auto');
    await expect(dealsScroll).toBeVisible();
    const dealsScrollWidth = await dealsScroll.evaluate(el => el.scrollWidth);
    const dealsClientWidth = await dealsScroll.evaluate(el => el.clientWidth);
    expect(dealsScrollWidth).toBeGreaterThan(dealsClientWidth);

    const prodsScroll = page.locator('section[data-section="Productos de Moda Móvil"] .overflow-x-auto');
    await expect(prodsScroll).toBeVisible();
  });

  test('Mobile: categories grid 4-per-row', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const grid = page.locator('section[data-section="Categorías Principales"] .grid');
    await expect(grid).toBeVisible();
    const cols = await grid.evaluate(el => getComputedStyle(el).gridTemplateColumns);
    expect(cols.split(' ').length).toBe(4);
  });

  test('Mobile: brand buttons grid', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const brandSection = page.locator('section[data-section="Comprar por Marca"]');
    await expect(brandSection).toBeVisible();
    await expect(brandSection.locator('text=Milwaukee')).toBeVisible();
    await expect(brandSection.locator('text=DeWalt')).toBeVisible();
    await expect(brandSection.locator('text=Bosch')).toBeVisible();
  });

  test('Mobile: explore products with tabs', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const explore = page.locator('section[data-section="Explorar Productos"]');
    await expect(explore).toBeVisible();
    await expect(explore.locator('text=Explorar Productos')).toBeVisible();
    await expect(explore.locator('text=Productos Destacados')).toBeVisible();
  });

  test('Mobile: all deal tiles are clickable links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const dealLinks = page.locator('section[data-section="Las Mejores Ofertas de Hoy"] a[href]');
    const count = await dealLinks.count();
    expect(count).toBeGreaterThanOrEqual(4);

    for (let i = 0; i < Math.min(count, 4); i++) {
      const href = await dealLinks.nth(i).getAttribute('href');
      expect(href).toBeTruthy();
    }
  });

  test('Mobile: product cards are clickable with Agregar button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const prodCards = page.locator('section[data-section="Productos de Moda Móvil"] a[href*="/producto/"]');
    expect(await prodCards.count()).toBeGreaterThanOrEqual(4);

    await expect(page.locator('section[data-section="Productos de Moda Móvil"] button:has-text("Agregar")').first()).toBeVisible();
  });
});