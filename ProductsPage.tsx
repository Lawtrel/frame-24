import React from 'react';
import MainLayout from '../components/MainLayout';
import ManagementPage from '../components/ManagementPage';

const ProductsPage: React.FC = () => {
  const handleAddProduct = () => {
    alert('Funcionalidade de adicionar produto será implementada.');
    // Navegar para a página de formulário de produto
  };

  return (
    <MainLayout>
      <ManagementPage title="Gerenciamento de Produtos" onAddClick={handleAddProduct}>
        {/* Conteúdo da tabela de produtos */}
        <p className="text-gray-700 dark:text-gray-300">
          Tabela de listagem de produtos (a ser implementada).
        </p>
      </ManagementPage>
    </MainLayout>
  );
};

export default ProductsPage;
