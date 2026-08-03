import { request } from './api';

export const listDocuments = () => request('/documents');

export const getDocument = (id) => request(`/documents/${id}`);

export const uploadDocument = (file) => {
  const body = new FormData();
  body.append('file', file);
  return request('/documents', {
    method: 'POST',
    body,
  });
};

export const askQuestion = (id, question) =>
  request(`/analyses/${id}/questions`, {
    method: 'POST',
    body: JSON.stringify({ question }),
  });