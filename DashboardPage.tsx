import React from 'react';
import { useAuth } from '../contexts/AuthContext';

import MainLayout from '../components/MainLayout';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <MainLayout>
      <h1 className="text-3xl font-bold text-dark-gray dark:text-white mb-4">
        Bem-vindo, {user?.email}!
      </h1>
      <p className="text-gray-700 dark:text-gray-300 mb-8">
        Esta é a página principal do sistema. Use o menu lateral para navegar pelas funcionalidades.
      </p>
      {/* Conteúdo do Dashboard */}
    </MainLayout>
  );
};

export default DashboardPage;
