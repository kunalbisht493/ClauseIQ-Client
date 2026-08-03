const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function request(path, options = {}) {
  const form = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(form ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  const data = res.status === 204 ? null : await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || 'Request failed.');

  return data;
}