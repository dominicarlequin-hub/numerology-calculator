import { useState } from "react";

// ── Letter map & constants ─────────────────────────────────────────────────────

const LETTER_MAP = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};
const VOWELS = new Set(["A","E","I","O","U"]);
const KARMIC_DEBT_NUMBERS = new Set([13,14,16,19]);

// ── Sephiroth + Tarot data ─────────────────────────────────────────────────────

const SEPHIROTH = [
  {
    id:1, name:"Kether", title:"The Crown", num:1, x:200, y:40, color:"#f5f0e0",
    desc:"Divine unity. The point of pure being before form. Your connection to source.",
    tarot:[
      { name:"The Fool", number:"0", symbol:"🜁", meaning:"Pure potential before manifestation. The soul at the threshold of existence — unformed, fearless, infinite." },
      { name:"The Magician", number:"I", symbol:"☿", meaning:"The will to begin. Divine power channeled through focused intention into the world of form." },
    ]
  },
  {
    id:2, name:"Chokmah", title:"Wisdom", num:2, x:320, y:110, color:"#c9a96e",
    desc:"Raw creative force. The first flash of divine thought. Masculine principle.",
    tarot:[
      { name:"The Star", number:"XVII", symbol:"✦", meaning:"Inspiration pouring from the heavens. Hope, cosmic guidance, the light that orients the wandering soul." },
      { name:"The Emperor", number:"IV", symbol:"♂", meaning:"Structure born from wisdom. The archetype of divine masculine authority and ordered creation." },
    ]
  },
  {
    id:3, name:"Binah", title:"Understanding", num:3, x:80, y:110, color:"#9b87c8",
    desc:"The great mother. Form-giver. Where potential becomes structure.",
    tarot:[
      { name:"The High Priestess", number:"II", symbol:"☽", meaning:"The veil between worlds. Deep intuition, mystery, the wisdom that cannot be spoken — only felt." },
      { name:"The Empress", number:"III", symbol:"♀", meaning:"Sacred feminine abundance. Life-giver, nurturer, the intelligence of the natural world made divine." },
    ]
  },
  {
    id:4, name:"Chesed", title:"Mercy", num:4, x:320, y:210, color:"#6ea8c9",
    desc:"Loving-kindness. Abundance. The architect of divine order and grace.",
    tarot:[
      { name:"The Wheel of Fortune", number:"X", symbol:"🜂", meaning:"Cycles of fate turning. What rises must fall — and what falls shall rise. Trust the turning." },
      { name:"The Hierophant", number:"V", symbol:"⛪", meaning:"Sacred tradition and spiritual law. The keeper of esoteric wisdom passed through lineage." },
    ]
  },
  {
    id:5, name:"Geburah", title:"Strength", num:5, x:80, y:210, color:"#c96e6e",
    desc:"Severity. Divine judgment. The force that purges what no longer serves.",
    tarot:[
      { name:"The Tower", number:"XVI", symbol:"⚡", meaning:"Sudden destruction of false structures. The lightning bolt that liberates by shattering illusion." },
      { name:"Strength", number:"VIII", symbol:"♾", meaning:"Power tamed by love. The roar of the lion silenced not by force but by inner mastery." },
    ]
  },
  {
    id:6, name:"Tiphareth", title:"Beauty", num:6, x:200, y:280, color:"#f5d060",
    desc:"The heart of the Tree. Harmony, sacrifice, the solar center of the self.",
    tarot:[
      { name:"The Sun", number:"XIX", symbol:"☀", meaning:"Radiant clarity. Joy without condition. The self revealed in its fullest, most luminous expression." },
      { name:"The Lovers", number:"VI", symbol:"♡", meaning:"Sacred union. The choice between paths, and the love that makes the soul whole." },
    ]
  },
  {
    id:7, name:"Netzach", title:"Victory", num:7, x:320, y:360, color:"#6ec97a",
    desc:"Desire, emotion, nature. The realm of feeling and creative passion.",
    tarot:[
      { name:"The Empress", number:"III", symbol:"♀", meaning:"The living pulse of nature. Desire as a divine current — creative, fertile, unstoppable." },
      { name:"The Chariot", number:"VII", symbol:"🜄", meaning:"Victory through directed will. Emotion harnessed and driven forward with fierce intention." },
    ]
  },
  {
    id:8, name:"Hod", title:"Splendour", num:8, x:80, y:360, color:"#c9a96e",
    desc:"Intellect, communication, magic. Where thought takes form in language.",
    tarot:[
      { name:"The Hermit", number:"IX", symbol:"🕯", meaning:"The lantern in the dark. Wisdom carried inward, knowledge sought in sacred solitude." },
      { name:"Justice", number:"XI", symbol:"⚖", meaning:"Cosmic law made visible. The precise intelligence that weighs all things with perfect clarity." },
    ]
  },
  {
    id:9, name:"Yesod", title:"Foundation", num:9, x:200, y:430, color:"#a0c4f5",
    desc:"The astral plane. Dreams, cycles, the unconscious mirror of reality.",
    tarot:[
      { name:"The Moon", number:"XVIII", symbol:"☾", meaning:"The realm of illusion and dream. The unconscious speaks in symbols — learn to read its language." },
      { name:"The High Priestess", number:"II", symbol:"☽", meaning:"The silver thread between worlds. She holds the scroll of hidden knowledge — patient, knowing, still." },
    ]
  },
  {
    id:10, name:"Malkuth", title:"The Kingdom", num:10, x:200, y:520, color:"#a08060",
    desc:"Earth. Physical reality. The final crystallization of divine energy into matter.",
    tarot:[
      { name:"The World", number:"XXI", symbol:"🜃", meaning:"Completion. The soul having journeyed the full Tree, now standing whole in the world of matter." },
      { name:"The Universe", number:"XXI", symbol:"∞", meaning:"Total integration. All paths walked, all lessons absorbed — divine consciousness grounded in form." },
    ]
  },
];

