import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate, useParams, Routes, Route, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import './original.css';
import './app.css';

const fallback = {
  about: {
    name: '',
    title: '',
    bio: 'Profile bio not set yet. Update this from the admin dashboard.',
    profile_image: '',
    location: '',
    email: '',
    github_url: '',
    linkedin_url: ''
  },
  skills: [
    ['JavaScript', 'Frontend', 90],
    ['React', 'Frontend', 85],
    ['Node.js', 'Backend', 88],
    ['Express', 'Backend', 88],
    ['PostgreSQL', 'Database', 85],
    ['AWS', 'Cloud', 75],
    ['Git & GitHub', 'Tools', 90]
  ].map(([name, category, proficiency], i) => ({ id: i, name, category, proficiency })),
  projects: [
    {
      id: '1',
      title: 'NSA Evaluation Appointment System',
      slug: 'nsa-evaluation-system',
      short_description: 'A digital appointment and evaluation workflow for students and administrators.',
      case_study: 'A full-stack platform that replaces manual appointment scheduling with structured student booking, admin scheduling and evaluation management.',
      technologies: ['Node.js', 'Express', 'PostgreSQL', 'EJS'],
      status: 'Completed',
      featured: true
    },
    {
      id: '2',
      title: 'Expense Tracker',
      slug: 'expense-tracker',
      short_description: 'Income, expense and financial summary application.',
      case_study: 'A database-backed expense tracker with authentication, transaction management and dashboard summaries.',
      technologies: ['Node.js', 'Express', 'PostgreSQL'],
      status: 'Completed',
      featured: true
    },
    {
      id: '3',
      title: 'Student Management System',
      slug: 'student-management-system',
      short_description: 'CRUD student management backed by PostgreSQL.',
      case_study: 'A clean CRUD system for managing student records.',
      technologies: ['Node.js', 'PostgreSQL', 'JavaScript'],
      status: 'Completed'
    }
  ],
  experience: [],
  education: [],
  certifications: [],
  services: [
    { id: 1, title: 'Full Stack Development', description: 'Responsive web applications with clean APIs, authentication and PostgreSQL.', icon: '01' },
    { id: 2, title: 'Backend Development', description: 'Node.js and Express services designed around reliable data flows.', icon: '02' },
    { id: 3, title: 'Cloud & DevOps', description: 'Practical AWS, deployment and serverless-ready architectures.', icon: '03' }
  ]
};

async function api(path, opts = {}) {
  const response = await fetch('/api' + path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers || {})
    },
    ...opts
  });

  if (response.status === 204) return null;
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text.slice(0, 160) || 'Unexpected server response' };
    }
  }
  if (!response.ok) throw new Error((data && data.error) || 'Request failed');
  return data;
}

const portfolioCacheKey = (key) => `portfolio:${key}`;

function readCachedData(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(portfolioCacheKey(key));
    if (raw === null) return fallbackValue;
    return JSON.parse(raw);
  } catch {
    return fallbackValue;
  }
}

function writeCachedData(key, value) {
  try {
    localStorage.setItem(portfolioCacheKey(key), JSON.stringify(value));
  } catch {
    // ignore storage failures
  }
}

function publishDataUpdate(key, value) {
  writeCachedData(key, value);
  window.dispatchEvent(new CustomEvent('portfolio:data:update', { detail: { key, value } }));
}

function useData(path, key) {
  const fallbackValue = fallback[key] ?? [];
  const [data, setData] = useState(() => readCachedData(key, fallbackValue));

  useEffect(() => {
    let active = true;

    const apply = (next) => {
      if (active) {
        setData(next);
        writeCachedData(key, next);
      }
    };

    const sync = async () => {
      const cached = readCachedData(key, fallbackValue);
      if (cached !== fallbackValue && active) setData(cached);

      try {
        const result = await api(path);
        const next = Array.isArray(result)
          ? result
          : result && Array.isArray(result.items)
            ? result.items
            : result && typeof result === 'object'
              ? result
              : fallbackValue;
        apply(next);
        publishDataUpdate(key, next);
      } catch {
        if (active) setData(cached);
      }
    };

    sync();

    const onUpdate = (event) => {
      if (event.detail?.key === key && active) {
        setData(event.detail.value);
      }
    };

    window.addEventListener('portfolio:data:update', onUpdate);
    return () => {
      active = false;
      window.removeEventListener('portfolio:data:update', onUpdate);
    };
  }, [path, key, fallbackValue]);

  return data;
}

