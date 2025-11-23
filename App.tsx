import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import ThemeToggle from './components/ThemeToggle'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import MoviesPage from './pages/MoviesPage'
import ProductsPage from './pages/ProductsPage'
import UsersPage from './pages/UsersPage'
import ComplexesPage from './pages/ComplexesPage'
import ShowtimesPage from './pages/ShowtimesPage'
import SalesPage from './pages/SalesPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <Router>
        {/* O min-h-screen e as classes de cor de fundo serão aplicadas no body via index.css e ThemeContext */}
        <div className="min-h-screen">

          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/movies" element={<MoviesPage />} />
              <Route path="/products" element={<ProductsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/complexes" element={<ComplexesPage />} />
              <Route path="/showtimes" element={<ShowtimesPage />} />
              <Route path="/sales" element={<SalesPage />} />
              {/* Rotas para as funcionalidades serão adicionadas aqui */}
            </Route>
            {/* Outras rotas serão adicionadas aqui */}
          </Routes>
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
