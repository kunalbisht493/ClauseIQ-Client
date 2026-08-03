import { useRef, useState } from 'react';

export default function UploadZone({ onUpload, busy }) {
  const ref = useRef();
  const [drag, setDrag] = useState(false);

  return (
    <div
      className={`upload ${drag ? 'drag' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDrag(false);
        e.dataTransfer.files[0] && onUpload(e.dataTransfer.files[0]);
      }}
    >
      <div>↑</div>
      <h3>{busy ? 'Analysing your document…' : 'Upload a legal document'}</h3>
      <p>Drag a PDF here, or choose one from your computer.</p>
      <button
        className="primary"
        disabled={busy}
        onClick={() => ref.current.click()}
      >
        Choose PDF
      </button>
      <input
        hidden
        ref={ref}
        type="file"
        accept="application/pdf"
        onChange={(e) => e.target.files[0] && onUpload(e.target.files[0])}
      />
      <small>PDF only · maximum 10 MB</small>
    </div>
  );
}