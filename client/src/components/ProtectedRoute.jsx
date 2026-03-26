import { Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-charcoal/70">
        Yükleniyor...
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