const PATHS = [
  [1,2],[1,3],[1,6],
  [2,3],[2,4],[2,6],
  [3,5],[3,6],
  [4,5],[4,6],[4,7],
  [5,6],[5,8],
  [6,7],[6,8],[6,9],
  [7,8],[7,9],[7,10],
  [8,9],[8,10],
  [9,10]
];

// ── Numerology engine ──────────────────────────────────────────────────────────

function reduce(n) {
  if (n===11||n===22||n===33) return n;
  while (n>9) {
    n = String(n).split("").reduce((a,d)=>a+Number(d),0);
    if (n===11||n===22||n===33) return n;
  }
  return n;
}

function reduceWithKarma(n) {
  if (n===11||n===22||n===33) return {value:n,karmic:null};
  if (KARMIC_DEBT_NUMBERS.has(n)) return {value:reduce(n),karmic:n};
  while (n>9) {
    const next = String(n).split("").reduce((a,d)=>a+Number(d),0);
    if (KARMIC_DEBT_NUMBERS.has(next)) return {value:reduce(next),karmic:next};
    n = next;
    if (n===11||n===22||n===33) return {value:n,karmic:null};
  }
  return {value:n,karmic:null};
}

function lifePathWithKarma(dob) {
  const digits = dob.replace(/\D/g,"");
  if (digits.length<8) return {value:null,karmic:null};
  return reduceWithKarma(digits.split("").reduce((a,d)=>a+Number(d),0));
}

function expressionWithKarma(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g,"").split("");
  if (!letters.length) return {value:null,karmic:null};
  return reduceWithKarma(letters.reduce((a,l)=>a+(LETTER_MAP[l]||0),0));
}

function soulUrgeNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g,"").split("");
  const vowels = letters.filter(l=>VOWELS.has(l));
  if (!vowels.length) return null;
  return reduce(vowels.reduce((a,l)=>a+(LETTER_MAP[l]||0),0));
}

function personalityNumber(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g,"").split("");
  const consonants = letters.filter(l=>!VOWELS.has(l));
  if (!consonants.length) return null;
  return reduce(consonants.reduce((a,l)=>a+(LETTER_MAP[l]||0),0));
}

function birthdayNumber(dob) {
  const parts = dob.split(/[-\/]/);
  const day = parseInt(parts[2]||parts[1]||"",10);
  if (isNaN(day)) return null;
  return reduce(day);
}

function personalYearNumber(dob) {
  const parts = dob.split(/[-\/]/);
  const month = parseInt(parts[1]||"",10);
  const day = parseInt(parts[2]||"",10);
  if (isNaN(month)||isNaN(day)) return null;
  return reduce(month + day + new Date().getFullYear());
}

function missingNumbers(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g,"").split("");
  const present = new Set(letters.map(l=>LETTER_MAP[l]).filter(Boolean));
  const missing = [];
  for (let i=1;i<=9;i++) if (!present.has(i)) missing.push(i);
  return missing;
}

function numToSephirahId(n) {
  if (n===11) return 2;
  if (n===22) return 3;
  if (n===33) return 6;
  if (n===10||n===0) return 10;
  if (n>10) return reduce(n);
  return n;
}

// ── Interpretation data ────────────────────────────────────────────────────────

const MEANINGS = {
  1:{title:"The Pioneer",short:"Independence · Leadership · Ambition",body:"You carry the energy of the initiator — a soul who lights the first flame. You are here to forge your own path, to lead not by force but by example. The shadow of 1 is isolation; the gift is sovereign self-trust."},
  2:{title:"The Empath",short:"Harmony · Intuition · Cooperation",body:"You are the quiet architect of connection. Where others see walls, you find doors. Your power lives in sensitivity — not weakness. The shadow of 2 is self-erasure; the gift is bridging worlds others cannot see."},
  3:{title:"The Alchemist of Joy",short:"Creativity · Expression · Magnetism",body:"You speak in symbols, color, and resonance. Your voice is a force of creation. The shadow of 3 is scattered energy and self-doubt; the gift is transforming ordinary experience into art."},
  4:{title:"The Architect",short:"Structure · Discipline · Foundation",body:"You build what lasts. While others dream, you lay the stone. The shadow of 4 is rigidity; the gift is being the ground others stand on — stable, enduring, real."},
  5:{title:"The Free Spirit",short:"Freedom · Change · Adventure",body:"You are the living current — always moving, always seeking. Stagnation is your true enemy. The shadow of 5 is restlessness without purpose; the gift is teaching others that life is meant to be lived, not managed."},
  6:{title:"The Guardian",short:"Love · Responsibility · Healing",body:"You feel the weight of those you love — and carry it willingly. Your heart is a sanctuary. The shadow of 6 is martyrdom; the gift is creating warmth so genuine it changes people."},
  7:{title:"The Mystic",short:"Wisdom · Solitude · Truth-Seeking",body:"You peer behind the veil. Questions that others abandon, you pursue to the end. The shadow of 7 is isolation and cynicism; the gift is illuminating hidden truths that alter how we understand existence."},
  8:{title:"The Sovereign",short:"Power · Abundance · Mastery",body:"You understand that power is a responsibility, not a prize. You are drawn to mastery in all forms. The shadow of 8 is ruthlessness or fear of your own strength; the gift is demonstrating that material and spiritual power are not opposites."},
  9:{title:"The Sage",short:"Compassion · Completion · Universal Love",body:"You have lived many lives — and carry their wisdom. Your purpose is to give back what you have gathered. The shadow of 9 is bitterness when the world doesn't match your vision; the gift is a love so wide it holds everyone."},
  11:{title:"The Illuminator",short:"Master Number · Intuition · Inspiration",body:"You are a channel between worlds. Your sensitivity is not a curse — it is your instrument. The shadow of 11 is anxiety and self-doubt; the gift is visionary insight that lights the way for others."},
  22:{title:"The Master Builder",short:"Master Number · Vision · Legacy",body:"You dream at the scale of civilizations. Your purpose is to make the impossible tangible. The shadow of 22 is paralysis under the weight of your own potential; the gift is architecture that outlasts a lifetime."},
  33:{title:"The Master Teacher",short:"Master Number · Service · Enlightenment",body:"You embody unconditional love in action. Your life is a teaching, whether or not you speak. The shadow of 33 is martyrdom and taking on others' burdens; the gift is the rarest form of wisdom — love as a daily practice."},
};
function getMeaning(n) {
  return MEANINGS[n]||{title:`Number ${n}`,short:"A rare and potent vibration.",body:"The universe speaks to you in a frequency all your own."};
}

