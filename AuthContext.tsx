import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  // Adicione outros campos do usuário conforme a API
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  // Adicione outras funções de autenticação (e.g., register, forgotPassword)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Em um projeto real, você faria uma requisição para validar o token e buscar os dados do usuário
      // Exemplo simplificado:
      setIsAuthenticated(true);
      // Aqui você buscaria os dados do usuário (e.g., GET /v1/users/me)
      // Por enquanto, vamos simular um usuário
      setUser({ id: '1', email: 'user@example.com' });
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Endpoint de login: POST /v1/auth/login
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user: userData } = response.data;

      localStorage.setItem('token', access_token);
      setIsAuthenticated(true);
      setUser(userData); // Assumindo que a API retorna os dados do usuário
      navigate('/dashboard'); // Redireciona para a página principal após o login
    } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Falha no login. Verifique suas credenciais.');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/'); // Redireciona para a página de login
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
