import { useState } from 'react'
import { ArrowUpRight, Download, Mail, MapPin, PhoneCall, X, ChevronLeft, ChevronRight, Images } from 'lucide-react'

import type { ProjectEntry } from './lib/types'
import { resumeProfile } from './lib/types'
function SectionHeading({ title }: { title: string }) {
  return <h2 className="text-[0.9rem] font-black tracking-[0.24em] text-black uppercase sm:text-[1rem]">{title}</h2>
}

function Pill({ children }: { children: string }) {
  return (
    <span className="inline-flex items-center justify-center rounded-full border border-black/80 px-3.5 py-1.5 text-[0.68rem] leading-none text-black transition-colors duration-200 hover:bg-black hover:text-[#f4efe7] sm:px-4 sm:py-2 sm:text-sm">
      {children}
    </span>
  )
}

function GithubLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.68c-2.78.61-3.37-1.18-3.37-1.18a2.65 2.65 0 0 0-1.11-1.47c-.91-.62.07-.61.07-.61a2.1 2.1 0 0 1 1.53 1.03 2.13 2.13 0 0 0 2.91.83 2.13 2.13 0 0 1 .64-1.34c-2.22-.25-4.56-1.11-4.56-4.92a3.83 3.83 0 0 1 1.02-2.66 3.56 3.56 0 0 1 .1-2.62s.83-.27 2.73 1.02a9.41 9.41 0 0 1 4.97 0c1.9-1.29 2.73-1.02 2.73-1.02a3.56 3.56 0 0 1 .1 2.62 3.83 3.83 0 0 1 1.02 2.66c0 3.82-2.35 4.67-4.58 4.91a2.39 2.39 0 0 1 .69 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}

function LinkedinLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <path d="M6.94 6.5a1.94 1.94 0 1 1 0-3.88 1.94 1.94 0 0 1 0 3.88ZM5.14 9h3.6v11H5.14V9ZM10.67 9h3.45v1.5h.05A3.78 3.78 0 0 1 17.58 8.7c3.77 0 4.47 2.48 4.47 5.71V20h-3.6v-4.97c0-1.18-.02-2.7-1.65-2.7-1.66 0-1.9 1.3-1.9 2.61V20h-3.6V9Z" />
    </svg>
  )
}

function TelegramLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
      <path d="M21.8 4.6 18.7 19c-.23 1.03-.85 1.28-1.72.79l-4.77-3.52-2.3 2.22c-.26.26-.49.49-.99.49l.34-4.86 8.84-7.99c.38-.34-.08-.53-.59-.19L6.27 13.8l-4.77-1.49c-1.04-.33-1.06-1.04.22-1.53L20.4 3.02c.92-.33 1.72.21 1.4 1.58Z" />
    </svg>
  )
}

