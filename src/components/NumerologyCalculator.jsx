import { useState } from "react";

// ── Numerology engine ──────────────────────────────────────────────────────────

const LETTER_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};

const VOWELS = new Set(["A","E","I","O","U"]);

function reduce(n) {
  if (n === 11 || n === 22 || n === 33) return n;
  while (n > 9) {
    n = String(n).split("").reduce((a, d) => a + Number(d), 0);
    if (n === 11 || n === 22 || n === 33) return n;
  }
  return n;
}

function lifePathNumber(dob) {
  const digits = dob.replace(/\D/g, "");
  if (digits.length < 8) return null;
  const sum = digits.split("").reduce((a, d) => a + Number(d), 0);
  return reduce(sum);
}

function expressionNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  if (!letters.length) return null;
  const sum = letters.reduce((a, l) => a + (LETTER_MAP[l] || 0), 0);
  return reduce(sum);
}

function soulUrgeNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const vowels = letters.filter(l => VOWELS.has(l));
  if (!vowels.length) return null;
  const sum = vowels.reduce((a, l) => a + (LETTER_MAP[l] || 0), 0);
  return reduce(sum);
}

function personalityNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, "").split("");
  const consonants = letters.filter(l => !VOWELS.has(l));
  if (!consonants.length) return null;
  const sum = consonants.reduce((a, l) => a + (LETTER_MAP[l] || 0), 0);
  return reduce(sum);
}

function birthdayNumber(dob) {
  const parts = dob.split(/[-\/]/);
  const day = parseInt(parts[2] || parts[1] || "", 10);
  if (isNaN(day)) return null;
  return reduce(day);
}

// ── Interpretations ────────────────────────────────────────────────────────────

const MEANINGS = {
  1: { title: "The Pioneer", short: "Independence · Leadership · Ambition", body: "You carry the energy of the initiator — a soul who lights the first flame. You are here to forge your own path, to lead not by force but by example. The shadow of 1 is isolation; the gift is sovereign self-trust." },
  2: { title: "The Empath", short: "Harmony · Intuition · Cooperation", body: "You are the quiet architect of connection. Where others see walls, you find doors. Your power lives in sensitivity — not weakness. The shadow of 2 is self-erasure; the gift is bridging worlds others cannot see." },
  3: { title: "The Alchemist of Joy", short: "Creativity · Expression · Magnetism", body: "You speak in symbols, color, and resonance. Your voice is a force of creation. The shadow of 3 is scattered energy and self-doubt; the gift is transforming ordinary experience into art." },
  4: { title: "The Architect", short: "Structure · Discipline · Foundation", body: "You build what lasts. While others dream, you lay the stone. The shadow of 4 is rigidity; the gift is being the ground others stand on — stable, enduring, real." },
  5: { title: "The Free Spirit", short: "Freedom · Change · Adventure", body: "You are the living current — always moving, always seeking. Stagnation is your true enemy. The shadow of 5 is restlessness without purpose; the gift is teaching others that life is meant to be lived, not managed." },
  6: { title: "The Guardian", short: "Love · Responsibility · Healing", body: "You feel the weight of those you love — and carry it willingly. Your heart is a sanctuary. The shadow of 6 is martyrdom; the gift is creating warmth so genuine it changes people." },
  7: { title: "The Mystic", short: "Wisdom · Solitude · Truth-Seeking", body: "You peer behind the veil. Questions that others abandon, you pursue to the end. The shadow of 7 is isolation and cynicism; the gift is illuminating hidden truths that alter how we understand existence." },
  8: { title: "The Sovereign", short: "Power · Abundance · Mastery", body: "You understand that power is a responsibility, not a prize. You are drawn to mastery in all forms. The shadow of 8 is ruthlessness or fear of your own strength; the gift is demonstrating that material and spiritual power are not opposites." },
  9: { title: "The Sage", short: "Compassion · Completion · Universal Love", body: "You have lived many lives — and carry their wisdom. Your purpose is to give back what you have gathered. The shadow of 9 is bitterness when the world doesn't match your vision; the gift is a love so wide it holds everyone." },
  11: { title: "The Illuminator", short: "Master Number · Intuition · Inspiration", body: "You are a channel between worlds. Your sensitivity is not a curse — it is your instrument. The shadow of 11 is anxiety and self-doubt; the gift is visionary insight that lights the way for others." },
  22: { title: "The Master Builder", short: "Master Number · Vision · Legacy", body: "You dream at the scale of civilizations. Your purpose is to make the impossible tangible. The shadow of 22 is paralysis under the weight of your own potential; the gift is architecture that outlasts a lifetime." },
  33: { title: "The Master Teacher", short: "Master Number · Service · Enlightenment", body: "You embody unconditional love in action. Your life is a teaching, whether or not you speak. The shadow of 33 is martyrdom and taking on others' burdens; the gift is the rarest form of wisdom — love as a daily practice." },
};

