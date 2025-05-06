
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import * as chatService from '@/services/chat/chatService';
import { Message, Session } from '@/types/chat';

export const useChat = (sessionId?: string) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  // Fetch all sessions
  const fetchSessions = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await chatService.getAllSessions();
      setSessions(data);
      return data;
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat sessions',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch session by ID
  const fetchSession = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const data = await chatService.getSessionById(id);
      setCurrentSession(data);
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat session',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Create new session
  const createSession = useCallback(async (data: Omit<Session, 'id'>) => {
    try {
      setIsLoading(true);
      const newSession = await chatService.createSession(data);
      setSessions(prev => [newSession, ...prev]);
      setCurrentSession(newSession);
      return newSession;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: 'Error',
        description: 'Failed to create chat session',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Fetch messages by session ID
  const fetchMessages = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const data = await chatService.getMessagesBySessionId(id);
      setMessages(data);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat messages',
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Send a message
  const sendMessage = useCallback(async (content: string, sessionId: string) => {
    try {
      setIsSending(true);
      const messageData = {
        content,
        sender: 'user',
        attachments: [],
      } as Omit<Message, 'id' | 'sessionId' | 'timestamp' | 'read'>;
      
      const newMessage = await chatService.sendMessage(sessionId, messageData);
      setMessages(prev => [...prev, newMessage]);
      
      // Update the session with the last message
      if (currentSession) {
        const updatedSession = {
          ...currentSession,
          lastMessage: content,
          lastMessageTime: newMessage.timestamp,
        };
        setCurrentSession(updatedSession);
        
        // Update in the sessions list
        setSessions(prev => prev.map(session => 
          session.id === sessionId ? updatedSession : session
        ));
      }
      
      return newMessage;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsSending(false);
    }
  }, [currentSession, toast]);

  // Mark messages as read
  const markAsRead = useCallback(async (sessionId: string) => {
    try {
      await chatService.markMessagesAsRead(sessionId);
      
      // Update local state
      setMessages(prev => prev.map(message => ({
        ...message,
        read: true,
      })));
      
      // Update the session unread count
      if (currentSession && currentSession.id === sessionId) {
        setCurrentSession({
          ...currentSession,
          unread: 0,
        });
      }
      
      // Update in the sessions list
      setSessions(prev => prev.map(session => 
        session.id === sessionId ? { ...session, unread: 0 } : session
      ));
      
      // Fetch updated unread count
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }, [currentSession, fetchUnreadCount]);

  // Get unread messages count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await chatService.getUnreadCount();
      setUnreadCount(data.count);
      return data.count;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return 0;
    }
  }, []);

  // Initialize with sessionId if provided
  useEffect(() => {
    if (sessionId) {
      fetchSession(sessionId);
      fetchMessages(sessionId);
    } else {
      fetchSessions();
    }
    fetchUnreadCount();
  }, [sessionId, fetchSession, fetchMessages, fetchSessions, fetchUnreadCount]);

  return {
    sessions,
    currentSession,
    messages,
    isLoading,
    isSending,
    unreadCount,
    fetchSessions,
    fetchSession,
    createSession,
    fetchMessages,
    sendMessage,
    markAsRead,
    fetchUnreadCount,
    setCurrentSession,
  };
};