function ContactItem({ label, value, href }: { label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-2.5 rounded-[1.5rem] border border-black/15 bg-white/35 px-3 py-2.5 transition-transform duration-200 hover:-translate-y-0.5 hover:border-black/35 hover:bg-white/60 sm:gap-3 sm:px-4 sm:py-3"
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noreferrer' : undefined}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/70 bg-[#f4efe7] text-black sm:h-10 sm:w-10">
        {label === 'Phone' ? <PhoneCall className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
        {label === 'Email' ? <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
        {label === 'Location' ? <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : null}
        {label === 'GitHub' ? <GithubLogo /> : null}
        {label === 'LinkedIn' ? <LinkedinLogo /> : null}
        {label === 'Telegram' ? <TelegramLogo /> : null}
      </div>
      <div className="min-w-0">
        <p className="text-[0.55rem] font-semibold tracking-[0.24em] text-black/60 uppercase sm:text-[0.65rem]">{label}</p>
        <p className="truncate text-[0.82rem] font-bold text-black group-hover:underline sm:text-base">{value}</p>
      </div>
    </a>
  )
}

function TimelineItem({
  title,
  subtitle,
  period,
  isLast = false,
}: {
  title: string
  subtitle: string
  period: string
  isLast?: boolean
}) {
  return (
    <article className="relative flex gap-4">
      {/* Connector column */}
      <div className="relative flex flex-col items-center" style={{ minWidth: '1.5rem' }}>
        {/* Dot */}
        <span
          className="relative z-10 mt-1 h-3 w-3 shrink-0 rounded-full border-2 border-black bg-[#f4efe7] shadow-[0_0_0_3px_rgba(0,0,0,0.08)]"
        />
        {/* Vertical line below dot */}
        {!isLast && (
          <span className="mt-1 flex-1 w-px bg-gradient-to-b from-black/30 to-black/05" />
        )}
      </div>

      {/* Content */}
      <div className="pb-6">
        <p className="text-[0.78rem] font-semibold tracking-[0.15em] text-black/40 uppercase mb-0.5">{period}</p>
        <p className="text-[0.88rem] font-black tracking-[0.08em] text-black uppercase leading-tight">{title}</p>
        <p className="mt-1 text-[0.82rem] text-black/65 leading-snug">{subtitle}</p>
      </div>
    </article>
  )
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  startIndex,
  title,
  onClose,
}: {
  images: string[]
  startIndex: number
  title: string
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)

  function prev() {
    setCurrent((c) => (c - 1 + images.length) % images.length)
  }
  function next() {
    setCurrent((c) => (c + 1) % images.length)
  }

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} gallery`}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
        aria-label="Close gallery"
      >
        <X className="h-4 w-4" />
      </button>

      {/* Counter */}
      <p className="absolute top-4 left-1/2 -translate-x-1/2 text-[0.65rem] font-semibold tracking-[0.25em] text-white/60 uppercase">
        {title} &nbsp;·&nbsp; {current + 1} / {images.length}
      </p>

      {/* Main image */}
      <div className="relative flex max-h-[80vh] max-w-[90vw] items-center justify-center">
        {images.length > 1 && (
          <button
            onClick={prev}
            className="absolute -left-12 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}

        <img
          src={images[current]}
          alt={`${title} screenshot ${current + 1}`}
          className="max-h-[75vh] max-w-[82vw] rounded-2xl border border-white/10 object-contain shadow-2xl"
          key={current}
        />

        {images.length > 1 && (
          <button
            onClick={next}
            className="absolute -right-12 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dot indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-6 flex gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to image ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/35 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ── ProjectGallery strip ──────────────────────────────────────────────────────
function ProjectGallery({ images, title, onOpen }: { images: string[]; title: string; onOpen: (i: number) => void }) {
  return (
    <div className="-mx-4 sm:-mx-5 mb-0">
      <div className="relative overflow-hidden rounded-t-[1.35rem]">
        {/* Horizontal scrollable strip */}
        <div
          className="flex gap-1.5 overflow-x-auto px-4 py-3 sm:px-5"
          style={{ scrollbarWidth: 'none' }}
        >
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => onOpen(i)}
              className="group relative h-24 w-36 shrink-0 overflow-hidden rounded-xl border border-black/12 bg-black/5 shadow-sm transition-all duration-200 hover:scale-[1.03] hover:border-black/30 hover:shadow-md sm:h-28 sm:w-44"
              aria-label={`View ${title} image ${i + 1}`}
            >
              <img
                src={src}
                alt={`${title} ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-200 group-hover:bg-black/25">
                <Images className="h-5 w-5 text-white opacity-0 drop-shadow-lg transition-opacity duration-200 group-hover:opacity-100" />
              </div>
              {/* Index badge */}
              <span className="absolute bottom-1 right-1.5 rounded-full bg-black/50 px-1.5 py-0.5 text-[0.5rem] font-bold tracking-wider text-white/80 backdrop-blur-sm">
                {i + 1}/{images.length}
              </span>
            </button>
          ))}
        </div>
        {/* Bottom fade rule */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-black/10" />
      </div>
    </div>
  )
}

