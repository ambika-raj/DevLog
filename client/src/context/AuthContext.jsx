import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import API from '../api/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          API.defaults.headers.common['Authorization'] = `Bearer ${token}`
          const res = await API.get('/api/auth/me')
          setUser(res.data)
        } catch (error) {
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
          delete API.defaults.headers.common['Authorization']
        }
      }
      setLoading(false)
    }
    checkLoggedIn()
  }, [])

  const login = async (email, password) => {
    const res = await API.post('/api/auth/login', {
      email,
      password,
    })
    localStorage.setItem('token', res.data.token)
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    API.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`
    setUser(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    delete API.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)