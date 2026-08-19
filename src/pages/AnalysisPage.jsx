import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { askQuestion, getDocument } from '../services/document.service';
import RiskBadge from '../components/analysis/RiskBadge';
import ChatBox from '../components/chat/ChatBox';

function QaHistoryItem({ item, isLatest = false, initialCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(initialCollapsed);
  const [showSources, setShowSources] = useState(false);
  const sources = item.sources || [];
  const riskFlags = item.riskFlags || [];

  if (collapsed) {
    return (
      <article
        className={`qa-item collapsed ${isLatest ? 'latest' : ''}`}
        onClick={() => setCollapsed(false)}
        title="Click to expand answer"
        style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', overflow: 'hidden' }}
      >
        <div
          className="qa-collapsed-row"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxWidth: '100%', minWidth: 0, gap: '12px' }}
        >
          <div
            className="qa-collapsed-question"
            style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: '1 1 0%', overflow: 'hidden' }}
          >
            <span className="qa-question-icon">Q</span>
            <span
              className="qa-collapsed-text"
              style={{
                display: 'block',
                minWidth: 0,
                flex: '1 1 0%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 600,
                color: '#243f47',
                fontSize: '14px',
              }}
            >
              {item.question}
            </span>
          </div>
          <div className="qa-toggle-action" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0, whiteSpace: 'nowrap' }}>
            {isLatest && (
              <span className="qa-active-tag">
                Active
              </span>
            )}
            <span>Expand ▼</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className={`qa-item ${isLatest ? 'latest' : ''}`}>
      <div className="qa-question" style={{ justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, minWidth: 0 }}>
          <span className="qa-question-icon">Q</span>
          <span>{item.question}</span>
        </div>
        <button
          type="button"
          className="link qa-toggle-action"
          style={{ fontSize: '12px', marginLeft: 8, cursor: 'pointer', whiteSpace: 'nowrap' }}
          onClick={(e) => {
            e.stopPropagation();
            setCollapsed(true);
          }}
          title="Minimize this answer"
        >
          Minimize ▲
        </button>
      </div>

      <p className="qa-answer">{item.answer}</p>

      {riskFlags.length > 0 && (
        <div className="qa-risks">
          {riskFlags.map((rf, idx) => (
            <span key={idx} className={`qa-risk-chip ${rf.level || 'low'}`}>
              {rf.clause ? `${rf.clause}: ` : ''}{rf.reason || rf.level}
            </span>
          ))}
        </div>
      )}

      {sources.length > 0 && (
        <>
          <button
            type="button"
            className="sources-toggle"
            onClick={() => setShowSources((prev) => !prev)}
          >
            {showSources ? '▲ Hide cited excerpts' : `▼ View ${sources.length} cited document excerpt${sources.length > 1 ? 's' : ''}`}
          </button>
          {showSources && (
            <div className="sources-list">
              {sources.map((src, i) => (
                <div key={i} className="source-chunk">
                  <div className="source-chunk-header">
                    <span>Excerpt #{src.chunkIndex != null ? src.chunkIndex + 1 : i + 1}</span>
                    {src.score != null && (
                      <span>Relevance: {Math.round(src.score * 100)}%</span>
                    )}
                  </div>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{src.text}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </article>
  );
}

export default function AnalysisPage() {
  const { id } = useParams();
  const [data, setData] = useState();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPreviousHistory, setShowPreviousHistory] = useState(true);

  useEffect(() => {
    let timerId;
    let isSubscribed = true;

    async function loadData() {
      try {
        const res = await getDocument(id);
        if (!isSubscribed) return;
        setData(res);
        if (res.document?.status === 'processing' || res.document?.status === 'uploaded') {
          timerId = setTimeout(loadData, 2500);
        }
      } catch (e) {
        if (!isSubscribed) return;
        setError(e.message);
      }
    }

    loadData();

    return () => {
      isSubscribed = false;
      if (timerId) clearTimeout(timerId);
    };
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
  const qaHistory = analysis?.qaHistory || [];
  const latestItem = qaHistory.length ? qaHistory[qaHistory.length - 1] : null;
  const previousItems = qaHistory.length > 1 ? qaHistory.slice(0, qaHistory.length - 1).reverse() : [];
  const hasLegacyQa = !qaHistory.length && analysis?.question && analysis?.answer;

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
        <div className="panel processing-card">
          <div className="spinner" />
          <h3>Analyzing and indexing your document…</h3>
          <p className="muted">
            We are extracting clauses, assessing risks, and creating vector embeddings. This page will update automatically once complete.
          </p>
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
            {qaHistory.length > 0 ? (
              <div className="qa-history">
                {previousItems.length > 0 && (
                  <div className="qa-latest-label">
                    <span>● Active Explanation</span>
                  </div>
                )}
                <QaHistoryItem
                  key={latestItem._id || latestItem.question || 'latest'}
                  item={latestItem}
                  isLatest={true}
                  initialCollapsed={false}
                />

                {previousItems.length > 0 && (
                  <div className="qa-previous-section">
                    <button
                      type="button"
                      className="qa-previous-toggle"
                      onClick={() => setShowPreviousHistory((prev) => !prev)}
                    >
                      <span>
                        Previous questions & explanations ({previousItems.length})
                      </span>
                      <span>{showPreviousHistory ? '▲ Hide history' : '▼ Show history'}</span>
                    </button>

                    {showPreviousHistory && (
                      <div className="qa-previous-list">
                        {previousItems.map((item, idx) => (
                          <QaHistoryItem
                            key={item._id || `${item.question}-${idx}`}
                            item={item}
                            isLatest={false}
                            initialCollapsed={true}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : hasLegacyQa ? (
              <div className="qa-history">
                <QaHistoryItem
                  item={{ question: analysis.question, answer: analysis.answer }}
                  isLatest={true}
                  initialCollapsed={false}
                />
              </div>
            ) : (
              <p className="muted" style={{ marginBottom: 16 }}>
                Ask any question about terms, liabilities, payment clauses, or obligations in this contract.
              </p>
            )}
            <ChatBox onAsk={ask} loading={loading} />
          </section>
        </div>
      )}
    </>
  );
}