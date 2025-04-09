import { test, expect } from '@playwright/test'

const testUser = 'test' + Date.now()

test('allows sign up and log in', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Sign Up' }).click()

  await page.getByRole('textbox', { name: 'Username: Password:' }).click()
  await page
    .getByRole('textbox', { name: 'Username: Password:' })
    .fill(testUser)
  await page.locator('#create-password').click()
  await page.locator('#create-password').fill('test')
  await page.getByRole('button', { name: 'Sign up' }).click()

  await page.waitForURL('**/login')

  await page.getByRole('textbox', { name: 'Username: Password:' }).click()
  await page
    .getByRole('textbox', { name: 'Username: Password:' })
    .fill(testUser)
  await page.locator('#create-password').click()
  await page.locator('#create-password').fill('test')
  await page.getByRole('button', { name: 'Log in' }).click()

  await page.waitForURL('**/')

  await expect(page.locator('nav')).toContainText(`Logged in as ${testUser}`)
})
