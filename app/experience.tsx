"use client";

import { useMemo, useState } from "react";

const stages = [
  { id: "connect", no: "01", verb: "CONNECT", title: "Earn attention and trust", note: "Open with relevance, not a rehearsed pitch.", icon: "↗" },
  { id: "discover", no: "02", verb: "DISCOVER", title: "Reveal what matters", note: "Move from stated need to business consequence.", icon: "⌁" },
  { id: "create", no: "03", verb: "CREATE", title: "Make value visible", note: "Translate capability into business relevance.", icon: "✦" },
  { id: "advance", no: "04", verb: "ADVANCE", title: "Secure the next step", note: "Turn momentum into mutual commitment.", icon: "→" },
];

const discoveryOptions = [
  { text: "Which solution are you currently evaluating?", score: 1, response: "Useful, but it moves to solution before the business context is clear." },
  { text: "What has changed in the business that makes this conversation important now?", score: 3, response: "Strong. It reveals context, urgency and the reason for action." },
  { text: "What is your budget and when do you want to buy?", score: 0, response: "Too soon. Commercial qualification matters, but trust and context come first." },
];

const valueOptions = [
  { text: "We offer a highly scalable cloud platform with advanced automation.", score: 1, response: "Capability-led. The buyer must still translate it into their world." },
  { text: "Our platform has been implemented successfully for many enterprises.", score: 1, response: "Evidence helps, but the relevance to this customer remains implicit." },
  { text: "You can reduce release friction and give teams faster, more reliable deployment cycles—without adding governance overhead.", score: 3, response: "Customer-centred: operating tension, desired outcome and risk are connected." },
];

