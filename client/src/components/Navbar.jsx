import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiGrid, FiFolderPlus, FiFolder, FiLogOut, FiExternalLink, FiBookOpen } from 'react-icons/fi'

const Navbar = () => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: <FiGrid /> },
    { path: '/projects', label: 'Projects', icon: <FiFolder /> },
    { path: '/projects/add', label: 'Add Project', icon: <FiFolderPlus /> },
    { path: '/notes', label: 'Notes', icon: <FiBookOpen /> },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 40px', height: '64px',
      background: 'rgba(10,15,30,0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '30px', height: '30px', borderRadius: '8px',
          background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '14px', fontWeight: '800', color: '#0a0f1e',
          fontFamily: 'Syne, sans-serif'
        }}>D</div>
        <span style={{ fontSize: '18px', fontWeight: '800', color: '#e2e8f0', fontFamily: 'Syne, sans-serif' }}>
          DevLog
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '7px 14px', borderRadius: '10px',
              textDecoration: 'none', fontSize: '0.88rem', fontWeight: '500',
              transition: 'all 0.2s ease',
              color: isActive(link.path) ? '#00C9A7' : '#64748b',
              background: isActive(link.path) ? 'rgba(0,201,167,0.08)' : 'transparent',
              border: `1px solid ${isActive(link.path) ? 'rgba(0,201,167,0.2)' : 'transparent'}`
            }}
          >
            <span style={{ fontSize: '14px' }}>{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Public Profile Link */}
        {user && (
          <a
            href={`/u/${user.username}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 12px', borderRadius: '8px',
              textDecoration: 'none', fontSize: '0.82rem', fontWeight: '500',
              color: '#475569', border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#00C9A7'; e.currentTarget.style.borderColor = 'rgba(0,201,167,0.3)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
          >
            <FiExternalLink size={13} />
            Portfolio
          </a>
        )}

        {/* Avatar + Logout */}
        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', fontWeight: '700', color: '#0a0f1e',
              fontFamily: 'Syne, sans-serif'
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </div> */}

            <Link to="/profile/edit"
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    width: '32px', height: '32px', borderRadius: '50%',
                    overflow: 'hidden', border: '2px solid rgba(0,201,167,0.3)',
                    textDecoration: 'none', flexShrink: 0
                }}>
                {user?.profilePic ? (
                    <img src={`http://localhost:5000${user.profilePic}`} alt="profile"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{
                    width: '100%', height: '100%',
                    background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '13px', fontWeight: '700', color: '#0a0f1e',
                    fontFamily: 'Syne, sans-serif'
                    }}>
                    {user?.name?.charAt(0).toUpperCase()}
                    </div>
                )}
                </Link>

            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '6px 12px', borderRadius: '8px',
                background: 'none', border: '1px solid rgba(255,255,255,0.06)',
                color: '#475569', fontSize: '0.82rem', cursor: 'pointer',
                transition: 'all 0.2s ease', fontFamily: "'DM Sans', sans-serif"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)' }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
            >
              <FiLogOut size={13} />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar