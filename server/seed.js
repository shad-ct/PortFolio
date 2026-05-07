const mongoose = require('mongoose');
require('dotenv').config();
const { Project, Blog } = require('./models');

const projects = [
  {
    title: 'KUFF Film Festival',
    description: 'A dark, cinematic platform built for a campus film festival featuring ticket booking and a dynamic movie schedule.',
    link: 'https://kuff.netlify.app',
    tags: ['React.js', 'Tailwind', 'Vite'],
    images: ['/projects/kuff_1.png', '/projects/kuff_2.png'],
    bulletPoints: [
      'Built and shipped a brutalist, dark-themed UI over a single weekend.',
      'Implemented responsive design for seamless mobile viewing.',
      'Designed custom film-grain textures to match the festival vibe.'
    ]
  },
  {
    title: 'Sagavazhvu',
    description: 'A comprehensive full-stack wellness and community platform with a custom content management system.',
    link: 'https://sagavazhvu.com',
    tags: ['MERN Stack', 'Express.js', 'Redux'],
    images: ['/projects/sagavazhvu_1.png', '/projects/sagavazhvu_2.png'],
    bulletPoints: [
      'Engineered a custom RESTful API for secure user authentication.',
      'Created a dynamic admin dashboard for content moderation.',
      'Optimized MongoDB queries to reduce loading times by 40%.'
    ]
  },
  {
    title: 'Aurora',
    description: 'An AI-powered daily journaling app focusing on mental clarity and mood tracking.',
    link: 'https://aurora-journal.app',
    tags: ['React Native', 'Firebase', 'Gemini AI'],
    images: ['/projects/aurora_1.png', '/projects/aurora_2.png'],
    bulletPoints: [
      'Integrated the Gemini API to analyze daily entries and suggest prompts.',
      'Built smooth, gesture-driven animations using React Native Reanimated.',
      'Implemented offline-first storage with automatic cloud syncing.'
    ]
  },
  {
    title: 'ICARD',
    description: 'A digital identification and access control system designed for university campuses.',
    link: 'https://icard-system.edu',
    tags: ['Node.js', 'PostgreSQL', 'RFID'],
    images: ['/projects/icard_1.png', '/projects/icard_2.png'],
    bulletPoints: [
      'Designed a secure QR-code generation service for temporary visitor passes.',
      'Integrated with legacy university database systems.',
      'Reduced physical card issuance costs by 60%.'
    ]
  },
  {
    title: 'Mobile AI',
    description: 'An experimental project running offline LLMs directly on mobile hardware.',
    link: 'https://github.com/shad-ct/mobile-ai',
    tags: ['Python', 'Termux', 'Ollama'],
    images: ['/projects/mobileai_1.png', '/projects/mobileai_2.png'],
    bulletPoints: [
      'Successfully compiled and ran Llama 3 locally on an Android device.',
      'Created a lightweight web interface served entirely from the phone.',
      'Documented the process for the open-source community.'
    ]
  },
  {
    title: 'Troll Hub',
    description: 'A viral meme soundboard and real-time interactive audio experience.',
    link: 'https://troll-hub.fun',
    tags: ['JavaScript', 'Web Audio API', 'Socket.io'],
    images: ['/projects/trollhub_1.png', '/projects/trollhub_2.png'],
    bulletPoints: [
      'Mapped keyboard events to over 50 instant-play audio samples.',
      'Implemented WebSockets to allow synchronized sound triggers across devices.',
      'Handled over 10,000 unique visitors during the launch week.'
    ]
  },
  {
    title: 'IUCAA Website',
    description: 'Had this wonderful opportunity to work on the IUCAA website for Kannur University Mangattuparamba. Doing PHP from scratch was a great experience.',
    link: 'https://iucaa.kannuruniversity.ac.in/',
    tags: ['PHP', 'University', 'Web Design'],
    images: ['/projects/iucaa.png'],
    bulletPoints: [
      'Developed the official website for IUCAA, Kannur University.',
      'Implemented backend logic using PHP from scratch.',
      'Designed a clean, professional interface for academic use.'
    ]
  },
  {
    title: 'Sagavazhvu (Fest Edition)',
    description: 'A real-time results and schedule tracker built for our college fest. We had only a few days to build it, and it was a huge success.',
    link: 'https://kuc-sagavazhvu-2025.web.app/',
    tags: ['React.js', 'Firebase', 'Real-time'],
    images: ['/projects/sagavazhvu_fest.png'],
    bulletPoints: [
      'Built in just 3-5 days to meet the festival deadline.',
      'Provided live competition results and scoreboards to students.',
      'Handled high traffic during the event with seamless updates.'
    ]
  },
  {
    title: 'Drum Kit',
    description: 'An interactive drum kit inspired by the movie Whiplash. Play various drum sounds using your keyboard.',
    link: 'https://shad-ct.github.io/Projects/DrumKit/index.html',
    tags: ['JavaScript', 'Web Audio', 'Interactivity'],
    images: ['/projects/drumkit.png'],
    bulletPoints: [
      'Mapped keyboard events to high-quality drum samples.',
      'Created a fun, responsive interface for musical experimentation.',
      'Inspired by the high-energy vibe of Whiplash.'
    ]
  },
  {
    title: 'KeyCode Finder',
    description: 'A handy tool to discover ASCII and keycodes for any key on your keyboard. Built during a CS class.',
    link: 'https://shad-ct.github.io/Projects/KeyCode/index.html',
    tags: ['JavaScript', 'Tool', 'Education'],
    images: ['/projects/keycode.png'],
    bulletPoints: [
      'Instantly displays ASCII and event codes for keyboard input.',
      'Useful for developers debugging keyboard events.',
      'Created as a practical application of CS fundamentals.'
    ]
  },
  {
    title: 'QR Code Generator',
    description: 'A practical tool to generate QR codes instantly from any text input.',
    link: 'https://shad-ct.github.io/Projects/QRGenerator/index.html',
    tags: ['JavaScript', 'API', 'Tool'],
    images: ['/projects/qrgenerator.png'],
    bulletPoints: [
      'Generates high-quality QR codes in real-time.',
      'Clean, minimalist UI focused on utility.',
      'Supports various text formats for encoding.'
    ]
  },
  {
    title: 'റീഡർ (Malayalam TTS)',
    description: 'A Malayalam Text-to-Speech tool designed to simplify reading long posts and texts.',
    link: 'https://shad-ct.github.io/Reader/',
    tags: ['Malayalam', 'TTS', 'Accessibility'],
    images: ['/projects/reader.png'],
    bulletPoints: [
      'Converts Malayalam text into natural-sounding speech.',
      'Helps users consume content without reading long texts.',
      'Focuses on accessibility for Malayalam speakers.'
    ]
  },
  {
    title: 'Age Calculator',
    description: 'A precise age calculator that breaks down your age into years, months, and days.',
    link: 'https://shad-ct.github.io/Projects/YouAre__YearsOld/index.html',
    tags: ['JavaScript', 'Tool', 'Logic'],
    images: ['/projects/age_calc.jpg'],
    bulletPoints: [
      'Calculates exact age based on date of birth.',
      'Provides a detailed breakdown of time passed.',
      'Simple and intuitive user interface.'
    ]
  },
  {
    title: 'Chat Decoder',
    description: 'An AI-powered tool that analyzes chat screenshots to reveal relationship dynamics using Gemini API.',
    link: 'https://studio--chat-decoder.us-central1.hosted.app/',
    tags: ['Gemini AI', 'React.js', 'Analysis'],
    images: ['/projects/chat_decoder.png'],
    bulletPoints: [
      'Integrated Gemini API for sentiment and relationship analysis.',
      'Processes image inputs to extract chat text and context.',
      'Provides playful insights into interpersonal connections.'
    ]
  }
];

