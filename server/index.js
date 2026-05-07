const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
require('dotenv').config();

const { Project, Blog, Contact, Peep, Visitor } = require('./models');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(fileUpload());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Health Check Endpoint (useful for Render deployment)
app.get(['/', '/health', '/api/health'], (req, res) => {
  const dbState = mongoose.connection.readyState;
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const isDbConnected = dbState === 1 || dbState === 2;
  
  res.status(isDbConnected ? 200 : 503).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: isDbConnected ? 'connected' : 'disconnected'
  });
});

// Image upload route (to ImgBB)
app.post('/api/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({ error: 'No image provided' });
    }

    const imageFile = req.files.image;
    const base64Image = imageFile.data.toString('base64');
    
    // Convert to standard form data for fetch
    const formData = new URLSearchParams();
    formData.append('image', base64Image);
    formData.append('key', process.env.IMGBB_API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    
    if (data.success) {
      res.json({ url: data.data.url });
    } else {
      res.status(500).json({ error: 'ImgBB upload failed', details: data });
    }
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Internal server error during upload' });
  }
});

// Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ _id: -1 });
    // Map _id to id for frontend
    res.json(projects.map(p => {
        const obj = p.toObject();
        obj.id = obj._id.toString();
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    
    const obj = project.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!project) return res.status(404).json({ error: 'Not found' });
    const obj = project.toObject(); obj.id = obj._id.toString();
    res.json(obj);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ _id: -1 });
    res.json(blogs.map(b => {
        const obj = b.toObject();
        obj.id = obj._id.toString();
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = new Blog(req.body);
    await blog.save();
    const obj = blog.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!blog) return res.status(404).json({ error: 'Not found' });
    const obj = blog.toObject(); obj.id = obj._id.toString();
    res.json(obj);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/blogs/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ _id: -1 });
    res.json(contacts.map(c => {
        const obj = c.toObject();
        obj.id = obj._id.toString();
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const contact = new Contact({
        ...req.body,
        submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
    });
    await contact.save();
    const obj = contact.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/contacts/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Peeps
app.get('/api/peeps', async (req, res) => {
  try {
    const peeps = await Peep.find();
    res.json(peeps.map(p => {
        const obj = p.toObject();
        obj.id = obj._id.toString();
        return obj;
    }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/peeps', async (req, res) => {
  try {
    const peep = new Peep(req.body);
    await peep.save();
    const obj = peep.toObject();
    obj.id = obj._id.toString();
    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/peeps/:id', async (req, res) => {
  try {
    const peep = await Peep.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!peep) return res.status(404).json({ error: 'Not found' });
    const obj = peep.toObject(); obj.id = obj._id.toString();
    res.json(obj);
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/peeps/:id', async (req, res) => {
  try {
    await Peep.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

// Initial Data Seed route (optional, helps populate DB first time)
app.post('/api/seed', async (req, res) => {
    try {
        const { projects, blogs } = req.body;
        if(projects && projects.length > 0) {
            await Project.deleteMany({});
            await Project.insertMany(projects.map(p => {
                const { id, ...rest } = p;
                return rest;
            }));
        }
        if(blogs && blogs.length > 0) {
            await Blog.deleteMany({});
            await Blog.insertMany(blogs.map(b => {
                const { id, ...rest } = b;
                return rest;
            }));
        }
        res.json({ message: 'Seeded successfully' });
    } catch(err) {
        res.status(500).json({ error: err.message });
    }
});
// --- Visitor Tracking ---
app.get('/api/visitors', async (req, res) => {
  try {
    const visitors = await Visitor.find().sort({ startTime: -1 });
    res.json(visitors.map(v => ({ ...v.toObject(), id: v._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/visitors', async (req, res) => {
  try {
    const { path, screenWidth, screenHeight, language } = req.body;
    
    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (ip && ip.includes(',')) ip = ip.split(',')[0].trim();
    if (!ip) ip = 'Unknown';

    // Rate Limit: Only log once per IP/Path per hour to prevent flooding
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingLog = await Visitor.findOne({
      ip,
      path,
      startTime: { $gt: oneHourAgo }
    });

    if (existingLog) {
      return res.json({ message: 'Log throttled', id: existingLog._id });
    }

    const userAgent = req.headers['user-agent'];
    let location = { city: 'Unknown', country: 'Unknown', region: 'Unknown' };
    
    // Simple geolocation
    if (ip !== '127.0.0.1' && ip !== '::1' && !ip.startsWith('192.168.') && !ip.startsWith('10.')) {
      try {
        const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
        const geoData = await geoRes.json();
        if (geoData.city) {
          location = { 
            city: geoData.city, 
            country: geoData.country_name, 
            region: geoData.region 
          };
        }
      } catch (geoErr) {
        console.error('Geo error:', geoErr);
      }
    }

    const newVisitor = new Visitor({
      ip,
      userAgent,
      location,
      path,
      screenWidth,
      screenHeight,
      language
    });

    await newVisitor.save();
    res.status(201).json({ ...newVisitor.toObject(), id: newVisitor._id.toString() });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/visitors', async (req, res) => {
  try {
    await Visitor.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/visitors/:id', async (req, res) => {
  try {
    await Visitor.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
