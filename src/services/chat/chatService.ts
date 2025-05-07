
import ApiService from '../api/api';
import { Message, Session } from '@/types/chat';

// Get all chat sessions
export const getAllSessions = async (): Promise<Session[]> => {
  return ApiService.get<Session[]>('/chat/sessions');
};

// Get session by ID
export const getSessionById = async (sessionId: string): Promise<Session> => {
  return ApiService.get<Session>(`/chat/sessions/${sessionId}`);
};

// Create a new session
export const createSession = async (data: Omit<Session, 'id'>): Promise<Session> => {
  return ApiService.post<Session>('/chat/sessions', data);
};

// Update session
export const updateSession = async (sessionId: string, data: Partial<Session>): Promise<Session> => {
  return ApiService.put<Session>(`/chat/sessions/${sessionId}`, data);
};

// Close session
export const closeSession = async (sessionId: string): Promise<Session> => {
  return ApiService.post<Session>(`/chat/sessions/${sessionId}/close`);
};

// Get messages by session ID
export const getMessagesBySessionId = async (sessionId: string): Promise<Message[]> => {
  return ApiService.get<Message[]>(`/chat/sessions/${sessionId}/messages`);
};

// Send a message
export const sendMessage = async (sessionId: string, message: Omit<Message, 'id' | 'sessionId' | 'timestamp' | 'read'>): Promise<Message> => {
  return ApiService.post<Message>(`/chat/sessions/${sessionId}/messages`, message);
};

// Mark messages as read
export const markMessagesAsRead = async (sessionId: string): Promise<void> => {
  return ApiService.post<void>(`/chat/sessions/${sessionId}/read`);
};

// Get unread count
export const getUnreadCount = async (): Promise<{ count: number }> => {
  return ApiService.get<{ count: number }>('/chat/messages/unread');
};
