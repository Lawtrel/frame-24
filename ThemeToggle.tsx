import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full transition-colors duration-300
                 bg-light-gray dark:bg-dark-gray
                 text-dark-gray dark:text-light-gray
                 hover:bg-gray-300 dark:hover:bg-gray-700
                 focus:outline-none focus:ring-2 focus:ring-primary-red"
      aria-label="Alternar tema"
    >
      {theme === 'light' ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  );
};

export default ThemeToggle;
