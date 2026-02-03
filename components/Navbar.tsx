'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, userProfile, logoutUser } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileConcursosOpen, setIsMobileConcursosOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutUser();
      router.push('/login');
    } catch {
      setIsLoggingOut(false);
    }
  };

  const formatDisplayName = (name: string) => {
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length === 0) return name;
    if (parts.length === 1) return parts[0];
    
    const firstName = parts[0];
    const secondName = parts[1];
    return `${firstName} ${secondName.charAt(0)}.`;
  };

  const isConcursosActive =
    pathname === '/meus-concursos' || pathname === '/concursos-disponiveis';

  return (
    <nav className="bg-gray-900 border-b border-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 shrink-0 min-w-0">
            <img 
              src="/logo.png" 
              alt="Detona Concurseiro" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="text-lg sm:text-2xl font-bold text-cyan-500 truncate">
              Detona
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`font-medium transition-colors ${
                isActive('/dashboard')
                  ? 'text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              Dashboard
            </Link>

            {/* Concursos Dropdown */}
            <div className="relative group">
              <button
                type="button"
                className={`font-medium transition-colors flex items-center gap-2 ${
                  isConcursosActive
                    ? 'text-cyan-400 border-b-2 border-cyan-500'
                    : 'text-gray-400 hover:text-cyan-400'
                }`}
              >
                Concursos
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className="absolute left-0 mt-2 w-56 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-sm shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-2">
                  <Link
                    href="/meus-concursos"
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive('/meus-concursos')
                        ? 'text-cyan-300'
                        : 'text-gray-300 hover:text-cyan-300'
                    }`}
                  >
                    Meus Concursos
                  </Link>
                  <Link
                    href="/concursos-disponiveis"
                    className={`block px-4 py-2 text-sm transition-colors ${
                      isActive('/concursos-disponiveis')
                        ? 'text-cyan-300'
                        : 'text-gray-300 hover:text-cyan-300'
                    }`}
                  >
                    Concursos Disponíveis
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/chat"
              className={`font-medium transition-colors ${
                isActive('/chat')
                  ? 'text-cyan-400 border-b-2 border-cyan-500'
                  : 'text-gray-400 hover:text-cyan-400'
              }`}
            >
              Chat ao vivo
            </Link>
          </div>

          {/* Right Section: User Info + Admin Shield + Logout */}
          <div className="hidden md:flex items-center space-x-4 shrink-0">
            <Link
              href="/perfil"
              className="text-gray-400 hover:text-cyan-400 transition-colors text-sm"
              title="Ir para perfil"
            >
              {userProfile?.displayName ? formatDisplayName(userProfile.displayName) : user?.email}
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title={isLoggingOut ? 'Desconectando...' : 'Sair'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" 
                />
              </svg>
            </button>
            {userProfile?.isAdmin && (
              <Link
                href="/admin"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                title="Admin"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
                  />
                </svg>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button & User Actions */}
          <div className="md:hidden flex items-center gap-3 shrink-0">
            <Link
              href="/perfil"
              className="text-gray-400 hover:text-cyan-400 transition-colors"
              title="Perfil"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </Link>
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="text-gray-400 hover:text-red-400 transition-colors disabled:opacity-50"
              title={isLoggingOut ? 'Desconectando...' : 'Sair'}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor" 
                className="w-5 h-5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" 
                />
              </svg>
            </button>
            {userProfile?.isAdmin && (
              <Link
                href="/admin"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
                title="Admin"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  strokeWidth={2} 
                  stroke="currentColor" 
                  className="w-5 h-5"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" 
                  />
                </svg>
              </Link>
            )}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
              aria-label="Abrir menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                className="w-6 h-6"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-2">
            <Link
              href="/dashboard"
              className={`block text-sm font-medium transition-colors ${
                isActive('/dashboard') ? 'text-cyan-400' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileConcursosOpen((prev) => !prev)}
              className={`w-full flex items-center justify-between text-sm font-medium transition-colors ${
                isConcursosActive ? 'text-cyan-400' : 'text-gray-300'
              }`}
            >
              Concursos
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-4 h-4 transition-transform ${
                  isMobileConcursosOpen ? 'rotate-180' : ''
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {isMobileConcursosOpen && (
              <div className="ml-4 space-y-1">
                <Link
                  href="/meus-concursos"
                  className={`block text-sm transition-colors ${
                    isActive('/meus-concursos') ? 'text-cyan-300' : 'text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Meus Concursos
                </Link>
                <Link
                  href="/concursos-disponiveis"
                  className={`block text-sm transition-colors ${
                    isActive('/concursos-disponiveis') ? 'text-cyan-300' : 'text-gray-300'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Concursos Disponíveis
                </Link>
              </div>
            )}

            <Link
              href="/chat"
              className={`block text-sm font-medium transition-colors ${
                isActive('/chat') ? 'text-cyan-400' : 'text-gray-300'
              }`}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Chat ao vivo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
