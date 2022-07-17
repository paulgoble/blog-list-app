const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require ('../app')

const api = supertest(app)
const Blog = require('../models/blog')
const { blogsList, newBlog } = require('./blogs_test_helpers')

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of blogsList) {
    let blogPost = new Blog(blog)
    await blogPost.save()
  }
})

describe('GET', () => {
  test('returns the correct number of blogs', async() => {
    const response = await api.get('/api/blogs')
      
    expect(response.body).toHaveLength(blogsList.length)
  })

  test("verifies that the unique id property is named 'id'", async() => {
    const response = await api.get('/api/blogs')
    
    expect(response.body[0].id).toBeDefined();
  })
})

describe('POST', () => {
  test('adds a new blog to the database', async() => {
    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body).toMatchObject(newBlog)

    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body).toHaveLength(blogsList.length + 1)
  })

  test('if likes is missing from post then default to 0', async() => {
    const response = await api.post('/api/blogs').send(newBlog)
    expect(response.body).toHaveProperty('likes', 0)
  })

  test('if title and url are missing return status 400', async() => {
    newBlog.title = null;
    newBlog.url = null;

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

describe('DELETE', () => {
  test('removes a blog post using unique id', async() => {
    const response = await api.get('/api/blogs')
    
    await api
      .delete(`/api/blogs/${response.body[0].id}`)
      .expect(204)

    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body).toHaveLength(blogsList.length - 1)
  })
})

describe('PUT', () => {
  test('updates likes correctly', async() => {
    const response = await api.get('/api/blogs')
    
    response.body[0].likes += 1;
    const updatedBlog = new Blog(response.body[0])
    
    await api
      .put(`/api/blogs/${updatedBlog.id}`)
      .send(updatedBlog)
      .expect(200)

    const blogsAfter = await api.get('/api/blogs')
    expect(blogsAfter.body[0].likes).toEqual(updatedBlog.likes)
  })
})


afterAll(() => {
  mongoose.connection.close()
})