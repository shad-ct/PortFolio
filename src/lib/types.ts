export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

export type EducationEntry = {
  institution: string;
  qualification: string;
  period: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  link?: string;
  logo?: string;
};

export type ResumeProfile = {
  name: string;
  title: string;
  summary: string;
  contacts: ContactLink[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  skills: string[];
  interests: string[];
  software: string[];
  languages: string[];
};

export type ProjectEntry = {
  id: string;
  title: string;
  description: string;
  link: string;
  githubLink?: string;
  liveLink?: string;
  tags: string[];
  images?: string[];
  bulletPoints: string[];
  isFeatured?: boolean;
};

export type ProjectDraft = {
  title: string;
  description: string;
  link: string;
  githubLink: string;
  liveLink: string;
  tags: string;
  images: string;
  bulletPoints: string;
  isFeatured: boolean;
};

export type BlogEntry = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
  publishedAt: string;
};

export type BlogDraft = {
  title: string;
  excerpt: string;
  content: string;
  tags: string;
  image: string;
};

export type ContactEntry = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  submittedAt: string;
};

export type ContactDraft = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type PeepEntry = {
  id: string;
  name: string;
  dob?: string;
  contact?: string;
  address?: string;
};

export type PeepDraft = {
  name: string;
  dob: string;
  contact: string;
  address: string;
};

export type SiteContent = {
  projects: ProjectEntry[];
  blogs: BlogEntry[];
  contacts: ContactEntry[];
  peeps: PeepEntry[];
};

export const resumeProfile: ResumeProfile = {
  name: 'Shad C T',
  title: 'FULL STACK DEVELOPER (MERN)',
  summary:
    "Hi, I'm Shad CT, currently pursuing a five-year integrated master's program in Computational Science at Kannur University, Mangattuparamba Campus. I'm passionate about tinkering, creating new things, reading, coding, and psychology. I love learning new things and am currently focusing on the MERN stack. I thrive on solving problems and continuously expanding my knowledge.",
  contacts: [
    {
      label: 'Email',
      value: 'contactshadct@gmail.com',
      href: 'mailto:contactshadct@gmail.com',
    },
    {
      label: 'GitHub',
      value: 'github.com/shad-ct',
      href: 'https://github.com/shad-ct/',
    },
    {
      label: 'LinkedIn',
      value: 'linkedin.com/in/shad-c-t',
      href: 'https://www.linkedin.com/in/shad-c-t',
    },
    {
      label: 'Telegram',
      value: 't.me/shad_ct',
      href: 'https://t.me/shad_ct',
    },
  ],
  education: [
    {
      institution: 'Kannur University, Mangattuparamba Campus',
      qualification: "Five Year Integrated Master's Program in Computational Science",
      period: 'Jun 2024 - Present',
    },
    {
      institution: 'GHSS Cherukunnu',
      qualification: 'High School Diploma, Biology, General (Grade: 96%)',
      period: 'Jun 2022 - Mar 2024',
    },
    {
      institution: 'GBHSS Cherukunnu',
      qualification: '10th Grade (Full A+ / 100%)',
      period: '2021 - 2022',
    },
  ],
  experience: [
    {
      company: 'IOTRICS',
      role: 'React Developer · Part-time · Hybrid',
      period: 'Sep 2025 - Present',
      link: 'https://www.iotrics.com/',
      logo: 'https://iotrics.com/iotrics_final2.png',
    },
    {
      company: 'AltezzAi',
      role: 'Junior React Developer · Part-time · Hybrid',
      period: 'Nov 2024 - Present',
      link: 'https://altezzai.com/',
      logo: '/altezzai.png',
    },
    {
      company: 'TinkerHub',
      role: 'Campus Lead · Full-time · On-site',
      period: 'Jul 2025 - Junly 2026',
      link: 'https://tinkerhub.org/',
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAM1BMVEX5ov73nf73nP73nP/9oP/Rhdh0Snd6Tn6hZqeNWpIAAABMME7ok/CycbgWDxddO2AtHS8gSpxXAAAAA3RSTlMLjO4mpzMHAAAAo0lEQVR4AY2TgQrFIAhFW1alM9f/f+3bWg8yNtkBJDgQNzXnNg+P+O108Mrm/Lv0Dgw+yfCnH7WMKd8UiJhTnGVINNi5njWFWeZJClFWEkk6dHBtQjhLiHUQgXtVaVkBKlDZFWUJpMi2/HqtGQi4XnAYb9HtQ5EmLQaixLURPgS65MFFlkDpltDlaLweGXLAXCFiWto3D3oatoEtzdU0l9r6Dj/J0BAy4aiu1QAAAABJRU5ErkJggg==',
    },
    {
      company: 'DevDopz',
      role: 'Intern · Part-time · Remote',
      period: 'Sep 2024 - Dec 2024',
      link: 'https://devdopz.com/',
      logo: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAPFBMVEVHcEz///////////////////////////////9xkv8FWP8WXv9Pe/++zP+vwP8taP8kY/+itv/h5//R2v+kCTLBAAAACXRSTlMAT5bK6/8TpZF0qzNcAAAA4klEQVR4AYXTYQ/EEAwG4Bo1MGr7///1JM2quXPxfGqyN10BKOawDtHZw8CCP1E5PXwJ+CWA5h3+cF59xyW/+T4TDv9w6/mUoH4QUxbl0j/h9dfUJkoR2TkCXF2JxIikigzAIOtRNBoJZAYO/BWp5crlARYXqFHkysomFB6M9ZF4twJZzS3dEriyDPEGem55Bh4VcNJBBaoEHNhVh0KtvEMeiw5PatTfZRrpQP1ho5aJDYB0aJQZjbIg48PiDgplZKcc953ylMqt71TgxDXJtGF/5faXdn/t9w9n//R2j3fz/D/VyxcoYPuxNgAAAABJRU5ErkJggg==',
    },
  ],
  skills: [
    'JavaScript',
    'TypeScript',
    'C',
    'PHP',
    'Node.js',
    'Express.js',
    'MongoDB',
    'React',
    'Python',
    'TailwindCSS',
  ],
  interests: ['Tinkering', 'Creating new things', 'Reading', 'Coding', 'Psychology'],
  software: ['MERN', 'React', 'Node.js', 'Express.js', 'MongoDB', 'Python', 'TailwindCSS'],
  languages: ['English', 'Malayalam', 'Hindi'],
};

const ADMIN_AUTH_KEY = 'portfolio-admin-auth';
export const ADMIN_USERNAME = 'admin';
export const ADMIN_PASSWORD = 'rootSD';

export function isAdminAuthenticated() {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.localStorage.getItem(ADMIN_AUTH_KEY) === 'true';
}

export function setAdminAuthenticated(status: boolean) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(ADMIN_AUTH_KEY, status ? 'true' : 'false');
}
