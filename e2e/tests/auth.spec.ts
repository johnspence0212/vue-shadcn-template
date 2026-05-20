import { test, expect } from '@playwright/test'

test('redirects to login, signs in as admin, signs out', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/login/)

  await page.getByLabel('Email').fill('admin@template.local')
  await page.getByLabel('Password').fill('AdminPassword123!')
  await page.getByRole('button', { name: 'Sign in' }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()

  await page.getByRole('button', { name: 'Sign out' }).click()
  await expect(page).toHaveURL(/\/login/)
})
