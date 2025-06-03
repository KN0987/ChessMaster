import { ReactNode, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Don't show footer in game rooms
  const isGameRoom = location.pathname.includes('/game/');
  

  return (
    <div className={`min-h-screen flex flex-col`}>
      <Navbar/>
      <main className="flex-1">
        {children}
      </main>
      {!isGameRoom && <Footer />}
    </div>
  );
};

export default Layout;