export type ProjectEntry = {
  id: string
  title: string
  description: string
  link: string
  tags: string[]
  image?: string
  bulletPoints: string[]
}

export type ProjectDraft = {
  title: string
  description: string
  link: string
  tags: string
  image: string
  bulletPoints: string
}

export type BlogEntry = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  tags: string[]
  image?: string
  publishedAt: string
}

export type BlogDraft = {
  title: string
  excerpt: string
  content: string
  tags: string
  image: string
}

export type ContactEntry = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  submittedAt: string
}

export type ContactDraft = {
  name: string
  email: string
  subject: string
  message: string
}

export type SiteContent = {
  projects: ProjectEntry[]
  blogs: BlogEntry[]
  contacts: ContactEntry[]
}

const SITE_STORAGE_KEY = 'portfolio-site-content'
const ADMIN_AUTH_KEY = 'portfolio-admin-auth'
export const ADMIN_USERNAME = 'admin'
export const ADMIN_PASSWORD = 'portfolio-admin'

function createId(prefix: string) {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getDefaultSiteContent(): SiteContent {
  return {
    projects: [
      {
        id: 'project-design-system',
        title: 'Design System',
        description:
          'Reusable React component library with 50+ components, full TypeScript support, and comprehensive documentation.',
        link: 'https://example.com/design-system',
        tags: ['React', 'TypeScript', 'Storybook', 'Tailwind'],
        bulletPoints: [
          'Built 50+ accessible, reusable components',
          'Implemented comprehensive design system documentation',
          'Achieved 95% test coverage with Jest and React Testing Library',
          'Impact: Reduced development time by 40% across team projects',
        ],
      },
      {
        id: 'project-ai-content-platform',
        title: 'AI Content Platform',
        description:
          'Full-stack SaaS application for AI-powered content generation with real-time collaboration features.',
        link: 'https://example.com/ai-content-platform',
        tags: ['Vite', 'AI SDK', 'Supabase', 'Stripe'],
        bulletPoints: [
          'Architected scalable backend with AI integrations',
          'Implemented Stripe payments and subscription management',
          'Built real-time collaboration using WebSockets',
          'Impact: 5000+ active users, $50k ARR',
        ],
      },
      {
        id: 'project-mobile-task-app',
        title: 'Mobile Task App',
        description: 'Cross-platform mobile application with offline support and cloud synchronization.',
        link: 'https://example.com/mobile-task-app',
        tags: ['React Native', 'Firebase', 'Redux'],
        bulletPoints: [
          'Developed cross-platform app supporting 50k+ downloads',
          'Implemented offline-first architecture with Firebase sync',
          'Achieved 4.8 star rating on both App Store and Play Store',
          'Impact: Featured in top charts on both platforms',
        ],
      },
    ],
    blogs: [
      {
        id: 'blog-readable-interfaces',
        slug: 'building-interfaces-that-stay-readable',
        title: 'Building interfaces that stay readable',
        excerpt: 'A short note on keeping dense portfolio layouts clear, aligned, and responsive.',
        content:
          'Clean layouts matter more as content density grows. I like to start with a strict visual rhythm, keep typography predictable, and avoid stacking too many competing accents in the same view.\n\nIn practice, that means using one clear hierarchy for headings, limiting decorative treatment, and giving each section enough breathing room to stand on its own.\n\nThe goal is not minimalism for its own sake. It is to make the page easier to scan without flattening the personality of the design.',
        tags: ['Design', 'Layout', 'Typography'],
        publishedAt: 'Apr 2026',
      },
      {
        id: 'blog-design-system-simplification',
        slug: 'what-i-learned-from-simplifying-a-design-system',
        title: 'What I learned from simplifying a design system',
        excerpt: 'Practical cleanup tips for reducing visual noise without losing flexibility.',
        content:
          'The biggest improvement often comes from removing, not adding. Simplifying a design system usually means reducing component variants, tightening spacing rules, and making defaults do more of the work.\n\nThat lowers decision fatigue for future work and makes the UI feel more consistent without forcing every screen into the same shape.\n\nA smaller set of well-defined primitives is usually enough for a personal site or portfolio, and it is much easier to evolve later.',
        tags: ['Systems', 'UI', 'Consistency'],
        publishedAt: 'Mar 2026',
      },
      {
        id: 'blog-smaller-primitives',
        slug: 'shipping-faster-with-smaller-ui-primitives',
        title: 'Shipping faster with smaller UI primitives',
        excerpt: 'Why keeping shared components minimal can make a portfolio easier to maintain.',
        content:
          'Smaller primitives are easier to test, easier to reuse, and easier to evolve. When a component only does one job, it becomes much simpler to reason about the rest of the page around it.\n\nFor personal sites especially, that keeps the codebase adaptable while still giving the page a distinctive visual system.\n\nIt also makes the admin workflow cleaner because each new project or blog entry can be represented with a small predictable shape.',
        tags: ['Components', 'Workflow', 'Maintainability'],
        publishedAt: 'Feb 2026',
      },
    ],
    contacts: [],
  }
}

export function loadSiteContent(): SiteContent {
  if (typeof window === 'undefined') {
    return getDefaultSiteContent()
  }

  try {
    const rawContent = window.localStorage.getItem(SITE_STORAGE_KEY)
    if (!rawContent) {
      return getDefaultSiteContent()
    }

    const parsedContent = JSON.parse(rawContent) as SiteContent
    return {
      projects: Array.isArray(parsedContent.projects) ? parsedContent.projects : [],
      blogs: Array.isArray(parsedContent.blogs) ? parsedContent.blogs : [],
      contacts: Array.isArray(parsedContent.contacts) ? parsedContent.contacts : [],
    }
  } catch {
    return getDefaultSiteContent()
  }
}

export function saveSiteContent(content: SiteContent) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(SITE_STORAGE_KEY, JSON.stringify(content))
}

