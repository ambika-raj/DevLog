import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { FiArrowLeft, FiGithub, FiExternalLink, FiEdit2, FiTrash2, FiCalendar, FiClock } from 'react-icons/fi'

const statusColors = {
  'Completed': { bg: 'rgba(0,201,167,0.1)', border: 'rgba(0,201,167,0.25)', text: '#00C9A7' },
  'In Progress': { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24' },
  'On Hold': { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8' },
}

const ProjectDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/projects/${id}`)
        setProject(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProject()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`)
      navigate('/projects')
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0a0f1e',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '2px solid #00C9A7', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  )

  if (!project) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#475569' }}>Project not found.</p>
    </div>
  )

  const status = statusColors[project.status] || statusColors['In Progress']

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Back */}
          <Link to="/projects" style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            color: '#475569', textDecoration: 'none', fontSize: '0.875rem',
            marginBottom: '28px', transition: 'color 0.2s'
          }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#00C9A7'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}
          >
            <FiArrowLeft size={15} /> Back to Projects
          </Link>

          {/* Thumbnail */}
          {project.thumbnail && (
            <div style={{
              width: '100%', height: '300px', borderRadius: '16px',
              overflow: 'hidden', marginBottom: '28px',
              border: '1px solid rgba(255,255,255,0.07)'
            }}>
              <img src={`http://localhost:5000${project.thumbnail}`} alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}

          {/* Main Card */}
          <div style={{
            padding: '32px', borderRadius: '16px',
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.07)',
            marginBottom: '20px'
          }}>

            {/* Title Row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <h1 style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '1.7rem',
                    fontWeight: '800', color: '#e2e8f0'
                  }}>{project.title}</h1>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px',
                    background: status.bg, border: `1px solid ${status.border}`,
                    color: status.text, fontSize: '0.78rem', fontWeight: '600'
                  }}>{project.status}</span>
                </div>

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.8rem' }}>
                    <FiCalendar size={12} />
                    Created {new Date(project.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.8rem' }}>
                    <FiClock size={12} />
                    Updated {new Date(project.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link to={`/projects/edit/${project._id}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px',
                    background: 'rgba(0,120,255,0.08)', border: '1px solid rgba(0,120,255,0.2)',
                    color: '#0078ff', textDecoration: 'none',
                    fontSize: '0.82rem', fontWeight: '500', transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,120,255,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,120,255,0.08)'}
                >
                  <FiEdit2 size={13} /> Edit
                </Link>
                <button onClick={handleDelete}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    color: '#f87171', cursor: 'pointer',
                    fontSize: '0.82rem', fontWeight: '500', transition: 'all 0.2s',
                    fontFamily: "'DM Sans', sans-serif"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >
                  <FiTrash2 size={13} /> Delete
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '20px 0' }} />

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '0.9rem',
                fontWeight: '700', color: '#64748b', textTransform: 'uppercase',
                letterSpacing: '0.05em', marginBottom: '12px'
              }}>About</h3>
              <p style={{ color: '#94a3b8', lineHeight: '1.8', fontSize: '0.95rem' }}>
                {project.description}
              </p>
            </div>

            {/* Tech Stack */}
            {project.techStack?.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '0.9rem',
                  fontWeight: '700', color: '#64748b', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '12px'
                }}>Tech Stack</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {project.techStack.map((tech, i) => (
                    <span key={i} style={{
                      padding: '6px 14px', borderRadius: '20px',
                      background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.2)',
                      color: '#00C9A7', fontSize: '0.82rem', fontWeight: '500'
                    }}>{tech}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            {(project.githubLink || project.liveLink) && (
              <div>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '0.9rem',
                  fontWeight: '700', color: '#64748b', textTransform: 'uppercase',
                  letterSpacing: '0.05em', marginBottom: '12px'
                }}>Links</h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {project.githubLink && (
                    <a href={project.githubLink} target="_blank" rel="noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '9px 18px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)',
                        color: '#94a3b8', textDecoration: 'none',
                        fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)' }}
                    >
                      <FiGithub size={15} /> View on GitHub
                    </a>
                  )}
                  {project.liveLink && (
                    <a href={project.liveLink} target="_blank" rel="noreferrer"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        padding: '9px 18px', borderRadius: '10px',
                        background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.2)',
                        color: '#00C9A7', textDecoration: 'none',
                        fontSize: '0.875rem', fontWeight: '500', transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,201,167,0.15)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,201,167,0.08)'}
                    >
                      <FiExternalLink size={15} /> Live Demo
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default ProjectDetail