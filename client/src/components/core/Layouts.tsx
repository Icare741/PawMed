import React from 'react';
import { PawPrint, ClipboardList, Users, MessageCircle } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import SidebarClients from './clients/SidebarClients';

interface LayoutProps {
  children: React.ReactNode;
}


const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen w-full">

      <SidebarClients />
      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Layout;
