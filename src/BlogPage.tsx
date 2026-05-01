import { ArrowRight } from 'lucide-react'

import type { BlogEntry } from './lib/siteData'

type BlogPageProps = {
  blogs: BlogEntry[]
  slug: string
}

export default function BlogPage({ blogs, slug }: BlogPageProps) {
  const blog = blogs.find((entry) => entry.slug === slug)

  if (!blog) {
    return (
      <main className="min-h-screen bg-white px-8 py-24 text-black [font-family:var(--font-space-grotesk),sans-serif]">
        <div className="mx-auto max-w-3xl space-y-6">
          <p className="text-xs tracking-widest text-gray-600">BLOG</p>
          <h1 className="text-5xl font-bold">Article not found</h1>
          <a href="/" className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
            Back to home <ArrowRight className="h-3 w-3" />
          </a>
        </div>
      </main>
    )
  }

  const paragraphs = blog.content.split('\n\n').filter(Boolean)
  const relatedPosts = blogs.filter((entry) => entry.slug !== blog.slug).slice(0, 2)

  return (
    <main className="min-h-screen bg-white text-black [font-family:var(--font-space-grotesk),sans-serif]">
      <nav className="border-b border-black bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-8 py-6">
          <a href="/" className="text-sm underline hover:opacity-70">
            ← BACK
          </a>
          <a href="/admin" className="text-xs tracking-[0.22em] uppercase text-gray-700 hover:text-black">
            ADMIN
          </a>
        </div>
      </nav>

      <article className="mx-auto max-w-4xl px-8 py-20">
        <p className="mb-4 text-xs tracking-widest text-gray-600">{blog.publishedAt}</p>
        <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">{blog.title}</h1>
        <p className="mb-10 text-lg leading-loose text-gray-700">{blog.excerpt}</p>

        {blog.image ? (
          <img src={blog.image} alt={blog.title} className="mb-10 h-80 w-full object-cover border border-black" />
        ) : null}

        <div className="mb-10 flex flex-wrap gap-3 text-xs tracking-widest text-gray-600">
          {blog.tags.map((tag) => (
            <span key={tag} className="border border-gray-300 px-3 py-1 uppercase">
              {tag}
            </span>
          ))}
        </div>

        <div className="space-y-6 text-lg leading-loose text-gray-700">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </article>

      <section className="mx-auto max-w-6xl border-t border-black px-8 py-16">
        <p className="mb-8 text-sm font-medium tracking-[0.22em] text-gray-600 uppercase">MORE POSTS</p>
        <div className="grid gap-8 md:grid-cols-2">
          {relatedPosts.map((entry) => (
            <article key={entry.id} className="space-y-3">
              <p className="text-xs tracking-widest text-gray-600">{entry.publishedAt}</p>
              <h2 className="text-2xl font-bold">{entry.title}</h2>
              <p className="text-sm leading-relaxed text-gray-700">{entry.excerpt}</p>
              <a href={`/blog/${entry.slug}`} className="inline-flex items-center gap-2 text-xs tracking-widest underline underline-offset-4">
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
          <a href="/" className="hover:opacity-70">
            HOME
          </a>
        </div>
      </footer>
    </main>
  )
}
