'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Message, UserProfile } from '@/types';

export function useRealtimeChat(
  conversationId: string,
  currentUser: UserProfile,
  initialMessages: Message[] = []
) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const channelRef = useRef<any>(null);

  // Load initial messages
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  // Set up Supabase Realtime channel subscription
  useEffect(() => {
    if (!conversationId) return;

    if (isSupabaseConfigured()) {
      const channel = supabase
        .channel(`chat_${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const newMsg = payload.new as Message;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setIsConnected(true);
          } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false);
          }
        });

      channelRef.current = channel;

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // In standalone / demo mode, mark as connected
      setIsConnected(true);
    }
  }, [conversationId]);

  // Transmit a new message
  const sendMessage = useCallback(
    async (content: string, attachmentUrl?: string, attachmentName?: string) => {
      if (!content.trim() && !attachmentUrl) return null;

      const newMsg: Message = {
        id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        conversation_id: conversationId,
        sender_id: currentUser.id,
        sender: currentUser,
        content: content.trim(),
        attachment_url: attachmentUrl,
        attachment_name: attachmentName,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setMessages((prev) => [...prev, newMsg]);

      // If live Supabase is active, persist to database
      if (isSupabaseConfigured()) {
        try {
          const { error } = await supabase.from('messages').insert({
            id: newMsg.id,
            conversation_id: conversationId,
            sender_id: currentUser.id,
            content: newMsg.content,
            attachment_url: newMsg.attachment_url,
            attachment_name: newMsg.attachment_name,
            is_read: false,
          });
          if (error) {
            console.error('Failed to persist message to Supabase:', error);
          }
        } catch (err) {
          console.error('Network error transmitting message:', err);
        }
      }

      return newMsg;
    },
    [conversationId, currentUser]
  );

  return {
    messages,
    sendMessage,
    isConnected,
  };
}
