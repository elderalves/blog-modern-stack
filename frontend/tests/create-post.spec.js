import { test, expect } from './fixtures/index.js'

test('allows creating a post', async ({ page, auth }) => {
  const testUser = await auth.signUpAndLogIn()

  // Create unique post title with timestamp to avoid conflicts
  const uniqueTitle = `Test Post ${Date.now()}`

  await page.locator('input[name="createTitle"]').click()
  await page.locator('input[name="createTitle"]').fill(uniqueTitle)
  await page.locator('input[name="createTitle"]').press('Tab')
  await page.locator('textarea[name="contents"]').fill('Hello World!')
  await page.locator('textarea[name="contents"]').press('Tab')
  await page.getByRole('button', { name: 'Create Post' }).click()

  // More specific selector for the newly created post
  const newPostArticle = page
    .getByRole('article')
    .filter({ hasText: uniqueTitle })

  // Check that our specific post title is visible
  await expect(newPostArticle.getByText(uniqueTitle)).toBeVisible()

  // Check that the author attribution is correct
  await expect(newPostArticle.getByText(`Written by:`)).toBeVisible()
  await expect(newPostArticle.getByText(testUser)).toBeVisible()
})
