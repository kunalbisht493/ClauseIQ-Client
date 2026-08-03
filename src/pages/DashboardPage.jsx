import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UploadZone from '../components/upload/UploadZone';
import { listDocuments, uploadDocument } from '../services/document.service';

const date = (v) =>
  new Date(v).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

export default function DashboardPage() {
  const [docs, setDocs] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const nav = useNavigate();

  useEffect(() => {
    listDocuments()
      .then((r) => setDocs(r.documents))
      .catch((e) => setError(e.message));
  }, []);

  async function upload(file) {
    if (file.type !== 'application/pdf') {
      return setError('Please select a PDF file.');
    }
    setBusy(true);
    setError('');
    try {
      const r = await uploadDocument(file);
      nav(`/documents/${r.document._id}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <header>
        <div>
          <p className="eyebrow">YOUR WORKSPACE</p>
          <h1>Make legal language clear.</h1>
          <p>Upload a contract to get a practical, AI-assisted review.</p>
        </div>
        <Link className="secondary" to="/history">
          View history
        </Link>
      </header>

      {error && <p className="alert error">{error}</p>}

      <UploadZone onUpload={upload} busy={busy} />

      <div className="stats">
        <div>
          <b>{docs.length}</b>
          <span>Documents uploaded</span>
        </div>
        <div>
          <b>{docs.filter((x) => x.status === 'ready').length}</b>
          <span>Ready to review</span>
        </div>
        <div>
          <b>{docs.filter((x) => x.status === 'failed').length}</b>
          <span>Need attention</span>
        </div>
      </div>

      <section>
        <div className="sectiontitle">
          <h2>Recent documents</h2>
          <Link to="/history">See all</Link>
        </div>
        {docs.length ? (
          <div className="docs">
            {docs.slice(0, 4).map((d) => (
              <Link to={`/documents/${d._id}`} className="doc" key={d._id}>
                <b>{d.filename}</b>
                <small>
                  {date(d.uploadedAt)} · {Math.ceil(d.size / 1024)} KB
                </small>
                <em className={d.status}>{d.status}</em>
              </Link>
            ))}
          </div>
        ) : (
          <div className="empty">
            No documents yet. Your uploaded contracts will appear here.
          </div>
        )}
      </section>
    </>
  );
}