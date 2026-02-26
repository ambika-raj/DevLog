import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { FiArrowLeft, FiUpload, FiUser, FiGlobe, FiFileText } from 'react-icons/fi'

const ProfileEdit = () => {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [profilePic, setProfilePic] = useState(null)
  const [profilePicPreview, setProfilePicPreview] = useState(null)
  const [formData, setFormData] = useState({
    name: '', bio: '', country: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/profile')
        const u = res.data
        setFormData({
          name: u.name || '',
          bio: u.bio || '',
          country: u.country || ''
        })
        if (u.profilePic) setProfilePicPreview(`http://localhost:5000${u.profilePic}`)
      } catch (err) {
        setError('Failed to load profile')
      } finally {
        setFetching(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleProfilePic = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }
    setProfilePic(file)
    setProfilePicPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError(''); setSuccess('')
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, val]) => data.append(key, val))
      if (profilePic) data.append('profilePic', profilePic)
      await axios.put('http://localhost:5000/api/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px 12px 42px', borderRadius: '12px', outline: 'none',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0', fontSize: '0.9rem', transition: 'border-color 0.2s',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif"
  }

  const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px' }

  if (fetching) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #00C9A7', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <Link to="/dashboard" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b', textDecoration: 'none'
            }}><FiArrowLeft size={16} /></Link>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.6rem', fontWeight: '800', color: '#e2e8f0', marginBottom: '4px' }}>Edit Profile</h1>
              <p style={{ color: '#475569', fontSize: '0.85rem' }}>Update your public profile info</p>
            </div>
          </div>

          {error && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', fontSize: '0.875rem' }}>{error}</div>
          )}
          {success && (
            <div style={{ marginBottom: '20px', padding: '12px 16px', borderRadius: '10px', background: 'rgba(0,201,167,0.08)', border: '1px solid rgba(0,201,167,0.25)', color: '#00C9A7', fontSize: '0.875rem' }}>{success}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ padding: '28px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '22px' }}>

              {/* Profile Picture */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ position: 'relative' }}>
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="Profile"
                      style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(0,201,167,0.3)' }} />
                  ) : (
                    <div style={{
                      width: '90px', height: '90px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '32px', fontWeight: '800', color: '#0a0f1e', fontFamily: 'Syne, sans-serif'
                    }}>
                      {formData.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <label style={{
                    position: 'absolute', bottom: '0', right: '0',
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: '#00C9A7', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: 'pointer',
                    border: '2px solid #0a0f1e'
                  }}>
                    <FiUpload size={12} style={{ color: '#0a0f1e' }} />
                    <input type="file" accept="image/*" onChange={handleProfilePic} style={{ display: 'none' }} />
                  </label>
                </div>
                <p style={{ color: '#334155', fontSize: '0.78rem' }}>Click the icon to change profile picture</p>
              </div>

              {/* Name */}
              <div>
                <label style={labelStyle}>Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FiUser style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '15px', pointerEvents: 'none' }} />
                  <input type="text" name="name" value={formData.name} onChange={handleChange}
                    placeholder="Your full name" required style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              </div>

              {/* Country */}
              <div>
                <label style={labelStyle}>Country</label>
                <div style={{ position: 'relative' }}>
                  <FiGlobe style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#475569', fontSize: '15px', pointerEvents: 'none' }} />
                  <input type="text" name="country" value={formData.country} onChange={handleChange}
                    placeholder="e.g. India" style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label style={labelStyle}>Bio</label>
                <div style={{ position: 'relative' }}>
                  <FiFileText style={{ position: 'absolute', left: '14px', top: '14px', color: '#475569', fontSize: '15px', pointerEvents: 'none' }} />
                  <textarea name="bio" value={formData.bio} onChange={handleChange}
                    placeholder="Tell recruiters about yourself — your skills, interests, goals..."
                    rows={4}
                    style={{ ...inputStyle, padding: '12px 16px 12px 42px', resize: 'vertical', lineHeight: '1.6' }}
                    onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <p style={{ color: '#334155', fontSize: '0.75rem', marginTop: '5px' }}>
                  This will be visible on your public portfolio page
                </p>
              </div>

              {/* Public Profile Link */}
              <div style={{
                padding: '14px 16px', borderRadius: '10px',
                background: 'rgba(0,201,167,0.05)', border: '1px solid rgba(0,201,167,0.15)'
              }}>
                <p style={{ color: '#475569', fontSize: '0.82rem', marginBottom: '4px' }}>Your public portfolio URL:</p>
                <a href={`/u/${user?.username}`} target="_blank" rel="noreferrer"
                  style={{ color: '#00C9A7', fontSize: '0.88rem', fontWeight: '500' }}>
                  {window.location.origin}/u/{user?.username}
                </a>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: loading ? '#1a2a3a' : 'linear-gradient(135deg, #00C9A7, #0078ff)',
                  color: loading ? '#475569' : '#fff', fontSize: '0.95rem', fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Syne, sans-serif',
                  transition: 'all 0.3s ease', boxShadow: loading ? 'none' : '0 0 24px rgba(0,201,167,0.25)'
                }}>
                {loading ? 'Saving...' : 'Save Profile →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfileEdit