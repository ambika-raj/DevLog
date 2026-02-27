import axios from 'axios'

const API = axios.create({
  baseURL: 'https://devlog-eis1.onrender.com/',
})

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API