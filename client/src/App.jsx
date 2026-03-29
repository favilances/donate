import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Profile from './pages/Profile.jsx'
import Register from './pages/Register.jsx'
import Wallet from './pages/Wallet.jsx'
import WalletOverlay from './pages/WalletOverlay.jsx'
import Cookies from './pages/legal/Cookies.jsx'
import Privacy from './pages/legal/Privacy.jsx'
import Terms from './pages/legal/Terms.jsx'
import Donate from './pages/Donate.jsx'

function App() {
  const location = useLocation()
  const isOverlayRoute = location.pathname.startsWith('/wallet/overlay')

  return (
    <div className={`relative flex min-h-screen flex-col overflow-hidden ${isOverlayRoute ? 'bg-slate-950' : 'bg-transparent'}`}>
      {!isOverlayRoute && (
        <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[360px] bg-gradient-hero blur-3xl" aria-hidden />
      )}
      {!isOverlayRoute && <Navbar />}
      <main className={`relative z-10 flex-1 ${isOverlayRoute ? '' : 'pb-16'}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/profile/:username/donate" element={<Donate />} />
          <Route path="/legal/terms" element={<Terms />} />
          <Route path="/legal/privacy" element={<Privacy />} />
          <Route path="/legal/cookies" element={<Cookies />} />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <Wallet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet/overlay"
            element={
              <ProtectedRoute>
                <WalletOverlay />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isOverlayRoute && <Footer />}
    </div>
  )
}

export default App