export function addProjectEntry(content: SiteContent, draft: ProjectDraft): SiteContent {
  const projectEntry: ProjectEntry = {
    id: createId('project'),
    title: draft.title.trim(),
    description: draft.description.trim(),
    link: draft.link.trim(),
    tags: draft.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    image: draft.image.trim() || undefined,
    bulletPoints: draft.bulletPoints
      .split('\n')
      .map((bulletPoint) => bulletPoint.trim())
      .filter(Boolean),
  }

  return {
    ...content,
    projects: [projectEntry, ...content.projects],
  }
}

export function addBlogEntry(content: SiteContent, draft: BlogDraft): SiteContent {
  const title = draft.title.trim()
  const blogEntry: BlogEntry = {
    id: createId('blog'),
    slug: slugify(title) || createId('post'),
    title,
    excerpt: draft.excerpt.trim(),
    content: draft.content.trim(),
    tags: draft.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    image: draft.image.trim() || undefined,
    publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
  }

  return {
    ...content,
    blogs: [blogEntry, ...content.blogs],
  }
}

export function addContactEntry(content: SiteContent, draft: ContactDraft): SiteContent {
  const contactEntry: ContactEntry = {
    id: createId('contact'),
    name: draft.name.trim(),
    email: draft.email.trim(),
    subject: draft.subject.trim(),
    message: draft.message.trim(),
    submittedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
  }

  return {
    ...content,
    contacts: [contactEntry, ...content.contacts],
  }
}

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true'
}

export const PORTFOLIO_DOCUMENT_ID = 'portfolio' as const

export type PortfolioDocument = {
  _id: typeof PORTFOLIO_DOCUMENT_ID
  content: SiteContent
  updatedAt: string
}

export function buildPortfolioDocument(content: SiteContent): PortfolioDocument {
  return {
    _id: PORTFOLIO_DOCUMENT_ID,
    content,
    updatedAt: new Date().toISOString(),
  }
}

export function setAdminAuthenticated(value: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(ADMIN_AUTH_KEY, value ? 'true' : 'false')
}