const KARMIC_MEANINGS = {
  13:{title:"Karmic Debt 13",lesson:"The Debt of Laziness",body:"In a past life, you avoided hard work and let others carry your weight. This life calls you to build through discipline and perseverance. The reward is mastery — but it must be earned. Shortcuts will collapse. Consistency is your redemption."},
  14:{title:"Karmic Debt 14",lesson:"The Debt of Misused Freedom",body:"You once abused freedom — through excess, addiction, or manipulation of others. This life asks you to find liberation through structure and moderation. True freedom is earned through self-mastery, not escape."},
  16:{title:"Karmic Debt 16",lesson:"The Debt of the Fallen Ego",body:"In a past life, ego and self-importance led to destruction — yours or others'. This life will repeatedly dismantle what you build through pride. The lesson: surrender ego, build from truth and humility. What survives will be real."},
  19:{title:"Karmic Debt 19",lesson:"The Debt of Selfishness",body:"You once used power for self-gain at the expense of others. This life demands that you learn independence without isolation, and strength without domination. Your gift becomes leadership rooted in service."},
};

const PY_THEMES = {
  1:"plant seeds, begin boldly, and trust new starts",
  2:"slow down, listen deeply, and nurture your relationships",
  3:"express yourself freely, create, and let joy lead",
  4:"build foundations, work hard, and establish lasting structures",
  5:"embrace change, release what no longer serves, and seek adventure",
  6:"tend to home, love, and the responsibilities that matter most",
  7:"go inward, seek truth, and trust your intuition over logic",
  8:"step into your power, pursue abundance, and lead with authority",
  9:"release, forgive, complete old cycles, and prepare for rebirth",
  11:"trust your visions — you are being called to inspire others",
  22:"think big and build something that outlasts this moment",
  33:"serve with love and let your life be the teaching",
};

const MISSING_MEANINGS = {
  1:{shadow:"Difficulty asserting yourself or taking initiative",lesson:"You are learning to own your voice and stand in your authority without needing permission."},
  2:{shadow:"Struggle with patience, diplomacy, or reading others",lesson:"You are learning the art of deep listening and the power of subtle, cooperative energy."},
  3:{shadow:"Difficulty expressing yourself creatively",lesson:"You are learning to let creativity flow without judgment — to speak, create, and play freely."},
  4:{shadow:"Resistance to routine, structure, or sustained effort",lesson:"You are learning that true freedom is built on foundation — discipline is not a cage, it is a launchpad."},
  5:{shadow:"Fear of change, risk, or the unknown",lesson:"You are learning to embrace life's unpredictability as a gift rather than a threat."},
  6:{shadow:"Difficulty nurturing others or accepting responsibility",lesson:"You are learning that love given freely — without keeping score — is the most powerful force you carry."},
  7:{shadow:"Avoidance of solitude, depth, or inner work",lesson:"You are learning to trust the unseen — to sit in stillness long enough to hear what your soul knows."},
  8:{shadow:"Complex relationship with money, power, or ambition",lesson:"You are learning that abundance is your birthright — and that wielding power with integrity is a spiritual act."},
  9:{shadow:"Difficulty with compassion, completion, or the big picture",lesson:"You are learning that all things end, and in that ending is grace — you are here to give, forgive, and release."},
};

// ── Compatibility data ─────────────────────────────────────────────────────────

