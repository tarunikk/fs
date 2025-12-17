const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const Blog = require('../models/blog')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('right amount of blogs', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('blog parameters include id not _id', async () => {
  const response = await api.get('/api/blogs')
  
  response.body.forEach(blog => {
    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
  })
})

test('a new blog can be added ', async () => {
  const newBlog = {
    title: 'Uusi blogi',
    author: 'Erkki Esimerkki',
    url: 'http://example.com',
    likes: 14
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  assert(titles.includes('Uusi blogi'))
})

test('blog without likes has zero likes', async () => {
  const newBlog = {
    title: 'Nolla tykkäystä',
    author: 'Erkki Esimerkki',
    url: 'http://nolikes.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

   const blogsAtEnd = await helper.blogsInDb()
   const resultBlog = blogsAtEnd.find(b => b.title === 'Nolla tykkäystä')

  assert.strictEqual(resultBlog.likes, 0)
})

test('title and url required', async () => {
  const newBlog = {
    author: 'no title or url',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  
  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deleting a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const titles = blogsAtEnd.map(b => b.title)
    assert(!titles.includes(blogToDelete.title))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
})

test('editing a blogs likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToEdit = blogsAtStart[0]

    await api
      .put(`/api/blogs/${blogToEdit.id}`)
      .expect(204)
})

after(async () => {
  await mongoose.connection.close()
})