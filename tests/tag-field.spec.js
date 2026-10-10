const { test, expect } = require('@playwright/test')

const resultTitles = (page) => page.locator('.tag-result:visible .tag-title')
const chips = (page) => page.locator('#tags .tag')

async function selectTag(page, query, title) {
    await page.getByRole('combobox').fill(query)
    await page.locator('.tag-result:visible', { has: page.locator('.tag-title', { hasText: new RegExp(`^${title}$`) }) }).click()
}

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test.describe('search', () => {
    test('shows no results until something is typed', async ({ page }) => {
        await expect(page.locator('.tag-result:visible')).toHaveCount(0)
        await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
    })

    test('matches titles and alternative names, ignoring case', async ({ page }) => {
        await page.getByRole('combobox').fill('JAVA')

        await expect(resultTitles(page)).toHaveText(['java', 'javascript', 'arrays', 'java-ee'])
        await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'true')
    })

    test('shows nothing when no tag matches', async ({ page }) => {
        await page.getByRole('combobox').fill('python')

        await expect(page.locator('.tag-result:visible')).toHaveCount(0)
        await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false')
    })

    test('underlines the matched part of titles and alternative names', async ({ page }) => {
        await page.getByRole('combobox').fill('SCRI')

        const javascript = page.locator('.tag-result:visible', { has: page.locator('.tag-title', { hasText: /^javascript$/ }) })
        await expect(javascript.locator('.tag-title .underline')).toHaveText('scri')
        await expect(javascript.locator('.tag-alternative-name .underline')).toHaveText(['scri', 'scri', 'scri'])
        await expect(javascript.locator('.tag-title')).toHaveText('javascript')
    })

    test('renders tag data as text, not HTML', async ({ page }) => {
        await page.route('**/taglist.js', (route) => route.fulfill({
            contentType: 'application/javascript',
            body: `var tagList = [{ Id: '1', Title: '<img src=x onerror="window.injected=true">', Description: '<b>bold</b>', AlternativeNames: [] }]`
        }))
        await page.goto('/')
        await page.getByRole('combobox').fill('img')

        await expect(page.locator('.tag-result:visible .tag-description')).toHaveText('<b>bold</b>')
        expect(await page.evaluate(() => window.injected)).toBeUndefined()
    })
})

test.describe('selecting tags', () => {
    test('clicking a result adds a tag and clears the search', async ({ page }) => {
        await selectTag(page, 'java', 'java')

        await expect(chips(page)).toHaveCount(1)
        await expect(chips(page)).toContainText('java')
        await expect(page.getByRole('combobox')).toHaveValue('')
        await expect(page.getByRole('combobox')).toBeFocused()
        await expect(page.locator('.tag-result:visible')).toHaveCount(0)
    })

    test('selected tags are left out of the results', async ({ page }) => {
        await selectTag(page, 'java', 'java')
        await page.getByRole('combobox').fill('java')

        await expect(resultTitles(page)).toHaveText(['javascript', 'arrays', 'java-ee'])
    })

    test('selecting one tag does not hide another tag\'s result', async ({ page }) => {
        // Regression: chips used to reuse result card ids, so 'java' disappeared
        await selectTag(page, 'javascript', 'javascript')
        await page.getByRole('combobox').fill('java')

        await expect(resultTitles(page)).toHaveText(['java', 'arrays', 'java-ee'])
    })

    test('never creates duplicate element ids', async ({ page }) => {
        await selectTag(page, 'java', 'java')
        await selectTag(page, 'java', 'javascript')
        await selectTag(page, 'j', 'jquery')

        const duplicates = await page.evaluate(() => {
            const ids = [...document.querySelectorAll('[id]')].map((el) => el.id)
            return ids.filter((id, i) => ids.indexOf(id) !== i)
        })
        expect(duplicates).toEqual([])
    })
})

test.describe('removing tags', () => {
    test('removed tags show up in results again', async ({ page }) => {
        await selectTag(page, 'java', 'java')
        await page.getByRole('button', { name: 'Remove java' }).click()

        await expect(chips(page)).toHaveCount(0)
        await expect(page.getByRole('combobox')).toBeFocused()
        await page.getByRole('combobox').fill('java')
        await expect(resultTitles(page)).toHaveText(['java', 'javascript', 'arrays', 'java-ee'])
    })

    test('removing one tag keeps the others selected', async ({ page }) => {
        // Regression: the wrong entry was spliced out and handlers stacked up
        await selectTag(page, 'java', 'java')
        await selectTag(page, 'java', 'javascript')
        await selectTag(page, 'j', 'jquery')
        await page.getByRole('button', { name: 'Remove java', exact: true }).click()

        await expect(chips(page)).toHaveCount(2)
        await page.getByRole('combobox').fill('j')
        await expect(resultTitles(page)).toHaveText(['java', 'arrays', 'java-ee', 'j'])
    })
})

test.describe('keyboard', () => {
    test('arrow keys move through results and Enter selects', async ({ page }) => {
        const input = page.getByRole('combobox')
        await input.fill('java')

        await input.press('ArrowDown')
        await input.press('ArrowDown')
        await expect(page.getByRole('option', { selected: true })).toContainText('javascript')
        await expect(input).toHaveAttribute('aria-activedescendant', '2')

        await input.press('Enter')
        await expect(chips(page)).toContainText(['javascript'])
    })

    test('ArrowUp from nothing selected wraps to the last result', async ({ page }) => {
        const input = page.getByRole('combobox')
        await input.fill('java')
        await input.press('ArrowUp')

        await expect(page.getByRole('option', { selected: true })).toContainText('java-ee')
    })

    test('Enter with no active result does nothing', async ({ page }) => {
        const input = page.getByRole('combobox')
        await input.fill('java')
        await input.press('Enter')

        await expect(chips(page)).toHaveCount(0)
        await expect(input).toHaveValue('java')
    })

    test('Escape clears the search', async ({ page }) => {
        const input = page.getByRole('combobox')
        await input.fill('java')
        await input.press('ArrowDown')
        await input.press('Escape')

        await expect(input).toHaveValue('')
        await expect(page.locator('.tag-result:visible')).toHaveCount(0)
        await expect(input).not.toHaveAttribute('aria-activedescendant')
    })
})