function Theme() {
  const [dark, setDark] = useState(() => localStorage.getItem('oc-theme') !== 'light');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    localStorage.setItem('oc-theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button className="theme-btn" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
      {dark ? '☀' : '◐'}
    </button>
  );
}

function getInitials(name = 'Portfolio') {
  return (name || 'Portfolio').split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join('').toUpperCase() || 'P';
}

function resolveImageUrl(url) {
  if (!url) return '';
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  if (url.startsWith('/uploads')) return url;
  if (url.startsWith('/')) return `${window.location.origin}${url}`;
  return url;
}

function Navbar() {
  return (
    <nav className="oc-nav">
      <div className="oc-nav-inner">
        <Link to="/" className="logo"><span className="brand-mark" aria-label="Home"></span></Link>
        <div className="nav-links">
          {[['/', 'Home'], ['/about', 'About'], ['/skills', 'Skills'], ['/experience', 'Experience'], ['/projects', 'Projects'], ['/services', 'Services'], ['/contact', 'Contact']].map(([u, l]) => (
            <Link key={u} to={u}>{l}</Link>
          ))}
        </div>
        <Theme />
      </div>
    </nav>
  );
}

function Shell({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <footer className="footer">© {new Date().getFullYear()} • Built with React, Node.js & PostgreSQL</footer>
    </>
  );
}

const fade = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55 } }
};