const COMPAT = {
  "1-1":{score:72,text:"Two pioneers — powerful but combustible. You'll push each other to grow, but must learn to yield."},
  "1-2":{score:85,text:"Complementary forces. 1 leads, 2 supports — but 2 teaches 1 the power of stillness."},
  "1-3":{score:88,text:"Dynamic and electric. Creative fire meets bold direction — a magnetic pairing."},
  "1-4":{score:75,text:"Ambition meets structure. You can build great things together if ego stays checked."},
  "1-5":{score:70,text:"Both crave freedom. Exciting but restless — requires intentional commitment."},
  "1-6":{score:80,text:"Leadership meets nurturing. Strong bond when 1 honors 6's emotional depth."},
  "1-7":{score:65,text:"The doer meets the thinker. Mutual respect is key — you operate on different frequencies."},
  "1-8":{score:82,text:"Two powerhouses. Ambitious and driven — incredible partnership if aligned in purpose."},
  "1-9":{score:78,text:"The pioneer meets the sage. Deep mutual respect, though 9's selflessness can frustrate 1."},
  "2-2":{score:88,text:"Deeply intuitive bond. Risk of co-dependency — but emotional intimacy is profound."},
  "2-3":{score:84,text:"Harmony and creativity. 3 brings spark; 2 brings depth. Beautifully balanced."},
  "2-4":{score:80,text:"Stability and loyalty. A quiet, enduring connection built on mutual trust."},
  "2-5":{score:60,text:"Sensitive meets restless. 5's need for freedom can unsettle 2's need for security."},
  "2-6":{score:92,text:"One of the most harmonious pairings. Both are givers — together, a sanctuary."},
  "2-7":{score:76,text:"Intuition meets insight. Deep conversations, but 7's detachment can hurt 2."},
  "2-8":{score:70,text:"Heart meets ambition. Can work if 8 honors 2's emotional needs consistently."},
  "2-9":{score:86,text:"Empathy meets compassion. A deeply soulful connection with shared humanitarian values."},
  "3-3":{score:82,text:"Pure creative energy. Joyful and expressive — but both must learn to listen."},
  "3-4":{score:68,text:"Spontaneity meets routine. Friction is real, but you balance each other out."},
  "3-5":{score:90,text:"Freedom and fun. Adventurous, playful, magnetic — a genuinely joyful match."},
  "3-6":{score:85,text:"Warmth and creativity. 6 grounds 3's scattered energy; 3 lights up 6's world."},
  "3-7":{score:72,text:"Social meets solitary. Requires patience and space — but intellectual sparks fly."},
  "3-8":{score:74,text:"Creativity meets ambition. Strong potential if they respect each other's rhythms."},
  "3-9":{score:88,text:"Two expressive souls. Abundant warmth and creativity — deeply fulfilling."},
  "4-4":{score:78,text:"Rock-solid and reliable. May lack spontaneity but the foundation is unshakeable."},
  "4-5":{score:58,text:"Structure vs freedom. One of the harder pairings — growth requires real compromise."},
  "4-6":{score:88,text:"The builder and the nurturer. A stable, loving home energy. Highly compatible."},
  "4-7":{score:80,text:"Discipline meets depth. Quiet and intellectual — a bond that deepens with time."},
  "4-8":{score:86,text:"Two builders. Shared ambition and work ethic — a formidable partnership."},
  "4-9":{score:70,text:"Practical meets idealistic. Can clash but also deeply complement each other."},
  "5-5":{score:75,text:"Two free spirits. Exhilarating but unstable — requires grounding rituals."},
  "5-6":{score:65,text:"Freedom vs commitment. 6 craves stability; 5 resists it. Requires real intention."},
  "5-7":{score:78,text:"Both independent. A mentally stimulating match — plenty of space, plenty of depth."},
  "5-8":{score:72,text:"Adventure meets power. Can build something bold together if aligned."},
  "5-9":{score:82,text:"Freedom and wisdom. 9 understands 5's need to roam — mutual respect flows naturally."},
  "6-6":{score:90,text:"Deep, devoted love. Nurturing squared — but watch for over-giving and resentment."},
  "6-7":{score:74,text:"Heart meets mind. Beautiful tension. 7 must open up; 6 must allow solitude."},
  "6-8":{score:80,text:"Love meets ambition. Strong and stable when 8 makes space for 6's emotional world."},
  "6-9":{score:88,text:"Two of the most giving numbers. A beautiful, compassionate connection."},
  "7-7":{score:84,text:"Dual mystics. Profound intellectual and spiritual depth — but must not isolate together."},
  "7-8":{score:70,text:"Wisdom meets will. Respect each other's depth and drive — but speak different languages."},
  "7-9":{score:86,text:"Seeker meets sage. A deeply philosophical bond — rare and meaningful."},
  "8-8":{score:78,text:"Power meets power. Respect and shared ambition make this work. Watch the ego."},
  "8-9":{score:74,text:"Ambition meets altruism. Can balance each other beautifully if values align."},
  "9-9":{score:88,text:"Souls in resonance. A spiritual, purposeful connection — profound and rare."},
};
function getCompat(a,b) {
  return COMPAT[`${Math.min(a,b)}-${Math.max(a,b)}`]||{score:75,text:"A unique vibration pairing. Your numbers create a one-of-a-kind resonance — navigate with openness."};
}

// ── Tarot Card Component ───────────────────────────────────────────────────────

function TarotCard({ card, color }) {
  return (
    <div style={{
      background:`linear-gradient(160deg, rgba(10,10,15,0.95), ${color}18)`,
      border:`1px solid ${color}55`,
      borderRadius:12,
      padding:"1rem",
      flex:"1 1 140px",
      minWidth:130,
      maxWidth:180,
    }}>
      <div style={{fontSize:"1.8rem",marginBottom:"0.4rem",textAlign:"center"}}>{card.symbol}</div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.65rem",color,letterSpacing:"0.1em",textTransform:"uppercase",textAlign:"center",marginBottom:"0.2rem"}}>
        {card.number}
      </div>
      <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",color,textAlign:"center",marginBottom:"0.5rem",fontWeight:400}}>
        {card.name}
      </div>
      <div style={{fontSize:"0.75rem",color:"#c4bdd8",lineHeight:1.6,fontStyle:"italic",textAlign:"center"}}>
        {card.meaning}
      </div>
    </div>
  );
}

// ── Tree of Life SVG Component ─────────────────────────────────────────────────

