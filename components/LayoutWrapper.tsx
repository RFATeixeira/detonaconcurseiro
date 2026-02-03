'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Páginas que não devem mostrar o Navbar
  const noNavbarRoutes = ['/login', '/register', '/'];
  
  const showNavbar = !noNavbarRoutes.includes(pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
}
