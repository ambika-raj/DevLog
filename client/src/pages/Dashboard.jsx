import { useState, useEffect } from 'react'
import axios from 'axios'\nimport API from '../api/axios'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import StatCard from '../components/StatCard'
import ProjectCard from '../components/ProjectCard'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { FiFolder, FiCheckCircle, FiClock, FiPauseCircle, FiFolderPlus } from 'react-icons/fi'

const Dashboard = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await API.get('https://devlog-eis1.onrender.com/api/projects')
        setProjects(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchProjects()
  }, [])

  // Stats
  const total = projects.length
  const completed = projects.filter(p => p.status === 'Completed').length
  const inProgress = projects.filter(p => p.status === 'In Progress').length
  const onHold = projects.filter(p => p.status === 'On Hold').length

  // Pie chart data
  const pieData = [
    { name: 'Completed', value: completed, color: '#00C9A7' },
    { name: 'In Progress', value: inProgress, color: '#fbbf24' },
    { name: 'On Hold', value: onHold, color: '#475569' },
  ].filter(d => d.value > 0)

  // Tech stack frequency
  const techCount = {}
  projects.forEach(p => p.techStack?.forEach(t => { techCount[t] = (techCount[t] || 0) + 1 }))
  const techData = Object.entries(techCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({ name, count }))

  const recentProjects = [...projects].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return
    try {
      await axios.delete(`https://devlog-eis1.onrender.com/api/projects/${id}`)
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
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontSize: '1.9rem',
              fontWeight: '800', color: '#e2e8f0', marginBottom: '6px'
            }}>
              Good to see you, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: '#475569', fontSize: '0.9rem' }}>
              Here's an overview of your dev journey
            </p>
          </div>

          {/* Stat Cards */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px', marginBottom: '32px'
          }}>
            <StatCard title="Total Projects" value={total} icon={<FiFolder />} color="#00C9A7" />
            <StatCard title="Completed" value={completed} icon={<FiCheckCircle />} color="#00C9A7"
              subtitle={total > 0 ? `${Math.round((completed / total) * 100)}% completion rate` : null} />
            <StatCard title="In Progress" value={inProgress} icon={<FiClock />} color="#fbbf24" />
            <StatCard title="On Hold" value={onHold} icon={<FiPauseCircle />} color="#94a3b8" />
          </div>

          {/* Charts Row */}
          {total > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '16px', marginBottom: '32px' }}>

              {/* Pie Chart */}
              <div style={{
                padding: '24px', borderRadius: '16px',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)'
              }}>
                <h3 style={{
                  fontFamily: 'Syne, sans-serif', fontSize: '0.95rem',
                  fontWeight: '700', color: '#e2e8f0', marginBottom: '20px'
                }}>Projects by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                      paddingAngle={3} dataKey="value">
                      {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: '#0d1a2e', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '8px', color: '#e2e8f0', fontSize: '0.82rem'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
                  {pieData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.color }} />
                      <span style={{ fontSize: '0.78rem', color: '#64748b' }}>{d.name} ({d.value})</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bar Chart */}
              {techData.length > 0 && (
                <div style={{
                  padding: '24px', borderRadius: '16px',
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.07)'
                }}>
                  <h3 style={{
                    fontFamily: 'Syne, sans-serif', fontSize: '0.95rem',
                    fontWeight: '700', color: '#e2e8f0', marginBottom: '20px'
                  }}>Most Used Tech Stack</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={techData} barSize={28}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: '#0d1a2e', border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '8px', color: '#e2e8f0', fontSize: '0.82rem'
                        }}
                      />
                      <Bar dataKey="count" fill="#00C9A7" radius={[4, 4, 0, 0]}
                        background={{ fill: 'rgba(255,255,255,0.02)', radius: [4, 4, 0, 0] }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}

          {/* Recent Projects */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{
                fontFamily: 'Syne, sans-serif', fontSize: '1.1rem',
                fontWeight: '700', color: '#e2e8f0'
              }}>Recent Projects</h2>
              <Link to="/projects" style={{
                fontSize: '0.82rem', color: '#00C9A7',
                textDecoration: 'none', fontWeight: '500'
              }}>View all →</Link>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#475569' }}>Loading...</div>
            ) : recentProjects.length === 0 ? (
              <div style={{
                textAlign: 'center', padding: '60px 24px',
                borderRadius: '16px', border: '1px dashed rgba(255,255,255,0.08)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗂️</div>
                <p style={{ color: '#475569', marginBottom: '20px', fontSize: '0.9rem' }}>
                  No projects yet. Start logging your work!
                </p>
                <Link to="/projects/add" style={{
                  display: 'inline-flex', alignItems: 'center', gap: '7px',
                  padding: '10px 20px', borderRadius: '10px',
                  background: 'linear-gradient(135deg, #00C9A7, #0078ff)',
                  color: '#fff', textDecoration: 'none',
                  fontSize: '0.875rem', fontWeight: '600',
                  boxShadow: '0 0 20px rgba(0,201,167,0.25)'
                }}>
                  <FiFolderPlus size={15} /> Add First Project
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                {recentProjects.map(project => (
                  <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard