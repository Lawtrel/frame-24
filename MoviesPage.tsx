import React from 'react';
import MainLayout from '../components/MainLayout';
import ManagementPage from '../components/ManagementPage';

const MoviesPage: React.FC = () => {
  const handleAddMovie = () => {
    alert('Funcionalidade de adicionar filme será implementada.');
    // Navegar para a página de formulário de filme
  };

  return (
    <MainLayout>
      <ManagementPage title="Gerenciamento de Filmes" onAddClick={handleAddMovie}>
        {/* Conteúdo da tabela de filmes */}
        <p className="text-gray-700 dark:text-gray-300">
          Tabela de listagem de filmes (a ser implementada).
        </p>
      </ManagementPage>
    </MainLayout>
  );
};

export default MoviesPage;
