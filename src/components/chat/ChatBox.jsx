import { useState } from 'react';

export default function ChatBox({ onAsk, loading }) {
  const [question, setQuestion] = useState('');

  async function submit(event) {
    event.preventDefault();
    if (!question.trim() || loading) return;
    const asked = question;
    setQuestion(''); // clear immediately; the answer streams in below
    await onAsk(asked);
  }

  return (
    <form className="chat" onSubmit={submit}>
      <input
        value={question}
        onChange={(event) => setQuestion(event.target.value)}
        placeholder="e.g. What's the late-payment interest rate?"
      />
      <button className="primary" disabled={loading}>
        {loading ? 'Thinking…' : 'Ask'}
      </button>
    </form>
  );
}