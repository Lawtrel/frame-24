import React from 'react';
import MainLayout from '../components/MainLayout';
import ManagementPage from '../components/ManagementPage';

const UsersPage: React.FC = () => {
  const handleAddUser = () => {
    alert('Funcionalidade de adicionar usuário será implementada.');
    // Navegar para a página de formulário de usuário
  };

  return (
    <MainLayout>
      <ManagementPage title="Gerenciamento de Usuários" onAddClick={handleAddUser}>
        {/* Conteúdo da tabela de usuários */}
        <p className="text-gray-700 dark:text-gray-300">
          Tabela de listagem de usuários (a ser implementada).
        </p>
      </ManagementPage>
    </MainLayout>
  );
};

export default UsersPage;
