import api from './axiosInstance'

export const registerUser = async (payload) => {
  const { data } = await api.post('/api/auth/register', payload)
  return data
}

export const loginUser = async (payload) => {
  const { data } = await api.post('/api/auth/login', payload)
  return data
}

export const fetchCurrentUser = async () => {
  const { data } = await api.get('/api/auth/me')
  return data
}

export const fetchProfileByUsername = async (username) => {
  const { data } = await api.get(`/api/users/${username}`)
  return data
}

export const updateProfile = async (payload) => {
  const { data } = await api.put('/api/users/update', payload)
  return data
}

export const fetchWalletSummary = async () => {
  const { data } = await api.get('/api/wallet')
  return data
}

export const createDonation = async (payload) => {
  const { data } = await api.post('/api/donations', payload)
  return data
}

export const fetchSelectedDonations = async (ids) => {
  const query = Array.isArray(ids) ? ids.join(',') : ids
  const { data } = await api.get(`/api/donations/selected`, {
    params: { ids: query },
  })
  return data
}
