import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { fetchCurrentUser, loginUser, registerUser } from '../api/auth'

export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    const token = window.localStorage.getItem('donation_token')
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const userResponse = await fetchCurrentUser()
      setUser(userResponse.user)
    } catch (error) {
      window.localStorage.removeItem('donation_token')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const refreshUser = useCallback(async () => {
    try {
      const { user: freshUser } = await fetchCurrentUser()
      setUser(freshUser)
      return freshUser
    } catch (error) {
      window.localStorage.removeItem('donation_token')
      setUser(null)
      throw error
    }
  }, [])

  const handleLogin = useCallback(async (credentials) => {
    const data = await loginUser(credentials)
    window.localStorage.setItem('donation_token', data.token)
    setUser(data.user)
    return data.user
  }, [])

  const handleRegister = useCallback(async (payload) => {
    const data = await registerUser(payload)
    window.localStorage.setItem('donation_token', data.token)
    setUser(data.user)
    return data.user
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem('donation_token')
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login: handleLogin,
      register: handleRegister,
      logout,
      refreshUser,
      isAuthenticated: Boolean(user),
    }),
    [user, loading, handleLogin, handleRegister, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
