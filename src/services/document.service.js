import { API_URL, request } from './api';

export const listDocuments = () => request('/documents');

export const getDocument = (id) => request(`/documents/${id}`);

// The server answers 202 right away and keeps working in the background;
// poll getDocument() until status is 'indexed' or 'ready'.
export const uploadDocument = (file) => {
  const body = new FormData();
  body.append('file', file);
  return request('/documents', {
    method: 'POST',
    body,
  });
};

// Non-streaming Q&A. Resolves to the new history entry.
export const askQuestion = async (id, question) => {
  const r = await request(`/analyses/${id}/questions`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  // Older backends returned the whole analysis instead of just the new entry.
  return r.qaEntry || r.analysis?.qaHistory?.at(-1);
};

// Streaming Q&A over Server-Sent Events. Calls onSources(sources) as soon as citations are
// retrieved and onToken(text) as the answer is generated. Resolves to the final history entry.
// Falls back to the non-streaming endpoint if the server doesn't have the stream route.
export async function askQuestionStream(id, question, { onSources, onToken, signal } = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('clauseiq-token') : null;
  const path = `/analyses/${id}/questions/stream`;

  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    credentials: 'include',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ question }),
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { path } }));
  }

  const isStream = (res.headers.get('content-type') || '').includes('text/event-stream');
  if (!isStream) {
    const data = await res.json().catch(() => null);
    // An older backend without the stream route answers 404/405 with a non-JSON-message body.
    if ((res.status === 404 || res.status === 405) && !data?.message) {
      return askQuestion(id, question);
    }
    throw new Error(data?.message || 'Request failed.');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let finalEntry = null;

  function handle(block) {
    let event = 'message';
    let data = '';
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) event = line.slice(6).trim();
      else if (line.startsWith('data:')) data += line.slice(5).trim();
    }
    if (!data) return;
    const payload = JSON.parse(data);
    if (event === 'sources') onSources?.(payload);
    else if (event === 'token') onToken?.(payload.text);
    else if (event === 'done') finalEntry = payload.qaEntry;
    else if (event === 'error') throw new Error(payload.message || 'Failed to generate an answer.');
  }

  for (;;) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true }).replace(/\r\n/g, '\n');
    let boundary;
    while ((boundary = buffer.indexOf('\n\n')) !== -1) {
      const block = buffer.slice(0, boundary);
      buffer = buffer.slice(boundary + 2);
      handle(block);
    }
  }

  if (!finalEntry) throw new Error('The answer was interrupted. Please try again.');
  return finalEntry;
}

export const deleteDocument = (id) =>
  request(`/documents/${id}`, {
    method: 'DELETE',
  });
