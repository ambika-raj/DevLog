import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import axios from 'axios'\nimport API from '../api/axios'
import Navbar from '../components/Navbar'
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi'

const EditProject = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailPreview, setThumbnailPreview] = useState(null)
  const [techInput, setTechInput] = useState('')
  const [formData, setFormData] = useState({
    title: '', description: '', techStack: [],
    status: 'In Progress', githubLink: '', liveLink: ''
  })

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`https://devlog-eis1.onrender.com/api/projects/${id}`)
        const p = res.data
        setFormData({
          title: p.title || '',
          description: p.description || '',
          techStack: p.techStack || [],
          status: p.status || 'In Progress',
          githubLink: p.githubLink || '',
          liveLink: p.liveLink || ''
        })
        if (p.thumbnail) setThumbnailPreview(`https://devlog-eis1.onrender.com${p.thumbnail}`)
      } catch (err) {
        setError('Failed to load project')
      } finally {
        setFetching(false)
      }
    }
    fetchProject()
  }, [id])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleThumbnail = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Image must be under 5MB'); return }
    setThumbnail(file)
    setThumbnailPreview(URL.createObjectURL(file))
  }

  const addTech = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const tech = techInput.trim()
      if (tech && !formData.techStack.includes(tech)) {
        setFormData({ ...formData, techStack: [...formData.techStack, tech] })
      }
      setTechInput('')
    }
  }

  const removeTech = (tech) => setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, val]) => {
        if (key === 'techStack') data.append(key, val.join(','))
        else if (val !== undefined && val !== null) data.append(key, val)
      })
      if (thumbnail) data.append('thumbnail', thumbnail)
      await axios.put(`https://devlog-eis1.onrender.com/api/projects/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/projects')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px', borderRadius: '12px', outline: 'none',
    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
    color: '#e2e8f0', fontSize: '0.9rem', transition: 'border-color 0.2s',
    boxSizing: 'border-box', fontFamily: "'DM Sans', sans-serif"
  }

  const labelStyle = { display: 'block', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '500', marginBottom: '8px' }

  if (fetching) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: '36px', height: '36px', borderRadius: '50%',
        border: '2px solid #00C9A7', borderTopColor: 'transparent',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
            <Link to="/projects" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748b', textDecoration: 'none'
            }}><FiArrowLeft size={16} /></Link>
            <div>
              <h1 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.6rem',
                fontWeight: '800', color: '#e2e8f0', marginBottom: '4px'
              }}>Edit Project</h1>
              <p style={{ color: '#475569', fontSize: '0.85rem' }}>Update your project details</p>
            </div>
          </div>

          {error && (
            <div style={{
              marginBottom: '24px', padding: '12px 16px', borderRadius: '10px',
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              color: '#f87171', fontSize: '0.875rem'
            }}>{error}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{
              padding: '28px', borderRadius: '16px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', flexDirection: 'column', gap: '22px'
            }}>

              <div>
                <label style={labelStyle}>Project Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleChange}
                  required style={inputStyle}
                  onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>

              <div>
                <label style={labelStyle}>Description *</label>
                <textarea name="description" value={formData.description} onChange={handleChange}
                  required rows={4} style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                  onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </div>

              <div>
                <label style={labelStyle}>Tech Stack</label>
                <div style={{
                  minHeight: '48px', padding: '8px 12px', borderRadius: '12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', flexWrap: 'wrap', gap: '6px', alignItems: 'center'
                }}>
                  {formData.techStack.map((tech) => (
                    <span key={tech} style={{
                      display: 'inline-flex', alignItems: 'center', gap: '5px',
                      padding: '3px 10px', borderRadius: '20px',
                      background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.2)',
                      color: '#00C9A7', fontSize: '0.78rem', fontWeight: '500'
                    }}>
                      {tech}
                      <FiX size={11} style={{ cursor: 'pointer' }} onClick={() => removeTech(tech)} />
                    </span>
                  ))}
                  <input type="text" value={techInput}
                    onChange={(e) => setTechInput(e.target.value)} onKeyDown={addTech}
                    placeholder={formData.techStack.length === 0 ? "Type and press Enter" : ""}
                    style={{
                      border: 'none', outline: 'none', background: 'transparent',
                      color: '#e2e8f0', fontSize: '0.88rem', flex: 1, minWidth: '120px',
                      fontFamily: "'DM Sans', sans-serif"
                    }} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {['In Progress', 'Completed', 'On Hold'].map(s => (
                    <button key={s} type="button" onClick={() => setFormData({ ...formData, status: s })}
                      style={{
                        flex: 1, padding: '10px', borderRadius: '10px', cursor: 'pointer',
                        border: `1px solid ${formData.status === s ? 'rgba(0,201,167,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        background: formData.status === s ? 'rgba(0,201,167,0.08)' : 'transparent',
                        color: formData.status === s ? '#00C9A7' : '#64748b',
                        fontSize: '0.82rem', fontWeight: '500',
                        transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif"
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>GitHub Link</label>
                  <input type="text" name="githubLink" value={formData.githubLink} onChange={handleChange}
                    placeholder="https://github.com/..." style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
                <div>
                  <label style={labelStyle}>Live Link</label>
                  <input type="text" name="liveLink" value={formData.liveLink} onChange={handleChange}
                    placeholder="https://your-project.com" style={inputStyle}
                    onFocus={(e) => e.target.style.borderColor = '#00C9A7'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Project Thumbnail</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: '10px', padding: '24px',
                  borderRadius: '12px', cursor: 'pointer',
                  border: '2px dashed rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.02)', overflow: 'hidden',
                  minHeight: thumbnailPreview ? '180px' : '100px'
                }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(0,201,167,0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}
                >
                  {thumbnailPreview ? (
                    <img src={thumbnailPreview} alt="preview"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} />
                  ) : (
                    <>
                      <FiUpload size={22} style={{ color: '#475569' }} />
                      <p style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center' }}>
                        Click to upload new thumbnail
                      </p>
                    </>
                  )}
                  <input type="file" accept="image/*" onChange={handleThumbnail} style={{ display: 'none' }} />
                </label>
              </div>

              <button type="submit" disabled={loading}
                style={{
                  width: '100%', padding: '14px', borderRadius: '12px', border: 'none',
                  background: loading ? '#1a2a3a' : 'linear-gradient(135deg, #00C9A7, #0078ff)',
                  color: loading ? '#475569' : '#fff',
                  fontSize: '0.95rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: 'Syne, sans-serif', transition: 'all 0.3s ease',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(0,201,167,0.25)'
                }}>
                {loading ? 'Updating...' : 'Update Project →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditProject