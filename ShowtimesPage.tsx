import React from 'react';
import MainLayout from '../components/MainLayout';
import ManagementPage from '../components/ManagementPage';

const ShowtimesPage: React.FC = () => {
  const handleAddShowtime = () => {
    alert('Funcionalidade de adicionar sessão será implementada.');
    // Navegar para a página de formulário de sessão
  };

  return (
    <MainLayout>
      <ManagementPage title="Gerenciamento de Sessões" onAddClick={handleAddShowtime}>
        {/* Conteúdo da tabela de sessões */}
        <p className="text-gray-700 dark:text-gray-300">
          Tabela de listagem de sessões (a ser implementada).
        </p>
      </ManagementPage>
    </MainLayout>
  );
};

export default ShowtimesPage;
