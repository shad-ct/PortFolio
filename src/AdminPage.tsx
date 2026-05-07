import { useState, useEffect, type FormEvent } from 'react'

import type { BlogDraft, ProjectDraft, PeepDraft, SiteContent } from './lib/types'
import { ADMIN_PASSWORD, ADMIN_USERNAME, isAdminAuthenticated, setAdminAuthenticated } from './lib/types'

type AdminPageProps = {
  content: SiteContent
  onAddProject: (draft: ProjectDraft) => void
  onAddBlog: (draft: BlogDraft) => void
  onAddPeep?: (draft: PeepDraft) => void
  onUpdateProject?: (id: string, data: any) => void
  onDeleteProject?: (id: string) => void
  onUpdateBlog?: (id: string, data: any) => void
  onDeleteBlog?: (id: string) => void
  onDeleteContact?: (id: string) => void
  onUpdatePeep?: (id: string, data: any) => void
  onDeletePeep?: (id: string) => void
}

const inputClassName =
  'w-full border-b border-black bg-transparent px-0 py-3 text-base outline-none placeholder:text-gray-400 focus:border-gray-600'

export default function AdminPage({ content, onAddProject, onAddBlog, onAddPeep, onUpdateProject, onDeleteProject, onUpdateBlog, onDeleteBlog, onDeleteContact, onUpdatePeep, onDeletePeep }: AdminPageProps) {
  const [authenticated, setAuthenticated] = useState(isAdminAuthenticated())
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'blogs' | 'contacts' | 'peeps' | 'visitors'>('dashboard')
  const [visitors, setVisitors] = useState<any[]>([])
  const [isLoadingVisitors, setIsLoadingVisitors] = useState(false)

  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

  useEffect(() => {
    if (activeTab === 'visitors' && authenticated) {
      fetchVisitors()
    }
  }, [activeTab, authenticated])

  async function fetchVisitors() {
    setIsLoadingVisitors(true)
    try {
      const res = await fetch(`${API_BASE}/visitors`)
      if (res.ok) {
        const data = await res.json()
        setVisitors(data)
      }
    } catch (err) {
      console.error('Error fetching visitors:', err)
    } finally {
      setIsLoadingVisitors(false)
    }
  }

  async function deleteVisitor(id: string) {
    if (!confirm('Delete this record?')) return
    try {
      const res = await fetch(`${API_BASE}/visitors/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setVisitors(prev => prev.filter(v => v.id !== id))
      }
    } catch (err) {
      console.error('Error deleting visitor:', err)
    }
  }
  async function deleteAllVisitors() {
    if (!confirm('ARE YOU SURE? This will permanently delete ALL visitor logs.')) return
    try {
      const res = await fetch(`${API_BASE}/visitors`, { method: 'DELETE' })
      if (res.ok) {
        setVisitors([])
      }
    } catch (err) {
      console.error('Error deleting all visitors:', err)
    }
  }

  const [projectDraft, setProjectDraft] = useState<ProjectDraft>({
    title: '',
    description: '',
    link: '',
    githubLink: '',
    liveLink: '',
    tags: '',
    images: '',
    bulletPoints: '',
    isFeatured: false,
  })
  const [blogDraft, setBlogDraft] = useState<BlogDraft>({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    image: '',
  })
  const [peepDraft, setPeepDraft] = useState<PeepDraft>({
    name: '',
    dob: '',
    contact: '',
    address: '',
  })
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null)
  // Edit states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [editingProjectData, setEditingProjectData] = useState<any>({})
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [editingBlogData, setEditingBlogData] = useState<any>({})
  const [editingPeepId, setEditingPeepId] = useState<string | null>(null)
  const [editingPeepData, setEditingPeepData] = useState<any>({})

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
    setProjectDraft({ title: '', description: '', link: '', githubLink: '', liveLink: '', tags: '', images: '', bulletPoints: '', isFeatured: false })
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

  function handlePeepSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!peepDraft.name.trim()) {
      setNotice('Peep name is required.')
      return
    }

    if (onAddPeep) {
      onAddPeep(peepDraft)
      setPeepDraft({ name: '', dob: '', contact: '', address: '' })
      setNotice('Peep added.')
    }
  }

  // DD/MM/YYYY → YYYY-MM-DD for <input type="date">
  function toDateInput(dob: string): string {
    if (!dob) return '';
    const parts = dob.split('/');
    if (parts.length !== 3) return '';
    return `${parts[2]}-${parts[1].padStart(2,'0')}-${parts[0].padStart(2,'0')}`;
  }
  // YYYY-MM-DD → DD/MM/YYYY for storage
  function fromDateInput(val: string): string {
    if (!val) return '';
    const parts = val.split('-');
    if (parts.length !== 3) return val;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }

  const upcomingBirthdays = (content.peeps || []).filter(peep => {
    if (!peep.dob) return false;
    const parts = peep.dob.split('/');
    if (parts.length < 2) return false;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    if (isNaN(day) || isNaN(month)) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    let bday = new Date(currentYear, month, day);
    
    if (bday < today) {
      bday = new Date(currentYear + 1, month, day);
    }
    
    const diffTime = bday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 0 && diffDays <= 7;
  }).map(peep => {
    const parts = peep.dob!.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    let bday = new Date(currentYear, month, day);
    if (bday < today) bday = new Date(currentYear + 1, month, day);
    const diffTime = bday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { ...peep, diffDays };
  }).sort((a, b) => a.diffDays - b.diffDays);

  const next7Birthdays = (content.peeps || []).filter(peep => {
    if (!peep.dob) return false;
    const parts = peep.dob.split('/');
    if (parts.length < 2) return false;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    if (isNaN(day) || isNaN(month)) return false;
    return true;
  }).map(peep => {
    const parts = peep.dob!.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const currentYear = today.getFullYear();
    let bday = new Date(currentYear, month, day);
    if (bday < today) bday = new Date(currentYear + 1, month, day);
    const diffTime = bday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return { ...peep, diffDays };
  }).sort((a, b) => a.diffDays - b.diffDays).slice(0, 7);

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
          <div className="flex items-center gap-6">
            <a href="/" className="text-sm underline hover:opacity-70">
              â† SITE
            </a>
            <div className="flex items-center gap-4 text-sm font-medium">
              <button onClick={() => setActiveTab('dashboard')} className={activeTab === 'dashboard' ? 'underline' : 'hover:opacity-70'}>Dashboard</button>
              <button onClick={() => setActiveTab('projects')} className={activeTab === 'projects' ? 'underline' : 'hover:opacity-70'}>Projects</button>
              <button onClick={() => setActiveTab('blogs')} className={activeTab === 'blogs' ? 'underline' : 'hover:opacity-70'}>Blogs</button>
              <button onClick={() => setActiveTab('contacts')} className={activeTab === 'contacts' ? 'underline' : 'hover:opacity-70'}>Contacts</button>
              <button onClick={() => setActiveTab('peeps')} className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors ${activeTab === 'peeps' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black'}`}>PEEPS</button>
              <button onClick={() => { setActiveTab('visitors'); fetchVisitors(); }} className={`text-xs font-bold tracking-[0.2em] uppercase transition-colors ${activeTab === 'visitors' ? 'text-black border-b-2 border-black pb-1' : 'text-gray-400 hover:text-black'}`}>VISITORS</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase hidden md:block">ADMIN DASHBOARD</p>
            <button onClick={handleLogout} className="text-xs tracking-widest uppercase text-gray-700 hover:text-black">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {activeTab === 'dashboard' && (
        <section className="mx-auto max-w-6xl px-8 py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">SUMMARY</p>
              <h1 className="mt-2 text-5xl font-bold">Dashboard</h1>
            </div>
            {notice ? <p className="text-sm text-gray-700">{notice}</p> : null}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-4">
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
            <div className="rounded-2xl border border-black p-5">
              <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Peeps</p>
              <p className="mt-3 text-4xl font-bold">{content.peeps?.length || 0}</p>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Upcoming Birthdays (Next 7 Days)</p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingBirthdays.length === 0 ? (
                <div className="rounded-2xl border border-gray-300 p-6 text-gray-700 col-span-full">No birthdays coming up in the next 7 days.</div>
              ) : (
                upcomingBirthdays.map((peep) => (
                  <div key={peep.id} className="rounded-2xl border border-black p-5 flex flex-col gap-2 bg-[#f4efe7]">
                    <h3 className="text-xl font-bold">{peep.name}</h3>
                    <p className="text-sm font-medium text-black">
                      {peep.diffDays === 0 ? "Today!" : `In ${peep.diffDays} day${peep.diffDays === 1 ? '' : 's'}`} ({peep.dob})
                    </p>
                    {peep.contact && <p className="text-sm text-gray-700">Contact: {peep.contact}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {activeTab === 'projects' && (
        <>
          <section className="mx-auto max-w-6xl px-8 py-16">
            <div className="mx-auto max-w-3xl">
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
                  GitHub Link
                  <input
                    value={projectDraft.githubLink}
                    onChange={(event) => setProjectDraft({ ...projectDraft, githubLink: event.target.value })}
                    className={inputClassName}
                    placeholder="https://github.com/user/repo"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-gray-800">
                  Live Link
                  <input
                    value={projectDraft.liveLink}
                    onChange={(event) => setProjectDraft({ ...projectDraft, liveLink: event.target.value })}
                    className={inputClassName}
                    placeholder="https://live-project.com"
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
                  Image URLs (one per line, optional)
                  <textarea
                    value={projectDraft.images}
                    onChange={(event) => setProjectDraft({ ...projectDraft, images: event.target.value })}
                    rows={3}
                    className={inputClassName}
                    placeholder={"https://example.com/screenshot.png\nhttps://example.com/logo.png"}
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-gray-800">
                   Or Upload Image (ImgBB)
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={async (e) => {
                         if(e.target.files && e.target.files[0]) {
                             const file = e.target.files[0];
                             const formData = new FormData();
                             formData.append('image', file);
                             try {
                                 setNotice('Uploading image...');
                                 const res = await fetch('http://localhost:5000/api/upload', {
                                     method: 'POST',
                                     body: formData
                                 });
                                 const data = await res.json();
                                 if(data.url) {
                                     setProjectDraft(prev => ({ 
                                         ...prev, 
                                         images: prev.images ? prev.images + '\n' + data.url : data.url 
                                     }));
                                     setNotice('Image uploaded successfully.');
                                 } else {
                                     setNotice('Upload failed.');
                                 }
                             } catch(err) {
                                 setNotice('Upload error.');
                             }
                         }
                     }}
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
                <label className="flex items-center gap-2 text-sm font-medium text-gray-800">
                  <input
                    type="checkbox"
                    checked={projectDraft.isFeatured}
                    onChange={(event) => setProjectDraft({ ...projectDraft, isFeatured: event.target.checked })}
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  Featured Project (Show on Homepage)
                </label>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
                >
                  SAVE PROJECT
                </button>
              </form>
            </div>
          </section>

          <section className="mx-auto max-w-6xl border-t border-black px-8 py-16">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Projects added</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {content.projects.map((project) => (
                <div key={project.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  {editingProjectId === project.id ? (
                    <div className="grid gap-3 p-5">
                      <p className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold">Editing: {project.title}</p>
                      <input className={inputClassName} value={editingProjectData.title || ''} onChange={e => setEditingProjectData({...editingProjectData, title: e.target.value})} placeholder="Title" />
                      <textarea className={inputClassName} rows={2} value={editingProjectData.description || ''} onChange={e => setEditingProjectData({...editingProjectData, description: e.target.value})} placeholder="Description" />
                      <textarea className={inputClassName} rows={3} value={editingProjectData.bulletPoints ? (Array.isArray(editingProjectData.bulletPoints) ? editingProjectData.bulletPoints.join('\n') : editingProjectData.bulletPoints) : ''} onChange={e => setEditingProjectData({...editingProjectData, bulletPoints: e.target.value})} placeholder="Bullet points (one per line)" />
                      <input className={inputClassName} value={editingProjectData.link || ''} onChange={e => setEditingProjectData({...editingProjectData, link: e.target.value})} placeholder="Link" />
                      <input className={inputClassName} value={editingProjectData.githubLink || ''} onChange={e => setEditingProjectData({...editingProjectData, githubLink: e.target.value})} placeholder="GitHub link" />
                      <input className={inputClassName} value={editingProjectData.liveLink || ''} onChange={e => setEditingProjectData({...editingProjectData, liveLink: e.target.value})} placeholder="Live link" />
                      <input className={inputClassName} value={Array.isArray(editingProjectData.tags) ? editingProjectData.tags.join(', ') : editingProjectData.tags || ''} onChange={e => setEditingProjectData({...editingProjectData, tags: e.target.value})} placeholder="Tags (comma separated)" />
                      <label className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                        <input type="checkbox" checked={editingProjectData.isFeatured || false} onChange={e => setEditingProjectData({...editingProjectData, isFeatured: e.target.checked})} className="h-3 w-3 rounded border-gray-300" />
                        Featured Project (Show on Homepage)
                      </label>
                      <label className="text-xs text-gray-600 font-medium">
                        Image URLs (one per line)
                        <textarea className={inputClassName} rows={3} value={Array.isArray(editingProjectData.images) ? editingProjectData.images.join('\n') : editingProjectData.images || ''} onChange={e => setEditingProjectData({...editingProjectData, images: e.target.value})} placeholder="https://..." />
                      </label>
                      {/* Image preview in edit mode */}
                      {(Array.isArray(editingProjectData.images) ? editingProjectData.images : (editingProjectData.images || '').split('\n').map((s:string) => s.trim()).filter(Boolean)).length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {(Array.isArray(editingProjectData.images) ? editingProjectData.images : (editingProjectData.images || '').split('\n').map((s:string) => s.trim()).filter(Boolean)).map((src:string, i:number) => (
                            <img key={i} src={src} alt="preview" className="h-16 w-24 object-cover rounded-lg border border-gray-200" />
                          ))}
                        </div>
                      )}
                      <label className="text-xs text-gray-600 font-medium">
                        Upload image (ImgBB)
                        <input type="file" accept="image/*" className="mt-1 block text-xs" onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const fd = new FormData(); fd.append('image', e.target.files[0]);
                            const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd });
                            const d = await res.json();
                            if (d.url) { const cur = Array.isArray(editingProjectData.images) ? editingProjectData.images.join('\n') : (editingProjectData.images || ''); setEditingProjectData((p:any) => ({...p, images: cur ? cur + '\n' + d.url : d.url})); setNotice('Image uploaded.'); }
                          }
                        }} />
                      </label>
                      <div className="flex gap-2 mt-1">
                        <button className="border border-black bg-black text-white px-4 py-2 text-xs" onClick={() => {
                          const d = editingProjectData;
                          const imgs = Array.isArray(d.images) ? d.images : (d.images || '').split('\n').map((s:string)=>s.trim()).filter(Boolean);
                          const tags = typeof d.tags === 'string' ? d.tags.split(',').map((t:string)=>t.trim()).filter(Boolean) : d.tags;
                          const bps = typeof d.bulletPoints === 'string' ? d.bulletPoints.split('\n').map((b:string)=>b.trim()).filter(Boolean) : d.bulletPoints;
                          onUpdateProject && onUpdateProject(project.id, { ...d, images: imgs, tags, bulletPoints: bps, isFeatured: d.isFeatured || false }); setEditingProjectId(null); setNotice('Project updated.');
                        }}>SAVE</button>
                        <button className="border border-gray-400 px-4 py-2 text-xs" onClick={() => setEditingProjectId(null)}>CANCEL</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Image gallery strip */}
                      {project.images && project.images.length > 0 && (
                        <div className="flex gap-1 overflow-x-auto p-2 bg-gray-50" style={{scrollbarWidth:'none'}}>
                          {project.images.map((src, i) => (
                            <img key={i} src={src} alt={`${project.title} ${i+1}`} className="h-28 w-40 shrink-0 object-cover rounded-xl border border-gray-200" />
                          ))}
                        </div>
                      )}
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-xl font-bold leading-tight">
                            {project.title}
                            {project.isFeatured && <span className="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">Featured</span>}
                          </h3>
                          <div className="flex gap-2 shrink-0">
                            <button className="text-xs border border-gray-300 px-3 py-1 hover:border-black transition-colors" onClick={() => { setEditingProjectId(project.id); setEditingProjectData({...project, tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags, images: Array.isArray(project.images) ? project.images.join('\n') : project.images || ''}); }}>Edit</button>
                            <button className="text-xs border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50 transition-colors" onClick={() => { if(confirm('Delete this project?')) { onDeleteProject && onDeleteProject(project.id); setNotice('Project deleted.'); } }}>Delete</button>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed">{project.description}</p>
                        {project.bulletPoints && project.bulletPoints.length > 0 && (
                          <ul className="mt-3 space-y-1 text-sm text-gray-700 list-disc list-inside">
                            {project.bulletPoints.map((bp, i) => <li key={i}>{bp}</li>)}
                          </ul>
                        )}
                        {project.tags && project.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => <span key={tag} className="text-[0.65rem] tracking-wider px-2.5 py-1 rounded-full border border-black/20 text-black/60 uppercase font-medium">{tag}</span>)}
                          </div>
                        )}
                        <div className="mt-4 flex flex-wrap gap-3 text-sm font-medium">
                          {project.link && <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 border border-black bg-black text-white px-3 py-1.5 text-xs hover:bg-white hover:text-black transition-colors">View →</a>}
                          {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" className="text-xs border border-gray-300 px-3 py-1.5 hover:border-black transition-colors">GitHub</a>}
                          {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" className="text-xs border border-gray-300 px-3 py-1.5 hover:border-black transition-colors">Live</a>}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === 'blogs' && (
        <>
          <section className="mx-auto max-w-6xl px-8 py-16">
            <div className="mx-auto max-w-3xl">
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
                 <label className="grid gap-2 text-sm font-medium text-gray-800">
                   Or Upload Image (ImgBB)
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={async (e) => {
                         if(e.target.files && e.target.files[0]) {
                             const file = e.target.files[0];
                             const formData = new FormData();
                             formData.append('image', file);
                             try {
                                 setNotice('Uploading image...');
                                 const res = await fetch('http://localhost:5000/api/upload', {
                                     method: 'POST',
                                     body: formData
                                 });
                                 const data = await res.json();
                                 if(data.url) {
                                     setBlogDraft(prev => ({ 
                                         ...prev, 
                                         image: data.url 
                                     }));
                                     setNotice('Image uploaded successfully.');
                                 } else {
                                     setNotice('Upload failed.');
                                 }
                             } catch(err) {
                                 setNotice('Upload error.');
                             }
                         }
                     }}
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

          <section className="mx-auto max-w-6xl border-t border-black px-8 py-16">
            <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Blogs written</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {content.blogs.map((blog) => (
                <div key={blog.id} className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  {editingBlogId === blog.id ? (
                    <div className="grid gap-3 p-5">
                      <p className="text-xs tracking-[0.2em] text-gray-500 uppercase font-semibold">Editing: {blog.title}</p>
                      <input className={inputClassName} value={editingBlogData.title || ''} onChange={e => setEditingBlogData({...editingBlogData, title: e.target.value})} placeholder="Title" />
                      <textarea className={inputClassName} rows={2} value={editingBlogData.excerpt || ''} onChange={e => setEditingBlogData({...editingBlogData, excerpt: e.target.value})} placeholder="Excerpt" />
                      <textarea className={inputClassName} rows={8} value={editingBlogData.content || ''} onChange={e => setEditingBlogData({...editingBlogData, content: e.target.value})} placeholder="Content" />
                      <input className={inputClassName} value={Array.isArray(editingBlogData.tags) ? editingBlogData.tags.join(', ') : editingBlogData.tags || ''} onChange={e => setEditingBlogData({...editingBlogData, tags: e.target.value})} placeholder="Tags" />
                      <label className="text-xs text-gray-600 font-medium">
                        Cover Image URL
                        <input className={inputClassName} value={editingBlogData.image || ''} onChange={e => setEditingBlogData({...editingBlogData, image: e.target.value})} placeholder="https://..." />
                      </label>
                      {editingBlogData.image && <img src={editingBlogData.image} alt="preview" className="h-32 w-full object-cover rounded-xl border border-gray-200" />}
                      <label className="text-xs text-gray-600 font-medium">
                        Upload cover image (ImgBB)
                        <input type="file" accept="image/*" className="mt-1 block text-xs" onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const fd = new FormData(); fd.append('image', e.target.files[0]);
                            const res = await fetch('http://localhost:5000/api/upload', { method: 'POST', body: fd });
                            const d = await res.json();
                            if (d.url) { setEditingBlogData((p:any) => ({...p, image: d.url})); setNotice('Image uploaded.'); }
                          }
                        }} />
                      </label>
                      <div className="flex gap-2 mt-1">
                        <button className="border border-black bg-black text-white px-4 py-2 text-xs" onClick={() => {
                          const d = editingBlogData;
                          const tags = typeof d.tags === 'string' ? d.tags.split(',').map((t:string)=>t.trim()).filter(Boolean) : d.tags;
                          onUpdateBlog && onUpdateBlog(blog.id, { ...d, tags }); setEditingBlogId(null); setNotice('Blog updated.');
                        }}>SAVE</button>
                        <button className="border border-gray-400 px-4 py-2 text-xs" onClick={() => setEditingBlogId(null)}>CANCEL</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Cover image */}
                      {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-36 object-cover" />}
                      <div className="p-5">
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <p className="text-[0.6rem] text-gray-500 tracking-widest uppercase">{blog.publishedAt}</p>
                            <h3 className="text-xl font-bold leading-tight mt-0.5 cursor-pointer hover:underline" onClick={() => setExpandedBlogId(expandedBlogId === blog.id ? null : blog.id)}>
                              {blog.title} <span className="text-gray-400 font-normal text-base">{expandedBlogId === blog.id ? '−' : '+'}</span>
                            </h3>
                          </div>
                          <div className="flex gap-2 shrink-0 flex-col items-end">
                            <div className="flex gap-2">
                              <a href={`/blog/${blog.slug}`} target="_blank" rel="noreferrer" className="text-xs border border-gray-300 px-2 py-1 hover:border-black transition-colors">View →</a>
                              <button className="text-xs border border-gray-300 px-2 py-1 hover:border-black transition-colors" onClick={() => { setEditingBlogId(blog.id); setEditingBlogData({...blog, tags: Array.isArray(blog.tags) ? blog.tags.join(', ') : blog.tags}); setExpandedBlogId(null); }}>Edit</button>
                              <button className="text-xs border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 transition-colors" onClick={() => { if(confirm('Delete this blog?')) { onDeleteBlog && onDeleteBlog(blog.id); setNotice('Blog deleted.'); } }}>Delete</button>
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{blog.excerpt}</p>
                        {blog.tags && blog.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {blog.tags.map((tag) => <span key={tag} className="text-[0.65rem] tracking-wider px-2.5 py-1 rounded-full border border-black/20 text-black/60 uppercase font-medium">{tag}</span>)}
                          </div>
                        )}
                        {expandedBlogId === blog.id && (
                          <div className="mt-5 pt-5 border-t border-gray-200 whitespace-pre-wrap text-sm leading-relaxed text-gray-800">
                            {blog.content}
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {activeTab === 'contacts' && (
        <section className="mx-auto max-w-6xl px-8 py-20">
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
                    <div className="flex items-center gap-3">
                      <p className="text-xs tracking-widest text-gray-500 uppercase">{contact.submittedAt}</p>
                      <button className="text-xs border border-red-300 px-3 py-1 text-red-600 hover:bg-red-50 transition-colors" onClick={() => { if(confirm('Delete this message?')) { onDeleteContact && onDeleteContact(contact.id); setNotice('Contact deleted.'); } }}>Delete</button>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-gray-800">{contact.subject}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700">{contact.message}</p>
                </article>
              ))
            )}
          </div>
        </section>
      )}

      {activeTab === 'peeps' && (
        <section className="mx-auto max-w-6xl px-8 py-16">
          <div className="grid gap-8 lg:grid-cols-2 mb-16">
            <form onSubmit={handlePeepSubmit} className="grid gap-5 rounded-2xl border border-black p-6 md:p-8">
              <div>
                <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Add Peep</p>
                <h2 className="mt-2 text-3xl font-bold">New Peep</h2>
              </div>
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Name
                <input
                  value={peepDraft.name}
                  onChange={(event) => setPeepDraft({ ...peepDraft, name: event.target.value })}
                  className={inputClassName}
                  placeholder="John Doe"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Date of Birth
                <input
                  type="date"
                  value={toDateInput(peepDraft.dob)}
                  onChange={(event) => setPeepDraft({ ...peepDraft, dob: fromDateInput(event.target.value) })}
                  className={inputClassName}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Contact
                <input
                  value={peepDraft.contact}
                  onChange={(event) => setPeepDraft({ ...peepDraft, contact: event.target.value })}
                  className={inputClassName}
                  placeholder="Phone or Email"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium text-gray-800">
                Address
                <textarea
                  value={peepDraft.address}
                  onChange={(event) => setPeepDraft({ ...peepDraft, address: event.target.value })}
                  rows={2}
                  className={inputClassName}
                  placeholder="Location"
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 border border-black bg-black px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black"
              >
                SAVE PEEP
              </button>
            </form>

            <div className="flex flex-col gap-5">
              <div>
                <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Coming up</p>
                <h2 className="mt-2 text-3xl font-bold">Next 7 Birthdays</h2>
              </div>
              <div className="grid gap-4">
                {next7Birthdays.length === 0 ? (
                   <p className="text-sm text-gray-700">No peeps found.</p>
                ) : (
                  next7Birthdays.map(peep => (
                    <div key={peep.id} className="rounded-2xl border border-black p-5 flex flex-col gap-2 bg-[#f4efe7]">
                      <div className="flex justify-between items-center">
                         <h3 className="text-xl font-bold">{peep.name}</h3>
                         <p className="text-sm font-medium text-black">
                           {peep.diffDays === 0 ? "Today!" : `In ${peep.diffDays} day${peep.diffDays === 1 ? '' : 's'}`}
                         </p>
                      </div>
                      <p className="text-sm text-gray-700">{peep.dob}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <p className="text-xs tracking-[0.22em] text-gray-600 uppercase">Peeps Directory</p>
          <div className="mt-6 space-y-12">
            {Object.entries(
              (content.peeps || []).reduce((acc, peep) => {
                let monthName = "Unknown";
                if (peep.dob) {
                  const parts = peep.dob.split('/');
                  if (parts.length >= 2) {
                    const monthNum = parseInt(parts[1], 10);
                    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    if (monthNum >= 1 && monthNum <= 12) {
                      monthName = monthNames[monthNum - 1];
                    }
                  }
                }
                if (!acc[monthName]) acc[monthName] = [];
                acc[monthName].push(peep);
                return acc;
              }, {} as Record<string, typeof content.peeps>)
            )
              .sort(([a], [b]) => {
                const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Unknown"];
                return monthNames.indexOf(a) - monthNames.indexOf(b);
              })
              .map(([month, peeps]) => (
              <div key={month}>
                <h2 className="text-3xl font-bold border-b border-black pb-2 mb-6">{month}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {peeps
                    .sort((a, b) => {
                      const dayA = a.dob ? parseInt(a.dob.split('/')[0], 10) : 0;
                      const dayB = b.dob ? parseInt(b.dob.split('/')[0], 10) : 0;
                      return (isNaN(dayA) ? 0 : dayA) - (isNaN(dayB) ? 0 : dayB);
                    })
                    .map(peep => (
                    <div key={peep.id} className="rounded-2xl border border-black p-5 flex flex-col gap-2">
                      {editingPeepId === peep.id ? (
                        <div className="grid gap-2">
                          <input className={inputClassName} value={editingPeepData.name || ''} onChange={e => setEditingPeepData({...editingPeepData, name: e.target.value})} placeholder="Name" />
                          <input type="date" className={inputClassName} value={toDateInput(editingPeepData.dob || '')} onChange={e => setEditingPeepData({...editingPeepData, dob: fromDateInput(e.target.value)})} />
                          <input className={inputClassName} value={editingPeepData.contact || ''} onChange={e => setEditingPeepData({...editingPeepData, contact: e.target.value})} placeholder="Contact" />
                          <textarea className={inputClassName} rows={2} value={editingPeepData.address || ''} onChange={e => setEditingPeepData({...editingPeepData, address: e.target.value})} placeholder="Address" />
                          <div className="flex gap-2 mt-1">
                            <button className="border border-black bg-black text-white px-4 py-1.5 text-xs" onClick={() => { onUpdatePeep && onUpdatePeep(peep.id, editingPeepData); setEditingPeepId(null); setNotice('Peep updated.'); }}>SAVE</button>
                            <button className="border border-gray-400 px-4 py-1.5 text-xs" onClick={() => setEditingPeepId(null)}>CANCEL</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex justify-between items-start gap-2">
                            <h3 className="text-xl font-bold">{peep.name}</h3>
                            <div className="flex gap-2 shrink-0">
                              <button className="text-xs border border-gray-300 px-2 py-1 hover:border-black transition-colors" onClick={() => { setEditingPeepId(peep.id); setEditingPeepData({...peep}); }}>Edit</button>
                              <button className="text-xs border border-red-300 px-2 py-1 text-red-600 hover:bg-red-50 transition-colors" onClick={() => { if(confirm('Delete this peep?')) { onDeletePeep && onDeletePeep(peep.id); setNotice('Peep deleted.'); } }}>Del</button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-700 space-y-1">
                            {peep.dob && <p><span className="font-medium text-black">DOB:</span> {peep.dob}</p>}
                            {peep.contact && <p><span className="font-medium text-black">Contact:</span> {peep.contact}</p>}
                            {peep.address && <p><span className="font-medium text-black">Address:</span> {peep.address}</p>}
                          </div>
                        </>
                      )}
                      </div>
                  ))}
                </div>
              </div>
            ))}
            {(!content.peeps || content.peeps.length === 0) && (
               <p className="text-sm text-gray-700">No peeps found.</p>
            )}
          </div>
        </section>
      )}

      {activeTab === 'visitors' && (
        <div className="mx-auto max-w-6xl px-8 py-16 space-y-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-4xl font-black tracking-tighter uppercase">Visitor Logs</h2>
              <p className="text-gray-500 mt-2">Real-time tracking of site interactions.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={fetchVisitors} className="border border-black px-6 py-2 text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors">Refresh</button>
              <button onClick={deleteAllVisitors} className="border border-red-600 bg-red-600 text-white px-6 py-2 text-xs font-bold uppercase hover:bg-white hover:text-red-600 transition-colors">Delete All Logs</button>
            </div>
          </div>

          {isLoadingVisitors ? (
            <p>Loading visitor data...</p>
          ) : (
            <div className="grid gap-6">
              {visitors.length === 0 ? (
                <p className="text-gray-400 italic">No visitor logs found.</p>
              ) : (
                <div className="overflow-x-auto border border-black/10 rounded-2xl bg-white shadow-sm">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-black/10">
                      <tr>
                        <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Visitor Info</th>
                        <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Location</th>
                        <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Device/Browser</th>
                        <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Session</th>
                        <th className="px-6 py-4 text-[0.65rem] font-black uppercase tracking-widest text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/5">
                      {visitors.map((v) => (
                        <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <p className="font-bold text-sm">{v.ip}</p>
                            <p className="text-[0.65rem] text-gray-400 mt-1 uppercase tracking-tighter">{v.path}</p>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">📍</span>
                              <div>
                                <p className="font-bold text-sm">{v.location?.city || 'Unknown'}</p>
                                <p className="text-xs text-gray-500">{v.location?.region}, {v.location?.country}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs truncate max-w-[200px] text-gray-600" title={v.userAgent}>{v.userAgent}</p>
                            <p className="text-[0.65rem] text-gray-400 mt-1 uppercase">{v.screenWidth}x{v.screenHeight} • {v.language}</p>
                          </td>
                          <td className="px-6 py-5">
                            <p className="text-xs font-bold">{new Date(v.startTime).toLocaleString()}</p>
                            <p className="text-[0.65rem] text-blue-600 font-black mt-1 uppercase">
                              {v.duration ? `${v.duration}s stayed` : 'Ongoing...'}
                            </p>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button onClick={() => deleteVisitor(v.id)} className="text-red-600 hover:text-red-800 transition-colors">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
