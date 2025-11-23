import React from 'react';

const DashboardPageComponent: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-background dark:text-text-primary mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-text-primary dark:bg-shadow-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-background dark:text-text-primary mb-2">Vendas Hoje</h2>
          <p className="text-3xl font-bold text-highlight">R$ 1.500,00</p>
        </div>
        {/* Card 2 */}
        <div className="bg-text-primary dark:bg-shadow-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-background dark:text-text-primary mb-2">Ingressos Vendidos</h2>
          <p className="text-3xl font-bold text-highlight">350</p>
        </div>
        {/* Card 3 */}
        <div className="bg-text-primary dark:bg-shadow-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-background dark:text-text-primary mb-2">Ocupação Média</h2>
          <p className="text-3xl font-bold text-highlight">75%</p>
        </div>
        {/* Card 4 */}
        <div className="bg-text-primary dark:bg-shadow-card p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-background dark:text-text-primary mb-2">Próxima Sessão</h2>
          <p className="text-xl text-background dark:text-text-primary">Oppenheimer - 19:00</p>
        </div>
      </div>
      {/* Adicione mais componentes de dashboard aqui */}
    </div>
  );
};

export default DashboardPageComponent;
