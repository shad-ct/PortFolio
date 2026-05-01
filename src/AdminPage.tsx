import { useState, type FormEvent } from 'react'

import type { BlogDraft, ProjectDraft, SiteContent } from './lib/siteData'
import { ADMIN_PASSWORD, ADMIN_USERNAME, isAdminAuthenticated, setAdminAuthenticated } from './lib/siteData'

type AdminPageProps = {
  content: SiteContent
  onAddProject: (draft: ProjectDraft) => void
  onAddBlog: (draft: BlogDraft) => void
}

const inputClassName =
  'w-full border-b border-black bg-transparent px-0 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-600'

export default function AdminPage({ content, onAddProject, onAddBlog }: AdminPageProps) {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated())
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [projectDraft, setProjectDraft] = useState<ProjectDraft>({
    title: '',
    description: '',
    link: '',
    tags: '',
    image: '',
    bulletPoints: '',
  })
  const [blogDraft, setBlogDraft] = useState<BlogDraft>({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  })

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAdminAuthenticated(true)
      setAuthenticated(true)
      setNotice('Logged in successfully.')
      return
    }

    setNotice('Invalid admin credentials.')
  }

  function handleLogout() {
    setAdminAuthenticated(false)
    setAuthenticated(false)
    setPassword('')
    setNotice('Logged out.')
  }

  function handleProjectSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!projectDraft.title.trim() || !projectDraft.description.trim()) {
      setNotice('Project title and description are required.')
      return
    }

    onAddProject(projectDraft)
    setProjectDraft({ title: '', description: '', link: '', tags: '', image: '', bulletPoints: '' })
    setNotice('Project added.')
  }

  function handleBlogSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!blogDraft.title.trim() || !blogDraft.excerpt.trim() || !blogDraft.content.trim()) {
      setNotice('Blog title, excerpt, and content are required.')
      return
    }

    onAddBlog(blogDraft)
    setBlogDraft({ title: '', excerpt: '', content: '', tags: '', image: '' })
    setNotice('Blog post published.')
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-white px-8 py-20 text-black [font-family:var(--font-space-grotesk),sans-serif]">
        <div className="mx-auto max-w-md space-y-8 rounded-2xl border border-black p-8">
          <div className="space-y-2 text-center">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">ADMIN</p>
            <h1 className="text-4xl font-bold">Login</h1>
            <p className="text-sm leading-relaxed text-gray-700">Restricted access for managing projects, blogs, and contacts.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Username
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className={inputClassName}
                placeholder="admin"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClassName}
                placeholder="portfolio-admin"
              />
            </label>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              SIGN IN
            </button>
          </form>

          {notice ? <p className="text-sm text-gray-700">{notice}</p> : null}

          <p className="text-xs tracking-widest text-gray-500 uppercase">Access the dashboard at /admin.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white text-black [font-family:var(--font-space-grotesk),sans-serif]">
      <nav className="border-b border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <a href="/" className="text-sm underline hover:opacity-70">
            ← SITE
          </a>
          <div className="flex items-center gap-4">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">ADMIN DASHBOARD</p>
            <button onClick={handleLogout} className="text-xs tracking-widest uppercase text-gray-700 hover:text-black">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-8 py-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">SUMMARY</p>
            <h1 className="mt-2 text-5xl font-bold">Manage site content</h1>
          </div>
          {notice ? <p className="text-sm text-gray-700">{notice}</p> : null}
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black p-5">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Projects</p>
            <p className="mt-3 text-4xl font-bold">{content.projects.length}</p>
          </div>
          <div className="rounded-2xl border border-black p-5">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Blog posts</p>
            <p className="mt-3 text-4xl font-bold">{content.blogs.length}</p>
          </div>
          <div className="rounded-2xl border border-black p-5">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Messages</p>
            <p className="mt-3 text-4xl font-bold">{content.contacts.length}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-8 pb-24">
        <div className="grid gap-8 lg:grid-cols-2">
          <form onSubmit={handleProjectSubmit} className="grid gap-5 rounded-2xl border border-black p-6 md:p-8">
            <div>
              <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Add project</p>
              <h2 className="mt-2 text-3xl font-bold">New project</h2>
            </div>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Title
              <input
                value={projectDraft.title}
                onChange={(event) => setProjectDraft({ ...projectDraft, title: event.target.value })}
                className={inputClassName}
                placeholder="Project title"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Description
              <textarea
                value={projectDraft.description}
                onChange={(event) => setProjectDraft({ ...projectDraft, description: event.target.value })}
                rows={3}
                className={inputClassName}
                placeholder="Short project summary"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Link
              <input
                value={projectDraft.link}
                onChange={(event) => setProjectDraft({ ...projectDraft, link: event.target.value })}
                className={inputClassName}
                placeholder="https://example.com"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Tags
              <input
                value={projectDraft.tags}
                onChange={(event) => setProjectDraft({ ...projectDraft, tags: event.target.value })}
                className={inputClassName}
                placeholder="React, TypeScript, Tailwind"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Image URL (optional)
              <input
                value={projectDraft.image}
                onChange={(event) => setProjectDraft({ ...projectDraft, image: event.target.value })}
                className={inputClassName}
                placeholder="https://..."
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Bullet points
              <textarea
                value={projectDraft.bulletPoints}
                onChange={(event) => setProjectDraft({ ...projectDraft, bulletPoints: event.target.value })}
                rows={5}
                className={inputClassName}
                placeholder="One bullet per line"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              SAVE PROJECT
            </button>
          </form>

          <form onSubmit={handleBlogSubmit} className="grid gap-5 rounded-2xl border border-black p-6 md:p-8">
            <div>
              <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Write blog</p>
              <h2 className="mt-2 text-3xl font-bold">New post</h2>
            </div>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Title
              <input
                value={blogDraft.title}
                onChange={(event) => setBlogDraft({ ...blogDraft, title: event.target.value })}
                className={inputClassName}
                placeholder="Blog title"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Excerpt
              <textarea
                value={blogDraft.excerpt}
                onChange={(event) => setBlogDraft({ ...blogDraft, excerpt: event.target.value })}
                rows={2}
                className={inputClassName}
                placeholder="Short summary shown on the blog list"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Content
              <textarea
                value={blogDraft.content}
                onChange={(event) => setBlogDraft({ ...blogDraft, content: event.target.value })}
                rows={8}
                className={inputClassName}
                placeholder="Write the full article content here"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Tags
              <input
                value={blogDraft.tags}
                onChange={(event) => setBlogDraft({ ...blogDraft, tags: event.target.value })}
                className={inputClassName}
                placeholder="Design, Strategy, UI"
              />
            </label>
            <label className="grid gap-2 text-sm font-medium text-gray-800">
              Image URL (optional)
              <input
                value={blogDraft.image}
                onChange={(event) => setBlogDraft({ ...blogDraft, image: event.target.value })}
                className={inputClassName}
                placeholder="https://..."
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
            >
              PUBLISH POST
            </button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Projects added</p>
            <div className="mt-6 space-y-4">
              {content.projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-gray-300 p-4">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <p className="mt-2 text-sm text-gray-700">{project.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Blogs written</p>
            <div className="mt-6 space-y-4">
              {content.blogs.map((blog) => (
                <div key={blog.id} className="rounded-2xl border border-gray-300 p-4">
                  <h3 className="text-xl font-bold">{blog.title}</h3>
                  <p className="mt-2 text-sm text-gray-700">{blog.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-20">
        <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Contacted peoples</p>
        <div className="mt-6 grid gap-4">
          {content.contacts.length === 0 ? (
            <div className="rounded-2xl border border-gray-300 p-6 text-gray-700">No messages yet.</div>
          ) : (
            content.contacts.map((contact) => (
              <article key={contact.id} className="rounded-2xl border border-gray-300 p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-bold">{contact.name}</h3>
                    <p className="text-sm text-gray-700">{contact.email}</p>
                  </div>
                  <p className="text-xs tracking-widest text-gray-500 uppercase">{contact.submittedAt}</p>
                </div>
                <p className="mt-4 text-sm font-medium text-gray-800">{contact.subject}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-700">{contact.message}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
