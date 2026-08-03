import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listDocuments } from '../services/document.service';

const date = (v) => new Date(v).toLocaleDateString();

export default function HistoryPage() {
  const [docs, setDocs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    listDocuments()
      .then((r) => setDocs(r.documents))
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <header>
        <div>
          <p className="eyebrow">DOCUMENT LIBRARY</p>
          <h1>Your document history</h1>
          <p>Return to an analysis or ask more questions at any time.</p>
        </div>
      </header>

      {error && <p className="alert error">{error}</p>}

      <div className="docs history">
        {docs.map((d) => (
          <Link to={`/documents/${d._id}`} className="doc" key={d._id}>
            <b>{d.filename}</b>
            <small>
              Uploaded {date(d.uploadedAt)} · {Math.ceil(d.size / 1024)} KB
            </small>
            <em className={d.status}>{d.status}</em>
          </Link>
        ))}
        {!docs.length && !error && (
          <div className="empty">Your document library is empty.</div>
        )}
      </div>
    </>
  );
}