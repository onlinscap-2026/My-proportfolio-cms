import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Calendar, User, Trash2 } from 'lucide-react';

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export default function MessagesView() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await axios.get('/api/messages', config);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-theme">Inbound Messages</h2>
        <p className="text-sm text-secondary-theme">View and manage messages from your contact form.</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-neutral-800"></div>)}
        </div>
      ) : messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg._id} className="rounded-2xl border border-theme bg-card-theme p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 text-orange-500">
                    <User size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{msg.name}</h3>
                    <p className="text-xs text-neutral-400">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-500">
                    <Calendar size={14} />
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </div>
                  <button className="rounded-lg bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className="rounded-xl bg-neutral-900/50 p-4 text-sm text-neutral-300 leading-relaxed">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-neutral-500 border border-dashed border-neutral-800 rounded-3xl">
          <Mail size={48} className="mb-4 opacity-20" />
          <p>No messages yet.</p>
        </div>
      )}
    </div>
  );
}
