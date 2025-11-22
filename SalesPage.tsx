import React from 'react';
import MainLayout from '../components/MainLayout';
import ManagementPage from '../components/ManagementPage';

const SalesPage: React.FC = () => {
  return (
    <MainLayout>
      <ManagementPage title="Vendas" showAddButton={false}>
        {/* Conteúdo da página de vendas */}
        <p className="text-gray-700 dark:text-gray-300">
          Interface de vendas (a ser implementada).
        </p>
      </ManagementPage>
    </MainLayout>
  );
};

export default SalesPage;
