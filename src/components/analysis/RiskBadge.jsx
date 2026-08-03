export default function RiskBadge({ score = 0 }) {
  const tone = score >= 70 ? 'high' : score >= 35 ? 'medium' : 'low';

  const label =
    score >= 70 ? 'High risk' : score >= 35 ? 'Review needed' : 'Low risk';

  return (
    <span className={`risk ${tone}`}>
      {label} · {score}/100
    </span>
  );
}