export default function InputPanel({ numInput, setNumInput, onPlay, msg, disabled }) {
  return (
    <div className="section">
      <div className="row">
        <input
          id="numInput"
          type="number"
          placeholder="?"
          min="0"
          step="any"
          value={numInput}
          disabled={disabled}
          onChange={e => setNumInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') onPlay(); }}
        />
        <button className="btn btn-primary" onClick={onPlay}>Play</button>
        <span className={msg.isErr ? 'err' : 'hint'}>{msg.text}</span>
      </div>
    </div>
  );
}
