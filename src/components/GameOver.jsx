import { theMax, getBest, updateBest, playerName } from '../gameLogic.js'

export default function GameOver({ gs, onNewGame }) {
  const { a, b, seq, lis, lds, competitive, loser, mode } = gs;
  const score   = seq.length;
  const trigger = lis.len >= a
    ? `Increasing subsequence of length ${a} reached`
    : `Decreasing subsequence of length ${b} reached`;

  if (competitive) {
    const winner = loser === 1 ? 2 : 1;
    const humanLost = mode === 'cpu' && loser === 1;
    const wrapCls   = humanLost ? 'go-loser' : 'go-winner';
    const color     = humanLost ? '#7a1010' : '#1a3a5c';
    return (
      <div className="section">
        <div className={`go-wrap ${wrapCls}`}>
          <div className="go-title" style={{ color }}>{playerName(mode, winner)} Wins!</div>
          <div className="go-score" style={{ color }}>{playerName(mode, loser)} lost</div>
          <div className="go-detail">
            {trigger}<br />
            Game lasted <strong style={{ color: '#111' }}>{score}</strong> move{score !== 1 ? 's' : ''}
            &nbsp;&middot;&nbsp;
            Theoretical max: <strong style={{ color: '#111' }}>{theMax(a, b)}</strong>
          </div>
          <button className="btn btn-primary" onClick={onNewGame}>Play Again</button>
        </div>
      </div>
    );
  }

  const isNew = updateBest(a, b, score);
  const best  = getBest(a, b);
  return (
    <div className="section">
      <div className={`go-wrap${isNew ? ' go-record' : ''}`}>
        {isNew && <div className="go-badge">NEW RECORD</div>}
        <div className="go-title" style={{ color: isNew ? '#1e5c1e' : '#111' }}>
          {isNew ? 'New Record!' : 'Game Over'}
        </div>
        <div className="go-score" style={{ color: isNew ? '#1e5c1e' : '#111' }}>{score}</div>
        <div className="go-detail">
          {trigger}<br />
          Best: <strong style={{ color: '#111' }}>{best}</strong>
          &nbsp;&middot;&nbsp;
          Theoretical max: <strong style={{ color: '#111' }}>{theMax(a, b)}</strong>
        </div>
        <button className="btn btn-primary" onClick={onNewGame}>Play Again</button>
      </div>
    </div>
  );
}
