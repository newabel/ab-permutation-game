import { useState, useEffect, useCallback } from 'react'
import { createInitialState, applyMove, aiMove } from './gameLogic.js'
import Settings  from './components/Settings.jsx'
import Stats     from './components/Stats.jsx'
import VizCanvas from './components/VizCanvas.jsx'
import Sequence  from './components/Sequence.jsx'
import InputPanel from './components/InputPanel.jsx'
import GameOver  from './components/GameOver.jsx'

export default function App() {
  const [gs, setGs]           = useState(() => createInitialState(3, 3, 'cpu', false));
  const [aInput, setAInput]   = useState('3');
  const [bInput, setBInput]   = useState('3');
  const [numInput, setNumInput] = useState('');
  const [msg, setMsg]         = useState({ text: '', isErr: false });

  // Auto-clear error messages
  useEffect(() => {
    if (!msg.isErr) return;
    const t = setTimeout(() => setMsg({ text: '', isErr: false }), 2500);
    return () => clearTimeout(t);
  }, [msg]);

  // AI turn
  useEffect(() => {
    if (gs.mode !== 'cpu' || gs.player !== 2 || gs.over) return;
    const t = setTimeout(() => {
      setGs(prev => applyMove(prev, aiMove(prev)));
    }, 650);
    return () => clearTimeout(t);
  }, [gs.player, gs.mode, gs.over, gs.competitive]);

  const handleNewGame = useCallback(() => {
    const a = parseInt(aInput, 10);
    const b = parseInt(bInput, 10);
    if (!a || a < 2 || !b || b < 2) { alert('a and b must each be at least 2'); return; }
    setGs(prev => createInitialState(a, b, prev.mode, prev.competitive));
    setNumInput('');
    setMsg({ text: '', isErr: false });
  }, [aInput, bInput]);

  const handlePlay = useCallback(() => {
    if (gs.over || (gs.mode === 'cpu' && gs.player === 2)) return;
    const n = parseFloat(numInput);
    if (!isFinite(n) || n <= 0) { setMsg({ text: 'Enter a positive number', isErr: true }); return; }
    if (gs.used.has(n)) { setMsg({ text: `${n} is already in the sequence`, isErr: true }); return; }
    setNumInput('');
    setMsg({ text: '', isErr: false });
    setGs(prev => applyMove(prev, n));
  }, [gs, numInput]);

  const setMode        = useCallback(m => setGs(prev => ({ ...prev, mode: m })),        []);
  const setCompetitive = useCallback(c => setGs(prev => ({ ...prev, competitive: c })), []);

  const isAiThinking = gs.mode === 'cpu' && gs.player === 2 && !gs.over;

  return (
    <div className="container">
      <h1>(a,b)-Permutation Game</h1>
      <p className="subtitle">
        Name different positive numbers. The game ends when the sequence contains
        an increasing subsequence of length <em>a</em> or a decreasing subsequence
        of length <em>b</em>. In <strong>cooperative</strong> mode, players work
        together to make the game last as long as possible. In{' '}
        <strong>competitive</strong> mode, the player who completes such a
        subsequence loses.
      </p>

      <Settings
        aInput={aInput} bInput={bInput}
        setAInput={setAInput} setBInput={setBInput}
        mode={gs.mode} competitive={gs.competitive}
        setMode={setMode} setCompetitive={setCompetitive}
        onNewGame={handleNewGame}
      />

      <Stats gs={gs} />
      <VizCanvas gs={gs} />
      <Sequence gs={gs} />

      {!gs.over && (
        <InputPanel
          numInput={numInput} setNumInput={setNumInput}
          onPlay={handlePlay}
          msg={isAiThinking ? { text: 'Computer is thinking…', isErr: false } : msg}
          disabled={isAiThinking}
        />
      )}

      {gs.over && <GameOver gs={gs} onNewGame={handleNewGame} />}
    </div>
  );
}
