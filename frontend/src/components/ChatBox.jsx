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
    <div className="fixed bottom-4 right-4 w-80 sm:w-96 h-[500px] flex flex-col bg-[#efeae2] border border-slate-200 rounded-3xl shadow-2xl overflow-hidden z-50">
      {/* Header */}
      <div className="bg-[#075e54] text-white p-4 flex items-center justify-between shadow-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
             {targetName?.charAt(0) || '?'}
          </div>
          <div className="flex flex-col">
             <span className="font-bold text-sm">{targetName || 'Chat'}</span>
             <span className="text-[10px] text-white/70">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
           <button onClick={onClose} className="text-white/80 hover:text-white transition-colors text-lg">✕</button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#efeae2]" style={{ backgroundImage: "url('https://i.pinimg.com/originals/8f/ba/cb/8fbacbd464e996966eb9d4a6b7a9c21e.jpg')", backgroundSize: 'cover', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(239, 234, 226, 0.9)' }}>
        {messages.length === 0 && (
          <div className="text-center mt-10">
             <span className="bg-white/80 text-slate-500 text-xs font-semibold px-4 py-2 rounded-xl backdrop-blur-sm shadow-sm inline-block">
                Start the conversation...
             </span>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isMine = msg.sender.id === user.id;
          return (
            <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 text-[13px] shadow-sm relative ${isMine ? 'bg-[#dcf8c6] text-slate-800 rounded-2xl rounded-tr-none' : 'bg-white text-slate-800 rounded-2xl rounded-tl-none'}`}>
                <div className="pr-12">{msg.content}</div>
                <div className="absolute bottom-1 right-2 text-[9px] text-slate-400 font-medium">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-3 bg-[#f0f0f0] flex items-center gap-2">
        <div className="flex-1 bg-white rounded-full flex items-center px-4 shadow-sm border border-slate-200">
           <input
             type="text"
             value={input}
             onChange={(e) => setInput(e.target.value)}
             placeholder="Type a message"
             className="flex-1 py-3 text-sm outline-none bg-transparent"
           />
        </div>
        <button type="submit" disabled={!input.trim()} className="w-12 h-12 rounded-full bg-[#075e54] text-white flex items-center justify-center disabled:opacity-50 disabled:bg-slate-400 shadow-md transition-all active:scale-95">
          <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
        </button>
      </form>
    </div>
  );
}
