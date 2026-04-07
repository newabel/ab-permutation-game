export default function Settings({ aInput, bInput, setAInput, setBInput, mode, competitive, setMode, setCompetitive, onNewGame }) {
  return (
    <div className="section">
      <div className="section-title">Settings</div>
      <div className="row">
        <div>
          <div className="label"><em>a</em> &mdash; increasing limit</div>
          <input type="number" value={aInput} min="2" max="12"
                 onChange={e => setAInput(e.target.value)} />
        </div>
        <div>
          <div className="label"><em>b</em> &mdash; decreasing limit</div>
          <input type="number" value={bInput} min="2" max="12"
                 onChange={e => setBInput(e.target.value)} />
        </div>
        <div className="sep" />
        <div>
          <div className="label">Mode</div>
          <div className="row" style={{ gap: '6px', marginTop: '4px' }}>
            <button className={`btn btn-mode${mode === 'cpu' ? ' active' : ''}`}
                    onClick={() => setMode('cpu')}>vs Computer</button>
            <button className={`btn btn-mode${mode === 'hot' ? ' active' : ''}`}
                    onClick={() => setMode('hot')}>Hot Seat</button>
          </div>
        </div>
        <div className="sep" />
        <div>
          <div className="label">Type</div>
          <div className="row" style={{ gap: '6px', marginTop: '4px' }}>
            <button className={`btn btn-mode${!competitive ? ' active' : ''}`}
                    onClick={() => setCompetitive(false)}>Cooperative</button>
            <button className={`btn btn-mode${competitive ? ' active' : ''}`}
                    onClick={() => setCompetitive(true)}>Competitive</button>
          </div>
        </div>
        <div className="sep" />
        <button className="btn btn-new" onClick={onNewGame}>New Game</button>
      </div>
    </div>
  );
}
