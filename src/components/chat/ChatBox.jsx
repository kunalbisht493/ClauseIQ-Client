import { useState } from 'react';

export default function ChatBox({ onAsk, loading }) {
  const [question, setQuestion] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!question.trim() || loading) return;
    await onAsk(question);
    setQuestion('');
  }

  return (
    <form className="chat" onSubmit={submit}>
      <input
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="Ask about this agreement…"
      />
      <button className="primary" disabled={loading}>
        {loading ? 'Thinking…' : 'Ask'}
      </button>
    </form>
  );
}