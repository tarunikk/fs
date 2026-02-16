const { test, expect, beforeEach, describe } = require('@playwright/test')
const { createBlog, loginWith } = require('./helper')

describe('Blog app', () => {
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

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to application')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong credentials')
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')

      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'blog created by playwright', 'anonymous author', 'www.example.com')

      await expect(page.getByText(`a new blog 'blog created by playwright' by 'anonymous author' added`)).toBeVisible()
      await expect(page.getByText('blog created by playwright anonymous author', { exact: true })).toBeVisible()
    })

    describe('and a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'a blog to like and delete', 'anonymous author', 'www.example.com')
      })
  
      test('blog can be liked', async ({ page }) => {
        await page.getByRole('button', { name: 'show' }).click()
        await expect(page.getByText('Likes: 0')).toBeVisible()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })

      test('blog can be deleted', async ({ page }) => {
        await page.getByRole('button', { name: 'show' }).click()
        page.on('dialog', dialog => dialog.accept());
        await page.getByRole('button', { name: 'delete' }).click()

        await expect(page.getByText(`removed 'a blog to like and delete'`)).toBeVisible()
        await expect(page.getByText('a blog to like and delete anonymous author')).not.toBeVisible()
      })

      test('blog can only be deleted by its creator', async ({ page, request }) => {
        await request.post('/api/users', {
          data: {
            name: 'Taru',
            username: 'tksnikka',
            password: 'salasana'
          }
        })
        await page.getByRole('button', { name: 'logout' }).click()
        await loginWith(page, 'tksnikka', 'salasana')
        await page.getByRole('button', { name: 'show' }).click()
        await expect(page.getByRole('button', { name: 'delete' })).not.toBeVisible()
      })
    })

    describe('blogs are in order of likes', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'first blog', 'anonymous author', 'www.example.com')
        await createBlog(page, 'second blog', 'unknown', 'www.somewhere.com')
        await createBlog(page, 'third blog', 'another one', 'www.wbsite.com')

        await page.getByRole('button', { name: 'show' }).first().click()
        await page.getByRole('button', { name: 'show' }).first().click()
        await page.getByRole('button', { name: 'show' }).first().click()
      })

      test('in the beginning the first created blog is at the top', async ({ page }) => {      
        await expect(page.getByRole('listitem').first()).toHaveText('first blog anonymous author www.example.comLikes: 0likeMatti Luukkainendelete')
      })

      test('second blog is at the top when it has a like', async ({ page }) => {     
        const secondBlogText = page.getByText('second blog unknown')
        const secondBlogElement = secondBlogText.locator('..') 

        await secondBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(secondBlogElement.getByText('Likes: 1')).toBeVisible()

        await expect(page.getByRole('listitem').first()).toHaveText('second blog unknown www.somewhere.comLikes: 1likeMatti Luukkainendelete')
      })
      
      test('third blog with most likes is at the top', async ({ page }) => {
        const secondBlogText = page.getByText('second blog unknown')
        const secondBlogElement = secondBlogText.locator('..') 
        const thirdBlogText = page.getByText('third blog another one')
        const thirdBlogElement = thirdBlogText.locator('..')

        await secondBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(secondBlogElement.getByText('Likes: 1')).toBeVisible()

        await thirdBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(thirdBlogElement.getByText('Likes: 1')).toBeVisible()
        await thirdBlogElement.getByRole('button', { name: 'like' }).click()
        await expect(thirdBlogElement.getByText('Likes: 2')).toBeVisible()

        // Kun kolmannelle blogille 'third blog' lisätään kaksi likeä, se on listan ensimmäisenä, second toisena yhdellä likellä ja first viimeisenä
        await expect(page.getByRole('listitem').first()).toHaveText('third blog another one www.wbsite.comLikes: 2likeMatti Luukkainendelete')
        await expect(page.getByRole('listitem').nth(1)).toHaveText('second blog unknown www.somewhere.comLikes: 1likeMatti Luukkainendelete')
        await expect(page.getByRole('listitem').last()).toHaveText('first blog anonymous author www.example.comLikes: 0likeMatti Luukkainendelete')
      })
    })
  })
})