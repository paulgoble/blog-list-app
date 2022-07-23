const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const { userExtractor } = require('../utils/auth_helper')

blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })

  if (blogs) {
    res.json(blogs)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', userExtractor, async (req, res) => {
  const blog = new Blog(req.body)
  if (!blog.url || !blog.title) {
    res.status(400).end()
  }

  blog.likes = blog.likes ? blog.likes : 0
  blog.user = await User.findById(req.userId)
  
  const newBlog = await blog.save()
  res.status(201).json(newBlog)
})

blogsRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  console.log(blog)
  if (!blog.user) {
    return res.status(400).json({ error: 'this blog has no user'})
  }
  if (blog.user.toString() !== req.userId) {
    return res.status(403).json({ error: 'access forbidden' })
  }

  const result = await Blog.findByIdAndRemove(req.params.id)
  if (result) {
    res.status(204).end()
  } else {
    res.status(400).end()
  }
})

blogsRouter.put('/:id', userExtractor, async (req, res) => {
  const blog = req.body
  const options = { new: true, runValidators: true }

  const result = await Blog.findByIdAndUpdate(req.params.id, blog, options)
  if (result) {
    res.json(result)
  } else {
    res.status(400).end()
  }
})

module.exports = blogsRouter