const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
  Blog.find({})
    .populate('user', { username: 1, name: 1 })
    .then(blogs => {
      response.json(blogs)
    })
})

/** 
const getTokenFrom = request => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}*/

blogsRouter.post('/', userExtractor, async (request, response) => {
  const user = request.user
  const blog = new Blog(request.body)

  blog.likes = blog.likes | 0
  blog.user = user._id
  
  if (!blog.title || !blog.url) {
    return response.status(400).end()
  }

  /**const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
    
  const user = await User.findById(decodedToken.id)
  
  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' })
  }
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id
  })*/

  user.blogs = user.blogs.concat(blog._id)
  await user.save()

  const savedBlog = await blog.save()

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user
  const blog = await Blog.findById(request.params.id)
  console.log('user: ', user)
  console.log('blogi: ', blog)
  
  console.log('käyttäjä id: ', user.id.toString())
  console.log('blogin käyttäjän id: ', blog.user.toString())

  if (!blog) {
    return response.status(204).end()
  }

  if (user.id.toString() !== blog.user.toString()) {
    return response.status(403).json({ error: 'user not authorized' })
  }

  user.blogs = user.blogs.filter(b => b.id.toString() !== blog.id.toString())

  await blog.deleteOne()
  response.status(204).end()
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes

  const updatedBlog = await blog.save()

  response.json(updatedBlog)
})

module.exports = blogsRouter