const blogs = [
  {
    slug: 'turning-your-phone-into-an-ai-server',
    title: 'Turning Your Phone Into an Offline AI Server',
    excerpt: 'A deep dive into how I used Ollama and Termux to run a local LLM on an Android phone...',
    content: "Ever wondered if your phone could do more than stream videos and scroll feeds? I did. This is how I turned a mid-range Android phone into a fully functional, offline AI inference server using Ollama and Termux.\n\nThe idea started during a power-cut experiment: what if I could run a small language model locally and query it from my laptop — all without the internet? Turns out, it's entirely possible.\n\nOllama handles the model serving, Termux gives you a Linux-like shell on Android, and a simple shell script ties everything together. You expose a port over your local network and suddenly every device on your Wi-Fi can talk to the AI.\n\nKey challenges: memory constraints (go for 1B–3B parameter models), battery drain (use a power bank or keep it charging), and firewall rules on some Android builds. Once past those, the performance is surprisingly usable for text tasks.",
    tags: ['Android', 'AI', 'Ollama', 'Termux', 'Networking'],
    publishedAt: 'Apr 2025'
  },
  {
    slug: 'vibe-coding-kuff-film-festival',
    title: 'Vibe Coding the KUFF Film Festival Website',
    excerpt: 'How I shipped a full campus film festival website in record time by leaning into intuition...',
    content: "The KUFF film festival brief arrived on a Tuesday. The deadline was Friday. No Figma file, no wireframes — just a vision and a stack of movie posters.\n\nVibe coding is what I call the approach of building by feel: you start with a rough structure, tweak until it looks right, and iterate aggressively. No paralysis, no over-planning.\n\nFor KUFF I scaffolded a React app, picked a dark cinematic palette (black, cream, film-grain texture), and built pages for Home, Movies, and About in roughly 12 hours of focused work across two days.\n\nThe result: kuff.netlify.app — clean, fast, and actually used by real attendees. Sometimes shipping beats perfecting.",
    tags: ['React.js', 'Vibe Coding', 'Campus Event', 'Design'],
    publishedAt: 'Mar 2025'
  },
  {
    slug: 'what-i-learned-building-mern-apps',
    title: 'What Six Months of MERN Stack Taught Me',
    excerpt: 'Honest lessons from building real-world full-stack apps — from REST API design mistakes...',
    content: "Six months ago I barely knew what Express middleware was. Today I've shipped three full-stack apps in production. Here's what actually changed.\n\nLesson 1: Schema design is everything in MongoDB. I over-used nested documents early on and ended up with queries that made no sense. Flat references and proper indexing saved the Sagavazhvu project.\n\nLesson 2: Error handling is a feature, not an afterthought. Every unhandled promise rejection I ignored in development became a 3am production bug.\n\nLesson 3: The frontend is not the easy part. React state management, useEffect timing, and prop drilling taught me more about software architecture than any backend tutorial.\n\nLesson 4: Deploy early, deploy often. Seeing your code live on day one changes how you think about what matters.",
    tags: ['MERN', 'MongoDB', 'Node.js', 'React', 'Lessons'],
    publishedAt: 'Feb 2025'
  },
  {
    slug: 'why-i-build-things-nobody-asked-for',
    title: 'Why I Build Things Nobody Asked For',
    excerpt: 'A personal essay on the joy of side projects, tinkering culture, and why building the Troll Hub...',
    content: "Nobody asked for a website that plays troll sounds when you press keyboard keys. That's exactly why I built it.\n\nThe Troll Hub started as a 2am idea during freshers day prep. We needed a way to trigger crowd sounds quickly without fumbling with a phone. I had a laptop, a browser, and a half-remembered Web Audio API tutorial.\n\nThree hours later, every key on the keyboard was mapped to a different audio clip. The next day it worked flawlessly in front of 200 students.\n\nThat's the thing about building for fun — you learn faster, ship faster, and care more. The best projects I've built were never on a spec sheet. They came from a real moment of 'I wonder if I could just...'\n\nTinkering is a mindset before it's a skill. Start weird, finish weird.",
    tags: ['Side Projects', 'Tinkering', 'JavaScript', 'Web Audio'],
    publishedAt: 'Jan 2025'
  }
];

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected. Dropping existing collections...');
    await Project.deleteMany({});
    await Blog.deleteMany({});
    
    console.log('Seeding projects...');
    await Project.insertMany(projects);
    
    console.log('Seeding blogs...');
    await Blog.insertMany(blogs);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
