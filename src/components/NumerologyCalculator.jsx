import { useState } from "react";

const LETTER_MAP = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8,
};
const VOWELS = new Set("aeiou");
const MASTER = new Set([11, 22, 33]);

function reduceToSingle(n) {
  while (n > 9 && !MASTER.has(n)) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

function lifePathNumber(dob) {
  const digits = dob.replace(/\D/g, "");
  const total = digits.split("").reduce((s, d) => s + Number(d), 0);
  return reduceToSingle(total);
}

function expressionNumber(name) {
  const total = name.toLowerCase().split("").reduce((s, c) => s + (LETTER_MAP[c] || 0), 0);
  return reduceToSingle(total);
}

function soulUrgeNumber(name) {
  const total = name.toLowerCase().split("").reduce((s, c) => s + (VOWELS.has(c) ? (LETTER_MAP[c] || 0) : 0), 0);
  return reduceToSingle(total);
}

const MEANINGS = {
  1:  { title: "The Leader",        body: "Independent, pioneering, self-reliant. You're built to start things." },
  2:  { title: "The Peacemaker",    body: "Diplomatic, intuitive, cooperative. You feel what others miss." },
  3:  { title: "The Creator",       body: "Expressive, joyful, magnetic. You turn ideas into art." },
  4:  { title: "The Builder",       body: "Disciplined, practical, dependable. You make things last." },
  5:  { title: "The Adventurer",    body: "Curious, versatile, freedom-loving. You need room to roam." },
  6:  { title: "The Nurturer",      body: "Caring, responsible, harmonious. You hold people together." },
  7:  { title: "The Seeker",        body: "Introspective, analytical, spiritual. You're chasing the deeper why." },
  8:  { title: "The Powerhouse",    body: "Ambitious, authoritative, business-minded. You're wired to lead at scale." },
  9:  { title: "The Humanitarian",  body: "Compassionate, idealistic, generous. You're here for everyone." },
  11: { title: "Master Intuitive",  body: "Visionary, highly sensitive, inspired. You see what others can't." },
  22: { title: "Master Builder",    body: "Vision plus discipline. You can build things that change the world." },
  33: { title: "Master Teacher",    body: "Selfless, healing, deeply compassionate. You uplift everyone around you." },
};

const GLYPHS = {
  1:"☀",2:"☽",3:"✦",4:"◆",5:"⚡",6:"♡",
  7:"◎",8:"∞",9:"✿",11:"✧",22:"⬡",33:"❋",
};

const S = {
  page: { minHeight:"100vh", background:"radial-gradient(ellipse at 50% 0%, #1a0533 0%, #0b0118 60%, #000 100%)", display:"flex", flexDirection:"column", alignItems:"center", padding:"48px 16px 64px", fontFamily:"'Georgia', serif", color:"#e8d8ff" },
  eyebrow: { letterSpacing:"0.25em", fontSize:"11px", textTransform:"uppercase", color:"#a78bca", marginBottom:"12px", fontFamily:"sans-serif" },
  title: { fontSize:"clamp(2rem, 6vw, 3.5rem)", fontWeight:"300", letterSpacing:"0.05em", margin:"0 0 8px", background:"linear-gradient(135deg, #e8d8ff 30%, #c084fc 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  subtitle: { fontSize:"15px", color:"#9370b8", marginBottom:"48px", fontFamily:"sans-serif", fontStyle:"italic" },
  card: { width:"100%", maxWidth:"480px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(200,150,255,0.15)", borderRadius:"20px", padding:"36px 32px", backdropFilter:"blur(12px)" },
  label: { display:"block", fontSize:"11px", letterSpacing:"0.18em", textTransform:"uppercase", color:"#a78bca", fontFamily:"sans-serif", marginBottom:"8px" },
  input: { width:"100%", background:"rgba(255,255,255,0.05)", border:"1px solid rgba(200,150,255,0.2)", borderRadius:"10px", padding:"12px 16px", fontSize:"16px", color:"#e8d8ff", outline:"none", marginBottom:"20px", boxSizing:"border-box", fontFamily:"sans-serif" },
  btn: { width:"100%", padding:"14px", borderRadius:"10px", border:"none", background:"linear-gradient(135deg, #7c3aed, #a855f7)", color:"#fff", fontSize:"15px", fontFamily:"sans-serif", cursor:"pointer", marginTop:"4px" },
  error: { fontSize:"13px", color:"#f87171", fontFamily:"sans-serif", marginTop:"-12px", marginBottom:"16px" },
  resultsWrap: { width:"100%", maxWidth:"480px", marginTop:"32px", display:"flex", flexDirection:"column", gap:"16px" },
  resultCard: (a) => ({ background:"rgba(255,255,255,0.03)", border:`1px solid ${a}44`, borderRadius:"16px", padding:"24px", position:"relative", overflow:"hidden" }),
  resultGlyph: (a) => ({ position:"absolute", top:"16px", right:"20px", fontSize:"28px", opacity:0.25, color:a }),
  resultLabel: { fontSize:"10px", letterSpacing:"0.22em", textTransform:"uppercase", color:"#9370b8", fontFamily:"sans-serif", marginBottom:"4px" },
  resultNumber: (a) => ({ fontSize:"52px", fontWeight:"300", color:a, lineHeight:1, marginBottom:"2px" }),
  resultTitle: { fontSize:"18px", fontWeight:"600", color:"#e8d8ff", marginBottom:"6px" },
  resultBody: { fontSize:"14px", color:"#b39dcc", lineHeight:1.6, fontFamily:"sans-serif" },
  divider: { width:"40px", height:"1px", background:"rgba(200,150,255,0.2)", margin:"8px 0" },
};

function ResultCard({ label, number, accent }) {
  const meaning = MEANINGS[number] || { title:"Mystical", body:"Your number holds deep secrets." };
  const glyph = GLYPHS[number] || "✦";
  return (
    <div style={S.resultCard(accent)}>
      <span style={S.resultGlyph(accent)}>{glyph}</span>
      <div style={S.resultLabel}>{label}</div>
      <div style={S.resultNumber(accent)}>{number}</div>
      <div style={S.divider} />
      <div style={S.resultTitle}>{meaning.title}</div>
      <div style={S.resultBody}>{meaning.body}</div>
    </div>
  );
}

export default function NumerologyCalculator() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");

  function validate() {
    if (!name.trim()) return "Enter your full birth name.";
    if (!dob.trim()) return "Enter your date of birth.";
    if (!/\d{4,8}/.test(dob.replace(/\D/g, ""))) return "Use format MM/DD/YYYY.";
    return "";
  }

  function calculate() {
    const err = validate();
    if (err) { setError(err); setResults(null); return; }
    setError("");
    setResults({ lp: lifePathNumber(dob), ex: expressionNumber(name), su: soulUrgeNumber(name) });
  }

  return (
    <div style={S.page}>
      <div style={S.eyebrow}>Pythagorean Numerology</div>
      <h1 style={S.title}>Read Your Numbers</h1>
      <p style={S.subtitle}>Your name and birthdate carry a vibration. Let's decode it.</p>
      <div style={S.card}>
        <label style={S.label}>Full birth name</label>
        <input style={S.input} placeholder="e.g. Dominic Carlequin" value={name} onChange={e => setName(e.target.value)} />
        <label style={S.label}>Date of birth</label>
        <input style={S.input} placeholder="MM/DD/YYYY" value={dob} onChange={e => setDob(e.target.value)} />
        {error && <div style={S.error}>{error}</div>}
        <button style={S.btn} onClick={calculate}>Calculate ✦</button>
      </div>
      {results && (
        <div style={S.resultsWrap}>
          <ResultCard label="Life Path — your life's purpose" number={results.lp} accent="#c084fc" />
          <ResultCard label="Expression — your natural talents" number={results.ex} accent="#818cf8" />
          <ResultCard label="Soul Urge — your inner desires" number={results.su} accent="#f0abfc" />
        </div>
      )}
    </div>
  );
}
