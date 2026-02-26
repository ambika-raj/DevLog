import { Link } from 'react-router-dom'
import { FiGithub, FiExternalLink, FiEdit2, FiTrash2 } from 'react-icons/fi'

const statusColors = {
  'Completed': { bg: 'rgba(0,201,167,0.1)', border: 'rgba(0,201,167,0.25)', text: '#00C9A7', dot: '#00C9A7' },
  'In Progress': { bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.25)', text: '#fbbf24', dot: '#fbbf24' },
  'On Hold': { bg: 'rgba(148,163,184,0.1)', border: 'rgba(148,163,184,0.2)', text: '#94a3b8', dot: '#94a3b8' },
}

const ProjectCard = ({ project, onDelete }) => {
  const status = statusColors[project.status] || statusColors['In Progress']

  return (
    <div style={{
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      fontFamily: "'DM Sans', sans-serif",
      display: 'flex',
      flexDirection: 'column'
    }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)'
        e.currentTarget.style.borderColor = 'rgba(0,201,167,0.2)'
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Thumbnail */}
      <div style={{
        height: '160px', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0d1a2e, #0a0f1e)',
        position: 'relative'
      }}>
        {project.thumbnail ? (
          <img
            src={`http://localhost:5000${project.thumbnail}`}
            alt={project.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0d1a2e 0%, #0a1628 100%)',
          }}>
            <div style={{
              fontSize: '2.5rem', fontWeight: '800',
              fontFamily: 'Syne, sans-serif',
              background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              {project.title?.charAt(0).toUpperCase()}
            </div>
          </div>
        )}

        {/* Status Badge */}
        <div style={{
          position: 'absolute', top: '12px', right: '12px',
          padding: '4px 10px', borderRadius: '20px',
          background: status.bg, border: `1px solid ${status.border}`,
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '0.72rem', fontWeight: '600', color: status.text
        }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: status.dot }} />
          {project.status}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>

        <h3 style={{
          fontFamily: 'Syne, sans-serif', fontSize: '1rem',
          fontWeight: '700', color: '#e2e8f0', marginBottom: '8px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {project.title}
        </h3>

        <p style={{
          fontSize: '0.83rem', color: '#475569', lineHeight: '1.6',
          marginBottom: '14px', flex: 1,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }}>
          {project.description}
        </p>

        {/* Tech Stack */}
        {project.techStack?.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
            {project.techStack.slice(0, 3).map((tech, i) => (
              <span key={i} style={{
                padding: '3px 10px', borderRadius: '20px',
                background: 'rgba(0,201,167,0.07)',
                border: '1px solid rgba(0,201,167,0.15)',
                fontSize: '0.72rem', color: '#00C9A7', fontWeight: '500'
              }}>{tech}</span>
            ))}
            {project.techStack.length > 3 && (
              <span style={{
                padding: '3px 10px', borderRadius: '20px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                fontSize: '0.72rem', color: '#475569'
              }}>+{project.techStack.length - 3}</span>
            )}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <FiGithub size={14} />
              </a>
            )}
            {project.liveLink && (
              <a href={project.liveLink} target="_blank" rel="noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: '32px', height: '32px', borderRadius: '8px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#64748b', textDecoration: 'none', transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#00C9A7'; e.currentTarget.style.borderColor = 'rgba(0,201,167,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
              >
                <FiExternalLink size={14} />
              </a>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <Link to={`/projects/edit/${project._id}`}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748b', textDecoration: 'none', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#0078ff'; e.currentTarget.style.borderColor = 'rgba(0,120,255,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              <FiEdit2 size={13} />
            </Link>
            <button
              onClick={() => onDelete(project._id)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#64748b', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
            >
              <FiTrash2 size={13} />
            </button>
            <Link to={`/projects/${project._id}`}
              style={{
                display: 'flex', alignItems: 'center',
                padding: '0 12px', height: '32px', borderRadius: '8px',
                background: 'rgba(0,201,167,0.08)',
                border: '1px solid rgba(0,201,167,0.2)',
                color: '#00C9A7', textDecoration: 'none',
                fontSize: '0.75rem', fontWeight: '600', transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,201,167,0.15)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,201,167,0.08)' }}
            >
              View →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard