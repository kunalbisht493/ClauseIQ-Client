const rawApiUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').trim().replace(/\/+$/, '');
export const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;

export async function request(path, options = {}, retries = 2) {
  const isFormData = options.body instanceof FormData;
  const token = typeof window !== 'undefined' ? localStorage.getItem('clauseiq-token') : null;

  try {
    const res = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      ...options,
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });

    // If server is waking up from cold start (502/503/504), wait and retry
    if ([502, 503, 504].includes(res.status) && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(path, options, retries - 1);
    }

    if (res.status === 401) {
      window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { path } }));
    }

    const data = res.status === 204 ? null : await res.json().catch(() => ({}));

    if (!res.ok) throw new Error(data?.message || 'Request failed.');
    return data;
  } catch (err) {
    // If fetch failed due to cold start network block and retries remain
    if (retries > 0 && (err.name === 'TypeError' || err.message?.includes('fetch') || err.message?.includes('network'))) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return request(path, options, retries - 1);
    }
    throw err;
  }
}