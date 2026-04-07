import { useRef, useEffect } from 'react'
import { theMax } from '../gameLogic.js'

function drawCanvas(canvas, gs) {
  const W = canvas.clientWidth, H = canvas.clientHeight;
  if (!W || !H) return;

  const dpr = window.devicePixelRatio || 1;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const { seq, lis, lds, a, b } = gs;
  const pl = 38, pr = 14, pt = 14, pb = 26;
  const pw = W - pl - pr, ph = H - pt - pb;

  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, W, H);

  const maxSteps = Math.max(theMax(a, b), seq.length) + 1;
  const vals = seq.length ? seq : [1, 5];
  const rawMin = Math.min(...vals), rawMax = Math.max(...vals);
  const span = Math.max(rawMax - rawMin, 4);
  const vLo = rawMin - span * 0.18, vHi = rawMax + span * 0.18;

  const toX = s => pl + (s / maxSteps) * pw;
  const toY = v => pt + ph - ((v - vLo) / (vHi - vLo)) * ph;

  // Grid
  ctx.strokeStyle = '#e8e8e8';
  ctx.lineWidth = 1;
  for (let s = 1; s < maxSteps; s++) {
    const x = toX(s);
    ctx.beginPath(); ctx.moveTo(x, pt); ctx.lineTo(x, pt + ph); ctx.stroke();
  }
  const yTicks = 5;
  for (let t = 0; t <= yTicks; t++) {
    const y = pt + (t / yTicks) * ph;
    ctx.beginPath(); ctx.moveTo(pl, y); ctx.lineTo(pl + pw, y); ctx.stroke();
  }

  // Axes
  ctx.strokeStyle = '#aaa';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(pl, pt); ctx.lineTo(pl, pt + ph); ctx.lineTo(pl + pw, pt + ph);
  ctx.stroke();

  // Axis labels
  ctx.fillStyle = '#888';
  ctx.font = '10px Georgia, serif';
  ctx.textAlign = 'center';
  const stepEvery = Math.max(1, Math.floor(maxSteps / 10));
  for (let s = stepEvery; s < maxSteps; s += stepEvery) {
    ctx.fillText(s, toX(s), pt + ph + 17);
  }
  ctx.textAlign = 'right';
  for (let t = 0; t <= yTicks; t++) {
    const v = vLo + ((yTicks - t) / yTicks) * (vHi - vLo);
    if (Number.isFinite(v)) ctx.fillText(Math.round(v), pl - 5, pt + (t / yTicks) * ph + 4);
  }

  if (seq.length === 0) return;

  // LIS path (dashed green)
  const lisArr = [...lis.idxSet].sort((x, y) => x - y);
  if (lisArr.length > 1) {
    ctx.strokeStyle = '#3a8a3a99';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    lisArr.forEach((idx, j) => {
      j === 0 ? ctx.moveTo(toX(idx + 1), toY(seq[idx]))
              : ctx.lineTo(toX(idx + 1), toY(seq[idx]));
    });
    ctx.stroke();
  }

  // LDS path (dashed red)
  const ldsArr = [...lds.idxSet].sort((x, y) => x - y);
  if (ldsArr.length > 1) {
    ctx.strokeStyle = '#aa222299';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 3]);
    ctx.beginPath();
    ldsArr.forEach((idx, j) => {
      j === 0 ? ctx.moveTo(toX(idx + 1), toY(seq[idx]))
              : ctx.lineTo(toX(idx + 1), toY(seq[idx]));
    });
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Points
  seq.forEach((v, i) => {
    const x = toX(i + 1), y = toY(v);
    const inL = lis.idxSet.has(i), inD = lds.idxSet.has(i);
    const last = i === seq.length - 1;
    const r = last ? 6 : 4.5;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = (inL && inD) ? '#c9a227' : inL ? '#3a8a3a' : inD ? '#aa2222' : '#336699';
    ctx.fill();

    if (last) {
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#222';
      ctx.font = 'bold 11px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText(v, x, y - 11);
    }
  });
}

export default function VizCanvas({ gs }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) drawCanvas(canvasRef.current, gs);
  }, [gs]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) drawCanvas(canvasRef.current, gs);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  // gs intentionally omitted — resize handler closes over latest ref via canvasRef
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="section" style={{ padding: '10px 12px' }}>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: '8px' }}>
        <TurnBadge gs={gs} />
        <div className="legend">
          <span><span className="dot" style={{ background: '#3a8a3a' }} />LIS</span>
          <span><span className="dot" style={{ background: '#aa2222' }} />LDS</span>
          <span><span className="dot" style={{ background: '#c9a227' }} />Both</span>
          <span><span className="dot" style={{ background: '#336699' }} />Other</span>
        </div>
      </div>
      <canvas id="viz" ref={canvasRef} />
    </div>
  );
}

function TurnBadge({ gs }) {
  if (gs.over) return <span className="turn-badge turn-over">Game Over</span>;
  const { mode, player } = gs;
  if (mode === 'cpu' && player === 2)
    return <span className="turn-badge turn-cpu">Computer</span>;
  if (mode === 'hot' && player === 2)
    return <span className="turn-badge turn-p2">Player 2</span>;
  return <span className="turn-badge turn-p1">{mode === 'cpu' ? 'Your Turn' : 'Player 1'}</span>;
}
