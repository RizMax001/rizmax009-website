
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    setLoading(false);
  };

  // Auto scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'Arial, sans-serif',
      background: 'linear-gradient(135deg, #7e22ce, #a855f7)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h1 style={{ textAlign: 'center' }}>💬 Teman Ngobrol Rizky Max 😎</h1>
      
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '1rem',
        borderRadius: '12px',
        maxWidth: '600px',
        margin: '2rem auto',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                background: m.role === 'user' ? '#d946ef' : '#a78bfa',
                padding: '0.6rem 1rem',
                borderRadius: '16px',
                maxWidth: '75%',
                color: '#fff',
                fontWeight: 'normal',
              }}>
                <b>{m.role === 'user' ? 'Kamu' : 'RizkyBot'}:</b> {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ color: '#ddd', fontStyle: 'italic' }}>RizkyBot lagi mikir... 🤔</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div style={{ marginTop: '1rem', display: 'flex' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Tulis sesuatu..."
            style={{
              flex: 1,
              padding: '0.75rem',
              borderRadius: '20px',
              border: 'none',
              outline: 'none',
              fontSize: '1rem'
            }}
          />
          <button
            onClick={sendMessage}
            style={{
              marginLeft: '1rem',
              padding: '0.75rem 1.5rem',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: '#9333ea',
              color: 'white',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
    }