// ── ProjectCard ───────────────────────────────────────────────────────────────
export function ProjectCard({ project }: { project: ProjectEntry }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const images = project.images ?? []

  return (
    <>
      <article className="flex h-full flex-col rounded-[1.6rem] border border-black/15 bg-white/50 shadow-[0_12px_30px_rgba(17,17,17,0.05)] transition-transform duration-200 hover:-translate-y-0.5 overflow-hidden">
        {/* Gallery strip at top (if images exist) */}
        {images.length > 0 && (
          <ProjectGallery images={images} title={project.title} onOpen={(i) => setLightboxIndex(i)} />
        )}

        {/* Card body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="text-[0.55rem] font-semibold tracking-[0.28em] text-black/55 uppercase sm:text-[0.65rem]">Project</p>
          <h3 className="mt-1.5 text-[0.88rem] font-black tracking-[0.07em] text-black uppercase sm:text-[1rem]">
            {project.title}
          </h3>
          <p className="mt-2 text-[0.8rem] leading-5 text-black/75 sm:text-sm sm:leading-6">{project.description}</p>
          <div className="mt-3 flex flex-wrap gap-1.5 text-[0.55rem] font-semibold tracking-[0.14em] text-black/55 uppercase sm:gap-2 sm:text-[0.65rem]">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-black/15 px-2 py-0.5 sm:px-2.5 sm:py-1">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-auto sm:pt-4">
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-black bg-black px-4 py-2 text-[0.6rem] font-semibold tracking-[0.18em] text-[#f4efe7] transition-colors hover:bg-[#f4efe7] hover:text-black sm:px-4 sm:py-2 sm:text-[0.68rem]"
            >
              VIEW PROJECT
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
            {project.githubLink && (
              <a
                href={project.githubLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-black/20 px-3.5 py-2 text-[0.6rem] font-semibold tracking-[0.16em] text-black/70 transition-colors hover:border-black/40 hover:text-black sm:text-[0.65rem]"
              >
                GITHUB
              </a>
            )}
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-black/20 px-3.5 py-2 text-[0.6rem] font-semibold tracking-[0.16em] text-black/70 transition-colors hover:border-black/40 hover:text-black sm:text-[0.65rem]"
              >
                LIVE
              </a>
            )}
            {images.length > 0 && (
              <button
                onClick={() => setLightboxIndex(0)}
                className="inline-flex items-center gap-1.5 rounded-full border border-black/20 px-3.5 py-2 text-[0.6rem] font-semibold tracking-[0.16em] text-black/70 transition-colors hover:border-black/40 hover:text-black sm:text-[0.65rem]"
              >
                <Images className="h-3 w-3" />
                {images.length} PHOTOS
              </button>
            )}
          </div>
        </div>
      </article>

      {/* Lightbox portal */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          startIndex={lightboxIndex}
          title={project.title}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  )
}

// ── BlogCard ─────────────────────────────────────────────────────────────────
function BlogCard({ blog }: { blog: import('./lib/types').BlogEntry }) {
  return (
    <a
      href={`/blog/${blog.slug}`}
      className="group flex flex-col gap-3 rounded-[1.6rem] border border-black/15 bg-white/50 p-4 shadow-[0_12px_30px_rgba(17,17,17,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-black/25 hover:shadow-md sm:p-5"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[0.55rem] font-semibold tracking-[0.28em] text-black/55 uppercase sm:text-[0.65rem]">
            {blog.publishedAt}
          </p>
          <h3 className="mt-1 text-[0.88rem] font-black tracking-[0.05em] text-black group-hover:underline sm:text-[1rem]">
            {blog.title}
          </h3>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-black/40 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-black" />
      </div>
      <p className="text-[0.8rem] leading-5 text-black/70 sm:text-sm sm:leading-6">{blog.excerpt}</p>
      <div className="mt-auto flex flex-wrap gap-1.5 text-[0.55rem] font-semibold tracking-[0.14em] text-black/50 uppercase sm:gap-2 sm:text-[0.65rem]">
        {blog.tags.map((tag) => (
          <span key={tag} className="rounded-full border border-black/12 px-2 py-0.5 sm:px-2.5 sm:py-1">
            {tag}
          </span>
        ))}
      </div>
    </a>
  )
}

type HomePageProps = {
  projects: ProjectEntry[]
  blogs: import('./lib/types').BlogEntry[]
  onContactSubmit?: (data: any) => Promise<void>
}

export default function HomePage({ projects, blogs, onContactSubmit }: HomePageProps) {
  function handleDownload() {
    window.print()
  }

  return (
    <main className="min-h-screen px-3 py-3 text-black sm:px-4 md:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:gap-5">
        {/* ── Hero grid: left column (bio + contacts + education) | right column (photo + skills) ── */}
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(260px,0.95fr)] lg:items-stretch xl:gap-8">
          {/* Left column */}
          <div className="space-y-4 sm:space-y-5">
            <div className="space-y-2.5 sm:space-y-3">
              <p className="text-[0.6rem] font-semibold tracking-[0.35em] text-black/65 uppercase sm:text-xs">Portfolio</p>
              <h1 className="max-w-[6ch] text-[clamp(2.9rem,8vw,6.1rem)] leading-[0.82] font-black tracking-[-0.09em] text-black uppercase [font-family:var(--font-display)]">
                {resumeProfile.name}
              </h1>
              <p className="text-[clamp(0.78rem,1.8vw,1rem)] font-black tracking-[0.22em] text-black uppercase">
                {resumeProfile.title}
              </p>
            </div>

            <p className="max-w-2xl text-[0.82rem] leading-6 text-black/78 sm:text-[0.92rem] sm:leading-7 md:text-[0.98rem]">
              {resumeProfile.summary}
            </p>

            <div className="grid gap-2 sm:grid-cols-2 sm:gap-2.5">
              {resumeProfile.contacts.map((contact) => (
                <ContactItem key={contact.label} {...contact} />
              ))}
            </div>

            {/* Education — visible on all screen sizes */}
            <div className="space-y-1">
              <SectionHeading title="Education" />
              <div className="mt-3">
                {resumeProfile.education.map((item, i) => (
                  <TimelineItem
                    key={`${item.institution}-${item.period}`}
                    title={item.institution}
                    subtitle={item.qualification}
                    period={item.period}
                    isLast={i === resumeProfile.education.length - 1}
                  />
                ))}
              </div>
            </div>

            {/* Experience — visible on all screen sizes */}
            <div className="space-y-1">
              <SectionHeading title="Experience" />
              <div className="mt-3">
                {resumeProfile.experience.map((item, i) => (
                  <TimelineItem
                    key={`${item.company}-${item.period}`}
                    title={item.company}
                    subtitle={item.role}
                    period={item.period}
                    isLast={i === resumeProfile.experience.length - 1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="lg:pl-4 xl:pl-8 lg:pt-1 space-y-4 sm:space-y-6 flex flex-col items-center lg:items-start lg:h-full">
            <div className="relative overflow-hidden rounded-[1.85rem] border border-black/15 bg-[linear-gradient(180deg,#c9c9c9_0%,#ededed_58%,#d6d6d6_100%)] shadow-[0_18px_50px_rgba(17,17,17,0.08)] w-full max-w-[16rem] sm:max-w-[18rem] lg:max-w-full lg:flex-1 lg:min-h-0">
              <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/10 to-transparent" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(255,255,255,0.4)_0%,rgba(255,255,255,0.08)_26%,transparent_52%)]" />
              <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.18)_0,rgba(255,255,255,0.18)_1px,transparent_1px,transparent_18px)] opacity-30" />
              <div className="absolute inset-x-10 top-12 h-28 rounded-full bg-black/10 blur-3xl" />
              <div className="relative flex aspect-[0.72/1] lg:aspect-auto lg:h-full items-center justify-center px-4 py-4 sm:px-5 sm:py-5">
                <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] border border-black/10 bg-[#f4efe7] shadow-[0_8px_24px_rgba(17,17,17,0.16)]">
                  <img
                    src="/profile.png"
                    alt="Shad C T"
                    className="h-full w-full object-cover object-center grayscale contrast-105"
                  />
                </div>
              </div>
            </div>

            <div className="grid content-start gap-4 sm:gap-5 w-full max-w-[16rem] sm:max-w-[18rem] lg:max-w-full">
              <div className="space-y-3 sm:space-y-4">
                <SectionHeading title="Skills" />
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {resumeProfile.skills.map((skill) => (
                    <Pill key={skill}>{skill}</Pill>
                  ))}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <SectionHeading title="Interests" />
                <div className="flex flex-wrap gap-2 sm:gap-2.5">
                  {resumeProfile.interests.map((interest) => (
                    <Pill key={interest}>{interest}</Pill>
                  ))}
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <SectionHeading title="Languages" />
                <div className="space-y-1.5 text-[0.68rem] tracking-[0.2em] text-black uppercase sm:text-sm">
                  {resumeProfile.languages.map((language) => (
                    <p key={language}>{language}</p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Projects ── */}
        <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
          <SectionHeading title="Featured Projects" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-5 xl:gap-6">
            {projects.filter(p => p.isFeatured).slice(0, 4).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {projects.length > projects.filter(p => p.isFeatured).slice(0, 4).length && (
            <div className="flex justify-center mt-6">
              <a href="/projects" className="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-6 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white">
                View All Projects
              </a>
            </div>
          )}
        </section>

        {/* ── Blog ── */}
        {blogs.length > 0 && (
          <section className="mt-6 space-y-4 sm:mt-8 sm:space-y-5">
            <SectionHeading title="Blog" />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-5 xl:gap-6">
              {blogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          </section>
        )}

        {/* ── Get in Touch ── */}
        <section className="print:hidden mt-2 space-y-4 rounded-[1.5rem] border border-black/15 bg-white/35 p-5 shadow-[0_12px_30px_rgba(17,17,17,0.05)] sm:p-6">
          <SectionHeading title="Get in Touch" />
          <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const formData = new FormData(form);
              const data = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  subject: 'Contact Form Submission', // Default subject
                  message: formData.get('message') as string
              };
              // Note: Make sure HomePageProps includes onContactSubmit
              if(typeof onContactSubmit === 'function'){
                  onContactSubmit(data).then(() => {
                      alert('Message sent successfully!');
                      form.reset();
                  }).catch(() => {
                      alert('Failed to send message.');
                  });
              } else {
                 console.log("Form data (no API bound):", data);
                 form.reset();
                 alert('Message sent locally!');
              }
          }}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-[0.68rem] font-semibold tracking-[0.15em] text-black/60 uppercase">Name</label>
              <input type="text" id="name" name="name" required className="w-full rounded-xl border border-black/20 bg-transparent px-4 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-[0.68rem] font-semibold tracking-[0.15em] text-black/60 uppercase">Email</label>
              <input type="email" id="email" name="email" required className="w-full rounded-xl border border-black/20 bg-transparent px-4 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" placeholder="john@example.com" />
            </div>
            <div className="space-y-2">
              <label htmlFor="message" className="text-[0.68rem] font-semibold tracking-[0.15em] text-black/60 uppercase">Message</label>
              <textarea id="message" name="message" required rows={4} className="w-full resize-none rounded-xl border border-black/20 bg-transparent px-4 py-2 text-sm text-black placeholder:text-black/40 focus:border-black focus:outline-none focus:ring-1 focus:ring-black" placeholder="Your message here..."></textarea>
            </div>
            <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-black bg-black px-6 py-2.5 text-[0.68rem] font-semibold tracking-[0.18em] text-[#f4efe7] transition-colors hover:bg-[#f4efe7] hover:text-black">
              SEND MESSAGE
            </button>
          </form>
        </section>

        <footer className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[1.35rem] border border-black/12 bg-white/35 px-4 py-3 text-[0.58rem] tracking-[0.28em] text-black/65 uppercase shadow-[0_10px_24px_rgba(17,17,17,0.04)] sm:mt-5 sm:px-5 sm:py-4">
          <p>SHAD C T</p>
          <div className="flex items-center gap-3">
            <p>FULL STACK DEVELOPER</p>
            <button
              type="button"
              onClick={handleDownload}
              className="print:hidden inline-flex items-center gap-2 rounded-full border border-black/70 bg-black px-3 py-1.5 text-[0.6rem] font-semibold tracking-[0.18em] text-[#f4efe7] transition-colors hover:bg-[#f4efe7] hover:text-black"
            >
              <Download className="h-3.5 w-3.5" />
              DOWNLOAD PDF
            </button>
          </div>
        </footer>
      </div>
    </main>
  )
}