export default function Home({ showRoleAccess = false }: { showRoleAccess?: boolean }) {
  const [activeStage, setActiveStage] = useState("connect");
  const [discovery, setDiscovery] = useState<number | null>(null);
  const [value, setValue] = useState<number | null>(null);
  const [commitment, setCommitment] = useState(2);
  const [notes, setNotes] = useState("");
  const [focus, setFocus] = useState(false);
  const [done, setDone] = useState(false);
  const score = useMemo(() => Math.round((((discovery === null ? 0 : discoveryOptions[discovery].score) + (value === null ? 0 : valueOptions[value].score)) / 6) * 100), [discovery, value]);
  const go = (id: string) => { setActiveStage(id); document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }); };

  return <main className={focus ? "site-shell focus-mode" : "site-shell"}>
    <header className="topbar">
      <a className="brand" href="#home"><img className="brand-logo" src="/s4s-logo.png" alt="Skills4Sales"/></a>
      <nav><a href="#journey">Journey</a><a href="#lab">Practice lab</a><a href="#plan">My action</a></nav>
      <button className="focus-button" onClick={() => setFocus(!focus)}>{focus ? "Exit focus" : "Focus mode"}</button>
    </header>

    <section id="home" className="hero">
      <div className="hero-copy">
        <p className="eyebrow"><span>LIVE DEMO</span> CORE SALES PERFORMANCE LAB</p>
        <h1>Enter the customer&apos;s world.<br/><em>Earn the next commitment.</em></h1>
        <p className="lead">Asteron Mobility is growing across 11 plants while onboarding two new EV customers. This learning journey helps sales professionals turn that operating context into confident, consultative customer conversations.</p>
        <div className="hero-actions"><button className="primary" onClick={() => go("journey")}>Begin the 60-minute mission <span>→</span></button><span className="duration">◷ &nbsp; 60 minutes &nbsp;·&nbsp; 70% practice</span></div>
      </div>
      <div className="conversation-map" aria-label="Customer conversation pathway">
        <div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="map-centre"><span>YOUR<br/>CUSTOMER</span><i/></div>
        {stages.map((stage, i) => <div key={stage.id} className={`map-node n${i + 1}`}><small>{stage.no}</small><b>{stage.verb}</b></div>)}
        <p>One conversation.<br/><strong>Four disciplined moves.</strong></p>
      </div>
    </section>

    <section className="proof-strip"><div><strong>4</strong><span>conversation moves</span></div><div><strong>2</strong><span>decision challenges</span></div><div><strong>1</strong><span>live opportunity plan</span></div><blockquote>“Don&apos;t pitch harder. <b>Understand better.</b>”</blockquote></section>

    <section id="journey" className="journey section-pad">
      <div className="section-heading"><p className="eyebrow">THE PERFORMANCE PATH</p><h2>Four moves. One connected conversation.</h2><p>Explore the moves, then apply them in a customer situation.</p></div>
      <div className="stage-grid">{stages.map(stage => <button key={stage.id} className={activeStage === stage.id ? "stage-card active" : "stage-card"} onClick={() => setActiveStage(stage.id)}><span className="stage-top"><small>{stage.no}</small><i>{stage.icon}</i></span><b>{stage.verb}</b><h3>{stage.title}</h3><p>{stage.note}</p><span className="explore">Explore move →</span></button>)}</div>
      <div className="stage-insight"><span className="insight-label">COACH&apos;S LENS</span><div><strong>{stages.find(s => s.id === activeStage)?.verb}</strong><p>{activeStage === "connect" ? "Relevance earns attention. Name a business tension the customer recognises before introducing what you sell." : activeStage === "discover" ? "Listen for the gap between what the customer says and what the situation costs, delays or prevents." : activeStage === "create" ? "Value is not a list of features. It is the credible difference your capability makes to an outcome that matters." : "A good close is a mutually understood decision: who will do what, by when, and why it matters."}</p></div></div>
    </section>

    <section id="lab" className="lab section-pad">
      <div className="lab-head"><div><p className="eyebrow">PRACTICE LAB</p><h2>The meeting has begun.</h2></div><div className="progress-pill"><span style={{width: `${discovery !== null && value !== null ? 100 : discovery !== null ? 50 : 12}%`}}/><small>{discovery !== null && value !== null ? "2 of 2 complete" : discovery !== null ? "1 of 2 complete" : "Ready"}</small></div></div>
      <article className="scenario"><div className="scenario-badge">CUSTOMER MOMENT</div><div className="buyer-avatar">AK</div><div><h3>Ananya Krishnan <span>VP, Enterprise Platforms</span></h3><p>“We have too many hand-offs between development and operations. Releases are slowing, but I&apos;m not convinced another transformation programme is the answer.”</p></div><aside><small>LISTEN FOR</small><b>Friction</b><b>Risk</b><b>Hesitation</b></aside></article>
      <div className="challenge-grid">
        <article className="challenge"><div className="challenge-no">01 <span>DISCOVER</span></div><h3>Which question would open the customer&apos;s world?</h3><div className="option-list">{discoveryOptions.map((opt, i) => <button key={opt.text} className={discovery === i ? "selected" : ""} onClick={() => setDiscovery(i)}><span>{String.fromCharCode(65+i)}</span>{opt.text}</button>)}</div>{discovery !== null && <div className={`feedback s${discoveryOptions[discovery].score}`}><b>{discoveryOptions[discovery].score === 3 ? "High-value move" : "Coach’s nudge"}</b>{discoveryOptions[discovery].response}</div>}</article>
        <article className="challenge"><div className="challenge-no">02 <span>CREATE</span></div><h3>Which response makes the value most relevant?</h3><div className="option-list">{valueOptions.map((opt, i) => <button key={opt.text} className={value === i ? "selected" : ""} onClick={() => setValue(i)}><span>{String.fromCharCode(65+i)}</span>{opt.text}</button>)}</div>{value !== null && <div className={`feedback s${valueOptions[value].score}`}><b>{valueOptions[value].score === 3 ? "High-value move" : "Coach’s nudge"}</b>{valueOptions[value].response}</div>}</article>
      </div>
      {discovery !== null && value !== null && <div className="score-card"><div className="score-ring" style={{"--score": `${score * 3.6}deg`} as React.CSSProperties}><span>{score}<small>/100</small></span></div><div><p className="eyebrow">CONVERSATION PULSE</p><h3>{score >= 80 ? "You made the conversation customer-centred." : "You found the moment. Now sharpen the relevance."}</h3><p>Your strongest route combines a context-first question with an outcome-led value statement.</p></div><button onClick={() => {setDiscovery(null);setValue(null)}}>Try another route ↻</button></div>}
    </section>

    <section id="plan" className="action section-pad">
      <div className="action-intro"><p className="eyebrow">WORKPLACE TRANSFER</p><h2>Make the next conversation count.</h2><p>Choose one behaviour to apply to a live opportunity. Small, observable shifts turn workshop insight into sales performance.</p></div>
      <div className="action-card"><label>MY NEXT CUSTOMER CONVERSATION</label><textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Name the opportunity and the shift you will make…"/><label>MY FOCUS MOVE</label><div className="commitment-options">{["Connect with relevance", "Discover consequence", "Create customer value", "Advance with clarity"].map((x,i)=><button key={x} className={commitment === i ? "active" : ""} onClick={()=>setCommitment(i)}>{x}</button>)}</div><button className="primary full" disabled={!notes.trim()} onClick={()=>setDone(true)}>{done ? "Commitment captured ✓" : "Capture my commitment"}</button>{done && <p className="saved">Carry this into your next customer meeting: <strong>{notes}</strong></p>}</div>
    </section>

    <section className="programme section-pad"><div><p className="eyebrow">THE COMPLETE JOURNEY</p><h2>From demo moment to<br/>sales performance.</h2></div><div className="programme-flow"><span><small>BEFORE</small><b>Readiness snapshot</b></span><i>→</i><span><small>DURING</small><b>Observed practice</b></span><i>→</i><span><small>CAPSTONE</small><b>Integrated demonstration</b></span><i>→</i><span><small>AFTER</small><b>Workplace application</b></span></div><p className="programme-note">Two days · 12 learning hours · 70% hands-on · Built around YASH customer situations</p></section>
    {showRoleAccess && <section className="portal-access section-pad">
      <div className="portal-access-head"><p className="eyebrow">CONTINUE TO THE NEXT LEVEL</p><h2>Choose your role.</h2><p>The programme overview is open to everyone. Role-based access unlocks the relevant learning, facilitation or administration space.</p></div>
      <div className="portal-role-grid">
        <article><span>01</span><h3>Learner</h3><p>Enter the guided learning journey and save your participation under the code shared for your cohort.</p><a href="/login/learner">Enter with access code →</a></article>
        <article><span>02</span><h3>Facilitator</h3><p>Run the session, guide practice, manage the learning flow and support participant application.</p><a href="/login/facilitator">Open facilitator login →</a></article>
        <article className="admin-role"><span>03</span><h3>Admin</h3><p>Manage programme access, role controls and the overall Skills4Sales learning environment.</p><a href="/login/admin">Open admin login →</a></article>
      </div>
    </section>}
    <footer><div className="brand"><img className="brand-logo" src="/s4s-login-logo.png" alt="Skills4Sales"/></div><p>Practice. Reflect. Perform.</p><span>Core Sales Performance Lab</span></footer>
  </main>;
}
