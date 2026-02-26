import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#0a0f1e',
      fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* ── LEFT PANEL ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1a2e 100%)',
      }}>

        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', left: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-100px', right: '-60px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,120,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(0,201,167,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,201,167,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '60px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '18px', fontWeight: '800', color: '#0a0f1e',
              fontFamily: 'Syne, sans-serif'
            }}>D</div>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#e2e8f0', fontFamily: 'Syne, sans-serif' }}>
              DevLog
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.85rem' }}>Your developer journey, documented.</p>
        </div>

        {/* Headline */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: '48px' }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '2.8rem',
            fontWeight: '800',
            lineHeight: '1.15',
            color: '#e2e8f0',
            marginBottom: '20px'
          }}>
            Track Every<br />
            <span style={{
              background: 'linear-gradient(90deg, #00C9A7, #0078ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Project. Every Win.</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.7', maxWidth: '380px' }}>
            Log your projects, track progress, and showcase your work to the world — all in one place.
          </p>
        </div>

        {/* Feature Pills */}
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[
            { icon: '🗂️', text: 'Organize all your dev projects' },
            { icon: '📊', text: 'Dashboard with live stats & charts' },
            { icon: '🌐', text: 'Shareable public portfolio page' },
          ].map((f, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              maxWidth: '340px'
            }}>
              <span style={{ fontSize: '18px' }}>{f.icon}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{f.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        width: '480px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'rgba(255,255,255,0.02)',
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        position: 'relative'
      }}>

        <div style={{ marginBottom: '36px' }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.9rem', fontWeight: '700',
            color: '#e2e8f0', marginBottom: '8px'
          }}>Welcome back 👋</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Sign in to continue to your dashboard</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171', fontSize: '0.875rem'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Email */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px' }}>
              Email address
            </label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#475569', fontSize: '16px', pointerEvents: 'none'
              }} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%', padding: '13px 14px 13px 42px',
                  borderRadius: '12px', outline: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0', fontSize: '0.95rem',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#475569', fontSize: '16px', pointerEvents: 'none'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{
                  width: '100%', padding: '13px 44px 13px 42px',
                  borderRadius: '12px', outline: 'none',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#e2e8f0', fontSize: '0.95rem',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#475569', fontSize: '16px', padding: '0',
                  display: 'flex', alignItems: 'center'
                }}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '14px',
              borderRadius: '12px', border: 'none',
              background: loading ? '#1a2a3a' : 'linear-gradient(135deg, #00C9A7, #0078ff)',
              color: loading ? '#475569' : '#fff',
              fontSize: '0.95rem', fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Syne, sans-serif',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 0 24px rgba(0,201,167,0.3)',
              marginTop: '4px'
            }}
            onMouseEnter={(e) => { if (!loading) e.target.style.boxShadow = '0 0 36px rgba(0,201,167,0.5)' }}
            onMouseLeave={(e) => { if (!loading) e.target.style.boxShadow = '0 0 24px rgba(0,201,167,0.3)' }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '28px', color: '#475569', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#00C9A7', fontWeight: '600', textDecoration: 'none' }}>
            Create one
          </Link>
        </p>

        <div style={{
          position: 'absolute', bottom: '30px', left: '48px', right: '48px',
          textAlign: 'center', color: '#1e293b', fontSize: '0.75rem'
        }}>
          Built with MERN Stack
        </div>
      </div>

    </div>
  )
}

export default Login