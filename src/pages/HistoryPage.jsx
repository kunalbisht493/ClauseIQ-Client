import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDocuments, deleteDocument } from '../services/document.service';

const date = (v) => new Date(v).toLocaleDateString();

export default function HistoryPage() {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    listDocuments()
      .then((r) => setDocs(r.documents))
      .catch((e) => setError(e.message));
  }, []);

  async function handleDelete(event, id, filename) {
    event.preventDefault();
    event.stopPropagation();
    if (!window.confirm(`Delete "${filename}"? This cannot be undone.`)) return;

    setError('');
    setDeletingId(id);
    try {
      await deleteDocument(id);
      setDocs((prev) => prev.filter((d) => d._id !== id));
    } catch (e) {
      setError(e.message);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <header>
        <div>
          <p className="eyebrow">DOCUMENT LIBRARY</p>
          <h1>Your document history</h1>
          <p>Return to an analysis or ask more questions at any time.</p>
        </div>
        <div className="header-actions">
          <Link className="secondary" to="/">
            Upload another
          </Link>
        </div>
      </header>

      {error && <p className="alert error">{error}</p>}

      <div className="docs history">
        {docs.map((d) => (
          <Link to={`/documents/${d._id}`} className="doc" key={d._id}>
            <div className="doc-info">
              <b>{d.filename}</b>
              <small>
                Uploaded {date(d.uploadedAt)} · {Math.ceil(d.size / 1024)} KB
              </small>
            </div>
            <div className="doc-actions">
              <em className={d.status}>{d.status}</em>
              <button
                type="button"
                className="doc-delete"
                aria-label={`Delete ${d.filename}`}
                disabled={deletingId === d._id}
                onClick={(e) => handleDelete(e, d._id, d.filename)}
              >
                {deletingId === d._id ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </Link>
        ))}

        {!docs.length && !error && (
          <div className="empty">Your document library is empty.</div>
        )}
      </div>
    </>
  );
}