function getMeaning(n) {
  return MEANINGS[n] || { title: `Number ${n}`, short: "A rare and potent vibration.", body: "The universe speaks to you in a frequency all your own." };
}

// ── Compatibility ──────────────────────────────────────────────────────────────

const COMPAT = {
  "1-1": { score: 72, text: "Two pioneers — powerful but combustible. You'll push each other to grow, but must learn to yield." },
  "1-2": { score: 85, text: "Complementary forces. 1 leads, 2 supports — but 2 teaches 1 the power of stillness." },
  "1-3": { score: 88, text: "Dynamic and electric. Creative fire meets bold direction — a magnetic pairing." },
  "1-4": { score: 75, text: "Ambition meets structure. You can build great things together if ego stays checked." },
  "1-5": { score: 70, text: "Both crave freedom. Exciting but restless — requires intentional commitment." },
  "1-6": { score: 80, text: "Leadership meets nurturing. Strong bond when 1 honors 6's emotional depth." },
  "1-7": { score: 65, text: "The doer meets the thinker. Mutual respect is key — you operate on different frequencies." },
  "1-8": { score: 82, text: "Two powerhouses. Ambitious and driven — incredible partnership if aligned in purpose." },
  "1-9": { score: 78, text: "The pioneer meets the sage. Deep mutual respect, though 9's selflessness can frustrate 1." },
  "2-2": { score: 88, text: "Deeply intuitive bond. Risk of co-dependency — but emotional intimacy is profound." },
  "2-3": { score: 84, text: "Harmony and creativity. 3 brings spark; 2 brings depth. Beautifully balanced." },
  "2-4": { score: 80, text: "Stability and loyalty. A quiet, enduring connection built on mutual trust." },
  "2-5": { score: 60, text: "Sensitive meets restless. 5's need for freedom can unsettle 2's need for security." },
  "2-6": { score: 92, text: "One of the most harmonious pairings. Both are givers — together, a sanctuary." },
  "2-7": { score: 76, text: "Intuition meets insight. Deep conversations, but 7's detachment can hurt 2." },
  "2-8": { score: 70, text: "Heart meets ambition. Can work if 8 honors 2's emotional needs consistently." },
  "2-9": { score: 86, text: "Empathy meets compassion. A deeply soulful connection with shared humanitarian values." },
  "3-3": { score: 82, text: "Pure creative energy. Joyful and expressive — but both must learn to listen." },
  "3-4": { score: 68, text: "Spontaneity meets routine. Friction is real, but you balance each other out." },
  "3-5": { score: 90, text: "Freedom and fun. Adventurous, playful, magnetic — a genuinely joyful match." },
  "3-6": { score: 85, text: "Warmth and creativity. 6 grounds 3's scattered energy; 3 lights up 6's world." },
  "3-7": { score: 72, text: "Social meets solitary. Requires patience and space — but intellectual sparks fly." },
  "3-8": { score: 74, text: "Creativity meets ambition. Strong potential if they respect each other's rhythms." },
  "3-9": { score: 88, text: "Two expressive souls. Abundant warmth and creativity — deeply fulfilling." },
  "4-4": { score: 78, text: "Rock-solid and reliable. May lack spontaneity but the foundation is unshakeable." },
  "4-5": { score: 58, text: "Structure vs freedom. One of the harder pairings — growth requires real compromise." },
  "4-6": { score: 88, text: "The builder and the nurturer. A stable, loving home energy. Highly compatible." },
  "4-7": { score: 80, text: "Discipline meets depth. Quiet and intellectual — a bond that deepens with time." },
  "4-8": { score: 86, text: "Two builders. Shared ambition and work ethic — a formidable partnership." },
  "4-9": { score: 70, text: "Practical meets idealistic. Can clash but also deeply complement each other." },
  "5-5": { score: 75, text: "Two free spirits. Exhilarating but unstable — requires grounding rituals." },
  "5-6": { score: 65, text: "Freedom vs commitment. 6 craves stability; 5 resists it. Requires real intention." },
  "5-7": { score: 78, text: "Both independent. A mentally stimulating match — plenty of space, plenty of depth." },
  "5-8": { score: 72, text: "Adventure meets power. Can build something bold together if aligned." },
  "5-9": { score: 82, text: "Freedom and wisdom. 9 understands 5's need to roam — mutual respect flows naturally." },
  "6-6": { score: 90, text: "Deep, devoted love. Nurturing squared — but watch for over-giving and resentment." },
  "6-7": { score: 74, text: "Heart meets mind. Beautiful tension. 7 must open up; 6 must allow solitude." },
  "6-8": { score: 80, text: "Love meets ambition. Strong and stable when 8 makes space for 6's emotional world." },
  "6-9": { score: 88, text: "Two of the most giving numbers. A beautiful, compassionate connection." },
  "7-7": { score: 84, text: "Dual mystics. Profound intellectual and spiritual depth — but must not isolate together." },
  "7-8": { score: 70, text: "Wisdom meets will. Respect each other's depth and drive — but speak different languages." },
  "7-9": { score: 86, text: "Seeker meets sage. A deeply philosophical bond — rare and meaningful." },
  "8-8": { score: 78, text: "Power meets power. Respect and shared ambition make this work. Watch the ego." },
  "8-9": { score: 74, text: "Ambition meets altruism. Can balance each other beautifully if values align." },
  "9-9": { score: 88, text: "Souls in resonance. A spiritual, purposeful connection — profound and rare." },
};

