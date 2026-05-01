import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'

import type { BlogEntry, ContactDraft, ProjectEntry } from './lib/siteData'

type HomePageProps = {
  projects: ProjectEntry[]
  blogs: BlogEntry[]
  onContactSubmit: (draft: ContactDraft) => void
}

export default function HomePage({ projects, blogs, onContactSubmit }: HomePageProps) {
  const [statusMessage, setStatusMessage] = useState('')

  function handleContactSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const draft = {
      name: String(formData.get('name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      subject: String(formData.get('subject') ?? '').trim(),
      message: String(formData.get('message') ?? '').trim(),
    }

    if (!draft.name || !draft.email || !draft.subject || !draft.message) {
      setStatusMessage('Please complete all fields before sending.')
      return
    }

    onContactSubmit(draft)
    event.currentTarget.reset()
    setStatusMessage('Message sent. I will get back to you soon.')
  }

  return (
    <main className="min-h-screen bg-white text-black [font-family:var(--font-space-grotesk),sans-serif]">
      <nav className="sticky top-0 z-50 border-b border-black bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-8 py-6">
          <div className="text-center">
            <p className="text-xs tracking-widest">ALEX RIVERA</p>
            <p className="text-xs tracking-widest text-gray-600">FULL STACK DEVELOPER</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium tracking-[0.22em] uppercase text-gray-700 md:text-base">
            <a href="#skills" className="transition-colors hover:text-black">
              Skills
            </a>
            <a href="#projects" className="transition-colors hover:text-black">
              Projects
            </a>
            <a href="#about" className="transition-colors hover:text-black">
              About
            </a>
            <a href="#contact" className="transition-colors hover:text-black">
              Contact
            </a>
            <a href="#blog" className="transition-colors hover:text-black">
              Blog
            </a>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-8 py-32">
        <div className="mb-24">
          <p className="mb-8 text-xs tracking-widest text-gray-600">INTRODUCTION</p>
          <h1 className="mb-12 text-7xl font-bold leading-tight md:text-8xl">ALEX RIVERA</h1>
          <p className="mb-12 max-w-3xl text-2xl leading-loose">
            Full-stack developer building elegant digital experiences with modern web technologies. Focused on
            performance, accessibility, and thoughtful design.
          </p>
          <p className="max-w-2xl text-lg text-gray-600">
            Currently exploring AI-powered applications and scalable cloud architecture. Available for interesting
            projects and collaborations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-8" />

      <section id="skills" className="mx-auto max-w-6xl scroll-mt-28 px-8 py-24">
        <p className="mb-16 text-sm font-medium tracking-[0.22em] text-gray-600 uppercase">TECHNICAL SKILLS</p>
        <div className="grid gap-20 md:grid-cols-2">
          <div>
            <h3 className="mb-8 text-2xl font-bold tracking-wide">FRONTEND</h3>
            <p className="text-lg leading-relaxed text-gray-700">React / TypeScript / Vite / Tailwind CSS / Framer Motion</p>
          </div>
          <div>
            <h3 className="mb-8 text-2xl font-bold tracking-wide">BACKEND</h3>
            <p className="text-lg leading-relaxed text-gray-700">Node.js / PostgreSQL / API Design / Authentication</p>
          </div>
          <div>
            <h3 className="mb-8 text-2xl font-bold tracking-wide">TOOLS & DevOps</h3>
            <p className="text-lg leading-relaxed text-gray-700">Git / Docker / Vercel / AWS / GitHub Actions</p>
          </div>
          <div>
            <h3 className="mb-8 text-2xl font-bold tracking-wide">DATABASES</h3>
            <p className="text-lg leading-relaxed text-gray-700">PostgreSQL / Supabase / Redis / MongoDB</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-8" />

      <section id="projects" className="mx-auto max-w-6xl scroll-mt-28 px-8 py-24">
        <p className="mb-16 text-sm font-medium tracking-[0.22em] text-gray-600 uppercase">PROJECTS</p>

        <div className="space-y-24">
          {projects.map((project) => (
            <article key={project.id} className="border-b border-gray-300 pb-24 last:border-b-0 last:pb-0">
              <div className="mb-8 grid items-start gap-12 md:grid-cols-3">
                <div className="col-span-2">
                  <h3 className="mb-6 text-4xl font-bold">{project.title}</h3>
                  <p className="mb-4 text-lg leading-relaxed text-gray-700">{project.description}</p>
                  <p className="mb-6 text-sm tracking-widest text-gray-600">
                    {project.tags.map((tag) => tag.toUpperCase()).join(' • ')}
                  </p>
                </div>
                {project.image ? (
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-48 w-full border border-black object-cover"
                  />
                ) : (
                  <div className="h-48 border border-black bg-gray-100" />
                )}
              </div>

              <ul className="mb-8 max-w-2xl space-y-2 text-sm text-gray-700">
                {project.bulletPoints.map((bulletPoint) => (
                  <li key={bulletPoint}>• {bulletPoint}</li>
                ))}
              </ul>

              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-black bg-transparent px-3 py-2 text-sm font-medium transition-colors hover:bg-black hover:text-white"
              >
                VIEW PROJECT <ArrowRight className="h-3 w-3" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-8" />

      <section id="about" className="mx-auto max-w-6xl scroll-mt-28 px-8 py-24">
        <p className="mb-8 text-sm font-medium tracking-[0.22em] text-gray-600 uppercase">ABOUT</p>
        <div className="max-w-3xl space-y-8">
          <p className="text-lg leading-loose text-gray-700">
            I am a full-stack developer passionate about building beautiful, performant web applications that solve real
            problems.
          </p>
          <p className="text-lg leading-loose text-gray-700">
            Currently exploring AI-powered products and scalable cloud architecture. Focused on performance,
            accessibility, and user experience at every level.
          </p>
          <p className="text-lg leading-loose text-gray-700">
            Always eager to collaborate on interesting projects and mentor junior developers. Lets build something
            great together.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-8" />

      <section id="contact" className="mx-auto max-w-6xl scroll-mt-28 px-8 py-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-12">
            <div>
              <p className="mb-4 text-sm font-medium tracking-[0.22em] text-gray-600 uppercase">GET IN TOUCH</p>
              <h2 className="text-4xl font-bold">Send a message</h2>
            </div>

            <div className="grid gap-10 sm:grid-cols-3 lg:grid-cols-1">
              <div>
                <a href="mailto:hello@alex.dev" className="group">
                  <p className="mb-4 text-xs tracking-widest text-gray-600">EMAIL</p>
                  <p className="text-2xl font-bold group-hover:underline">hello@alex.dev</p>
                </a>
              </div>
              <div>
                <a href="#" className="group">
                  <p className="mb-4 text-xs tracking-widest text-gray-600">LINKEDIN</p>
                  <p className="text-2xl font-bold group-hover:underline">linkedin.com/in/alexrivera</p>
                </a>
              </div>
              <div>
                <a href="#" className="group">
                  <p className="mb-4 text-xs tracking-widest text-gray-600">GITHUB</p>
                  <p className="text-2xl font-bold group-hover:underline">github.com/alexrivera</p>
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleContactSubmit} className="grid gap-6 rounded-2xl border border-black p-6 md:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Name
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="border-b border-black bg-transparent px-0 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-600"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  className="border-b border-black bg-transparent px-0 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-600"
                />
              </label>
            </div>

            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Subject
              <input
                type="text"
                name="subject"
                placeholder="Project inquiry"
                className="border-b border-black bg-transparent px-0 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-600"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Message
              <textarea
                name="message"
                rows={6}
                placeholder="Tell me a bit about what you're building..."
                className="border-b border-black bg-transparent px-0 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-600"
              />
            </label>

            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <p className="text-xs tracking-widest text-gray-600">{statusMessage || 'I WILL GET BACK TO YOU SOON'}</p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                SEND MESSAGE
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      </section>

      <section id="blog" className="mx-auto max-w-6xl scroll-mt-28 border-t border-black px-8 py-24">
        <p className="mb-8 text-sm font-medium tracking-[0.22em] text-gray-600 uppercase">BLOG</p>
        <div className="grid gap-8 md:grid-cols-3">
          {blogs.slice(0, 3).map((blog) => (
            <article key={blog.id} className="space-y-3">
              <p className="text-xs tracking-widest text-gray-600">{blog.publishedAt}</p>
              <h3 className="text-2xl font-bold">{blog.title}</h3>
              <p className="text-sm leading-relaxed text-gray-700">{blog.excerpt}</p>
              <a
                href={`/blog/${blog.slug}`}
                className="inline-flex items-center gap-2 text-xs tracking-widest text-black underline underline-offset-4"
              >
                READ MORE
                <ArrowRight className="h-3 w-3" />
              </a>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-black">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-12 text-xs tracking-widest">
          <p>© {new Date().getFullYear()} ALEX RIVERA</p>
          <a href="/admin" className="hover:opacity-70">
            ADMIN
          </a>
        </div>
      </footer>
    </main>
  )
}
