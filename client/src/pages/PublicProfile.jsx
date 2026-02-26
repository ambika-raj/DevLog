import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { FiGithub, FiExternalLink, FiFolder, FiMapPin } from 'react-icons/fi'

const statusColors = {
  'Completed': { bg: 'rgba(0,201,167,0.1)', border: 'rgba(0,201,167,0.25)', text: '#00C9A7' },
  'In Progress': { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24' },
  'On Hold': { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8' },
}

const PublicProfile = () => {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/public/${username}`)
        setData(res.data)
      } catch (err) {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #00C9A7', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (notFound) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔍</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', color: '#e2e8f0', marginBottom: '8px' }}>Profile not found</h2>
      <p style={{ color: '#475569', marginBottom: '24px' }}>No user found with username @{username}</p>
      <Link to="/login" style={{ color: '#00C9A7', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to DevLog</Link>
    </div>
  )

  const { user, projects } = data

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Hero Header */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 100%)',
        position: 'relative', overflow: 'hidden'
      }}>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '-60px', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,201,167,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,120,255,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(0,201,167,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,201,167,0.02) 1px, transparent 1px)`, backgroundSize: '40px 40px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '56px 24px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px' }}>
              {/* Avatar */}
              {user.profilePic ? (
                <img src={`http://localhost:5000${user.profilePic}`} alt={user.name}
                  style={{ width: '88px', height: '88px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,201,167,0.3)', flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: '88px', height: '88px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '32px', fontWeight: '800', color: '#0a0f1e',
                  fontFamily: 'Syne, sans-serif', flexShrink: 0,
                  border: '3px solid rgba(0,201,167,0.2)'
                }}>
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: '800', color: '#e2e8f0', marginBottom: '4px' }}>
                  {user.name}
                </h1>
                <p style={{ color: '#475569', fontSize: '0.875rem', marginBottom: '10px' }}>@{user.username}</p>

                {user.bio && (
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.7', maxWidth: '500px', marginBottom: '12px' }}>
                    {user.bio}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {user.country && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.82rem' }}>
                      <FiMapPin size={12} style={{ color: '#00C9A7' }} /> {user.country}
                    </span>
                  )}
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#475569', fontSize: '0.82rem' }}>
                    <FiFolder size={12} style={{ color: '#00C9A7' }} />
                    <span style={{ color: '#00C9A7', fontWeight: '600' }}>{projects.length}</span> completed projects
                  </span>
                </div>
              </div>
            </div>

            {/* DevLog branding */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#334155', fontSize: '0.75rem' }}>Powered by</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '6px', background: 'linear-gradient(135deg, #00C9A7, #0078ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '800', color: '#0a0f1e' }}>D</div>
                <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#475569', fontFamily: 'Syne, sans-serif' }}>DevLog</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px' }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.1rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '24px' }}>
          Completed Projects
        </h2>

        {projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)' }}>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>No completed projects to show yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {projects.map(project => {
              const status = statusColors[project.status] || statusColors['Completed']
              return (
                <div key={project._id}
                  style={{ borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden', transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,201,167,0.2)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.boxShadow = 'none' }}
                >
                  {/* Thumbnail */}
                  <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                    {project.thumbnail ? (
                      <img src={`http://localhost:5000${project.thumbnail}`} alt={project.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0d1a2e, #0a0f1e)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#00C9A7' }}>
                        {project.title?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 10px', borderRadius: '20px', background: status.bg, border: `1px solid ${status.border}`, fontSize: '0.72rem', fontWeight: '600', color: status.text }}>
                      {project.status}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1rem', fontWeight: '700', color: '#e2e8f0', marginBottom: '8px' }}>{project.title}</h3>
                    <p style={{ fontSize: '0.83rem', color: '#475569', lineHeight: '1.6', marginBottom: '14px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{project.description}</p>

                    {project.techStack?.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
                        {project.techStack.slice(0, 3).map((tech, i) => (
                          <span key={i} style={{ padding: '3px 10px', borderRadius: '20px', background: 'rgba(0,201,167,0.07)', border: '1px solid rgba(0,201,167,0.15)', fontSize: '0.72rem', color: '#00C9A7', fontWeight: '500' }}>{tech}</span>
                        ))}
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {project.githubLink && (
                        <a href={project.githubLink} target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', textDecoration: 'none', fontSize: '0.78rem', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#e2e8f0'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                        ><FiGithub size={12} /> GitHub</a>
                      )}
                      {project.liveLink && (
                        <a href={project.liveLink} target="_blank" rel="noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '6px 12px', borderRadius: '8px', background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.2)', color: '#00C9A7', textDecoration: 'none', fontSize: '0.78rem', transition: 'all 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,201,167,0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,201,167,0.08)'}
                        ><FiExternalLink size={12} /> Live Demo</a>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default PublicProfile