function getCompat(a, b) {
  const key1 = `${Math.min(a,b)}-${Math.max(a,b)}`;
  return COMPAT[key1] || { score: 75, text: "A unique vibration pairing. Your numbers create a one-of-a-kind resonance — navigate with openness." };
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --surface: #111118;
    --surface2: #18181f;
    --border: rgba(160,140,200,0.12);
    --border-glow: rgba(160,140,200,0.28);
    --gold: #c9a96e;
    --gold-dim: rgba(201,169,110,0.15);
    --violet: #9b87c8;
    --violet-dim: rgba(155,135,200,0.12);
    --text: #e8e4f0;
    --text-dim: #8880a0;
    --master: #e8a0b0;
    --display: 'Cormorant Garamond', serif;
    --body: 'Inter', sans-serif;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--body); min-height: 100vh; }

  .app { max-width: 720px; margin: 0 auto; padding: 2rem 1.25rem 4rem; }

  .header { text-align: center; margin-bottom: 3rem; }
  .header-eye { font-size: 2.2rem; margin-bottom: 0.75rem; opacity: 0.85; }
  .header h1 { font-family: var(--display); font-size: clamp(2rem, 6vw, 3.2rem); font-weight: 300; letter-spacing: 0.08em; color: var(--gold); line-height: 1.1; }
  .header p { font-size: 0.85rem; color: var(--text-dim); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 0.5rem; }

  .tabs { display: flex; gap: 0.25rem; background: var(--surface); border: 1px solid var(--border); border-radius: 10px; padding: 0.25rem; margin-bottom: 2rem; }
  .tab { flex: 1; padding: 0.6rem 0.5rem; font-size: 0.78rem; font-family: var(--body); letter-spacing: 0.06em; text-transform: uppercase; background: none; border: none; color: var(--text-dim); cursor: pointer; border-radius: 7px; transition: all 0.2s; }
  .tab.active { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(201,169,110,0.3); }
  .tab:hover:not(.active) { color: var(--text); }

  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 14px; padding: 1.75rem; margin-bottom: 1.25rem; }

  .field { margin-bottom: 1.25rem; }
  .field label { display: block; font-size: 0.72rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.45rem; }
  .field input { width: 100%; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 1rem; font-size: 0.95rem; color: var(--text); font-family: var(--body); outline: none; transition: border-color 0.2s; }
  .field input:focus { border-color: var(--violet); }

  .btn { width: 100%; padding: 0.85rem; background: linear-gradient(135deg, rgba(201,169,110,0.18), rgba(155,135,200,0.18)); border: 1px solid var(--gold); border-radius: 9px; color: var(--gold); font-family: var(--body); font-size: 0.82rem; letter-spacing: 0.12em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .btn:hover { background: linear-gradient(135deg, rgba(201,169,110,0.28), rgba(155,135,200,0.28)); box-shadow: 0 0 20px rgba(201,169,110,0.15); }

  .results-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1.5rem; }
  @media (max-width: 480px) { .results-grid { grid-template-columns: 1fr; } }

  .num-card { background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; cursor: pointer; transition: all 0.2s; }
  .num-card:hover, .num-card.open { border-color: var(--border-glow); }
  .num-card.open { background: var(--bg); }
  .num-card .label { font-size: 0.68rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.35rem; }
  .num-card .number { font-family: var(--display); font-size: 3rem; font-weight: 300; line-height: 1; color: var(--gold); }
  .num-card .number.master { color: var(--master); }
  .num-card .num-title { font-size: 0.8rem; color: var(--violet); margin-top: 0.3rem; }
  .num-card .short { font-size: 0.72rem; color: var(--text-dim); margin-top: 0.2rem; }
  .num-card .meaning-body { font-size: 0.83rem; line-height: 1.65; color: #c4bdd8; margin-top: 0.85rem; padding-top: 0.85rem; border-top: 1px solid var(--border); font-style: italic; }
  .num-card .toggle-hint { font-size: 0.65rem; color: var(--text-dim); margin-top: 0.5rem; letter-spacing: 0.05em; }

  .compat-section { margin-top: 1.5rem; }
  .compat-score-wrap { text-align: center; padding: 1.5rem 0 1rem; }
  .compat-score { font-family: var(--display); font-size: 5rem; font-weight: 300; line-height: 1; color: var(--gold); }
  .compat-score-label { font-size: 0.72rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 0.25rem; }
  .compat-bar-wrap { height: 4px; background: var(--surface2); border-radius: 2px; margin: 1rem 0; overflow: hidden; }
  .compat-bar { height: 100%; background: linear-gradient(90deg, var(--violet), var(--gold)); border-radius: 2px; transition: width 0.8s cubic-bezier(.23,1,.32,1); }
  .compat-text { font-size: 1.05rem; line-height: 1.7; color: #c4bdd8; text-align: center; font-style: italic; font-family: var(--display); }
  .compat-numbers { display: flex; align-items: center; justify-content: center; gap: 1.5rem; margin-bottom: 1.5rem; }
  .compat-num { font-family: var(--display); font-size: 2.5rem; font-weight: 300; color: var(--gold); text-align: center; }
  .compat-num small { display: block; font-family: var(--body); font-size: 0.65rem; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.08em; }
  .compat-x { font-size: 1.2rem; color: var(--text-dim); }

  .divider { display: flex; align-items: center; gap: 0.75rem; margin: 1.5rem 0; }
  .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .divider span { font-size: 0.65rem; color: var(--text-dim); letter-spacing: 0.1em; text-transform: uppercase; white-space: nowrap; }

  .empty { text-align: center; padding: 2rem; color: var(--text-dim); font-size: 0.85rem; }

  .person-block { margin-bottom: 1.25rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border); }
  .person-block:last-of-type { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .person-label { font-size: 0.72rem; color: var(--violet); letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.75rem; }
`;

// ── Component ──────────────────────────────────────────────────────────────────

export default function NumerologyCalculator() {
  const [tab, setTab] = useState("calculator");

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [results, setResults] = useState(null);
  const [openCards, setOpenCards] = useState({});

  const [p1name, setP1name] = useState("");
  const [p1dob, setP1dob] = useState("");
  const [p2name, setP2name] = useState("");
  const [p2dob, setP2dob] = useState("");
  const [compat, setCompat] = useState(null);

  function calculate() {
    const lp = lifePathNumber(dob);
    const ex = expressionNumber(name);
    const su = soulUrgeNumber(name);
    const pe = personalityNumber(name);
    const bd = birthdayNumber(dob);
    setResults({ lp, ex, su, pe, bd });
    setOpenCards({});
  }

  function calculateCompat() {
    const lp1 = lifePathNumber(p1dob);
    const lp2 = lifePathNumber(p2dob);
    const ex1 = expressionNumber(p1name);
    const ex2 = expressionNumber(p2name);
    if (!lp1 || !lp2) return;
    const lpData = getCompat(lp1, lp2);
    const exData = (ex1 && ex2) ? getCompat(ex1, ex2) : null;
    const avg = exData ? Math.round((lpData.score + exData.score) / 2) : lpData.score;
    setCompat({ lp1, lp2, ex1, ex2, lpData, exData, avg, name1: p1name || "Person 1", name2: p2name || "Person 2" });
  }

  function toggleCard(key) {
    setOpenCards(prev => ({ ...prev, [key]: !prev[key] }));
  }

  const numCards = results ? [
    { key: "lp", label: "Life Path", value: results.lp },
    { key: "ex", label: "Expression", value: results.ex },
    { key: "su", label: "Soul Urge", value: results.su },
    { key: "pe", label: "Personality", value: results.pe },
    { key: "bd", label: "Birthday", value: results.bd },
  ] : [];

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="header">
          <div className="header-eye">🜃</div>
          <h1>Numerology</h1>
          <p>Decode the language of your soul</p>
        </div>

        <div className="tabs">
          <button className={`tab ${tab === "calculator" ? "active" : ""}`} onClick={() => setTab("calculator")}>Calculator</button>
          <button className={`tab ${tab === "compatibility" ? "active" : ""}`} onClick={() => setTab("compatibility")}>Compatibility</button>
        </div>

        {tab === "calculator" && (
          <>
            <div className="card">
              <div className="field">
                <label>Full Birth Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="As it appears on your birth certificate" />
              </div>
              <div className="field">
                <label>Date of Birth</label>
                <input type="date" value={dob} onChange={e => setDob(e.target.value)} />
              </div>
              <button className="btn" onClick={calculate}>Reveal My Numbers</button>
            </div>

            {results && (
              <>
                <div className="divider"><span>Your Numerology Profile</span></div>
                <div className="results-grid">
                  {numCards.map(({ key, label, value }) => {
                    if (!value) return null;
                    const m = getMeaning(value);
                    const isMaster = [11,22,33].includes(value);
                    const isOpen = openCards[key];
                    return (
                      <div key={key} className={`num-card ${isOpen ? "open" : ""}`} onClick={() => toggleCard(key)}>
                        <div className="label">{label}</div>
                        <div className={`number ${isMaster ? "master" : ""}`}>{value}</div>
                        <div className="num-title">{m.title}</div>
                        <div className="short">{m.short}</div>
                        {isOpen && <div className="meaning-body">{m.body}</div>}
                        <div className="toggle-hint">{isOpen ? "Tap to collapse" : "Tap to read meaning"}</div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}

        {tab === "compatibility" && (
          <>
            <div className="card">
              <div className="person-block">
                <div className="person-label">Person 1</div>
                <div className="field">
                  <label>Full Birth Name</label>
                  <input value={p1name} onChange={e => setP1name(e.target.value)} placeholder="Name" />
                </div>
                <div className="field">
                  <label>Date of Birth</label>
                  <input type="date" value={p1dob} onChange={e => setP1dob(e.target.value)} />
                </div>
              </div>
              <div className="person-block">
                <div className="person-label">Person 2</div>
                <div className="field">
                  <label>Full Birth Name</label>
                  <input value={p2name} onChange={e => setP2name(e.target.value)} placeholder="Name" />
                </div>
                <div className="field">
                  <label>Date of Birth</label>
                  <input type="date" value={p2dob} onChange={e => setP2dob(e.target.value)} />
                </div>
              </div>
              <button className="btn" onClick={calculateCompat}>Read Our Compatibility</button>
            </div>

            {compat && (
              <div className="card compat-section">
                <div className="compat-numbers">
                  <div className="compat-num">
                    {compat.lp1}
                    <small>{compat.name1}</small>
                  </div>
                  <div className="compat-x">✦</div>
                  <div className="compat-num">
                    {compat.lp2}
                    <small>{compat.name2}</small>
                  </div>
                </div>
                <div className="compat-score-wrap">
                  <div className="compat-score">{compat.avg}</div>
                  <div className="compat-score-label">Resonance Score</div>
                </div>
                <div className="compat-bar-wrap">
                  <div className="compat-bar" style={{ width: `${compat.avg}%` }} />
                </div>
                <div className="divider"><span>Life Path Compatibility</span></div>
                <p className="compat-text">{compat.lpData.text}</p>
                {compat.exData && (
                  <>
                    <div className="divider"><span>Expression Compatibility</span></div>
                    <p className="compat-text">{compat.exData.text}</p>
                  </>
                )}
              </div>
            )}

            {!compat && (
              <div className="empty">Enter both birth dates to reveal your resonance</div>
            )}
          </>
        )}
      </div>
    </>
  );
}
