import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Home, ShoppingCart, Package, Users2, LineChart, Settings, Package2, Clock } from 'lucide-react';

// Composant SidebarLink modifié
const SidebarLink = ({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
          }`}
        >
          {icon}
          <span className='sr-only'>{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side='right'>{label}</TooltipContent>
    </Tooltip>
  );
};

export function Sidebar() {
  return (
    <aside className='fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex'>
      <nav className='flex flex-col items-center gap-4 px-2 sm:py-5'>
        {/* Logo */}
        <Link
          to='/'
          className='group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base'
        >
          <Package2 className='h-4 w-4 transition-all group-hover:scale-110' />
          <span className='sr-only'>Acme Inc</span>
        </Link>

        {/* Liens de navigation */}
        <SidebarLink icon={<Home className='h-5 w-5' />} label='Dashboard' to='/dashboard' />
        <SidebarLink icon={<Clock className='h-5 w-5' />} label='Historique' to='/consultations' />
      </nav>
      <nav className='mt-auto flex flex-col items-center gap-4 px-2 sm:py-5'>
        <SidebarLink icon={<Settings className='h-5 w-5' />} label='Settings' to='/settings' />
      </nav>
    </aside>
  );
}
