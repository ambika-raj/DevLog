import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi'

const NOTE_COLORS = [
  { label: 'Dark', value: '#1e293b' },
  { label: 'Teal', value: 'rgba(0,201,167,0.12)' },
  { label: 'Blue', value: 'rgba(0,120,255,0.12)' },
  { label: 'Yellow', value: 'rgba(251,191,36,0.12)' },
  { label: 'Red', value: 'rgba(239,68,68,0.12)' },
  { label: 'Purple', value: 'rgba(168,85,247,0.12)' },
]

const Notes = () => {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ title: '', content: '', color: '#1e293b' })
  const [creating, setCreating] = useState(false)
  const [newNote, setNewNote] = useState({ title: '', content: '', color: '#1e293b' })
  const titleRef = useRef(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  useEffect(() => {
    if (creating && titleRef.current) titleRef.current.focus()
  }, [creating])

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/notes')
      setNotes(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async () => {
    if (!newNote.title && !newNote.content) { setCreating(false); return }
    try {
      const res = await axios.post('http://localhost:5000/api/notes', newNote)
      setNotes([res.data, ...notes])
      setNewNote({ title: '', content: '', color: '#1e293b' })
      setCreating(false)
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (note) => {
    setEditingId(note._id)
    setEditData({ title: note.title, content: note.content, color: note.color })
  }

  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/notes/${id}`, editData)
      setNotes(notes.map(n => n._id === id ? res.data : n))
      setEditingId(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this note?')) return
    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`)
      setNotes(notes.filter(n => n._id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const cardStyle = (color) => ({
    borderRadius: '14px',
    background: color || '#1e293b',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    transition: 'all 0.3s ease',
    position: 'relative',
    minHeight: '160px'
  })

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0f1e', fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <div style={{ paddingTop: '64px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: '1.9rem', fontWeight: '800', color: '#e2e8f0', marginBottom: '6px' }}>
                Sticky Notes 📝
              </h1>
              <p style={{ color: '#475569', fontSize: '0.9rem' }}>{notes.length} note{notes.length !== 1 ? 's' : ''}</p>
            </div>
            <button onClick={() => setCreating(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', borderRadius: '12px', border: 'none',
                background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                color: '#fff', fontSize: '0.875rem', fontWeight: '600',
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                boxShadow: '0 0 20px rgba(0,201,167,0.25)'
              }}>
              <FiPlus size={15} /> New Note
            </button>
          </div>

          {/* Create Note Card */}
          {creating && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ ...cardStyle(newNote.color), border: '1px solid rgba(0,201,167,0.3)' }}>

                {/* Color Picker */}
                <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                  {NOTE_COLORS.map(c => (
                    <button key={c.value} type="button"
                      onClick={() => setNewNote({ ...newNote, color: c.value })}
                      style={{
                        width: '20px', height: '20px', borderRadius: '50%',
                        background: c.value === '#1e293b' ? '#1e293b' : c.value,
                        border: newNote.color === c.value ? '2px solid #00C9A7' : '2px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }} />
                  ))}
                </div>

                <input
                  ref={titleRef}
                  type="text"
                  placeholder="Note title..."
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#e2e8f0', fontSize: '1rem', fontWeight: '700',
                    fontFamily: 'Syne, sans-serif', width: '100%'
                  }}
                />
                <textarea
                  placeholder="Write your note here..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  rows={4}
                  style={{
                    background: 'transparent', border: 'none', outline: 'none',
                    color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.7',
                    fontFamily: "'DM Sans', sans-serif", width: '100%',
                    resize: 'none'
                  }}
                />
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                  <button onClick={() => { setCreating(false); setNewNote({ title: '', content: '', color: '#1e293b' }) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                      color: '#64748b', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif"
                    }}>
                    <FiX size={13} /> Cancel
                  </button>
                  <button onClick={handleCreate}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '7px 14px', borderRadius: '8px', cursor: 'pointer',
                      background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
                      color: '#00C9A7', fontSize: '0.82rem', fontFamily: "'DM Sans', sans-serif"
                    }}>
                    <FiCheck size={13} /> Save Note
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px', color: '#475569' }}>Loading notes...</div>
          ) : notes.length === 0 && !creating ? (
            <div style={{
              textAlign: 'center', padding: '80px 24px',
              borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px' }}>
                No notes yet. Create your first sticky note!
              </p>
              <button onClick={() => setCreating(true)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 20px', borderRadius: '10px', border: 'none',
                  background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                  color: '#fff', fontSize: '0.875rem', fontWeight: '600',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                }}>
                <FiPlus size={15} /> Create Note
              </button>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {notes.map(note => (
                <div key={note._id}
                  style={cardStyle(note.color)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)'
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  {editingId === note._id ? (
                    <>
                      {/* Color Picker in Edit */}
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '4px' }}>
                        {NOTE_COLORS.map(c => (
                          <button key={c.value} type="button"
                            onClick={() => setEditData({ ...editData, color: c.value })}
                            style={{
                              width: '18px', height: '18px', borderRadius: '50%',
                              background: c.value === '#1e293b' ? '#1e293b' : c.value,
                              border: editData.color === c.value ? '2px solid #00C9A7' : '2px solid rgba(255,255,255,0.1)',
                              cursor: 'pointer'
                            }} />
                        ))}
                      </div>
                      <input
                        type="text" value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        style={{
                          background: 'transparent', border: 'none', outline: 'none',
                          color: '#e2e8f0', fontSize: '1rem', fontWeight: '700',
                          fontFamily: 'Syne, sans-serif', width: '100%'
                        }}
                      />
                      <textarea
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        rows={4}
                        style={{
                          background: 'transparent', border: 'none', outline: 'none',
                          color: '#94a3b8', fontSize: '0.875rem', lineHeight: '1.7',
                          fontFamily: "'DM Sans', sans-serif", width: '100%', resize: 'none'
                        }}
                      />
                      <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setEditingId(null)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
                            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                            color: '#64748b', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif"
                          }}><FiX size={11} /> Cancel</button>
                        <button onClick={() => handleUpdate(note._id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '5px 10px', borderRadius: '6px', cursor: 'pointer',
                            background: 'rgba(0,201,167,0.1)', border: '1px solid rgba(0,201,167,0.3)',
                            color: '#00C9A7', fontSize: '0.78rem', fontFamily: "'DM Sans', sans-serif"
                          }}><FiCheck size={11} /> Save</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <h3 style={{
                          fontFamily: 'Syne, sans-serif', fontSize: '0.95rem',
                          fontWeight: '700', color: '#e2e8f0', marginBottom: '8px'
                        }}>{note.title || 'Untitled'}</h3>
                        <p style={{
                          color: '#94a3b8', fontSize: '0.85rem', lineHeight: '1.7',
                          whiteSpace: 'pre-wrap', wordBreak: 'break-word'
                        }}>{note.content}</p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                        <span style={{ color: '#334155', fontSize: '0.72rem' }}>
                          {new Date(note.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => startEdit(note)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: '28px', height: '28px', borderRadius: '7px', cursor: 'pointer',
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              color: '#64748b', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#0078ff'; e.currentTarget.style.borderColor = 'rgba(0,120,255,0.3)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                          ><FiEdit2 size={12} /></button>
                          <button onClick={() => handleDelete(note._id)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              width: '28px', height: '28px', borderRadius: '7px', cursor: 'pointer',
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              color: '#64748b', transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)' }}
                            onMouseLeave={(e) => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)' }}
                          ><FiTrash2 size={12} /></button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Notes