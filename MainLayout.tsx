import React, { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Film, Users, Package, ShoppingCart, Settings, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface NavItemProps {
  to: string;
  icon: ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => (
  <Link
    to={to}
    className="flex items-center p-3 rounded-lg text-dark-gray dark:text-light-gray hover:bg-light-gray dark:hover:bg-gray-700 transition-colors duration-200"
  >
    {icon}
    <span className="ml-3">{label}</span>
  </Link>
);

const MainLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { to: '/movies', icon: <Film className="w-5 h-5" />, label: 'Filmes' },
    { to: '/products', icon: <Package className="w-5 h-5" />, label: 'Produtos' },
    { to: '/users', icon: <Users className="w-5 h-5" />, label: 'Usuários' },
    { to: '/complexes', icon: <Settings className="w-5 h-5" />, label: 'Complexos' },
    { to: '/showtimes', icon: <Film className="w-5 h-5" />, label: 'Sessões' },
    { to: '/sales', icon: <ShoppingCart className="w-5 h-5" />, label: 'Vendas' },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 p-4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-dark-gray flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="text-2xl font-bold text-primary-red">
            Frame-24
          </div>
          <ThemeToggle />
        </div>
        <nav className="flex-grow space-y-2">
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} icon={item.icon} label={item.label} />
          ))}
        </nav>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="w-full flex items-center p-3 rounded-lg text-dark-gray dark:text-light-gray hover:bg-light-gray dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="ml-3">Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 bg-light-gray dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
