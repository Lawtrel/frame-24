import React from 'react';
import MainLayout from '../components/MainLayout';
import ManagementPage from '../components/ManagementPage';

const ComplexesPage: React.FC = () => {
  const handleAddComplex = () => {
    alert('Funcionalidade de adicionar complexo será implementada.');
    // Navegar para a página de formulário de complexo
  };

  return (
    <MainLayout>
      <ManagementPage title="Gerenciamento de Complexos" onAddClick={handleAddComplex}>
        {/* Conteúdo da tabela de complexos */}
        <p className="text-gray-700 dark:text-gray-300">
          Tabela de listagem de complexos (a ser implementada).
        </p>
      </ManagementPage>
    </MainLayout>
  );
};

export default ComplexesPage;
