import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, Bell } from 'lucide-react';
import { toggleDrawer } from '@/store/uiSlice';
import { useNotifications } from '@/hooks/useSupabaseData';
import type { RootState } from '@/store';

const logoUrl = 'https://miaoda-conversation-file.s3cdn.medo.dev/user-cc0cvmcrcxkw/app-cdkoojeqtu69/20260706/mayuresh.jpeg';

const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const { data: notifications = [] } = useNotifications(user?.id);
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <header className="md:hidden sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          onClick={() => dispatch(toggleDrawer())}
          className="p-2 -ml-2 hover:bg-muted rounded-lg transition-colors shrink-0"
          aria-label="Menu"
        >
          <Menu className="w-6 h-6 text-foreground" />
        </button>

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 min-w-0"
        >
          <img src={logoUrl} alt="Mayuresh Enterprises" className="w-8 h-8 rounded-lg object-contain bg-white border border-border shrink-0" />
          <div className="flex flex-col min-w-0 text-left">
            <h1 className="text-lg font-bold leading-tight truncate text-foreground">
              Mayuresh Enterprises
            </h1>
            <p className="text-[10px] text-muted-foreground tracking-wide truncate">Print Your Imagination</p>
          </div>
        </button>

        <div className="flex items-center gap-1 ml-auto shrink-0">
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 flex items-center justify-center text-[9px] font-bold bg-primary text-primary-foreground rounded-full">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
