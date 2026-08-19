const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
export const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

export async function request(path, options = {}) {
  const isFormData = options.body instanceof FormData;

  const res = await fetch(`${API_URL}${path}`, {
    credentials: 'include',
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { path } }));
  }

  const data = res.status === 204 ? null : await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || 'Request failed.');
  return data;
}