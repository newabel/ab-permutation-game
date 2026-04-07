import { useEffect, useRef } from 'react'

export default function Sequence({ gs }) {
  const { seq, lis, lds } = gs;
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
  }, [seq.length]);

  return (
    <div className="section">
      <div className="section-title">Sequence</div>
      <div className="chips" ref={containerRef}>
        {seq.length === 0
          ? <span style={{ color: '#888', fontSize: '0.8rem', fontStyle: 'italic' }}>No numbers yet</span>
          : seq.map((v, i) => {
              const inL = lis.idxSet.has(i), inD = lds.idxSet.has(i);
              const last = i === seq.length - 1;
              let cls = 'chip ' + ((inL && inD) ? 'chip-both' : inL ? 'chip-lis' : inD ? 'chip-lds' : 'chip-default');
              if (last) cls += ' chip-last';
              return <span key={i} className={cls}>{v}</span>;
            })
        }
      </div>
    </div>
  );
}
