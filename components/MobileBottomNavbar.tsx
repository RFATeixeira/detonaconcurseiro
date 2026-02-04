'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { HeroIcons } from './HeroIcons';

interface MobileBottomNavbarProps {
  onSidebarToggle?: () => void;
  currentRoom?: string;
  unreadNotifications?: number;
  onNotificationsClick?: () => void;
  showMenu?: boolean;
}

export default function MobileBottomNavbar({
  onSidebarToggle,
  currentRoom,
  unreadNotifications = 0,
  onNotificationsClick,
  showMenu = false,
}: MobileBottomNavbarProps) {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;
  const isInChatPage = pathname === '/chat';

  const navItems = [
    {
      icon: <HeroIcons.Home className="w-6 h-6" />,
      label: 'Dashboard',
      href: '/dashboard',
      tooltip: 'Dashboard',
    },
    {
      icon: <HeroIcons.AcademicCap className="w-6 h-6" />,
      label: 'Concursos',
      href: '/meus-concursos',
      tooltip: 'Meus Concursos',
    },
    {
      icon: <HeroIcons.ChatBubbleLeftRight className="w-6 h-6" />,
      label: 'Chat',
      href: '/chat',
      tooltip: 'Chat ao vivo',
    },
    {
      icon: <HeroIcons.UserCircle className="w-6 h-6" />,
      label: 'Perfil',
      href: '/perfil',
      tooltip: 'Meu Perfil',
    },
  ];

  const handleNotificationsClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  return (
    <>
      {/* Mobile Bottom Navbar - Floating Island */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 pb-4 px-4">
        <nav
          className="rounded-full py-3 px-2 flex items-center justify-around gap-1 shadow-2xl border border-white/20 w-full"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.8) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {navItems.map((item) => {
            const active =
              item.href === '/chat'
                ? pathname === '/chat'
                : pathname === item.href ||
                  (item.href === '/meus-concursos' &&
                    (pathname === '/meus-concursos' ||
                      pathname.startsWith('/meus-concursos/')));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group ${
                  active
                    ? 'bg-linear-to-br from-cyan-500/40 to-blue-500/40 text-cyan-300 shadow-lg shadow-cyan-500/30'
                    : 'text-gray-400 hover:text-cyan-300 hover:bg-white/5'
                }`}
                title={item.tooltip}
              >
                {item.icon}
                {active && (
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-pulse"></div>
                )}
              </Link>
            );
          })}

          {/* Notifications Button - Only on chat page */}
          {isInChatPage && (
            <button
              onClick={handleNotificationsClick}
              className="relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 text-gray-400 hover:text-red-300 hover:bg-white/5 group"
              title="Notificações"
            >
              <HeroIcons.Bell className="w-6 h-6" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-linear-to-br from-red-500 to-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
          )}

          {/* Menu Button - Only on chat page */}
          {isInChatPage && (
            <button
              onClick={onSidebarToggle}
              className={`relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 group ${
                showMenu
                  ? 'bg-linear-to-br from-cyan-500/40 to-blue-500/40 text-cyan-300 shadow-lg shadow-cyan-500/30'
                  : 'text-gray-400 hover:text-cyan-300 hover:bg-white/5'
              }`}
              title="Menu"
            >
              <HeroIcons.Bars3 className="w-6 h-6" />
            </button>
          )}
        </nav>
      </div>

      {/* Safe area spacer on mobile */}
      <div className="md:hidden h-20 shrink-0"></div>
    </>
  );
}