function TreeOfLife({ activeNums }) {
  const [selected, setSelected] = useState(null);

  const activeSephIds = new Set();
  (activeNums||[]).forEach(n => {
    activeSephIds.add(numToSephirahId(n));
  });

  const sel = selected ? SEPHIROTH.find(s=>s.id===selected) : null;

  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"1.25rem"}}>
      <svg viewBox="0 0 400 570" width="100%" style={{maxWidth:300,display:"block"}}>
        {/* Paths */}
        {PATHS.map(([a,b],i)=>{
          const sa = SEPHIROTH.find(s=>s.id===a);
          const sb = SEPHIROTH.find(s=>s.id===b);
          const bothActive = activeSephIds.has(a) && activeSephIds.has(b);
          return (
            <line key={i} x1={sa.x} y1={sa.y} x2={sb.x} y2={sb.y}
              stroke={bothActive ? "rgba(201,169,110,0.45)" : "rgba(160,140,200,0.1)"}
              strokeWidth={bothActive ? 1.5 : 1}
            />
          );
        })}

        {/* Nodes */}
        {SEPHIROTH.map(s=>{
          const isActive = activeSephIds.has(s.id);
          const isSel = selected===s.id;
          return (
            <g key={s.id} style={{cursor:"pointer"}}
              onClick={()=>setSelected(isSel?null:s.id)}
            >
              {isActive && (
                <circle cx={s.x} cy={s.y} r={24} fill="none"
                  stroke={s.color} strokeWidth={1} opacity={0.3}/>
              )}
              <circle cx={s.x} cy={s.y} r={16}
                fill={isSel ? `${s.color}33` : isActive ? `${s.color}18` : "rgba(17,17,24,0.95)"}
                stroke={isSel ? s.color : isActive ? s.color : "rgba(160,140,200,0.18)"}
                strokeWidth={isSel ? 2 : isActive ? 1.5 : 1}
              />
              <text x={s.x} y={s.y+1} textAnchor="middle" dominantBaseline="middle"
                fontSize="10" fontFamily="Cormorant Garamond, serif" fontWeight={isActive?"600":"400"}
                fill={isActive ? s.color : "rgba(136,128,160,0.55)"}
              >{s.num}</text>
              <text x={s.x} y={s.y+28} textAnchor="middle" fontSize="7"
                fontFamily="Inter, sans-serif"
                fill={isActive ? "rgba(232,228,240,0.8)" : "rgba(136,128,160,0.4)"}
              >{s.name}</text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      {sel && (
        <div style={{width:"100%",maxWidth:380,background:"#0e0e15",border:`1px solid ${sel.color}44`,borderRadius:14,padding:"1.25rem",borderLeft:`3px solid ${sel.color}`}}>
          {/* Sephirah info */}
          <div style={{fontSize:"0.6rem",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(136,128,160,0.6)",marginBottom:"0.2rem"}}>Sephirah {sel.num}</div>
          <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.6rem",color:sel.color,lineHeight:1.1}}>{sel.name}</div>
          <div style={{fontSize:"0.72rem",color:"rgba(155,135,200,0.8)",marginBottom:"0.6rem"}}>{sel.title}</div>
          <div style={{fontSize:"0.82rem",color:"#c4bdd8",lineHeight:1.65,fontStyle:"italic",marginBottom:"1rem"}}>{sel.desc}</div>

          {/* Tarot cards */}
          <div style={{fontSize:"0.6rem",letterSpacing:"0.12em",textTransform:"uppercase",color:"rgba(136,128,160,0.6)",marginBottom:"0.6rem"}}>
            ✦ Associated Tarot
          </div>
          <div style={{display:"flex",gap:"0.75rem",flexWrap:"wrap"}}>
            {sel.tarot.map((card,i)=>(
              <TarotCard key={i} card={card} color={sel.color}/>
            ))}
          </div>

          {activeSephIds.has(sel.id) && (
            <div style={{marginTop:"0.85rem",fontSize:"0.7rem",color:sel.color,letterSpacing:"0.06em",borderTop:`1px solid ${sel.color}33`,paddingTop:"0.6rem"}}>
              ✦ This Sephirah is active in your personal chart
            </div>
          )}
        </div>
      )}

      {activeSephIds.size === 0 && !selected && (
        <p style={{fontSize:"0.8rem",color:"rgba(136,128,160,0.5)",textAlign:"center",maxWidth:260,lineHeight:1.6}}>
          Calculate your numbers first, then return here to illuminate your Tree and reveal your Tarot correspondences.
        </p>
      )}

      {activeSephIds.size > 0 && !selected && (
        <p style={{fontSize:"0.75rem",color:"rgba(136,128,160,0.55)",textAlign:"center"}}>
          Tap a glowing node to reveal its Tarot cards
        </p>
      )}
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
  :root{
    --bg:#0a0a0f;--surface:#111118;--surface2:#18181f;
    --border:rgba(160,140,200,0.12);--border-glow:rgba(160,140,200,0.28);
    --gold:#c9a96e;--gold-dim:rgba(201,169,110,0.15);
    --violet:#9b87c8;--text:#e8e4f0;--text-dim:#8880a0;--master:#e8a0b0;
  }
  body{background:var(--bg);color:var(--text);font-family:'Inter',sans-serif;min-height:100vh;}
  .app{max-width:720px;margin:0 auto;padding:2rem 1.25rem 4rem;}
  .header{text-align:center;margin-bottom:3rem;}
  .header-eye{font-size:2.2rem;margin-bottom:.75rem;opacity:.85;}
  .header h1{font-family:'Cormorant Garamond',serif;font-size:clamp(2rem,6vw,3.2rem);font-weight:300;letter-spacing:.08em;color:var(--gold);line-height:1.1;}
  .header p{font-size:.85rem;color:var(--text-dim);letter-spacing:.12em;text-transform:uppercase;margin-top:.5rem;}
  .tabs{display:flex;gap:.2rem;background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:.25rem;margin-bottom:2rem;flex-wrap:wrap;}
  .tab{flex:1;min-width:70px;padding:.55rem .3rem;font-size:.68rem;font-family:'Inter',sans-serif;letter-spacing:.05em;text-transform:uppercase;background:none;border:none;color:var(--text-dim);cursor:pointer;border-radius:7px;transition:all .2s;white-space:nowrap;}
  .tab.active{background:var(--gold-dim);color:var(--gold);border:1px solid rgba(201,169,110,0.3);}
  .tab:hover:not(.active){color:var(--text);}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:14px;padding:1.75rem;margin-bottom:1.25rem;}
  .field{margin-bottom:1.25rem;}
  .field label{display:block;font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-dim);margin-bottom:.45rem;}
  .field input{width:100%;background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:.75rem 1rem;font-size:.95rem;color:var(--text);font-family:'Inter',sans-serif;outline:none;transition:border-color .2s;}
  .field input:focus{border-color:var(--violet);}
  .btn{width:100%;padding:.85rem;background:linear-gradient(135deg,rgba(201,169,110,.18),rgba(155,135,200,.18));border:1px solid var(--gold);border-radius:9px;color:var(--gold);font-family:'Inter',sans-serif;font-size:.82rem;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .2s;}
  .btn:hover{background:linear-gradient(135deg,rgba(201,169,110,.28),rgba(155,135,200,.28));box-shadow:0 0 20px rgba(201,169,110,.15);}
  .results-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.5rem;}
  @media(max-width:480px){.results-grid{grid-template-columns:1fr;}}
  .num-card{background:var(--surface2);border:1px solid var(--border);border-radius:12px;padding:1.25rem;cursor:pointer;transition:all .2s;}
  .num-card:hover,.num-card.open{border-color:var(--border-glow);}
  .num-card.open{background:var(--bg);}
  .num-card .label{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-dim);margin-bottom:.35rem;}
  .num-card .number{font-family:'Cormorant Garamond',serif;font-size:3rem;font-weight:300;line-height:1;color:var(--gold);}
  .num-card .number.master{color:var(--master);}
  .num-card .num-title{font-size:.8rem;color:var(--violet);margin-top:.3rem;}
  .num-card .short{font-size:.72rem;color:var(--text-dim);margin-top:.2rem;}
  .num-card .meaning-body{font-size:.83rem;line-height:1.65;color:#c4bdd8;margin-top:.85rem;padding-top:.85rem;border-top:1px solid var(--border);font-style:italic;}
  .num-card .toggle-hint{font-size:.65rem;color:var(--text-dim);margin-top:.5rem;letter-spacing:.05em;}
  .karmic-card{background:rgba(180,60,80,.08);border:1px solid rgba(220,100,110,.3);border-radius:12px;padding:1.25rem;margin-bottom:.85rem;cursor:pointer;transition:all .2s;}
  .karmic-card:hover,.karmic-card.open{border-color:rgba(220,100,110,.55);}
  .karmic-card .k-eyebrow{font-size:.65rem;letter-spacing:.12em;text-transform:uppercase;color:#e07080;margin-bottom:.35rem;}
  .karmic-card .k-number{font-family:'Cormorant Garamond',serif;font-size:2.8rem;font-weight:300;color:#e07080;line-height:1;}
  .karmic-card .k-title{font-size:.82rem;color:#e8b0b8;margin-top:.3rem;font-weight:500;}
  .karmic-card .k-lesson{font-size:.72rem;color:rgba(232,176,184,.65);margin-top:.15rem;font-style:italic;}
  .karmic-card .k-body{font-size:.83rem;line-height:1.65;color:#d4a8b0;margin-top:.85rem;padding-top:.85rem;border-top:1px solid rgba(220,100,110,.2);font-style:italic;}
  .karmic-card .toggle-hint{font-size:.65rem;color:rgba(220,100,110,.5);margin-top:.5rem;letter-spacing:.05em;}
  .divider{display:flex;align-items:center;gap:.75rem;margin:1.5rem 0;}
  .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border);}
  .divider span{font-size:.65rem;color:var(--text-dim);letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;}
  .py-card{background:var(--surface2);border:1px solid rgba(155,135,200,.25);border-radius:12px;padding:1.25rem;margin-bottom:1rem;}
  .py-number{font-family:'Cormorant Garamond',serif;font-size:3.5rem;font-weight:300;color:var(--violet);line-height:1;}
  .py-label{font-size:.68rem;letter-spacing:.1em;text-transform:uppercase;color:var(--text-dim);margin-bottom:.35rem;}
  .py-theme{font-size:.85rem;color:#c4bdd8;margin-top:.5rem;line-height:1.6;font-style:italic;}
  .missing-grid{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.75rem;}
  .missing-chip{background:rgba(180,60,80,.08);border:1px solid rgba(220,100,110,.25);border-radius:8px;padding:.5rem .75rem;cursor:pointer;transition:all .2s;min-width:44px;text-align:center;}
  .missing-chip:hover,.missing-chip.open{border-color:rgba(220,100,110,.5);}
  .missing-chip .mn{font-family:'Cormorant Garamond',serif;font-size:1.6rem;font-weight:300;color:#e07080;line-height:1;}
  .missing-detail{background:rgba(180,60,80,.06);border:1px solid rgba(220,100,110,.2);border-radius:10px;padding:1rem 1.25rem;margin-top:.75rem;}
  .missing-detail .md-shadow{font-size:.78rem;color:#e07080;margin-bottom:.4rem;}
  .missing-detail .md-lesson{font-size:.82rem;color:#d4a8b0;line-height:1.65;font-style:italic;}
  .compat-score-wrap{text-align:center;padding:1.5rem 0 1rem;}
  .compat-score{font-family:'Cormorant Garamond',serif;font-size:5rem;font-weight:300;line-height:1;color:var(--gold);}
  .compat-score-label{font-size:.72rem;color:var(--text-dim);letter-spacing:.1em;text-transform:uppercase;margin-top:.25rem;}
  .compat-bar-wrap{height:4px;background:var(--surface2);border-radius:2px;margin:1rem 0;overflow:hidden;}
  .compat-bar{height:100%;background:linear-gradient(90deg,var(--violet),var(--gold));border-radius:2px;}
  .compat-text{font-size:1.05rem;line-height:1.7;color:#c4bdd8;text-align:center;font-style:italic;font-family:'Cormorant Garamond',serif;}
  .compat-numbers{display:flex;align-items:center;justify-content:center;gap:1.5rem;margin-bottom:1.5rem;}
  .compat-num{font-family:'Cormorant Garamond',serif;font-size:2.5rem;font-weight:300;color:var(--gold);text-align:center;}
  .compat-num small{display:block;font-family:'Inter',sans-serif;font-size:.65rem;color:var(--text-dim);text-transform:uppercase;letter-spacing:.08em;}
  .compat-x{font-size:1.2rem;color:var(--text-dim);}
  .empty{text-align:center;padding:2rem;color:var(--text-dim);font-size:.85rem;}
  .person-block{margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--border);}
  .person-block:last-of-type{border-bottom:none;margin-bottom:0;padding-bottom:0;}
  .person-label{font-size:.72rem;color:var(--violet);letter-spacing:.1em;text-transform:uppercase;margin-bottom:.75rem;}
`;

// ── Main component ─────────────────────────────────────────────────────────────

export default function NumerologyCalculator() {
  const [tab, setTab] = useState("calculator");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [results, setResults] = useState(null);
  const [openCards, setOpenCards] = useState({});
  const [openMissing, setOpenMissing] = useState(null);
  const [p1name, setP1name] = useState("");
  const [p1dob, setP1dob] = useState("");
  const [p2name, setP2name] = useState("");
  const [p2dob, setP2dob] = useState("");
  const [compat, setCompat] = useState(null);

  function calculate() {
    const lpK = lifePathWithKarma(dob);
    const exK = expressionWithKarma(name);
    const su = soulUrgeNumber(name);
    const pe = personalityNumber(name);
    const bd = birthdayNumber(dob);
    const py = personalYearNumber(dob);
    const missing = missingNumbers(name);
    const karmicDebts = [];
    if (lpK.karmic) karmicDebts.push({debt:lpK.karmic,source:"Life Path"});
    if (exK.karmic) karmicDebts.push({debt:exK.karmic,source:"Expression"});
    setResults({lp:lpK.value,ex:exK.value,su,pe,bd,py,karmicDebts,missing});
    setOpenCards({});
    setOpenMissing(null);
  }

  function calculateCompat() {
    const lp1 = lifePathWithKarma(p1dob).value;
    const lp2 = lifePathWithKarma(p2dob).value;
    const ex1 = expressionWithKarma(p1name).value;
    const ex2 = expressionWithKarma(p2name).value;
    if (!lp1||!lp2) return;
    const lpData = getCompat(lp1,lp2);
    const exData = (ex1&&ex2) ? getCompat(ex1,ex2) : null;
    const avg = exData ? Math.round((lpData.score+exData.score)/2) : lpData.score;
    setCompat({lp1,lp2,ex1,ex2,lpData,exData,avg,name1:p1name||"Person 1",name2:p2name||"Person 2"});
  }

  function toggleCard(key) {
    setOpenCards(prev=>({...prev,[key]:!prev[key]}));
  }

  const numCards = results ? [
    {key:"lp",label:"Life Path",value:results.lp},
    {key:"ex",label:"Expression",value:results.ex},
    {key:"su",label:"Soul Urge",value:results.su},
    {key:"pe",label:"Personality",value:results.pe},
    {key:"bd",label:"Birthday",value:results.bd},
  ] : [];

  const activeNums = results
    ? [results.lp,results.ex,results.su,results.pe,results.bd].filter(Boolean)
    : [];

  const pyM = results?.py ? getMeaning(results.py) : null;

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
          <button className={`tab ${tab==="calculator"?"active":""}`} onClick={()=>setTab("calculator")}>Calculator</button>
          <button className={`tab ${tab==="tree"?"active":""}`} onClick={()=>setTab("tree")}>Tree of Life</button>
          <button className={`tab ${tab==="compatibility"?"active":""}`} onClick={()=>setTab("compatibility")}>Compatibility</button>
        </div>

        {/* ── CALCULATOR ── */}
        {tab==="calculator" && (
          <>
            <div className="card">
              <div className="field">
                <label>Full Birth Name</label>
                <input value={name} onChange={e=>setName(e.target.value)} placeholder="As it appears on your birth certificate"/>
              </div>
              <div className="field">
                <label>Date of Birth</label>
                <input type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
              </div>
              <button className="btn" onClick={calculate}>Reveal My Numbers</button>
            </div>

            {results && (
              <>
                <div className="divider"><span>Your Numerology Profile</span></div>
                <div className="results-grid">
                  {numCards.map(({key,label,value})=>{
                    if (!value) return null;
                    const m = getMeaning(value);
                    const isMaster = [11,22,33].includes(value);
                    const isOpen = openCards[key];
                    return (
                      <div key={key} className={`num-card ${isOpen?"open":""}`} onClick={()=>toggleCard(key)}>
                        <div className="label">{label}</div>
                        <div className={`number ${isMaster?"master":""}`}>{value}</div>
                        <div className="num-title">{m.title}</div>
                        <div className="short">{m.short}</div>
                        {isOpen && <div className="meaning-body">{m.body}</div>}
                        <div className="toggle-hint">{isOpen?"Tap to collapse":"Tap to read meaning"}</div>
                      </div>
                    );
                  })}
                </div>

                {results.py && (
                  <>
                    <div className="divider"><span>Personal Year {new Date().getFullYear()}</span></div>
                    <div className="py-card">
                      <div className="py-label">Your {new Date().getFullYear()} Vibration</div>
                      <div className="py-number">{results.py}</div>
                      <div className="num-title">{pyM?.title}</div>
                      <div className="py-theme">This year calls you to {PY_THEMES[results.py]||"integrate all you've gathered"}.</div>
                    </div>
                  </>
                )}

                {results.karmicDebts?.length > 0 && (
                  <>
                    <div className="divider"><span>⚠ Karmic Debt Detected</span></div>
                    {results.karmicDebts.map(({debt,source})=>{
                      const km = KARMIC_MEANINGS[debt];
                      const isOpen = openCards[`k-${debt}`];
                      return (
                        <div key={debt} className={`karmic-card ${isOpen?"open":""}`} onClick={()=>toggleCard(`k-${debt}`)}>
                          <div className="k-eyebrow">Karmic Debt · Found in {source}</div>
                          <div className="k-number">{debt}</div>
                          <div className="k-title">{km.title}</div>
                          <div className="k-lesson">{km.lesson}</div>
                          {isOpen && <div className="k-body">{km.body}</div>}
                          <div className="toggle-hint">{isOpen?"Tap to collapse":"Tap to read your karmic lesson"}</div>
                        </div>
                      );
                    })}
                  </>
                )}

                {results.missing?.length > 0 && (
                  <>
                    <div className="divider"><span>Missing Numbers in Your Name</span></div>
                    <div className="card">
                      <p style={{fontSize:".8rem",color:"var(--text-dim)",marginBottom:".75rem",lineHeight:1.6}}>
                        Absent from your birth name — areas where your soul came to develop mastery.
                      </p>
                      <div className="missing-grid">
                        {results.missing.map(n=>(
                          <div key={n} className={`missing-chip ${openMissing===n?"open":""}`} onClick={()=>setOpenMissing(openMissing===n?null:n)}>
                            <div className="mn">{n}</div>
                          </div>
                        ))}
                      </div>
                      {openMissing && MISSING_MEANINGS[openMissing] && (
                        <div className="missing-detail">
                          <div className="md-shadow">Shadow: {MISSING_MEANINGS[openMissing].shadow}</div>
                          <div className="md-lesson">{MISSING_MEANINGS[openMissing].lesson}</div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <div className="divider"><span>✦</span></div>
                <p style={{textAlign:"center",fontSize:".78rem",color:"var(--text-dim)",lineHeight:1.7}}>
                  Visit the <strong style={{color:"var(--gold)"}}>Tree of Life</strong> tab to see your Kabbalistic placements and Tarot correspondences.
                </p>
              </>
            )}
          </>
        )}

        {/* ── TREE OF LIFE ── */}
        {tab==="tree" && (
          <>
            {!results && (
              <div className="card">
                <div className="field">
                  <label>Full Birth Name</label>
                  <input value={name} onChange={e=>setName(e.target.value)} placeholder="As it appears on your birth certificate"/>
                </div>
                <div className="field">
                  <label>Date of Birth</label>
                  <input type="date" value={dob} onChange={e=>setDob(e.target.value)}/>
                </div>
                <button className="btn" onClick={calculate}>Illuminate My Tree</button>
              </div>
            )}
            {results && (
              <p style={{textAlign:"center",fontSize:".78rem",color:"var(--text-dim)",marginBottom:"1rem",lineHeight:1.6}}>
                Glowing nodes are active in your chart. Tap any node to reveal its meaning and Tarot cards.
              </p>
            )}
            <div className="card">
              <TreeOfLife activeNums={activeNums}/>
            </div>
          </>
        )}

        {/* ── COMPATIBILITY ── */}
        {tab==="compatibility" && (
          <>
            <div className="card">
              <div className="person-block">
                <div className="person-label">Person 1</div>
                <div className="field">
                  <label>Full Birth Name</label>
                  <input value={p1name} onChange={e=>setP1name(e.target.value)} placeholder="Name"/>
                </div>
                <div className="field">
                  <label>Date of Birth</label>
                  <input type="date" value={p1dob} onChange={e=>setP1dob(e.target.value)}/>
                </div>
              </div>
              <div className="person-block">
                <div className="person-label">Person 2</div>
                <div className="field">
                  <label>Full Birth Name</label>
                  <input value={p2name} onChange={e=>setP2name(e.target.value)} placeholder="Name"/>
                </div>
                <div className="field">
                  <label>Date of Birth</label>
                  <input type="date" value={p2dob} onChange={e=>setP2dob(e.target.value)}/>
                </div>
              </div>
              <button className="btn" onClick={calculateCompat}>Read Our Compatibility</button>
            </div>

            {compat && (
              <div className="card">
                <div className="compat-numbers">
                  <div className="compat-num">{compat.lp1}<small>{compat.name1}</small></div>
                  <div className="compat-x">✦</div>
                  <div className="compat-num">{compat.lp2}<small>{compat.name2}</small></div>
                </div>
                <div className="compat-score-wrap">
                  <div className="compat-score">{compat.avg}</div>
                  <div className="compat-score-label">Resonance Score</div>
                </div>
                <div className="compat-bar-wrap">
                  <div className="compat-bar" style={{width:`${compat.avg}%`}}/>
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
            {!compat && <div className="empty">Enter both birth dates to reveal your resonance</div>}
          </>
        )}

      </div>
    </>
  );
}
