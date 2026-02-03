'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, onSnapshot, query, serverTimestamp, limit, Timestamp, where, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import GlassBackground from '@/components/GlassBackground';
import { db } from '@/lib/firebase';
import { useConcursos } from '@/lib/use-concursos';

// Forçar renderização dinâmica para evitar prerender
export const dynamic = 'force-dynamic';

type ChatMessage = {
  id: string;
  text: string;
  userId: string;
  displayName: string;
  isAdmin?: boolean;
  isAlert?: boolean;
  chatRoom?: string;
  createdAt?: Timestamp | null;
  replyTo?: {
    id: string;
    text: string;
    displayName: string;
  };
};

type ChatRoom = {
  id: string;
  name: string;
  type: 'geral' | 'concurso';
};

export default function ChatPage() {
  const { user, userProfile, loading } = useAuth();
  const { concursos, loading: concursosLoading } = useConcursos();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string>('geral');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isAlertMode, setIsAlertMode] = useState(false);
  const [activeAlerts, setActiveAlerts] = useState<Set<string>>(new Set());
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);

  // Carregar notificações lidas do localStorage ao montar
  useEffect(() => {
    if (user) {
      const storageKey = `readNotifications_${user.uid}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setReadNotifications(new Set(parsed));
        } catch (error) {
          console.error('Erro ao carregar notificações lidas:', error);
        }
      }
    }
  }, [user]);

  // Salvar notificações lidas no localStorage sempre que mudar
  useEffect(() => {
    if (user && readNotifications.size > 0) {
      const storageKey = `readNotifications_${user.uid}`;
      localStorage.setItem(storageKey, JSON.stringify(Array.from(readNotifications)));
    }
  }, [readNotifications, user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }, [messages, activeRoom]);

  // Chat rooms disponíveis
  const chatRooms = useMemo<ChatRoom[]>(() => {
    const rooms: ChatRoom[] = [{ id: 'geral', name: 'Chat Geral', type: 'geral' }];
    
    concursos.forEach((concurso) => {
      rooms.push({
        id: `concurso-${concurso.id}`,
        name: concurso.nomeConcurso,
        type: 'concurso',
      });
    });
    
    return rooms;
  }, [concursos]);

  useEffect(() => {
    // Verificar se db está inicializado (cliente apenas)
    if (!db) return;
    
    const chatQuery = query(
      collection(db, 'live-chat'),
      where('chatRoom', '==', activeRoom),
      limit(100)
    );

    const unsubscribe = onSnapshot(chatQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data() as Omit<ChatMessage, 'id'>;
        return { id: doc.id, ...docData };
      });
      
      // Ordenar no cliente para evitar necessidade de índice composto
      data.sort((a, b) => {
        const timeA = a.createdAt?.toMillis() || 0;
        const timeB = b.createdAt?.toMillis() || 0;
        return timeA - timeB;
      });
      
      setMessages(data);
    });

    return () => unsubscribe();
  }, [activeRoom]);

  const displayName = useMemo(() => {
    if (userProfile?.displayName) return userProfile.displayName;
    return user?.email || 'Usuário';
  }, [userProfile, user]);

  // Marcar notificações como lidas ao abrir painel
  const handleOpenNotifications = () => {
    setIsNotificationPanelOpen(true);
    markNotificationsAsRead();
  };

  // Marcar notificações como lidas
  const markNotificationsAsRead = () => {
    const newRead = new Set(readNotifications);
    messages.forEach((msg) => {
      if (msg.isAlert) {
        newRead.add(msg.id);
      }
    });
    setReadNotifications(newRead);
  };

  // Fechar painel de notificações
  const handleCloseNotifications = () => {
    markNotificationsAsRead();
    setIsNotificationPanelOpen(false);
  };

  // Contar notificações não lidas
  const unreadNotifications = useMemo(() => {
    return messages.filter((msg) => msg.isAlert && !readNotifications.has(msg.id)).length;
  }, [messages, readNotifications]);

  const handleSend = async () => {
    if (!user || !message.trim() || !db) return;
    setSending(true);
    try {
      const messageData: any = {
        text: message.trim(),
        userId: user.uid,
        displayName,
        isAdmin: userProfile?.isAdmin || false,
        isAlert: (userProfile?.isAdmin && isAlertMode) || false,
        chatRoom: activeRoom,
        createdAt: serverTimestamp(),
      };

      // Adicionar referência de resposta se estiver respondendo
      if (replyingTo) {
        messageData.replyTo = {
          id: replyingTo.id,
          text: replyingTo.text,
          displayName: replyingTo.displayName,
        };
      }

      await addDoc(collection(db, 'live-chat'), messageData);
      setMessage('');
      setReplyingTo(null);
      
      // Adicionar alerta ao conjunto de alertas ativos
      if (userProfile?.isAdmin && isAlertMode) {
        setActiveAlerts((prev) => new Set(prev).add(activeRoom));
      }
    } finally {
      setSending(false);
    }
  };



  const handleDeleteMessage = async (messageId: string) => {
    if (!userProfile?.isAdmin) return;
    try {
      await deleteDoc(doc(db, 'live-chat', messageId));
    } catch (error) {
      console.error('Erro ao deletar mensagem:', error);
    }
  };

  const handleReplyMessage = (msg: ChatMessage) => {
    setReplyingTo(msg);
  };

  const activeRoomName = useMemo(() => {
    return chatRooms.find((room) => room.id === activeRoom)?.name || 'Chat';
  }, [activeRoom, chatRooms]);

  if (loading || concursosLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen bg-gray-950 relative overflow-hidden"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)',
        }}
      >
        <GlassBackground />
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-gray-950 overflow-hidden"
      style={{
        backgroundImage:
          'linear-gradient(135deg, rgb(3, 7, 18) 0%, rgb(17, 24, 39) 50%, rgb(0, 0, 0) 100%)',
      }}
    >
      <GlassBackground />

      <main className="relative z-10 w-full h-full flex flex-col overflow-hidden pt-[calc(env(safe-area-inset-top)+4rem)] md:pt-24 md:px-4">
        <div className="backdrop-blur-sm bg-white/5 rounded-none md:rounded-2xl shadow-2xl border-0 md:border border-white/10 overflow-x-hidden overflow-y-hidden flex md:h-[calc(100vh-8rem)] h-full flex-col md:flex-row w-full">
          {/* Sidebar - Menu lateral */}
          <div
            className={`${
              isSidebarOpen ? 'w-full md:w-80 h-screen md:h-auto' : 'w-0 h-0 md:h-auto'
            } transition-all duration-300 border-r-0 md:border-r border-white/10 overflow-hidden flex flex-col absolute md:relative md:block z-50 md:z-10 bg-gray-950 md:bg-transparent`}
          >
            <div
              className="shrink-0 backdrop-blur-sm bg-gray-900/30 px-4 py-4 border-b border-white/10 flex items-center justify-between"
              style={{
                backgroundImage:
                  'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              }}
            >
              <h3 className="text-lg font-bold text-white">Conversas</h3>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden text-gray-400 hover:text-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Chat Rooms - with flex-1 to push admin to bottom */}
            <div className="flex-1 overflow-y-auto">
              {chatRooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => {
                    setActiveRoom(room.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full px-4 py-4 text-left border-b border-white/5 transition-all ${
                    activeRoom === room.id
                      ? 'bg-cyan-500/10 border-l-4 border-l-cyan-400'
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        room.type === 'geral'
                          ? 'bg-cyan-500/20 text-cyan-300'
                          : 'bg-blue-500/20 text-blue-300'
                      }`}
                    >
                      {room.type === 'geral' ? '💬' : '📚'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-100 truncate">{room.name}</p>
                      <p className="text-xs text-gray-400">
                        {room.type === 'geral' ? 'Chat público' : 'Chat do concurso'}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col w-full md:w-auto relative overflow-x-hidden overflow-y-hidden">
            <div
              className="shrink-0 backdrop-blur-sm bg-gray-900/30 px-4 md:px-6 py-4 border-b border-white/10 flex items-center justify-between"
              style={{
                backgroundImage:
                  activeAlerts.has(activeRoom)
                    ? 'linear-gradient(90deg, rgba(220, 38, 38, 0.3) 0%, rgba(239, 68, 68, 0.3) 100%)'
                    : 'linear-gradient(90deg, rgba(6, 182, 212, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%)',
              }}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="text-gray-400 hover:text-white transition-colors"
                  title={isSidebarOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                  </svg>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white drop-shadow-lg">{activeRoomName}</h2>
                    {activeAlerts.has(activeRoom) && (
                      <span className="text-red-400 text-xl">🚨</span>
                    )}
                  </div>
                  <p className="text-cyan-200 text-xs mt-0.5">
                    {messages.length} {messages.length === 1 ? 'mensagem' : 'mensagens'}
                  </p>
                </div>
              </div>

              {/* Botão de Notificações + Aviso */}
              <div className="relative z-1000 flex items-center gap-2">
                {userProfile?.isAdmin && (
                  <button
                    onClick={() => setIsAlertMode(!isAlertMode)}
                    className={`transition-all ${
                      isAlertMode
                        ? 'text-red-400 scale-110'
                        : 'text-gray-400 hover:text-red-400 hover:scale-110'
                    }`}
                    title={isAlertMode ? 'Modo aviso ativo' : 'Ativar modo aviso'}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"       
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-6 h-6"
                     >
                      {/* Triângulo */}
                      <path
                        strokeLinecap="round"      
                        strokeLinejoin="round"
                        d="M12 3L2.25 20.25h19.5L12 3Z"
                      />

                       {/* Exclamação */}
                        <path
                         strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v5"
                      />
                        <circle cx="12" cy="17" r="1" fill="currentColor" />
                      </svg>
                  </button>
                )}
                <button
                  onClick={handleOpenNotifications}
                  className="relative text-gray-400 hover:text-cyan-300 transition-colors"
                  title="Notificações"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              </div>
            </div>
            

            <div className="flex-1 overflow-y-auto px-1 md:px-6 py-4 md:py-6 space-y-4 relative z-0 scrollbar-hide w-full" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  Nenhuma mensagem ainda. Seja o primeiro a falar neste chat.
                </div>
              ) : (
                messages.map((msg) => {
                  const isMine = msg.userId === user.uid;
                  const time = msg.createdAt?.toDate
                    ? msg.createdAt.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                    : 'agora';

                  return (
                    <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} group w-full`}>
                      <div className="flex items-start gap-y-2 max-w-[85%] md:max-w-[75%] min-w-0">
                        <div
                          className={`flex-1 rounded-xl border px-2 md:px-4 py-2 md:py-3 backdrop-blur-sm text-sm md:text-base overflow-hidden ${
                            msg.isAlert
                              ? 'bg-red-500/30 border-red-400/50 text-red-100 shadow-lg shadow-red-500/20'
                              : msg.isAdmin
                              ? 'bg-purple-500/20 border-purple-400/40 text-gray-100'
                              : isMine
                              ? 'bg-cyan-500/10 border-cyan-400/30 text-gray-100'
                              : 'bg-white/5 border-white/10 text-gray-100'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 md:gap-3 text-xs mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              {msg.isAlert && <span className="text-red-400 shrink-0">🚨</span>}
                              <span className="text-gray-400 truncate text-xs md:text-sm">{msg.displayName}</span>
                              {msg.isAdmin && (
                                <span className={`${msg.isAlert ? 'bg-red-500/40 text-red-100' : 'bg-purple-500/30 text-purple-200'} px-1.5 md:px-2 py-0.5 rounded text-[9px] md:text-[10px] font-semibold uppercase shrink-0`}>
                                  Admin
                                </span>
                              )}
                            </div>
                            <span className="text-gray-400 text-xs shrink-0">{time}</span>
                          </div>
                          
                          {msg.replyTo && (
                            <div className="mb-2 p-2 rounded bg-black/20 border-l-2 border-cyan-400/50 text-xs">
                              <p className="text-cyan-300 font-semibold">{msg.replyTo.displayName}</p>
                              <p className="text-gray-300 line-clamp-2">{msg.replyTo.text}</p>
                            </div>
                          )}
                          
                          <p className="text-xs md:text-sm leading-relaxed wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        
                        <div className="flex items-center gap-0.5 md:gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => handleReplyMessage(msg)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Responder"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-4.5m4.5 0v4.5"
                              />
                            </svg>
                          </button>
                          {userProfile?.isAdmin && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Deletar mensagem"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at bottom */}
            {replyingTo && (
              <div className="border-t border-white/10 bg-blue-500/10 px-4 md:px-6 py-3 flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs text-blue-300 mb-1">Respondendo para:</p>
                  <p className="text-sm text-gray-200 truncate">{replyingTo.text}</p>
                </div>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-gray-400 hover:text-white ml-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
            <div className="shrink-0 border-t border-white/10 bg-gray-900/40 backdrop-blur-sm w-full">
              <div className="flex gap-3 px-4 md:px-6 py-4">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-gray-900/40 border border-white/10 rounded-xl px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/40 text-sm md:text-base"
                />
                <button
                  onClick={handleSend}
                  disabled={sending || !message.trim()}
                  className="px-4 md:px-5 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-60 disabled:cursor-not-allowed border border-cyan-400/30 hover:border-cyan-400/60 text-sm md:text-base"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, rgba(6, 182, 212, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%)',
                  }}
                >
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Painel de Notificações - Fora da main para evitar z-index issues */}
      {isNotificationPanelOpen && (
        <div className="fixed right-4 top-20 w-80 rounded-xl border border-white/10 bg-gray-900/95 backdrop-blur-sm shadow-2xl z-9999 max-h-96 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-white">Notificações</h3>
            <button
              onClick={handleCloseNotifications}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages
              .filter((msg) => msg.isAlert)
              .reverse()
              .slice(0, 10)
              .map((msg) => {
                const time = msg.createdAt?.toDate
                  ? msg.createdAt.toDate().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
                  : 'agora';

                return (
                  <div key={msg.id} className="p-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                    <div className="flex items-start gap-2">
                      <span className="text-lg shrink-0">
                        🚨
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-300">
                          {msg.displayName}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {msg.text}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">{time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            {messages.filter((msg) => msg.isAlert).length === 0 && (
              <div className="p-6 text-center text-gray-400 text-sm">
                Nenhuma notificação
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
