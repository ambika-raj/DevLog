import axios from 'axios'\nimport API from '../api/axios'

const API = axios.create({
  baseURL: 'https://devlog-eis1.onrender.com',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API