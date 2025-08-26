import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/app/reducers/AuthReducers';
import {
  Video,
  Calendar,
  Users,
  Settings,
  LogOut,
  LayoutDashboard,
  Plus
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
}

const PractitionerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Navigation différente selon le rôle
  const navigation: NavigationItem[] = user?.role_id === 2 ? [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Consultations', href: '/consultations', icon: Video },
    { name: 'Disponibilités', href: '/availabilities', icon: Calendar },
    { name: 'Patients', href: '/patients', icon: Users },
  ] : [
    { name: 'Tableau de bord', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Mes rendez-vous', href: '/consultations', icon: Video },
    { name: 'Prendre RDV', href: '/booking', icon: Plus },
  ];

  const renderIcon = (Icon: LucideIcon, className: string = "h-6 w-6") => {
    return <Icon className={className} />;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-8 w-auto"
                  src="/logo.png"
                  alt="PawMed"
                />
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <button
                  onClick={() => navigate('/settings')}
                  className="p-2 rounded-full hover:bg-gray-100"
                >
                  {renderIcon(Settings, "h-6 w-6 text-gray-500")}
                </button>
              </div>
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    {renderIcon(LogOut, "h-6 w-6 text-gray-500")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Navigation Cards */}
          <div className="flex space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                  isActive(item.href)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                } shadow-sm`}
              >
                {renderIcon(item.icon)}
                <span className="mt-2 text-sm font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Welcome Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {user?.role_id === 2 ? `Bonjour, Dr. ${user?.name}` : `Bonjour, ${user?.name}`}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {user?.role_id === 2
                  ? "Voici un aperçu de votre activité aujourd'hui"
                  : "Bienvenue dans votre espace patient"}
              </p>
            </div>
            {user?.role_id === 2 ? (
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/consultations')}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Video className="h-4 w-4 mr-2" />
                  Démarrer une consultation
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/booking')}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Prendre rendez-vous
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="mt-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default PractitionerLayout;
