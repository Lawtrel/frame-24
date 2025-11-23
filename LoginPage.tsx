import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-dark-gray rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center text-dark-gray dark:text-white">
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-primary-red focus:border-primary-red
                         bg-white dark:bg-gray-800 text-dark-gray dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400
                         focus:outline-none focus:ring-primary-red focus:border-primary-red
                         bg-white dark:bg-gray-800 text-dark-gray dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-primary-red hover:text-red-700">
                Esqueceu a senha?
              </a>
            </div>
          </div>
          {error && (
            <p className="text-sm text-center text-primary-red">{error}</p>
          )}
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
            >
              Entrar
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
          <a href="#" className="font-medium text-primary-red hover:text-red-700">
            Não tem conta? Registre-se
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
