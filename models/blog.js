const mongoose = require('mongoose')

mongoose.set('toJSON', { virtuals: true })

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  url: { type: String, required: true },
  likes: { type: Number }
})

module.exports = mongoose.model('Blog', blogSchema)