import { theMax, getBest } from '../gameLogic.js'

export default function Stats({ gs }) {
  const { a, b, seq, lis, lds } = gs;
  return (
    <div className="section">
      <div className="section-title">Progress</div>
      <div className="stats-grid">
        <div className="stat">
          <div className="stat-label">Increasing (LIS)</div>
          <div className="prog-wrap">
            <div className="prog-bg">
              <div className="prog-fg lis-color" style={{ width: `${(lis.len / a) * 100}%` }} />
            </div>
            <div className="stat-val">{lis.len}/{a}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Decreasing (LDS)</div>
          <div className="prog-wrap">
            <div className="prog-bg">
              <div className="prog-fg lds-color" style={{ width: `${(lds.len / b) * 100}%` }} />
            </div>
            <div className="stat-val">{lds.len}/{b}</div>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Moves / Max</div>
          <div className="stat-val">{seq.length} / {theMax(a, b)}</div>
        </div>
        <div className="stat">
          <div className="stat-label">Best Score</div>
          <div className="stat-val">{getBest(a, b) || '-'}</div>
        </div>
      </div>
    </div>
  );
}
