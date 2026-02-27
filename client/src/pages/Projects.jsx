import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ProjectCard from '../components/ProjectCard'
import { FiSearch, FiFilter, FiFolderPlus } from 'react-icons/fi'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')

  const statuses = ['All', 'In Progress', 'Completed', 'On Hold']

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const params = {}
      if (search) params.search = search
      if (statusFilter !== 'All') params.status = statusFilter
      const res = await axios.get('https://devlog-eis1.onrender.comapi/projects', { params })
      setProjects(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(fetchProjects, 400)
    return () => clearTimeout(timer)
  }, [search, statusFilter])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await axios.delete(`https://devlog-eis1.onrender.comapi/projects/${id}`)
      setProjects(projects.filter(p => p._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />

      <div style={{ paddingTop: '64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.9rem',
                fontWeight: '800', color: '#e2e8f0', marginBottom: '6px'
              }}>My Projects</h1>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>
                {projects.length} project{projects.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <Link to="/projects/add" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', borderRadius: '12px',
              background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
              color: '#fff', textDecoration: 'none',
              fontSize: '0.875rem', fontWeight: '600',
              boxShadow: '0 0 20px rgba(0,201,167,0.25)',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 0 32px rgba(0,201,167,0.45)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 0 20px rgba(0,201,167,0.25)'}
            >
              <FiFolderPlus size={15} /> New Project
            </Link>
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            display: 'flex', gap: '12px', marginBottom: '28px',
            flexWrap: 'wrap', alignItems: 'center'
          }}>
            {/* Search */}
            <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
              <FiSearch style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#475569', fontSize: '15px', pointerEvents: 'none'
              }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by title or tech stack..."
                style={{
                  width: '100%', padding: '11px 14px 11px 40px',
                  borderRadius: '12px', outline: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0', fontSize: '0.9rem',
                  boxSizing: 'border-box', transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>

            {/* Status Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <FiFilter size={14} style={{ color: '#475569' }} />
              {statuses.map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '7px 14px', borderRadius: '20px',
                    border: `1px solid ${statusFilter === s ? 'rgba(0,201,167,0.4)' : 'rgba(255,255,255,0.08)'}`,
                    background: statusFilter === s ? 'rgba(0,201,167,0.1)' : 'transparent',
                    color: statusFilter === s ? '#00C9A7' : '#64748b',
                    fontSize: '0.82rem', fontWeight: '500', cursor: 'pointer',
                    transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif"
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#475569' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                border: '2px solid #00C9A7', borderTopColor: 'transparent',
                animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
              }} />
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px' }}>
                {search || statusFilter !== 'All' ? 'No projects match your search.' : 'No projects yet. Add your first one!'}
              </p>
              {!search && statusFilter === 'All' && (
                <Link to="/projects/add" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 20px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                  color: '#fff', textDecoration: 'none',
                  fontSize: '0.875rem', fontWeight: '600'
                }}>
                  <FiFolderPlus size={15} /> Add Project
                </Link>
              )}
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '20px'
            }}>
              {projects.map(project => (
                <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Projects