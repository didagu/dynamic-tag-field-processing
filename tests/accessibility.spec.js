const { test, expect } = require('@playwright/test')
const AxeBuilder = require('@axe-core/playwright').default

const scan = (page) => new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze()

const summarise = (violations) => violations.map((v) => `${v.id}: ${v.help} (${v.nodes.length})`)

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('empty page has no accessibility violations', async ({ page }) => {
    const { violations } = await scan(page)
    expect(summarise(violations)).toEqual([])
})

test('open results with an active option have no accessibility violations', async ({ page }) => {
    const input = page.getByRole('combobox')
    await input.fill('java')
    await input.press('ArrowDown')

    const { violations } = await scan(page)
    expect(summarise(violations)).toEqual([])
})

test('selected tags have no accessibility violations', async ({ page }) => {
    const input = page.getByRole('combobox')
    await input.fill('java')
    await input.press('ArrowDown')
    await input.press('Enter')
    await input.fill('jq')
    await input.press('ArrowDown')
    await input.press('Enter')

    const { violations } = await scan(page)
    expect(summarise(violations)).toEqual([])
})
