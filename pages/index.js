import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Teman Ngobrol Rizky Max 😎</h1>
      <div style={{ margin: '1rem 0', minHeight: '300px' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: '0.5rem 0' }}>
            <b>{m.role === 'user' ? 'Kamu' : 'RizkyBot'}:</b> {m.content}
          </div>
        ))}
        {loading && <div><i>RizkyBot lagi mikir... 🤔</i></div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && sendMessage()}
        placeholder="Tulis sesuatu..."
        style={{ width: '80%', padding: '0.5rem' }}
      />
      <button onClick={sendMessage} style={{ padding: '0.5rem', marginLeft: '1rem' }}>Kirim</button>
    </div>
  );
}