function Section({ title, kicker, children }) {
  return (
    <section className="section">
      <div className="container">
        <motion.div {...fade}>
          <div className="kicker">{kicker}</div>
          <h2>{title}</h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}

function Stat({ n, l }) {
  return (
    <div className="stat glass">
      <strong>{n}</strong>
      <span>{l}</span>
    </div>
  );
}

function ProjectCard({ p }) {
  return (
    <motion.article className="glass project-card" whileHover={{ y: -5 }}>
      {/* NEW: Show project image if available */}
      {p.image_url && (
        <div className="project-image" style={{
          width: '100%',
          height: '200px',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '1rem',
          backgroundColor: '#1a1a1a'
        }}>
          <img 
            src={p.image_url} 
            alt={p.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        </div>
      )}
      <div className="project-top">
        <span>{p.status}</span>
        {p.featured && <b>Featured</b>}
      </div>
      <h3>{p.title}</h3>
      <p>{p.short_description}</p>
      <div className="tags">{(p.technologies || []).map((t) => <span key={t}>{t}</span>)}</div>
      <Link to={'/projects/' + p.slug} className="text-link">View case study →</Link>
    </motion.article>
  );
}

function Home() {
  const about = useData('/about', 'about');
  const projects = useData('/projects', 'projects');
  const skills = useData('/skills', 'skills');
  const services = useData('/services', 'services');

  return (
    <Shell>
      <section className="hero">
        <div className="hero-copy">
          <div className="kicker">SOFTWARE ENGINEER · CLOUD · SECURITY</div>
          <motion.h1 {...fade}>Building digital products with <span>code, clarity and purpose.</span></motion.h1>
          <p>{about.bio}</p>
          <div className="actions">
            <Link className="btn primary" to="/projects">Explore projects</Link>
            <Link className="btn ghost" to="/contact">Let's connect</Link>
          </div>
          <div className="tech-orbit">{['React', 'Node.js', 'PostgreSQL', 'AWS', 'Git'].map((x, i) => <span style={{ '--i': i }} key={x}>{x}</span>)}</div>
        </div>

        <div className="hero-card glass">
          {about.profile_image ? <img src={resolveImageUrl(about.profile_image)} alt={about.name} /> : <div className="avatar-badge">{getInitials(about.name)}</div>}
          <div>
            <strong>{about.name}</strong>
            <small>{about.title}</small>
          </div>
        </div>
      </section>

      <Section kicker="ABOUT" title="A developer focused on useful software">
        <div className="split">
          <div className="glass card">
            <p>{about.bio}</p>
            <div className="mini-grid">
              <span>Location<strong>{about.location}</strong></span>
              <span>Focus<strong>Full Stack</strong></span>
            </div>
          </div>
          <div className="stats">
            <Stat n={projects.length} l="Projects" />
            <Stat n={skills.length} l="Skills" />
            <Stat n={services.length} l="Services" />
            <Stat n="24/7" l="Curiosity" />
          </div>
        </div>
      </Section>

      <Section kicker="SELECTED WORK" title="Projects">
        <div className="project-grid">
          {projects.filter((p) => p.published !== false).slice(0, 3).map((p) => <ProjectCard p={p} key={p.id} />)}
        </div>
      </Section>

      <Section kicker="SERVICES" title="What I can build">
        <div className="service-grid">
          {services.filter((s) => s.published !== false).slice(0, 3).map((s) => (
            <div className="glass service" key={s.id}>
              <span>{s.icon || '01'}</span>
              <h3>{s.title}</h3>
              <p>{s.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </Shell>
  );
}

function About() {
  const a = useData('/about', 'about');

  return (
    <Shell>
      <Section kicker="ABOUT ME" title={a.title}>
        <div className="profile-layout">
          {a.profile_image ? <img className="profile" src={resolveImageUrl(a.profile_image)} alt={a.name} /> : <div className="profile-badge">{getInitials(a.name)}</div>}
          <div className="glass card">
            <h3>{a.name}</h3>
            <p>{a.bio}</p>
            <p>{a.location} · {a.email}</p>
            <div className="actions">
              <a className="btn ghost" href={a.github_url || '#'} target="_blank" rel="noreferrer">GitHub</a>
              <a className="btn ghost" href={a.linkedin_url || '#'} target="_blank" rel="noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>
      </Section>
    </Shell>
  );
}

function Skills() {
  const skills = useData('/skills', 'skills');
  const groups = [...new Set(skills.map((s) => s.category))];

  return (
    <Shell>
      <Section kicker="CAPABILITIES" title="Skills">
        <div className="skill-groups">
          {groups.map((g) => (
            <div className="glass card" key={g}>
              <h3>{g}</h3>
              {skills.filter((s) => s.category === g).map((s) => (
                <div className="skill" key={s.id || s.name}>
                  <div>
                    <span>{s.name}</span>
                    <b>{s.proficiency}%</b>
                  </div>
                  <div className="bar"><i style={{ width: `${s.proficiency}%` }} /></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </Section>
    </Shell>
  );
}

function Experience() {
  const items = useData('/experience', 'experience');

  return (
    <Shell>
      <Section kicker="JOURNEY" title="Experience">
        <div className="timeline">
          {items.length ? items.map((x) => (
            <div className="timeline-item" key={x.id}>
              <div className="dot" />
              <div className="glass card">
                <span>{x.start_date} — {x.current ? 'Present' : x.end_date || 'Now'}</span>
                <h3>{x.job_title}</h3>
                <b>{x.company}</b>
                <p>{x.description}</p>
                {(x.achievements || []).map((a) => <li key={a}>{a}</li>)}
              </div>
            </div>
          )) : <Empty text="Add your experience from the admin dashboard." />}
        </div>
      </Section>
    </Shell>
  );
}

function Education() {
  const items = useData('/education', 'education');

  return (
    <Shell>
      <Section kicker="EDUCATION" title="Education">
        <div className="project-grid">
          {items.length ? items.map((x) => (
            <div className="glass card" key={x.id}>
              <h3>{x.degree}</h3>
              <b>{x.institution}</b>
              <p>{x.field}</p>
              <span>{x.start_date} — {x.end_date}</span>
              <p>{x.description}</p>
            </div>
          )) : <Empty text="Add education from the admin dashboard." />}
        </div>
      </Section>
    </Shell>
  );
}

function Certifications() {
  const items = useData('/certifications', 'certifications');

  return (
    <Shell>
      <Section kicker="CERTIFICATIONS" title="Certifications">
        <div className="project-grid">
          {items.length ? items.map((x) => (
            <div className="glass card" key={x.id}>
              <h3>{x.name}</h3>
              <b>{x.issuer}</b>
              <p>{x.issue_date}</p>
              {x.credential_url && <a className="text-link" href={x.credential_url} target="_blank" rel="noreferrer">Verify credential →</a>}
            </div>
          )) : <Empty text="Add certifications from the admin dashboard." />}
        </div>
      </Section>
    </Shell>
  );
}

function Services() {
  const items = useData('/services', 'services');

  return (
    <Shell>
      <Section kicker="SERVICES" title="How I help">
        <div className="service-grid">
          {items.filter((x) => x.published !== false).map((x) => (
            <div className="glass service" key={x.id}>
              <span>{x.icon || '01'}</span>
              <h3>{x.title}</h3>
              <p>{x.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </Shell>
  );
}

function Projects() {
  const items = useData('/projects', 'projects');

  return (
    <Shell>
      <Section kicker="PORTFOLIO" title="Projects">
        <div className="project-grid">
          {items.filter((x) => x.published !== false).map((p) => <ProjectCard p={p} key={p.id} />)}
        </div>
      </Section>
    </Shell>
  );
}

function ProjectDetails() {
  const { slug } = useParams();
  const [p, setP] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setP(null);
    setError('');
    api('/projects?slug=' + encodeURIComponent(slug))
      .then(setP)
      .catch((err) => setError(err.message || 'Project not found.'));
  }, [slug]);

  if (error) {
    return <Shell><Section kicker="PROJECT" title="Project not found"><Empty text={error} /></Section></Shell>;
  }

  if (!p) {
    return <Shell><Section kicker="PROJECT" title="Loading…" /></Shell>;
  }

  return (
    <Shell>
      <Section kicker={p.status} title={p.title}>
        <div className="case-study glass card">
          <p className="lead">{p.short_description}</p>
          <div className="tags">{(p.technologies || []).map((t) => <span key={t}>{t}</span>)}</div>
          <div className="case-body">{(p.case_study || '').split('\n').map((x, i) => <p key={i}>{x}</p>)}</div>
          <div className="actions">
            {p.github_url && <a className="btn ghost" href={p.github_url} target="_blank" rel="noreferrer">GitHub</a>}
            {p.live_demo_url && <a className="btn primary" href={p.live_demo_url} target="_blank" rel="noreferrer">Live demo</a>}
          </div>
        </div>
      </Section>
    </Shell>
  );
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setState('Sending…');

    try {
      await api('/messages', { method: 'POST', body: JSON.stringify(form) });
      setState('Message sent. Thanks!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setState(err.message);
    }
  };

  return (
    <Shell>
      <Section kicker="CONTACT" title="Let's talk">
        <div className="contact-layout">
          <div className="glass card">
            <h3>Have an idea?</h3>
            <p>Tell me what you are building, what problem you are solving and where you need help.</p>
          </div>
          <form className="glass form" onSubmit={submit}>
            {['name', 'email', 'subject'].map((k) => (
              <input
                key={k}
                required
                type={k === 'email' ? 'email' : 'text'}
                placeholder={k[0].toUpperCase() + k.slice(1)}
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
              />
            ))}
            <textarea required rows="7" placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <button className="btn primary">Send message</button>
            <small>{state}</small>
          </form>
        </div>
      </Section>
    </Shell>
  );
}

function Empty({ text }) {
  return <div className="glass card"><p>{text}</p></div>;
}

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  const go = async (e) => {
    e.preventDefault();
    setErr('');

    try {
      await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      nav('/admin/dashboard');
    } catch (x) {
      setErr(x.message || 'Login failed');
    }
  };

  return (
    <div className="admin-page">
      <div className="glass auth-card">
        <div className="brand-mark admin-mark" aria-label="Admin"></div>
        <h2>Admin Login</h2>
        <form className="form" onSubmit={go}>
          <input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn primary">Sign in</button>
          <small>{err}</small>
        </form>
      </div>
    </div>
  );
}

const adminResources = ['skills', 'experience', 'education', 'certifications', 'services', 'projects'];

function Admin() {
  const nav = useNavigate();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState('overview');
  const [items, setItems] = useState([]);
  const [about, setAbout] = useState(null);
  const [resume, setResume] = useState(null);
  const [messages, setMessages] = useState([]);
  const [saveStatus, setSaveStatus] = useState('');

  useEffect(() => {
    api('/auth/me')
      .then((x) => setUser(x.user))
      .catch(() => nav('/admin/login'));
  }, [nav]);

  useEffect(() => {
    if (!user) return;

    Promise.all(adminResources.map((x) => api('/' + x))).then((all) => setItems(all)).catch(() => {});
    api('/about').then(setAbout);
    api('/resume').then(setResume);
    api('/messages').then(setMessages).catch(() => {});
  }, [user]);

  if (!user) {
    return <div className="admin-page"><div className="glass auth-card"><h2>Loading admin…</h2></div></div>;
  }

  const logout = async () => {
    await api('/auth/logout', { method: 'POST' });
    nav('/admin/login');
  };

  const saveAboutData = async (payload) => {
    const next = await api('/about', { method: 'PUT', body: JSON.stringify(payload) });
    setAbout(next);
    publishDataUpdate('about', next);
    setSaveStatus('About saved successfully.');
    return next;
  };

  const uploadImage = async (file) => {
    if (!file) return;
    setSaveStatus('Uploading image...');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Image upload failed.');

      const nextAbout = { ...about, profile_image: data.url };
      setAbout(nextAbout);
      await saveAboutData(nextAbout);
      setSaveStatus('Image uploaded successfully.');
    } catch (err) {
      setSaveStatus(err.message || 'Unable to upload image.');
    }
  };

  const saveAbout = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    try {
      await saveAboutData(about);
    } catch (err) {
      setSaveStatus(err.message || 'Unable to save about details.');
    }
  };

  const saveResume = async (e) => {
    e.preventDefault();
    setSaveStatus('');
    try {
      const next = await api('/resume', { method: 'PUT', body: JSON.stringify(resume) });
      setResume(next);
      publishDataUpdate('resume', next);
      setSaveStatus('Resume saved successfully.');
    } catch (err) {
      setSaveStatus(err.message || 'Unable to save resume.');
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="brand-mark admin-mark" aria-label="Admin"></div>
        <strong>Admin</strong>
        {['overview', 'about', 'skills', 'experience', 'education', 'certifications', 'services', 'projects', 'resume', 'messages'].map((x) => (
          <button className={tab === x ? 'active' : ''} onClick={() => setTab(x)} key={x}>{x.replace(/\b\w/g, (m) => m.toUpperCase())}</button>
        ))}
        <button onClick={logout}>Logout</button>
      </aside>

      <section className="admin-main">
        <header>
          <div>
            <span className="kicker">CONTROL CENTER</span>
            <h1>{tab}</h1>
          </div>
          <Theme />
        </header>

        {tab === 'overview' && (
          <div className="admin-stats">
            {adminResources.map((x, i) => <Stat key={x} n={items[i]?.length || 0} l={x} />)}
          </div>
        )}

        {tab === 'about' && about && (
          <form className="glass card admin-form" onSubmit={saveAbout}>
            {['name', 'title', 'location', 'email', 'phone', 'github_url', 'linkedin_url'].map((k) => (
              <input
                key={k}
                placeholder={k}
                value={about[k] || ''}
                onChange={(e) => setAbout({ ...about, [k]: e.target.value })}
              />
            ))}
            <label className="field-label">
              Profile image URL
              <input
                placeholder="https://example.com/image.jpg"
                value={about.profile_image || ''}
                onChange={(e) => setAbout({ ...about, profile_image: e.target.value })}
              />
            </label>
            <label className="field-label">
              Upload image
              <input type="file" accept="image/*" onChange={(e) => uploadImage(e.target.files?.[0])} />
            </label>
            <textarea rows="7" value={about.bio || ''} onChange={(e) => setAbout({ ...about, bio: e.target.value })} />
            <button className="btn primary">Save About</button>
            {saveStatus && <small>{saveStatus}</small>}
          </form>
        )}

        {tab === 'resume' && resume && (
          <form className="glass card admin-form" onSubmit={saveResume}>
            <input placeholder="Google Drive CV URL" value={resume.file_url || ''} onChange={(e) => setResume({ ...resume, file_url: e.target.value })} />
            <button className="btn primary">Save CV link</button>
            {saveStatus && <small>{saveStatus}</small>}
          </form>
        )}

        {tab === 'messages' && (
          <div className="admin-list">
            {messages.map((m) => (
              <div className="glass card" key={m.id}>
                <b>{m.subject}</b>
                <span>{m.name} · {m.email}</span>
                <p>{m.message}</p>
                <button
                  className="btn ghost"
                  onClick={async () => {
                    await api('/messages', { method: 'PUT', body: JSON.stringify({ id: m.id, is_read: !m.is_read }) });
                    setMessages(messages.map((x) => x.id === m.id ? { ...x, is_read: !x.is_read } : x));
                  }}
                >
                  {m.is_read ? 'Mark unread' : 'Mark read'}
                </button>
              </div>
            ))}
          </div>
        )}

        {adminResources.includes(tab) && (
          <ResourceEditor
            resource={tab}
            data={items[adminResources.indexOf(tab)] || []}
            onChange={(value) => {
              const copy = [...items];
              copy[adminResources.indexOf(tab)] = value;
              setItems(copy);
            }}
          />
        )}
      </section>
    </div>
  );
}

const resourceDefinitions = {
  skills: {
    fields: [
      ['name', 'Name', 'text'], ['category', 'Category', 'text'], ['proficiency', 'Proficiency (%)', 'number'],
      ['icon', 'Icon', 'text'], ['display_order', 'Display order', 'number']
    ],
    empty: { name: '', category: 'Frontend', proficiency: 80, icon: '', display_order: 0 }
  },
  experience: {
    fields: [
      ['job_title', 'Job title', 'text'], ['company', 'Company', 'text'], ['location', 'Location', 'text'],
      ['start_date', 'Start date', 'date'], ['end_date', 'End date', 'date'], ['current', 'Current role', 'checkbox'],
      ['description', 'Description', 'textarea'], ['achievements', 'Achievements (comma separated)', 'text'], ['display_order', 'Display order', 'number']
    ],
    empty: { job_title: '', company: '', location: '', start_date: '', end_date: '', current: false, description: '', achievements: '', display_order: 0 }
  },
  education: {
    fields: [
      ['institution', 'Institution', 'text'], ['degree', 'Degree', 'text'], ['field', 'Field of study', 'text'],
      ['start_date', 'Start date', 'date'], ['end_date', 'End date', 'date'], ['grade', 'Grade', 'text'],
      ['description', 'Description', 'textarea'], ['display_order', 'Display order', 'number']
    ],
    empty: { institution: '', degree: '', field: '', start_date: '', end_date: '', grade: '', description: '', display_order: 0 }
  },
  certifications: {
    fields: [
      ['name', 'Certification name', 'text'], ['issuer', 'Issuer', 'text'], ['issue_date', 'Issue date', 'date'],
      ['credential_id', 'Credential ID', 'text'], ['credential_url', 'Credential URL', 'url'], ['description', 'Description', 'textarea'],
      ['icon', 'Icon', 'text'], ['display_order', 'Display order', 'number']
    ],
    empty: { name: '', issuer: '', issue_date: '', credential_id: '', credential_url: '', description: '', icon: '', display_order: 0 }
  },
  services: {
    fields: [
      ['title', 'Title', 'text'], ['description', 'Description', 'textarea'], ['icon', 'Icon / number', 'text'],
      ['display_order', 'Display order', 'number'], ['published', 'Published', 'checkbox']
    ],
    empty: { title: '', description: '', icon: '', display_order: 0, published: true }
  },
  projects: {
    fields: [
      ['title', 'Title', 'text'], ['slug', 'Slug', 'text'], ['short_description', 'Short description', 'textarea'],
      ['case_study', 'Case study', 'textarea'], ['image_url', 'Image URL', 'url'], ['technologies', 'Technologies (comma separated)', 'text'],
      ['github_url', 'GitHub URL', 'url'], ['live_demo_url', 'Live demo URL', 'url'], ['status', 'Status', 'select'],
      ['featured', 'Featured', 'checkbox'], ['published', 'Published', 'checkbox'], ['display_order', 'Display order', 'number']
    ],
    empty: { title: '', slug: '', short_description: '', case_study: '', image_url: '', technologies: '', github_url: '', live_demo_url: '', status: 'Completed', featured: false, published: true, display_order: 0 }
  }
};

function formValue(item, field, type) {
  const value = item?.[field];
  if (type === 'checkbox') return Boolean(value);
  if (Array.isArray(value)) return value.join(', ');
  return value ?? '';
}

function normalizeResourcePayload(resource, form) {
  const payload = { ...form };
  if (['experience', 'projects'].includes(resource)) {
    if (typeof payload.achievements === 'string') payload.achievements = payload.achievements.split(',').map((x) => x.trim()).filter(Boolean);
  }
  if (resource === 'projects' && typeof payload.technologies === 'string') {
    payload.technologies = payload.technologies.split(',').map((x) => x.trim()).filter(Boolean);
  }
  for (const key of Object.keys(payload)) {
    if (payload[key] === '') payload[key] = null;
  }
  return payload;
}

function ResourceEditor({ resource, data, onChange }) {
  const definition = resourceDefinitions[resource];
  const [form, setForm] = useState(definition.empty);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const reset = () => {
    setForm({ ...definition.empty });
    setEditingId(null);
    setError('');
  };

const handleImageUpload = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  
  // Check file size (5MB limit)
 // File size limit is now checked after compression
// Original limit is 5MB, but compresses to ~100-200KB

  setUploadingImage(true);
  try {
    // Compress image before uploading
    const canvas = document.createElement('canvas');
    const img = new Image();
    
    img.onload = () => {
      try {
        // Set canvas size (max width 800px to reduce file size)
        const maxWidth = 800;
        const maxHeight = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to JPEG with compression (0.7 quality = good balance)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        
        // Check compressed size
        if (compressedDataUrl.length > 1 * 1024 * 1024) {
          setError('Compressed image still too large. Try a smaller image.');
          setUploadingImage(false);
          return;
        }

        setForm({ ...form, image_url: compressedDataUrl });
        setUploadingImage(false);
      } catch (err) {
        setError('Failed to compress image');
        setUploadingImage(false);
      }
    };

    img.onerror = () => {
      setError('Failed to load image');
      setUploadingImage(false);
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      img.src = event.target?.result;
    };
    reader.onerror = () => {
      setError('Failed to read image file');
      setUploadingImage(false);
    };
    reader.readAsDataURL(file);
  } catch (err) {
    setError('Image upload failed');
    setUploadingImage(false);
  }
};

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const payload = normalizeResourcePayload(resource, form);
      const path = '/' + resource + (editingId ? '/' + editingId : '');
      const result = await api(path, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
      });
      onChange(editingId ? data.map((item) => item.id === editingId ? result : item) : [...data, result]);
      reset();
    } catch (err) {
      setError(err.message || 'Unable to save item.');
    } finally {
      setBusy(false);
    }
  };

  const edit = (item) => {
    const next = {};
    definition.fields.forEach(([key, , type]) => { next[key] = formValue(item, key, type); });
    setForm(next);
    setEditingId(item.id);
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const del = async (id) => {
    if (!window.confirm('Delete this item? This cannot be undone.')) return;
    setBusy(true);
    setError('');
    try {
      await api('/' + resource + '/' + id, { method: 'DELETE' });
      onChange(data.filter((x) => x.id !== id));
      if (editingId === id) reset();
    } catch (err) {
      setError(err.message || 'Unable to delete item.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <form className="glass card admin-form" onSubmit={submit}>
        <h3>{editingId ? `Edit ${resource}` : `Add ${resource}`}</h3>
        
        {/* NEW: Show image preview and upload for projects */}
        {resource === 'projects' && form.image_url && (
          <div className="image-preview" style={{ marginBottom: '1rem' }}>
            <img 
              src={form.image_url} 
              alt="preview" 
              style={{ maxWidth: '200px', maxHeight: '150px', borderRadius: '8px' }}
            />
          </div>
        )}

        {definition.fields.map(([key, label, type]) => {
          // NEW: Replace image_url field with file upload for projects
          if (resource === 'projects' && key === 'image_url') {
            return (
              <label className="field-label" key={key}>
                {label}
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <small style={{ display: 'block', marginTop: '0.5rem' }}>Uploading image...</small>}
                {form.image_url && <small style={{ display: 'block', marginTop: '0.5rem' }}>✓ Image selected</small>}
              </label>
            );
          }

          if (type === 'checkbox') return (
            <label className="field-label checkbox-field" key={key}>
              <input type="checkbox" checked={Boolean(form[key])} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} />
              {label}
            </label>
          );
          if (type === 'textarea') return (
            <label className="field-label" key={key}>
              {label}
              <textarea rows="4" value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          );
          if (type === 'select') return (
            <label className="field-label" key={key}>
              {label}
              <select value={form[key] ?? 'Completed'} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                <option>Completed</option><option>In Progress</option><option>Archived</option>
              </select>
            </label>
          );
          return (
            <label className="field-label" key={key}>
              {label}
              <input type={type} value={form[key] ?? ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </label>
          );
        })}
        <div className="actions">
          <button className="btn primary" disabled={busy || uploadingImage}>{busy ? 'Saving…' : editingId ? 'Update' : 'Add'}</button>
          {editingId && <button type="button" className="btn ghost" onClick={reset}>Cancel</button>}
        </div>
        {error && <small>{error}</small>}
      </form>

      <div className="admin-list">
        {data.map((x) => (
          <div className="glass card row" key={x.id}>
            <div>
              <h3>{x.title || x.name || x.job_title || x.degree || x.institution}</h3>
              <span>{x.category || x.company || x.issuer || x.status || ''}</span>
            </div>
            <div className="actions">
              <button className="btn ghost" onClick={() => edit(x)} disabled={busy}>Edit</button>
              <button className="btn ghost" onClick={() => del(x.id)} disabled={busy}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="admin-page">
          <div className="glass auth-card">
            <h2>Something went wrong</h2>
            <p>Please refresh the page. If the problem continues, check the browser console and server logs.</p>
            <button className="btn primary" onClick={() => window.location.reload()}>Refresh</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/skills" element={<Skills />} />
      <Route path="/experience" element={<Experience />} />
      <Route path="/education" element={<Education />} />
      <Route path="/certifications" element={<Certifications />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetails />} />
      <Route path="/services" element={<Services />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/*" element={<Admin />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

createRoot(document.getElementById('root')).render(
  <AppErrorBoundary>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </AppErrorBoundary>
);
