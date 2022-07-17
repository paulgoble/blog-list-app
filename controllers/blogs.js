const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({})

  if (blogs) {
    res.json(blogs)
  } else {
    res.status(404).end()
  }
})

blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body)

  if (!blog.likes) {
    blog.likes = 0
  }
  if (!blog.url || !blog.title) {
    res.status(400).end()
  }
  const result = await blog.save()
  res.status(201).json(result)
})

blogsRouter.delete('/:id', async (req, res) => {
  const result = await Blog.findByIdAndRemove(req.params.id)

  if (result) {
    res.status(204).end()
  } else {
    res.status(400).end()
  }
})

blogsRouter.put('/:id', async (req, res) => {
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