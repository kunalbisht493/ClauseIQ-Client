import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { askQuestion, getDocument } from '../services/document.service';
import RiskBadge from '../components/analysis/RiskBadge';
import ChatBox from '../components/chat/ChatBox';

export default function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDocument(id)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [id]);

  async function ask(q) {
    setLoading(true);
    setError('');
    try {
      const r = await askQuestion(id, q);
      setData((d) => ({ ...d, analysis: r.analysis }));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  if (error && !data) return <p className="alert error">{error}</p>;
  if (!data) return <div className="empty">Loading document analysis…</div>;

  const { document, analysis = {} } = data;

  return (
    <>
      <Link className="back" to="/history">
        ← Back to history
      </Link>

      <header>
        <div>
          <p className="eyebrow">DOCUMENT ANALYSIS</p>
          <h1>{document.filename}</h1>
          <p>
            Uploaded {new Date(document.uploadedAt).toLocaleDateString()} ·{' '}
            {document.status}
          </p>
        </div>
        <div className="header-actions">
          {analysis && (
            <RiskBadge score={analysis.riskScore} level={analysis.riskLevel} />
          )}
          <Link className="secondary" to="/">
            Upload another
          </Link>
        </div>
      </header>

      {error && <p className="alert error">{error}</p>}

      {document.status === 'failed' ? (
        <div className="alert error">
          Analysis failed: {document.error || 'Please try uploading again.'}
        </div>
      ) : document.status !== 'ready' ? (
        <div className="empty">
          Your document is being processed. Refresh this page in a moment.
        </div>
      ) : (
        <div className="analysis">
          <section className="panel summary">
            <h2>Plain-language summary</h2>
            <p>{analysis?.summary || 'Your analysis is being prepared.'}</p>
          </section>

          <section className="panel">
            <h2>Risk flags</h2>
            {analysis?.riskClauses?.length ? (
              <div className="risks">
                {analysis.riskClauses.map((r, i) => (
                  <article key={i}>
                    <div>
                      <b>
                        {i + 1}. {r.level || 'Review'} · {r.score || 0}/100
                      </b>
                      <p>{r.reason}</p>
                      {r.recommendation && (
                        <p className="recommendation">
                          <b>Recommendation: </b>
                          {r.recommendation}
                        </p>
                      )}
                      <button
                        type="button"
                        className="link ask-about"
                        disabled={loading}
                        onClick={() =>
                          ask(`Explain this clause in more detail and its practical impact: "${r.clause}"`)
                        }
                      >
                        Ask about this →
                      </button>
                    </div>
                    <blockquote>{r.clause}</blockquote>
                  </article>
                ))}
              </div>
            ) : (
              <p className="muted">No risk clauses have been identified yet.</p>
            )}
          </section>

          <section className="panel">
            <h2>Ask this document</h2>
            {analysis?.question && (
              <div className="answer">
                <b>{analysis.question}</b>
                <p>{analysis.answer}</p>
              </div>
            )}
            <ChatBox onAsk={ask} loading={loading} />
          </section>
        </div>
      )}
    </>
  );
}