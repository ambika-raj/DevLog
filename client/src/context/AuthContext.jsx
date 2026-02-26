import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

// Step 1 - Create the context
const AuthContext = createContext()

// Step 2 - Create the provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Step 3 - Check if user is already logged in when app loads
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem('token')

      if (token) {
        try {
          // set token in axios default headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`

          // fetch user info
          const res = await axios.get('http://localhost:5000/api/auth/me')
          setUser(res.data)
        } catch (error) {
          // token invalid or expired
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        }
      }

      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  // Step 4 - Login function
  const login = async (email, password) => {
    const res = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    })

    // save token in localStorage
    localStorage.setItem('token', res.data.token)

    // set token in axios default headers for future requests
    axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`

    setUser(res.data)
    return res.data
  }

  // Step 5 - Logout function
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Step 6 - Custom hook for easy access
export const useAuth = () => useContext(AuthContext)