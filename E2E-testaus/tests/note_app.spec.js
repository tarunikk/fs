const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Note app', () => {
  // Testien alustus
  // Nollaa palvelimen tietokannan aina ennen testien suorittamista
  // Testit aloittavat samalla tavalla, eli avaamalla sivun http://localhost:5173
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3001/api/testing/reset')
    await request.post('http://localhost:3001/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  // Ladataan etusivu ja testataan onko sen elementit renderöity näkyville
  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Jyvaskyla 2025')).toBeVisible()
  })

  // Testataan sisäänkirjautumista ja logiForm lomakkeen toiminta
  test('user can log in', async ({ page }) => {
    await page.getByRole('button', { name: 'login' }).click()
    
    await page.getByLabel('username').fill('mluukkai')
    await page.getByLabel('password').fill('salainen')

    await page.getByRole('button', { name: 'login' }).click()
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
  
  // Lisätään uusi muistiinpano
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('button', { name: 'login' }).click()
      await page.getByLabel('username').fill('mluukkai')
      await page.getByLabel('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new note can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new note' }).click()
      // await page.getByRole('textbox').fill('a note created by playwright')
      await page.getByPlaceholder('write note content here').fill('a note created by playwright')
      await page.getByRole('button', { name: 'save' }).click()
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await page.getByRole('button', { name: 'new note' }).click()
        await page.getByRole('textbox').fill('another note by playwright')
        await page.getByRole('button', { name: 'save' }).click()
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })
  })
})