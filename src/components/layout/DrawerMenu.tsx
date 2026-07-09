import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { X, Home, LayoutGrid, Printer, Boxes, MapPin, Heart, Phone, Info, LogOut, User, Building2, Briefcase } from 'lucide-react';
import { Sheet, SheetContent, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { setDrawerOpen } from '@/store/uiSlice';
import { logout } from '@/store/authSlice';
import { supabase } from '@/lib/supabase';
import type { RootState } from '@/store';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

const menuItems = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: LayoutGrid, label: 'Categories', path: '/categories' },
  { icon: Printer, label: 'Products', path: '/products' },
  { icon: Briefcase, label: 'Services', path: '/services' },
  { icon: Building2, label: 'About Us', path: '/about' },
  { icon: Boxes, label: 'My Enquiries', path: '/enquiries' },
  { icon: Phone, label: 'Contact Us', path: '/contact' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const DrawerMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const open = useSelector((state: RootState) => state.ui.drawerOpen);
  const { user } = useSelector((state: RootState) => state.auth);

  const handleNavigate = (path: string) => {
    dispatch(setDrawerOpen(false));
    navigate(path);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => dispatch(setDrawerOpen(v))}>
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <SheetDescription className="sr-only">Browse app sections and settings</SheetDescription>
        <div className="flex flex-col h-full">
          {/* Header - no close button here, Sheet provides its own */}
          <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
            <img src={logoUrl} alt="Mayuresh Enterprises" className="w-8 h-8 rounded-lg object-contain bg-white border border-sidebar-border shrink-0" />
            <h2 className="text-sm font-bold text-sidebar-foreground truncate">
              Mayuresh Enterprises
            </h2>
          </div>

          {/* User info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-sidebar-foreground truncate">
                  {user?.email ? user.email.split('@')[0] : 'Guest User'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email || 'Welcome to Mayuresh Enterprises'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu items */}
          <nav className="flex-1 overflow-y-auto py-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent'
                  }`}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
            <button
              onClick={async () => {
                dispatch(setDrawerOpen(false));
                await supabase.auth.signOut();
                dispatch(logout());
                navigate('/profile');
              }}
              className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Log Out
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DrawerMenu;
