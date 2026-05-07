const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, required: true },
  githubLink: { type: String },
  liveLink: { type: String },
  tags: [String],
  images: [String],
  bulletPoints: [String],
  isFeatured: { type: Boolean, default: false }
});

const Project = mongoose.model('Project', projectSchema);

const blogSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
  image: String,
  publishedAt: String
});

const Blog = mongoose.model('Blog', blogSchema);

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  submittedAt: String
});

const Contact = mongoose.model('Contact', contactSchema);

const peepSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dob: { type: String },
  contact: { type: String },
  address: { type: String }
});

const Peep = mongoose.model('Peep', peepSchema);

module.exports = { Project, Blog, Contact, Peep };
