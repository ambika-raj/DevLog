// import axios from 'axios'  
// import API from '../api/axios'

// const API = axios.create({
//   baseURL: 'https://devlog-eis1.onrender.com',
// })

// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token')
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// export default API

import axios from 'axios'

const API = axios.create({
<<<<<<< HEAD
  baseURL: 'https://devlog-eis1.onrender.com',
=======
  baseURL: import.meta.env.VITE_API_URL || '',
>>>>>>> d73a41cc4a259a73d5120d7c7070bf8deab1c9cb
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default API