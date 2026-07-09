import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, LayoutGrid, FileText, Phone, User, Briefcase } from 'lucide-react';

const navItems = [
  { name: 'Home', path: '/', icon: Home },
  { name: 'Categories', path: '/categories', icon: LayoutGrid },
  { name: 'Services', path: '/services', icon: Briefcase },
  { name: 'Enquiries', path: '/enquiries', icon: FileText },
  { name: 'Profile', path: '/profile', icon: User },
];

const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="max-w-md mx-auto flex items-center justify-around py-1.5 pb-5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-0.5 px-3 py-1 relative min-w-[56px]"
            >
              <Icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
