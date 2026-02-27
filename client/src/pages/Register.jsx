import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAtSign } from 'react-icons/fi'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await axios.post('https://devlog-eis1.onrender.com//api/auth/register', formData)
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    borderRadius: '12px',
    outline: 'none',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  }

  const fields = [
    { label: 'Full Name', name: 'name', type: 'text', icon: <FiUser />, placeholder: 'John Doe', hint: null },
    { label: 'Username', name: 'username', type: 'text', icon: <FiAtSign />, placeholder: 'johndoe', hint: 'Your public profile: /u/johndoe' },
    { label: 'Email address', name: 'email', type: 'email', icon: <FiMail />, placeholder: 'you@example.com', hint: null },
  ]

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: '#0a0f1e',
      fontFamily: "'DM Sans', sans-serif"
    }}>

      {/* ── LEFT PANEL — Form ── */}
      <div style={{
        width: '520px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '60px 48px',
        background: 'rgba(255,255,255,0.02)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        position: 'relative'
      }}>

        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '16px', fontWeight: '800', color: '#0a0f1e',
            fontFamily: 'Syne, sans-serif'
          }}>D</div>
          <span style={{ fontSize: '22px', fontWeight: '800', color: '#e2e8f0', fontFamily: 'Syne, sans-serif' }}>
            DevLog
          </span>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '1.8rem', fontWeight: '700',
            color: '#e2e8f0', marginBottom: '8px'
          }}>Create your account ✨</h2>
          <p style={{ color: '#475569', fontSize: '0.9rem' }}>Start documenting your dev journey today</p>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            marginBottom: '20px', padding: '12px 16px', borderRadius: '10px',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
            color: '#f87171', fontSize: '0.875rem'
          }}>{error}</div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Text Fields */}
          {fields.map((field) => (
            <div key={field.name}>
              <label style={{
                display: 'block', color: '#94a3b8',
                fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px'
              }}>
                {field.label}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{
                  position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                  color: '#475569', fontSize: '15px', pointerEvents: 'none',
                  display: 'flex', alignItems: 'center'
                }}>
                  {field.icon}
                </span>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required
                  style={{ ...inputStyle, padding: '13px 14px 13px 42px' }}
                  onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>
              {field.hint && (
                <p style={{ color: '#334155', fontSize: '0.78rem', marginTop: '5px' }}>
                  {field.hint}
                </p>
              )}
            </div>
          ))}

          {/* Password */}
          <div>
            <label style={{
              display: 'block', color: '#94a3b8',
              fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                color: '#475569', fontSize: '15px', pointerEvents: 'none'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                style={{ ...inputStyle, padding: '13px 44px 13px 42px' }}
                onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#475569', fontSize: '15px', padding: '0',
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
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>

        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#475569', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#00C9A7', fontWeight: '600', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>

      </div>

      {/* ── RIGHT PANEL — Branding ── */}
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

        {/* Blobs */}
        <div style={{
          position: 'absolute', top: '-60px', right: '-60px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,167,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-40px',
          width: '350px', height: '350px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,120,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(rgba(0,201,167,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,201,167,0.03) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          pointerEvents: 'none'
        }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '2.8rem', fontWeight: '800',
            lineHeight: '1.15', color: '#e2e8f0', marginBottom: '20px'
          }}>
            Your Projects.<br />
            <span style={{
              background: 'linear-gradient(90deg, #00C9A7, #0078ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Your Story.</span>
          </h1>
          <p style={{
            color: '#64748b', fontSize: '1rem',
            lineHeight: '1.7', maxWidth: '380px', marginBottom: '48px'
          }}>
            Join developers who use DevLog to track their work, measure growth, and impress recruiters with a clean portfolio.
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {[
              { step: '01', title: 'Create your account', desc: 'Sign up in seconds, no credit card needed' },
              { step: '02', title: 'Log your projects', desc: 'Add projects with tech stack, status & links' },
              { step: '03', title: 'Share your portfolio', desc: 'Get a public URL to share with recruiters' },
            ].map((s) => (
              <div key={s.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  minWidth: '36px', height: '36px', borderRadius: '10px',
                  background: 'rgba(0,201,167,0.1)',
                  border: '1px solid rgba(0,201,167,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem', fontWeight: '700', color: '#00C9A7',
                  fontFamily: 'Syne, sans-serif'
                }}>{s.step}</div>
                <div>
                  <p style={{ color: '#e2e8f0', fontSize: '0.9rem', fontWeight: '600', marginBottom: '3px' }}>
                    {s.title}
                  </p>
                  <p style={{ color: '#475569', fontSize: '0.82rem' }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Register