const { test, describe, expect, beforeEach } = require('@playwright/test')
const { createNote, loginWith } = require('./helper')

describe('Note app', () => {
  // Testien alustus
  // Nollaa palvelimen tietokannan aina ennen testien suorittamista
  // Testit aloittavat samalla tavalla, eli avaamalla sivun http://localhost:5173
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('/')
  })

  // Ladataan etusivu ja testataan onko sen elementit renderöity näkyville
  test('front page can be opened', async ({ page }) => {
    const locator = page.getByText('Notes')
    await expect(locator).toBeVisible()
    await expect(page.getByText('Note app, Department of Computer Science, University of Jyvaskyla 2025')).toBeVisible()
  })

  // Testataan sisäänkirjautumista ja logiForm lomakkeen toiminta
  test('user can log in', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'salainen')
  
    await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
  })
  
  // Epäonnistuneen sisäänkirjautumisen testi
  test('login fails with wrong password', async ({ page }) => {
    await loginWith(page, 'mluukkai', 'wrong')

    const errorDiv = page.locator('.error')
    await expect(errorDiv).toContainText('wrong credentials')
    await expect(errorDiv).toHaveCSS('border-style', 'solid')
    await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

    await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
  })
  
  // Lisätään uusi muistiinpano
  describe('when logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })
    
    
    test('a new note can be created', async ({ page }) => {
      await createNote(page, 'a note created by playwright')
      await expect(page.getByText('a note created by playwright')).toBeVisible()
    })

    
    describe('and a note exists', () => {
      beforeEach(async ({ page }) => {
        await createNote(page, 'another note by playwright')
      })
  
      test('importance can be changed', async ({ page }) => {
        await page.getByRole('button', { name: 'make not important' }).click()
        await expect(page.getByText('make important')).toBeVisible()
      })
    })

    describe('and several notes exists', () => {    
      beforeEach(async ({ page }) => {
            await createNote(page, 'first note')
            await page.getByRole('button', { name: 'cancel' }).click()
            await createNote(page, 'second note')
            await page.getByRole('button', { name: 'cancel' }).click()
            await createNote(page, 'third note')
      })

      test('one of those can be made nonimportant', async ({ page }) => {
        const otherNoteText = page.getByText('second note')
        const otherNoteElement = otherNoteText.locator('..')

        await otherNoteElement
          .getByRole('button', { name: 'make not important' }).click()
        await expect(otherNoteElement.getByText('make important')).toBeVisible()
      })
    })
  })
})