import React, { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface ManagementPageProps {
  title: string;
  children: ReactNode;
  onAddClick?: () => void;
  showAddButton?: boolean;
}

const ManagementPage: React.FC<ManagementPageProps> = ({ title, children, onAddClick, showAddButton = true }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-dark-gray dark:text-white">
          {title}
        </h1>
        {showAddButton && (
          <button
            onClick={onAddClick}
            className="flex items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-red"
          >
            <Plus className="w-5 h-5 mr-2" />
            Adicionar
          </button>
        )}
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {children}
      </div>
    </div>
  );
};

export default ManagementPage;
