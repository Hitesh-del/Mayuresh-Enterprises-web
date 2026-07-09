import React from 'react';
import AppHeader from './AppHeader';
import DesktopHeader from './DesktopHeader';
import DesktopFooter from './DesktopFooter';
import MobileFooter from './MobileFooter';
import BottomNav from './BottomNav';
import DrawerMenu from './DrawerMenu';

interface LayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideHeader = false }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background overflow-x-hidden">
      <DrawerMenu />
      {!hideHeader && <DesktopHeader />}
      {!hideHeader && <AppHeader />}
      <div className="flex-1 w-full max-w-7xl mx-auto relative min-w-0">
        <main className="pb-24 md:pb-0 min-w-0">{children}</main>
      </div>
      <MobileFooter />
      <BottomNav />
      <DesktopFooter />
    </div>
  );
};

export default Layout;
