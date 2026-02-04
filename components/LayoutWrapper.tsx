'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import MobileBottomNavbar from './MobileBottomNavbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Páginas que não devem mostrar o Navbar desktop
  const noNavbarRoutes = ['/login', '/register', '/'];
  
  // Páginas que não devem mostrar a Navbar mobile
  const noMobileNavbarRoutes = ['/login', '/register', '/', '/chat'];
  
  const showNavbar = !noNavbarRoutes.includes(pathname);
  const showMobileNavbar = !noMobileNavbarRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
      {showMobileNavbar && <MobileBottomNavbar />}
    </>
  );
}
