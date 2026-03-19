import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Users, Settings, History, LayoutDashboard } from 'lucide-react';
import { cn } from './UI';

export const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: 'Home', path: '/dashboard' },
    { icon: Shield, label: 'Armed', path: '/armed' },
    { icon: Users, label: 'Contacts', path: '/contacts' },
    { icon: Settings, label: 'Settings', path: '/triggers' },
    { icon: History, label: 'History', path: '/history' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-sand/20 bg-white/80 backdrop-blur-lg px-2 pb-safe pt-2">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 rounded-2xl px-3 py-2 transition-all active:scale-90',
                isActive ? 'bg-brand-red/10 text-brand-red' : 'text-brand-sand hover:text-brand-charcoal'
              )}
            >
              <item.icon className={cn('h-6 w-6', isActive ? 'fill-current' : '')} />
              <span className="text-[10px] font-bold uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export const SectionHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="mb-8 flex items-end justify-between px-1">
    <div className="space-y-1">
      <h2 className="text-3xl font-bold tracking-tight text-brand-charcoal">{title}</h2>
      {subtitle && <p className="text-sm font-medium text-brand-sand">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);
