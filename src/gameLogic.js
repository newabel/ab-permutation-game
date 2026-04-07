// ── Algorithms ────────────────────────────────────────────────────────────────

/** O(n log n) LIS with index reconstruction. Returns { len, idxSet }. */
export function computeLIS(seq) {
  const n = seq.length;
  if (n === 0) return { len: 0, idxSet: new Set() };

  const tails = [];
  const parent = new Array(n).fill(-1);

  for (let i = 0; i < n; i++) {
    let lo = 0, hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (seq[tails[mid]] < seq[i]) lo = mid + 1; else hi = mid;
    }
    if (lo > 0) parent[i] = tails[lo - 1];
    tails[lo] = i;
  }

  const idxSet = new Set();
  let cur = tails[tails.length - 1];
  while (cur !== -1) { idxSet.add(cur); cur = parent[cur]; }
  return { len: tails.length, idxSet };
}

/** LDS via negation. */
export function computeLDS(seq) {
  return computeLIS(seq.map(x => -x));
}

export const theMax = (a, b) => (a - 1) * (b - 1) + 1;

// ── Records ───────────────────────────────────────────────────────────────────

const recKey  = (a, b) => `abgame:${a}:${b}`;
export const getBest = (a, b) => +(localStorage.getItem(recKey(a, b)) || 0);

export function updateBest(a, b, score) {
  if (score > getBest(a, b)) { localStorage.setItem(recKey(a, b), score); return true; }
  return false;
}

// ── State factory ─────────────────────────────────────────────────────────────

export function createInitialState(a, b, mode, competitive) {
  return {
    a, b, mode, competitive,
    seq: [],
    used: new Set(),
    player: 1,
    loser: null,
    over: false,
    lis: { len: 0, idxSet: new Set() },
    lds: { len: 0, idxSet: new Set() },
  };
}

// ── Core ──────────────────────────────────────────────────────────────────────

/** Pure: returns the next game state after playing n. */
export function applyMove(state, n) {
  const seq  = [...state.seq, n];
  const used = new Set(state.used);
  used.add(n);
  const lis  = computeLIS(seq);
  const lds  = computeLDS(seq);
  const over = lis.len >= state.a || lds.len >= state.b;

  return {
    ...state,
    seq, used, lis, lds, over,
    loser:  over ? state.player : null,
    player: over ? state.player : (state.player === 1 ? 2 : 1),
  };
}

// ── Computer AI ───────────────────────────────────────────────────────────────

/**
 * Cooperative: minimise max(lis/(a-1), lds/(b-1)) — stay away from limits.
 * Competitive: maximise that ratio — push limits so the opponent has fewer safe moves.
 */
export function aiMove(state) {
  const { seq, used, a, b, competitive } = state;
  const maxN = Math.max(150, (a - 1) * (b - 1) * 5 + 20);
  let bestN = -1, bestEnds = true;
  let bestScore = competitive ? -Infinity : Infinity;

  for (let n = 1; n <= maxN; n++) {
    if (used.has(n)) continue;
    const ns  = seq.concat(n);
    const nl  = computeLIS(ns).len;
    const nd  = computeLDS(ns).len;
    const ends  = nl >= a || nd >= b;
    const score = Math.max(nl / (a - 1), nd / (b - 1));

    const better = competitive ? (score > bestScore) : (score < bestScore);

    if (bestEnds && !ends) {
      bestN = n; bestScore = score; bestEnds = false;
    } else if (bestEnds === ends && better) {
      bestN = n; bestScore = score;
    }
  }

  return bestN > 0 ? bestN : 1;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

export function playerName(mode, p) {
  if (mode === 'cpu') return p === 1 ? 'Human' : 'Computer';
  return `Player ${p}`;
}
