
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as chatService from '@/services/chat/chatService';
import { Message, Session } from '@/types/chat';

export const useChat = (sessionId?: string) => {
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const queryClient = useQueryClient();

  // Fetch all sessions
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions
  } = useQuery({
    queryKey: ['chatSessions'],
    queryFn: chatService.getAllSessions,
    enabled: !sessionId // Only fetch all sessions if not looking at a specific one
  });

  // Fetch session by ID
  const {
    data: session,
    isLoading: isLoadingSession,
    refetch: refetchSession
  } = useQuery({
    queryKey: ['chatSession', sessionId],
    queryFn: () => sessionId ? chatService.getSessionById(sessionId) : null,
    enabled: !!sessionId
  });

  // Fetch messages by session ID
  const {
    data: messages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages
  } = useQuery({
    queryKey: ['chatMessages', currentSession?.id || sessionId],
    queryFn: () => {
      const id = currentSession?.id || sessionId;
      return id ? chatService.getMessagesBySessionId(id) : [];
    },
    enabled: !!(currentSession?.id || sessionId)
  });

  // Get unread count
  const {
    data: unreadData,
    refetch: refetchUnreadCount
  } = useQuery({
    queryKey: ['unreadMessages'],
    queryFn: chatService.getUnreadCount
  });

  const unreadCount = unreadData?.count || 0;

  // Create new session mutation
  const createSessionMutation = useMutation({
    mutationFn: chatService.createSession,
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      setCurrentSession(newSession);
      toast.success('New chat session created');
    },
    onError: (error: any) => {
      toast.error(`Failed to create chat session: ${error.message || "Unknown error"}`);
    }
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ sessionId, message }: { sessionId: string, message: Omit<Message, 'id' | 'sessionId' | 'timestamp' | 'read'> }) => 
      chatService.sendMessage(sessionId, message),
    onSuccess: () => {
      const id = currentSession?.id || sessionId;
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['chatMessages', id] });
        queryClient.invalidateQueries({ queryKey: ['chatSession', id] });
        queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
      }
    },
    onError: (error: any) => {
      toast.error(`Failed to send message: ${error.message || "Unknown error"}`);
    }
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: chatService.markMessagesAsRead,
    onSuccess: () => {
      const id = currentSession?.id || sessionId;
      if (id) {
        queryClient.invalidateQueries({ queryKey: ['chatSession', id] });
        queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
        queryClient.invalidateQueries({ queryKey: ['unreadMessages'] });
      }
    }
  });

  // Set current session when session is loaded
  useEffect(() => {
    if (session) {
      setCurrentSession(session);
    }
  }, [session]);

  // Create a new session
  const createSession = useCallback((data: Omit<Session, 'id'>) => {
    return createSessionMutation.mutateAsync(data);
  }, [createSessionMutation]);

  // Send a message
  const sendMessage = useCallback((content: string, sessionId: string) => {
    const messageData = {
      content,
      sender: 'user' as const,
      attachments: [],
    };
    
    return sendMessageMutation.mutateAsync({ sessionId, message: messageData });
  }, [sendMessageMutation]);

  // Mark messages as read
  const markAsRead = useCallback((sessionId: string) => {
    return markAsReadMutation.mutateAsync(sessionId);
  }, [markAsReadMutation]);

  // Initialize with sessionId if provided and mark messages as read
  useEffect(() => {
    if (sessionId && currentSession?.unread && currentSession.unread > 0) {
      markAsRead(sessionId);
    }
  }, [sessionId, currentSession, markAsRead]);

  return {
    sessions,
    currentSession,
    messages,
    isLoading: isLoadingSessions || isLoadingSession || isLoadingMessages,
    isSending: sendMessageMutation.isPending,
    unreadCount,
    fetchSessions: refetchSessions,
    fetchSession: refetchSession,
    createSession,
    fetchMessages: refetchMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount: refetchUnreadCount,
    setCurrentSession,
  };
};
