
import type { ProjectEntry } from './lib/types'
import { ProjectCard } from './HomePage'

type ProjectsPageProps = {
  projects: ProjectEntry[]
}

export default function ProjectsPage({ projects }: ProjectsPageProps) {
  return (
    <main className="min-h-screen bg-[#f4efe7] text-black [font-family:var(--font-space-grotesk),sans-serif]">
      <nav className="border-b border-black/15 bg-white/50 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 sm:px-8">
          <a href="/" className="text-sm font-semibold tracking-widest text-black underline hover:opacity-70">
            ← BACK TO HOME
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-6xl px-6 py-12 sm:px-8 md:py-20">
        <div className="mb-10 sm:mb-16">
          <p className="mb-3 text-[0.65rem] font-bold tracking-[0.25em] text-black/50 uppercase sm:text-xs">
            PORTFOLIO
          </p>
          <h1 className="text-4xl font-black uppercase tracking-[-0.05em] text-black sm:text-5xl md:text-6xl lg:text-7xl [font-family:var(--font-display)]">
            All Projects
          </h1>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        
        {projects.length === 0 && (
          <p className="text-sm text-gray-700">No projects found.</p>
        )}
      </section>

      <footer className="border-t border-black/15 bg-white/30">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-12 text-xs font-bold tracking-widest text-black/70 sm:px-8">
          <p>© {new Date().getFullYear()} SHAD C T</p>
          <a href="/" className="hover:text-black">
            HOME
          </a>
        </div>
      </footer>
    </main>
  )
}
