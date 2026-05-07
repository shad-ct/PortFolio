import { useEffect, useState } from "react";
import AdminPage from "./AdminPage";
import BlogPage from "./BlogPage";
import HomePage from "./HomePage";
import ProjectsPage from "./ProjectsPage";

import type { SiteContent } from "./lib/types";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

function VisitorTracker() {
  const [consent, setConsent] = useState<boolean | null>(() => {
    const saved = localStorage.getItem('analytics-consent');
    return saved ? JSON.parse(saved) : null;
  });
  const [visitorId, setVisitorId] = useState<string | null>(null);

  useEffect(() => {
    if (consent === true) {
      // Log visit
      const logVisit = async () => {
        try {
          const res = await fetch(`${API_BASE}/visitors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path: window.location.pathname,
              screenWidth: window.screen.width,
              screenHeight: window.screen.height,
              language: navigator.language
            })
          });
          if (res.ok) {
            const data = await res.json();
            setVisitorId(data.id);
          }
        } catch (err) {
          console.error('Tracking error:', err);
        }
      };

      logVisit();

      // Update duration on exit
      const updateDuration = () => {
        if (visitorId) {
          navigator.sendBeacon(`${API_BASE}/visitors`, JSON.stringify({ id: visitorId }));
        }
      };

      window.addEventListener('beforeunload', updateDuration);
      return () => window.removeEventListener('beforeunload', updateDuration);
    }
  }, [consent, visitorId]);

  if (consent === null) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999] max-w-sm rounded-2xl border border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="mb-2 font-black uppercase">Analytics Consent</h3>
        <p className="mb-4 text-xs leading-relaxed text-gray-600">
          We collect anonymous data (IP, location, duration) to improve the experience. Is that okay?
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setConsent(true);
              localStorage.setItem('analytics-consent', 'true');
            }}
            className="flex-1 border border-black bg-black px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-white hover:text-black"
          >
            YES, TRACK ME
          </button>
          <button
            onClick={() => {
              setConsent(false);
              localStorage.setItem('analytics-consent', 'false');
            }}
            className="flex-1 border border-black bg-white px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-black hover:text-white"
          >
            NO
          </button>
        </div>
      </div>
    );
  }

  return null;
}

function App() {
  const [siteContent, setSiteContent] = useState<SiteContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from MongoDB on mount
  useEffect(() => {
    async function fetchData() {
      try {
        const [projectsRes, blogsRes, contactsRes, peepsRes] = await Promise.all([
          fetch(`${API_BASE}/projects`),
          fetch(`${API_BASE}/blogs`),
          fetch(`${API_BASE}/contacts`),
          fetch(`${API_BASE}/peeps`)
        ]);

        if (projectsRes.ok && blogsRes.ok && contactsRes.ok && peepsRes.ok) {
          const projects = await projectsRes.json();
          const blogs = await blogsRes.json();
          const contacts = await contactsRes.json();
          const peeps = await peepsRes.json();
          // Set content strictly from MongoDB
          setSiteContent({ projects, blogs, contacts, peeps });
        } else {
          console.error("Failed to fetch data from API. Is the backend running?");
          setSiteContent({ projects: [], blogs: [], contacts: [], peeps: [] });
        }
      } catch (err) {
        console.error("API connection error:", err);
        setSiteContent({ projects: [], blogs: [], contacts: [], peeps: [] });
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const handleAddProject = async (draft: any) => {
    try {
      const parsedImages = draft.images.split('\n').map((u: string) => u.trim()).filter(Boolean);
      
      const payload = {
          title: draft.title.trim(),
          description: draft.description.trim(),
          link: draft.link.trim(),
          githubLink: draft.githubLink?.trim() || "",
          liveLink: draft.liveLink?.trim() || "",
          tags: draft.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          images: parsedImages,
          bulletPoints: draft.bulletPoints.split('\n').map((b: string) => b.trim()).filter(Boolean),
          isFeatured: draft.isFeatured || false
      };

      const res = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newProject = await res.json();
        setSiteContent(prev => prev ? { ...prev, projects: [newProject, ...prev.projects] } : null);
      }
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  const handleAddBlog = async (draft: any) => {
    try {
       const slug = draft.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
       const payload = {
          title: draft.title.trim(),
          slug: slug || `post-${Date.now()}`,
          excerpt: draft.excerpt.trim(),
          content: draft.content.trim(),
          tags: draft.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
          image: draft.image?.trim() || undefined,
          publishedAt: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
       };

       const res = await fetch(`${API_BASE}/blogs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const newBlog = await res.json();
        setSiteContent(prev => prev ? { ...prev, blogs: [newBlog, ...prev.blogs] } : null);
      }
    } catch (err) {
      console.error("Error adding blog:", err);
    }
  };

  const handleContactSubmit = async (formData: any) => {
       try {
           const res = await fetch(`${API_BASE}/contacts`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
           });
           if(res.ok) {
               // Assuming you don't need to immediately update frontend state for contacts unless admin page is open
           }
       } catch (err) {
           console.error("Contact submission error", err);
           throw err;
       }
  }

  const handleAddPeep = async (draft: any) => {
    try {
      const res = await fetch(`${API_BASE}/peeps`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft)
      });
      if (res.ok) {
        const newPeep = await res.json();
        setSiteContent(prev => prev ? { ...prev, peeps: [newPeep, ...(prev.peeps || [])] } : null);
      }
    } catch (err) {
      console.error("Error adding peep:", err);
    }
  };

  const handleUpdateProject = async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) {
        const updated = await res.json();
        setSiteContent(prev => prev ? { ...prev, projects: prev.projects.map(p => p.id === id ? updated : p) } : null);
      }
    } catch (err) { console.error("Error updating project:", err); }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/projects/${id}`, { method: 'DELETE' });
      if (res.ok) setSiteContent(prev => prev ? { ...prev, projects: prev.projects.filter(p => p.id !== id) } : null);
    } catch (err) { console.error("Error deleting project:", err); }
  };

  const handleUpdateBlog = async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) {
        const updated = await res.json();
        setSiteContent(prev => prev ? { ...prev, blogs: prev.blogs.map(b => b.id === id ? updated : b) } : null);
      }
    } catch (err) { console.error("Error updating blog:", err); }
  };

  const handleDeleteBlog = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/blogs/${id}`, { method: 'DELETE' });
      if (res.ok) setSiteContent(prev => prev ? { ...prev, blogs: prev.blogs.filter(b => b.id !== id) } : null);
    } catch (err) { console.error("Error deleting blog:", err); }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/contacts/${id}`, { method: 'DELETE' });
      if (res.ok) setSiteContent(prev => prev ? { ...prev, contacts: prev.contacts.filter(c => c.id !== id) } : null);
    } catch (err) { console.error("Error deleting contact:", err); }
  };

  const handleUpdatePeep = async (id: string, data: any) => {
    try {
      const res = await fetch(`${API_BASE}/peeps/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (res.ok) {
        const updated = await res.json();
        setSiteContent(prev => prev ? { ...prev, peeps: (prev.peeps || []).map(p => p.id === id ? updated : p) } : null);
      }
    } catch (err) { console.error("Error updating peep:", err); }
  };

  const handleDeletePeep = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/peeps/${id}`, { method: 'DELETE' });
      if (res.ok) setSiteContent(prev => prev ? { ...prev, peeps: (prev.peeps || []).filter(p => p.id !== id) } : null);
    } catch (err) { console.error("Error deleting peep:", err); }
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f4efe7]">Loading...</div>;
  }

  if (!siteContent) return null;

  const pathname = typeof window === "undefined" ? "/" : window.location.pathname.replace(/\/$/, "") || "/";

  if (pathname.startsWith("/blog/")) {
    const slug = decodeURIComponent(pathname.split("/").filter(Boolean)[1] ?? "");
    return <BlogPage blogs={siteContent.blogs} slug={slug} />;
  }

  if (pathname === "/projects") {
    // We need to import ProjectsPage (we will do this at the top)
    return <ProjectsPage projects={siteContent.projects} />;
  }

  if (pathname === "/admin") {
    return (
      <AdminPage
        content={siteContent}
        onAddProject={handleAddProject}
        onAddBlog={handleAddBlog}
        onAddPeep={handleAddPeep}
        onUpdateProject={handleUpdateProject}
        onDeleteProject={handleDeleteProject}
        onUpdateBlog={handleUpdateBlog}
        onDeleteBlog={handleDeleteBlog}
        onDeleteContact={handleDeleteContact}
        onUpdatePeep={handleUpdatePeep}
        onDeletePeep={handleDeletePeep}
      />
    );
  }

  return (
    <>
      <VisitorTracker />
      <HomePage projects={siteContent.projects} blogs={siteContent.blogs} onContactSubmit={handleContactSubmit} />
    </>
  );
}

export default App;
