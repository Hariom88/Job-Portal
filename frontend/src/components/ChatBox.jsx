import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useAuth } from '../context/AuthContext';
import { chatService } from '../services/api';

export default function ChatBox({ targetUserId, targetName, onClose }) {
  const { user } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [client, setClient] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!user || !targetUserId) return;

    chatService.initChat(targetUserId).then(res => {
      setChat(res.data);
      return chatService.getMessages(res.data.id);
    }).then(res => {
      setMessages(res.data);
    }).catch(err => console.error("Failed to load chat", err));
  }, [user, targetUserId]);

  useEffect(() => {
    if (!chat) return;

    const socketUrl = import.meta.env.VITE_API_BASE_URL 
      ? import.meta.env.VITE_API_BASE_URL.replace('/api', '/ws-connect') 
      : 'http://localhost:8080/ws-connect';

    const socket = new SockJS(socketUrl);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    stompClient.onConnect = () => {
      stompClient.subscribe(`/topic/chat/${chat.id}`, (msg) => {
        const newMsg = JSON.parse(msg.body);
        setMessages((prev) => [...prev, newMsg]);
      });
    };

    stompClient.activate();
    setClient(stompClient);

    return () => stompClient.deactivate();
  }, [chat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !client || !client.connected) return;

    client.publish({
      destination: `/app/chat/${chat.id}/sendMessage`,
      body: JSON.stringify({
        senderId: user.id,
        content: input.trim()
      })
    });

    setInput('');
  };

  if (!chat) return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-slate-200 rounded-2xl shadow-2xl flex items-center justify-center z-50">
      <div className="animate-pulse text-slate-400 font-bold">Connecting...</div>
    </div>
  );

  return (
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 font-bold flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-inner">
             {targetName?.charAt(0) || '?'}
          </div>
          <span>{targetName || 'Chat'}</span>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10 font-medium">Start the conversation...</div>
        )}
        {messages.map((msg, idx) => {
          const isMine = msg.sender.id === user.id;
          return (
            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] p-3 text-sm shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-tl-sm'}`}>
                {msg.content}
                <div className={`text-[10px] mt-1 text-right font-bold ${isMine ? 'text-blue-200' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 bg-white border-t border-slate-100 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-blue-500 transition-colors"
        />
        <button type="submit" disabled={!input.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-xl font-bold text-sm disabled:opacity-50 shadow-md">
          Send
        </button>
      </form>
    </div>
  );
}
