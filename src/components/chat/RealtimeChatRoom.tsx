'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Paperclip, 
  Code2, 
  Sparkles, 
  CheckCheck, 
  Check, 
  ExternalLink, 
  FileCode, 
  ShieldCheck, 
  Radio, 
  X,
  MessageSquare
} from 'lucide-react';
import { useRealtimeChat } from '@/hooks/useRealtimeChat';
import { Message, UserProfile } from '@/types';

interface RealtimeChatRoomProps {
  conversationId: string;
  currentUser: UserProfile;
  otherUser: UserProfile;
  gigTitle?: string;
  initialMessages?: Message[];
}

export function RealtimeChatRoom({
  conversationId,
  currentUser,
  otherUser,
  gigTitle = 'Active Project Workspace',
  initialMessages = [],
}: RealtimeChatRoomProps) {
  const { messages, sendMessage, isConnected } = useRealtimeChat(
    conversationId,
    currentUser,
    initialMessages
  );

  const [inputVal, setInputVal] = useState('');
  const [attachmentLink, setAttachmentLink] = useState('');
  const [showAttachmentInput, setShowAttachmentInput] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() && !attachmentLink.trim()) return;

    await sendMessage(
      inputVal,
      attachmentLink.trim() || undefined,
      attachmentLink ? 'External Deliverable Link' : undefined
    );

    setInputVal('');
    setAttachmentLink('');
    setShowAttachmentInput(false);
  };

  const renderMessageContent = (content: string) => {
    // Basic Markdown code block detection
    if (content.includes('```')) {
      const parts = content.split('```');
      return (
        <div className="space-y-2">
          {parts.map((part, i) => {
            if (i % 2 === 1) {
              return (
                <pre key={i} className="p-3 rounded-xl bg-slate-950 border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                  <code>{part.trim()}</code>
                </pre>
              );
            }
            return part ? <p key={i} className="whitespace-pre-wrap">{part}</p> : null;
          })}
        </div>
      );
    }

    return <p className="whitespace-pre-wrap leading-relaxed">{content}</p>;
  };

  return (
    <div className="flex flex-col h-[600px] rounded-3xl bg-[#0e0e13]/90 backdrop-blur-xl border border-white/[0.08] shadow-2xl overflow-hidden text-slate-200">
      
      {/* Chat Room Header */}
      <div className="p-4 sm:px-6 border-b border-white/5 bg-[#121216]/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={otherUser.avatar_url}
              alt={otherUser.full_name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
            />
            {otherUser.verified_student && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-600 text-white rounded-full p-0.5 border border-[#0e0e13]">
                <ShieldCheck size={10} />
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">{otherUser.full_name}</h4>
              <span className="text-[10px] px-2 py-0.2 rounded-full bg-white/5 text-slate-400 capitalize">
                {otherUser.role}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {otherUser.college_name} • <span className="text-indigo-300">{gigTitle}</span>
            </p>
          </div>
        </div>

        {/* Realtime Connection Status Pill */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-amber-400'} opacity-75`} />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          </span>
          <span className="text-[11px] text-slate-400">
            {isConnected ? 'Realtime Mesh Active' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Message Feed Scroll View */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-2 text-slate-500 text-xs">
            <MessageSquare size={32} className="text-indigo-400/40" />
            <p className="font-semibold text-slate-400">Encrypted Student Collaboration Channel</p>
            <p className="max-w-xs text-[11px]">
              Direct requirements discussion, scope changes, and milestone file deliverables are recorded here for escrow settlement safety.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUser.id;
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-500 font-mono">
                  <span>{isMe ? 'You' : otherUser.full_name}</span>
                  <span>•</span>
                  <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                <div
                  className={`max-w-md sm:max-w-lg p-3.5 rounded-2xl text-xs shadow-md space-y-2 ${
                    isMe
                      ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                      : 'bg-[#181820] text-slate-200 border border-white/5 rounded-bl-xs'
                  }`}
                >
                  {renderMessageContent(msg.content)}

                  {/* Attachment Pill */}
                  {msg.attachment_url && (
                    <div className="pt-2 border-t border-white/10">
                      <a
                        href={msg.attachment_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-[11px] text-cyan-300 font-mono border border-cyan-400/30 transition truncate max-w-full"
                      >
                        <ExternalLink size={12} className="shrink-0" />
                        <span className="truncate">{msg.attachment_name || msg.attachment_url}</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Delivery checkmark */}
                {isMe && (
                  <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-0.5 font-mono">
                    {msg.is_read ? (
                      <CheckCheck size={12} className="text-cyan-400" />
                    ) : (
                      <Check size={12} />
                    )}
                    <span>{msg.is_read ? 'Read' : 'Delivered'}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Drawer */}
      <AnimatePresence>
        {showAttachmentInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-3 bg-[#15151c] border-t border-white/5 flex items-center gap-2"
          >
            <input
              type="url"
              placeholder="Paste deliverable proof URL (GitHub PR, Figma, Drive link)..."
              value={attachmentLink}
              onChange={(e) => setAttachmentLink(e.target.value)}
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-xs text-white focus:outline-none focus:border-indigo-400"
            />
            <button
              onClick={() => setShowAttachmentInput(false)}
              className="p-1.5 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Action Form */}
      <form onSubmit={handleSend} className="p-3 sm:p-4 border-t border-white/5 bg-[#121216]/70 flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowAttachmentInput(!showAttachmentInput)}
          className={`p-2 rounded-xl transition ${
            showAttachmentInput ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
          }`}
          title="Attach deliverable link or code repo"
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          placeholder="Type message or paste code (use ``` for syntax blocks)..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-950 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition shadow-inner"
        />

        <button
          type="submit"
          disabled={!inputVal.trim() && !attachmentLink.trim()}
          className="p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white transition shadow-lg shadow-indigo-600/30 shrink-0"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
