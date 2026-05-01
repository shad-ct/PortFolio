import { useEffect, useState } from 'react'

import AdminPage from './AdminPage'
import BlogPage from './BlogPage'
import HomePage from './HomePage'
import {
  addBlogEntry,
  addContactEntry,
  addProjectEntry,
  loadSiteContent,
  saveSiteContent,
} from './lib/siteData'

function App() {
  const [siteContent, setSiteContent] = useState(() => loadSiteContent())

  useEffect(() => {
    saveSiteContent(siteContent)
  }, [siteContent])

  const pathname = typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/'

  if (pathname.startsWith('/blog/')) {
    const slug = decodeURIComponent(pathname.split('/').filter(Boolean)[1] ?? '')
    return <BlogPage blogs={siteContent.blogs} slug={slug} />
  }

  if (pathname === '/admin') {
    return (
      <AdminPage
        content={siteContent}
        onAddProject={(draft) => setSiteContent((currentContent) => addProjectEntry(currentContent, draft))}
        onAddBlog={(draft) => setSiteContent((currentContent) => addBlogEntry(currentContent, draft))}
      />
    )
  }

  return <HomePage projects={siteContent.projects} blogs={siteContent.blogs} onContactSubmit={(draft) => setSiteContent((currentContent) => addContactEntry(currentContent, draft))} />
}

export default App
