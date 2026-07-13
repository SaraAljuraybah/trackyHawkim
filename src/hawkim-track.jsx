import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  CheckCircle2, Circle, Clock, Ban, ChevronDown, ChevronRight, ChevronLeft, Star, Trophy,
  Video, Calendar, Users, TrendingUp, MessageCircle, Send, Pin, Heart, PartyPopper,
  Lightbulb, Link as LinkIcon, X, Settings2, Target, ListChecks, Layers, PackageCheck,
  Sparkles, Award, Rocket, ClipboardList, ArrowRight, Pencil, Trash2, Reply as ReplyIcon,
  CalendarClock, Flag, AlertTriangle,
} from "lucide-react";

/* ============================== RAW SEED DATA ============================== */

const RAW_WEEKS = [
  {
    weekNumber: 1, start: "2026-07-14", end: "2026-07-20",
    objective: "Build the foundation of the domain knowledge and organize the research environment.",
    tasks: [
      "Finalize the Background chapter structure.",
      "Organize all SFDA references and official documents.",
      "Create the project knowledge base.",
      "Study Regulatory Compliance.",
      "Begin studying the SFDA.",
    ],
    parallelTasks: [
      "Build the initial company contact database.",
      "Start collecting pharmaceutical company emails.",
      "Design the company outreach automation.",
    ],
    deliverables: [
      "Approved Background outline.",
      "Organized research repository.",
      "First draft of Section 2.1 Regulatory Compliance.",
      "Notes for Section 2.2 SFDA.",
      "Initial company contact list.",
    ],
    successCriteria: [
      "Every member understands the research direction.",
      "The writing structure is finalized.",
      "Research materials are organized.",
    ],
  },
  {
    weekNumber: 2, start: "2026-07-21", end: "2026-07-27",
    objective: "Understand how pharmaceutical organizations operate under SFDA regulations.",
    tasks: [
      "Complete SFDA research.",
      "Study Standard Operating Procedures.",
      "Study regulatory guidelines.",
      "Understand the relationship between regulations and SOPs.",
    ],
    parallelTasks: [
      "Continue contacting companies.",
      "Collect public SOP examples.",
      "Continue organizing references.",
    ],
    deliverables: [
      "Draft of Section 2.2 The Saudi Food and Drug Authority.",
      "Draft of Section 2.3 Regulatory Guidelines and SOPs.",
      "SOP examples repository.",
    ],
    successCriteria: [
      "The team can clearly explain how SOPs are created, managed, and governed.",
    ],
  },
  {
    weekNumber: 3, start: "2026-07-28", end: "2026-08-03",
    objective: "Understand Pharmacovigilance and pharmaceutical compliance verification.",
    tasks: [
      "Study Pharmacovigilance.",
      "Study Good Pharmacovigilance Practice.",
      "Understand pharmaceutical compliance verification.",
      "Study inspection and audit processes.",
    ],
    parallelTasks: [
      "Continue company outreach.",
      "Collect GVP-related SOPs.",
      "Update research notes.",
    ],
    deliverables: [
      "Draft of Section 2.4 Pharmacovigilance and GVP.",
      "Draft of Section 2.5 Compliance Verification in the Pharmaceutical Industry.",
    ],
    successCriteria: [
      "The team understands the pharmaceutical compliance workflow.",
    ],
  },
  {
    weekNumber: 4, start: "2026-08-04", end: "2026-08-10",
    objective: "Complete the Domain section.",
    tasks: [
      "Study the challenges of manual regulatory compliance.",
      "Research AI applications in regulatory compliance.",
      "Review all Domain subsections.",
      "Improve transitions and logical flow.",
    ],
    parallelTasks: [
      "Follow up with contacted companies.",
      "Continue collecting SOPs.",
      "Organize all Domain references.",
    ],
    deliverables: [
      "Draft of Section 2.6 Challenges of Manual Regulatory Compliance.",
      "Draft of Section 2.7 Artificial Intelligence for Regulatory Compliance.",
      "Complete first draft of the Domain chapter.",
    ],
    successCriteria: [
      "The Domain chapter is complete and ready for review.",
    ],
  },
  {
    weekNumber: 5, start: "2026-08-11", end: "2026-08-17",
    objective: "Investigate possible technologies for Hawkim.",
    tasks: [
      "Study Large Language Models.",
      "Compare embedding models.",
      "Study vector databases.",
      "Study Retrieval-Augmented Generation architectures.",
    ],
    parallelTasks: [
      "Continue dataset collection.",
      "Continue company follow-ups.",
      "Organize technology references.",
    ],
    deliverables: [
      "Initial technology evaluation document.",
      "Model comparison tables.",
      "Pros and cons for each technology option.",
    ],
    successCriteria: [
      "The team understands the main available technical approaches.",
    ],
  },
  {
    weekNumber: 6, start: "2026-08-18", end: "2026-08-24",
    objective: "Select and justify the technologies that will be used in Hawkim.",
    tasks: [
      "Study Explainable AI.",
      "Study Trustworthy AI.",
      "Compare rule-based, AI-based, and hybrid approaches.",
      "Select the most suitable models and architecture.",
      "Write the technical justification.",
    ],
    parallelTasks: [
      "Continue SOP and regulation collection.",
      "Review technical decisions as a team.",
      "Update the decision log.",
    ],
    deliverables: [
      "Complete Technologies chapter draft.",
      "Final model-selection document.",
      "Architecture justification.",
      "Technology decision log.",
    ],
    successCriteria: [
      "Every technology decision is supported by evidence.",
    ],
  },
  {
    weekNumber: 7, start: "2026-08-25", end: "2026-08-31",
    objective: "Study and synthesize related research papers.",
    tasks: [
      "Search for high-quality related research.",
      "Read and analyze selected papers.",
      "Extract methods, results, limitations, and research gaps.",
      "Create a research paper comparison matrix.",
      "Begin the Literature Review draft.",
    ],
    parallelTasks: [
      "Continue company outreach where needed.",
      "Organize paper references.",
      "Upload team paper summaries.",
    ],
    deliverables: [
      "Research paper summaries.",
      "Research paper comparison table.",
      "Initial Literature Review draft.",
    ],
    successCriteria: [
      "The team understands the current research landscape for AI-based compliance checking.",
    ],
  },
  {
    weekNumber: 8, start: "2026-09-01", end: "2026-09-07",
    objective: "Analyze competitors and position Hawkim.",
    tasks: [
      "Identify competitive products.",
      "Analyze each product's features.",
      "Document strengths and weaknesses.",
      "Collect product screenshots and logos.",
      "Compare the products with Hawkim.",
      "Write the Competitive Product Analysis.",
    ],
    parallelTasks: [
      "Complete remaining literature review gaps.",
      "Verify all competitor information.",
      "Organize comparison evidence.",
    ],
    deliverables: [
      "Competitive Products section.",
      "Competitive Product Analysis.",
      "Feature comparison table.",
      "Complete Literature Review draft.",
    ],
    successCriteria: [
      "Hawkim's value proposition and differentiation are clearly explained.",
    ],
  },
  {
    weekNumber: 9, start: "2026-09-08", end: "2026-09-10",
    objective: "Review all work and prepare the final summer deliverables.",
    tasks: [
      "Review all chapters.",
      "Fix gaps and inconsistencies.",
      "Verify citations and references.",
      "Organize datasets.",
      "Review company outreach results.",
      "Prepare all documents for supervisor review.",
    ],
    parallelTasks: [
      "Conduct final team quality review.",
      "Organize shared folders.",
      "Prepare a final summary of summer progress.",
    ],
    deliverables: [
      "Completed Domain chapter.",
      "Completed Technologies chapter.",
      "Completed Literature Review.",
      "Organized dataset repository.",
      "Company contact database.",
      "Research knowledge base.",
      "Final reference library.",
    ],
    successCriteria: [
      "All deliverables are complete and ready for supervisor review.",
    ],
  },
];

const MEMBERS = [
  { id: "m1", name: "Sara", initials: "S", color: "#8B5CF6" },
  { id: "m2", name: "Haya", initials: "H", color: "#0EA5E9" },
  { id: "m3", name: "Dalal", initials: "DL", color: "#F97316" },
  { id: "m4", name: "Dana", initials: "DA", color: "#EC4899" },
];

const BADGES = [
  { id: "hero", label: "Research Hero", emoji: "🏆" },
  { id: "progress", label: "Great Progress", emoji: "🚀" },
  { id: "support", label: "Team Support", emoji: "💡" },
  { id: "goal", label: "Goal Achiever", emoji: "🎯" },
];

const SECTION_STYLES = {
  tasks: { name: "Tasks", icon: ListChecks, ring: "#3B82F6", bg: "#EFF6FF", chip: "#DBEAFE", text: "#1D4ED8" },
  parallel: { name: "Parallel Tasks", icon: Layers, ring: "#0D9488", bg: "#F0FDFA", chip: "#CCFBF1", text: "#0F766E" },
  deliverables: { name: "Deliverables", icon: PackageCheck, ring: "#F97316", bg: "#FFF7ED", chip: "#FFEDD5", text: "#C2410C" },
  criteria: { name: "Success Criteria", icon: Target, ring: "#8B5CF6", bg: "#FAF5FF", chip: "#F3E8FF", text: "#7C3AED" },
};

const WEEK_ACCENTS = ["#3B82F6", "#0D9488", "#8B5CF6", "#F97316", "#0EA5E9", "#EAB308", "#EC4899", "#F43F5E", "#22C55E"];

const PLAN_START = new Date("2026-07-14T00:00:00");
const PLAN_END = new Date("2026-09-10T23:59:59");

const WEIGHTS = { task: 2, parallel: 1, deliverable: 4 };

/* ============================== HELPERS ============================== */

function buildItems(weekNumber, kind, arr, weight) {
  return arr.map((text, i) => ({
    id: `w${weekNumber}-${kind}-${i}`,
    text,
    weight,
    status: "Not Started", // Not Started | In Progress | Completed | Blocked
    assignee: null,
  }));
}

function buildWeeks() {
  return RAW_WEEKS.map((w, idx) => ({
    id: `week-${w.weekNumber}`,
    weekNumber: w.weekNumber,
    start: new Date(w.start + "T00:00:00"),
    end: new Date(w.end + "T23:59:59"),
    objective: w.objective,
    successCriteria: w.successCriteria,
    tasks: buildItems(w.weekNumber, "t", w.tasks, WEIGHTS.task),
    parallelTasks: buildItems(w.weekNumber, "p", w.parallelTasks, WEIGHTS.parallel),
    deliverables: buildItems(w.weekNumber, "d", w.deliverables, WEIGHTS.deliverable),
    accent: WEEK_ACCENTS[idx % WEEK_ACCENTS.length],
  }));
}

function fmtDate(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtShort(d) {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
function daysBetween(a, b) {
  return Math.round((b.setHours(0,0,0,0) - a.setHours(0,0,0,0)) / 86400000);
}

function findActiveWeekIndex(weeks, today) {
  for (let i = 0; i < weeks.length; i++) {
    if (today >= weeks[i].start && today <= weeks[i].end) return i;
  }
  if (today < weeks[0].start) return -1; // before plan
  if (today > weeks[weeks.length - 1].end) return -2; // after plan
  // gap between weeks (shouldn't happen, but fall back to nearest upcoming)
  for (let i = 0; i < weeks.length; i++) if (today < weeks[i].start) return i;
  return -2;
}

function weekStatus(week, today) {
  if (today < week.start) return "Upcoming";
  if (today >= week.start && today <= week.end) return "Active";
  // week is over
  const p = week._progress ?? 0;
  return p >= 100 ? "Completed" : "Delayed";
}

const STATUS_STYLES = {
  Upcoming: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
  Active: { bg: "#DCFCE7", text: "#15803D", dot: "#22C55E" },
  Completed: { bg: "#DBEAFE", text: "#1D4ED8", dot: "#3B82F6" },
  Delayed: { bg: "#FFE4E6", text: "#BE123C", dot: "#F43F5E" },
  "At Risk": { bg: "#FEF3C7", text: "#B45309", dot: "#F59E0B" },
};

function computeProgress(week, taskOverrides) {
  const all = [...week.tasks, ...week.parallelTasks, ...week.deliverables];
  let total = 0, done = 0, completedCount = 0, blockedCount = 0;
  all.forEach((item) => {
    const status = taskOverrides[item.id]?.status ?? item.status;
    total += item.weight;
    if (status === "Completed") { done += item.weight; completedCount++; }
    if (status === "Blocked") blockedCount++;
  });
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { pct, totalItems: all.length, completedCount, blockedCount, remaining: all.length - completedCount };
}

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const LS_KEYS = {
  tasks: "hawkim_task_overrides_v1",
  pulse: "hawkim_pulse_v1",
  stars: "hawkim_weekly_stars_v1",
  reviews: "hawkim_weekly_reviews_v1",
  simDate: "hawkim_sim_date_v1",
  meeting: "hawkim_meeting_v1",
};

const SEED_PULSE = [
  { id: "p1", memberId: "m1", text: "ترا خلصت بيبر ولخصتها لكم بملف الوورد 📄", ts: Date.now() - 1000 * 60 * 60 * 5, reactions: { "👍": ["m2"], "🎉": [] }, replies: [], pinned: false },
  { id: "p2", memberId: "m3", text: "I just added a paper to the document folder. Check it out!", ts: Date.now() - 1000 * 60 * 60 * 3, reactions: { "👍": ["m1", "m4"], "🎉": [] }, replies: [
    { id: "r1", memberId: "m1", text: "أشوفه الحين، شكراً!", ts: Date.now() - 1000 * 60 * 60 * 2 },
  ], pinned: false },
  { id: "p3", memberId: "m4", text: "أرسلت إيميلات للشركات اليوم 📬", ts: Date.now() - 1000 * 60 * 30, reactions: { "👍": [], "🎉": [] }, replies: [], pinned: false },
];

/* ============================== SMALL UI ATOMS ============================== */

function Avatar({ member, size = 32 }) {
  return (
    <div
      title={member.name}
      style={{
        width: size, height: size, borderRadius: "50%", background: member.color,
        color: "white", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.4, fontWeight: 700, flexShrink: 0, border: "2px solid white",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
      }}
    >
      {member.initials}
    </div>
  );
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.Upcoming;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{ background: s.bg, color: s.text }}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {status}
    </span>
  );
}

const ITEM_STATUS_CYCLE = ["Not Started", "In Progress", "Completed", "Blocked"];
function ItemStatusIcon({ status }) {
  if (status === "Completed") return <CheckCircle2 size={20} strokeWidth={2.4} style={{ color: "#22C55E" }} />;
  if (status === "In Progress") return <Clock size={20} style={{ color: "#F59E0B" }} />;
  if (status === "Blocked") return <Ban size={20} style={{ color: "#F43F5E" }} />;
  return <Circle size={20} style={{ color: "#CBD5E1" }} />;
}

/* Confetti burst */
function Confetti({ trigger }) {
  const [pieces, setPieces] = useState([]);
  useEffect(() => {
    if (!trigger) return;
    const emojis = ["🎉", "✨", "🎊", "⭐", "💫"];
    const arr = Array.from({ length: 24 }).map((_, i) => ({
      id: i, left: Math.random() * 100, delay: Math.random() * 0.3,
      emoji: emojis[i % emojis.length], dur: 1.2 + Math.random() * 0.8,
      rot: Math.random() * 360,
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 2200);
    return () => clearTimeout(t);
  }, [trigger]);
  if (pieces.length === 0) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 100, overflow: "hidden" }}>
      {pieces.map((p) => (
        <span
          key={p.id}
          style={{
            position: "absolute", left: `${p.left}%`, top: "-5%", fontSize: 22,
            animation: `hawkim-fall ${p.dur}s ease-in ${p.delay}s forwards`,
            transform: `rotate(${p.rot}deg)`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style>{`@keyframes hawkim-fall { to { top: 105%; transform: translateY(0) rotate(360deg); opacity: 0.3; } }`}</style>
    </div>
  );
}

/* ============================== ITEM ROW ============================== */

function ItemRow({ item, override, onCycle, editable }) {
  const status = override?.status ?? item.status;
  return (
    <div className="group flex items-start gap-2.5 rounded-xl px-2.5 py-2 hover:bg-white/70 transition-colors">
      <button
        onClick={() => editable && onCycle(item.id, status)}
        className={editable ? "mt-0.5 cursor-pointer active:scale-90 transition-transform" : "mt-0.5"}
        title={editable ? "Click to change status" : status}
      >
        <ItemStatusIcon status={status} />
      </button>
      <div className="flex-1 min-w-0">
        <p
          dir="auto"
          className={`text-sm leading-snug ${status === "Completed" ? "line-through text-slate-400" : "text-slate-700"}`}
        >
          {item.text}
        </p>
        {status !== "Not Started" && (
          <span
            className="mt-1 inline-block text-[10px] font-semibold uppercase tracking-wide rounded-full px-2 py-0.5"
            style={{
              background: status === "Completed" ? "#DCFCE7" : status === "Blocked" ? "#FFE4E6" : "#FEF3C7",
              color: status === "Completed" ? "#15803D" : status === "Blocked" ? "#BE123C" : "#B45309",
            }}
          >
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

function SectionCard({ kind, items, overrides, onCycle, editable }) {
  const s = SECTION_STYLES[kind];
  const Icon = s.icon;
  const doneCount = items.filter((i) => (overrides[i.id]?.status ?? i.status) === "Completed").length;
  return (
    <div className="rounded-2xl p-4 flex flex-col h-full" style={{ background: s.bg, border: `1px solid ${s.chip}` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg p-1.5" style={{ background: s.chip }}>
            <Icon size={16} style={{ color: s.text }} />
          </div>
          <h4 className="font-bold text-sm" style={{ color: s.text }}>{s.name}</h4>
        </div>
        <span className="text-xs font-semibold" style={{ color: s.text }}>{doneCount}/{items.length}</span>
      </div>
      <div className="flex flex-col divide-y divide-white/60 flex-1">
        {items.map((item) => (
          <ItemRow key={item.id} item={item} override={overrides[item.id]} onCycle={onCycle} editable={editable} />
        ))}
        {items.length === 0 && <p className="text-xs text-slate-400 italic py-2">Nothing here yet.</p>}
      </div>
    </div>
  );
}

function CriteriaCard({ items }) {
  const s = SECTION_STYLES.criteria;
  const Icon = s.icon;
  return (
    <div className="rounded-2xl p-4 flex flex-col h-full" style={{ background: s.bg, border: `1px solid ${s.chip}` }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="rounded-lg p-1.5" style={{ background: s.chip }}>
          <Icon size={16} style={{ color: s.text }} />
        </div>
        <h4 className="font-bold text-sm" style={{ color: s.text }}>{s.name}</h4>
      </div>
      <ul className="flex flex-col gap-2">
        {items.map((c, i) => (
          <li key={i} dir="auto" className="text-sm text-slate-700 flex gap-2 items-start">
            <Sparkles size={14} className="mt-1 flex-shrink-0" style={{ color: s.text }} />
            <span>{c}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ============================== WEEKLY STAR ============================== */

function WeeklyStarCard({ weekId, star, onEdit }) {
  const member = star ? MEMBERS.find((m) => m.id === star.memberId) : null;
  const badge = star ? BADGES.find((b) => b.id === star.badgeId) : null;
  return (
    <div
      className="rounded-2xl p-5 flex flex-col items-center text-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg,#FDF4FF 0%,#FFF7ED 100%)", border: "1px solid #FBCFE8" }}
    >
      <div className="absolute -top-6 -right-6 opacity-20"><Star size={90} style={{ color: "#EC4899" }} /></div>
      <span className="text-xs font-bold tracking-wide uppercase flex items-center gap-1" style={{ color: "#BE185D" }}>
        <Star size={14} fill="#EC4899" style={{ color: "#EC4899" }} /> Weekly Star
      </span>
      {member ? (
        <>
          <div className="my-3"><Avatar member={member} size={64} /></div>
          <p className="font-extrabold text-lg text-slate-800">{member.name}</p>
          {badge && (
            <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full px-3 py-1" style={{ background: "#FCE7F3", color: "#BE185D" }}>
              {badge.emoji} {badge.label}
            </span>
          )}
          {star.message && <p dir="auto" className="mt-2 text-sm text-slate-600 italic">"{star.message}"</p>}
        </>
      ) : (
        <p className="my-6 text-sm text-slate-400 italic">Not selected yet this week.</p>
      )}
      <button
        onClick={onEdit}
        className="mt-4 text-xs font-semibold rounded-full px-4 py-1.5 flex items-center gap-1.5 transition-transform active:scale-95"
        style={{ background: "#EC4899", color: "white" }}
      >
        <Pencil size={12} /> {member ? "Change" : "Choose"} Star
      </button>
    </div>
  );
}

function StarModal({ weekNumber, current, onSave, onClose }) {
  const [memberId, setMemberId] = useState(current?.memberId || MEMBERS[0].id);
  const [badgeId, setBadgeId] = useState(current?.badgeId || BADGES[0].id);
  const [message, setMessage] = useState(current?.message || "");
  return (
    <Modal title={`⭐ Weekly Star — Week ${weekNumber}`} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Choose team member</p>
          <div className="flex gap-2 flex-wrap">
            {MEMBERS.map((m) => (
              <button
                key={m.id}
                onClick={() => setMemberId(m.id)}
                className="flex items-center gap-2 rounded-full pl-1.5 pr-3 py-1.5 border-2 transition-colors"
                style={{ borderColor: memberId === m.id ? m.color : "#E2E8F0", background: memberId === m.id ? `${m.color}15` : "white" }}
              >
                <Avatar member={m} size={26} /> <span className="text-sm font-medium">{m.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Badge</p>
          <div className="flex gap-2 flex-wrap">
            {BADGES.map((b) => (
              <button
                key={b.id}
                onClick={() => setBadgeId(b.id)}
                className="text-sm rounded-full px-3 py-1.5 border-2 transition-colors"
                style={{ borderColor: badgeId === b.id ? "#EC4899" : "#E2E8F0", background: badgeId === b.id ? "#FCE7F3" : "white" }}
              >
                {b.emoji} {b.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-2">Recognition message (optional)</p>
          <textarea
            dir="auto"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-2.5 text-sm resize-none focus:outline-none focus:ring-2"
            style={{ "--tw-ring-color": "#EC489966" }}
            rows={2}
            placeholder="Great job this week!"
          />
        </div>
        <button
          onClick={() => onSave({ memberId, badgeId, message })}
          className="rounded-xl py-2.5 font-bold text-white transition-transform active:scale-95"
          style={{ background: "linear-gradient(90deg,#EC4899,#8B5CF6)" }}
        >
          Save Weekly Star
        </button>
      </div>
    </Modal>
  );
}

/* ============================== MODAL ============================== */

function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)" }} onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-3xl" : "max-w-md"} max-h-[85vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

/* ============================== PROGRESS CHART ============================== */

function ProgressChart({ weeks, taskOverrides }) {
  const data = weeks.map((w, i) => {
    const { pct } = computeProgress(w, taskOverrides);
    return { week: `W${w.weekNumber}`, planned: Math.round(((i + 1) / weeks.length) * 100), actual: pct };
  });
  return (
    <div className="rounded-2xl p-4 bg-white border border-slate-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={16} style={{ color: "#8B5CF6" }} />
        <h4 className="font-bold text-sm text-slate-700">Weekly Progress Chart</h4>
      </div>
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
            <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #E2E8F0", fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="planned" name="Planned" stroke="#CBD5E1" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            <Line type="monotone" dataKey="actual" name="Actual" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 4, fill: "#8B5CF6" }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ============================== TEAM PULSE ============================== */

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  return `${Math.floor(hr / 24)}d ago`;
}

function TeamPulse({ posts, setPosts, currentMemberId, setCurrentMemberId }) {
  const [text, setText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");

  const sorted = [...posts].sort((a, b) => (b.pinned - a.pinned) || (b.ts - a.ts));

  function post() {
    if (!text.trim()) return;
    const newPost = { id: `p${Date.now()}`, memberId: currentMemberId, text: text.trim(), ts: Date.now(), reactions: { "👍": [], "🎉": [] }, replies: [], pinned: false };
    setPosts([newPost, ...posts]);
    setText("");
  }
  function react(postId, emoji) {
    setPosts(posts.map((p) => {
      if (p.id !== postId) return p;
      const list = p.reactions[emoji] || [];
      const has = list.includes(currentMemberId);
      return { ...p, reactions: { ...p.reactions, [emoji]: has ? list.filter((m) => m !== currentMemberId) : [...list, currentMemberId] } };
    }));
  }
  function togglePin(postId) {
    setPosts(posts.map((p) => (p.id === postId ? { ...p, pinned: !p.pinned } : p)));
  }
  function removePost(postId) {
    setPosts(posts.filter((p) => p.id !== postId));
  }
  function submitReply(postId) {
    if (!replyText.trim()) return;
    setPosts(posts.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, { id: `r${Date.now()}`, memberId: currentMemberId, text: replyText.trim(), ts: Date.now() }] } : p)));
    setReplyText("");
    setReplyingTo(null);
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
        <MessageCircle size={16} style={{ color: "#0D9488" }} />
        <h4 className="font-bold text-sm text-slate-700">Team Pulse</h4>
      </div>
      <div className="flex-1 overflow-y-auto px-4 flex flex-col gap-3 pb-2 max-h-72">
        {sorted.map((p) => {
          const member = MEMBERS.find((m) => m.id === p.memberId);
          return (
            <div key={p.id} className={`rounded-xl p-3 ${p.pinned ? "bg-amber-50 border border-amber-200" : "bg-slate-50"}`}>
              <div className="flex items-start gap-2.5">
                <Avatar member={member} size={28} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{member?.name}</span>
                    <span className="text-[11px] text-slate-400">{timeAgo(p.ts)}</span>
                    {p.pinned && <Pin size={11} className="text-amber-500" />}
                  </div>
                  <p dir="auto" className="text-sm text-slate-700 mt-0.5 whitespace-pre-wrap">{p.text}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    {["👍", "🎉"].map((emoji) => (
                      <button key={emoji} onClick={() => react(p.id, emoji)} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800">
                        <span>{emoji}</span><span>{p.reactions[emoji]?.length || 0}</span>
                      </button>
                    ))}
                    <button onClick={() => setReplyingTo(replyingTo === p.id ? null : p.id)} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800">
                      <ReplyIcon size={12} /> Reply
                    </button>
                    <button onClick={() => togglePin(p.id)} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800">
                      <Pin size={12} /> {p.pinned ? "Unpin" : "Pin"}
                    </button>
                    {p.memberId === currentMemberId && (
                      <button onClick={() => removePost(p.id)} className="text-xs flex items-center gap-1 text-slate-400 hover:text-rose-500">
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                  {p.replies.length > 0 && (
                    <div className="mt-2 flex flex-col gap-2 border-l-2 border-slate-200 pl-3">
                      {p.replies.map((r) => {
                        const rm = MEMBERS.find((m) => m.id === r.memberId);
                        return (
                          <div key={r.id} className="text-xs">
                            <span className="font-semibold text-slate-700">{rm?.name}: </span>
                            <span dir="auto" className="text-slate-600">{r.text}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {replyingTo === p.id && (
                    <div className="mt-2 flex gap-2">
                      <input
                        dir="auto"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submitReply(p.id)}
                        placeholder="Write a reply..."
                        className="flex-1 text-xs rounded-lg border border-slate-200 px-2.5 py-1.5 focus:outline-none"
                      />
                      <button onClick={() => submitReply(p.id)} className="text-xs font-semibold px-2 text-teal-600">Send</button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        {sorted.length === 0 && <p className="text-xs text-slate-400 italic py-4 text-center">No updates yet — say hello 👋</p>}
      </div>
      <div className="border-t border-slate-100 p-3 flex items-center gap-2">
        <select
          value={currentMemberId}
          onChange={(e) => setCurrentMemberId(e.target.value)}
          className="text-xs rounded-lg border border-slate-200 px-2 py-2 bg-white flex-shrink-0"
        >
          {MEMBERS.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
        <input
          dir="auto"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && post()}
          placeholder="Share a quick update..."
          className="flex-1 text-sm rounded-xl border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-teal-200"
        />
        <button onClick={post} className="rounded-xl p-2 text-white flex-shrink-0" style={{ background: "#0D9488" }}>
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

/* ============================== WEEKLY REVIEW ============================== */

const REVIEW_FIELDS = [
  ["completed", "What did we complete?"],
  ["remaining", "What remains incomplete?"],
  ["learned", "What did we learn?"],
  ["blocked", "What blocked us?"],
  ["decisions", "What decisions did we make?"],
  ["nextFocus", "What is the focus for next week?"],
  ["needHelp", "Do we need help from our supervisor?"],
];

function WeeklyReviewModal({ weekNumber, existing, onSave, onClose }) {
  const [form, setForm] = useState(existing || {});
  return (
    <Modal title={`📝 Weekly Review — Week ${weekNumber}`} onClose={onClose} wide>
      <div className="grid sm:grid-cols-2 gap-3">
        {REVIEW_FIELDS.map(([key, label]) => (
          <div key={key} className={key === "needHelp" ? "sm:col-span-2" : ""}>
            <label className="text-xs font-semibold text-slate-500 mb-1 block">{label}</label>
            <textarea
              dir="auto"
              value={form[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </div>
        ))}
      </div>
      <button
        onClick={() => onSave(form)}
        className="mt-4 w-full rounded-xl py-2.5 font-bold text-white transition-transform active:scale-95"
        style={{ background: "linear-gradient(90deg,#6366F1,#8B5CF6)" }}
      >
        Save Weekly Review
      </button>
    </Modal>
  );
}

/* ============================== HEADER ============================== */

function Header({ today, currentWeek, weeks, overallPct, activeTab, setActiveTab }) {
  const daysRemaining = Math.max(0, daysBetween(new Date(today), new Date(PLAN_END)));
  return (
    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 pb-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="rounded-xl p-2" style={{ background: "linear-gradient(135deg,#8B5CF6,#EC4899)" }}>
                <Rocket size={20} className="text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-slate-800">Hawkim Track</h1>
            </div>
            <p className="text-xs text-slate-500 mt-1 ml-1">Summer Research Progress Dashboard · Jul 14 – Sep 10, 2026</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex -space-x-2">
              {MEMBERS.map((m) => <Avatar key={m.id} member={m} size={30} />)}
            </div>
            <div className="text-right">
              <p className="text-[11px] text-slate-400">Overall Progress</p>
              <p className="text-lg font-extrabold" style={{ color: "#8B5CF6" }}>{overallPct}%</p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3 text-xs">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 flex items-center gap-1"><Calendar size={12} /> {new Date(today).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
          <span className="rounded-full px-3 py-1 flex items-center gap-1" style={{ background: "#EDE9FE", color: "#6D28D9" }}>
            <Flag size={12} /> {currentWeek ? `Week ${currentWeek.weekNumber}` : "No active week"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600 flex items-center gap-1"><CalendarClock size={12} /> {daysRemaining} days remaining</span>
        </div>
        <div className="flex gap-2 mt-4">
          {["Week Plan", "Plan Details"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-sm font-semibold px-4 py-2 rounded-full transition-colors ${activeTab === tab ? "text-white" : "text-slate-500 hover:bg-slate-100"}`}
              style={activeTab === tab ? { background: "linear-gradient(90deg,#8B5CF6,#6366F1)" } : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================== CURRENT WEEK VIEW ============================== */

function CurrentWeekCard({ week, today, taskOverrides, onCycle, onOpenReview, celebrate }) {
  const { pct, totalItems, completedCount, remaining, blockedCount } = computeProgress(week, taskOverrides);
  const status = weekStatus(week, today);
  return (
    <div
      className="rounded-3xl p-5 sm:p-6 relative overflow-hidden"
      style={{
        background: "white",
        border: "2px solid transparent",
        backgroundImage: `linear-gradient(white,white), linear-gradient(120deg, ${week.accent}, #EC4899)`,
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
        boxShadow: `0 8px 30px -10px ${week.accent}55`,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wide rounded-full px-3 py-1 text-white" style={{ background: week.accent }}>
              Week {week.weekNumber} · Current Week
            </span>
            <StatusPill status={status} />
            {pct === 100 && <span className="text-xs font-bold text-amber-500 flex items-center gap-1"><PartyPopper size={13}/> Week complete!</span>}
          </div>
          <p className="text-sm text-slate-400 mt-2">{fmtShort(week.start)} – {fmtShort(week.end)}, 2026</p>
          <p dir="auto" className="text-slate-700 font-medium mt-1 max-w-2xl">{week.objective}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-3xl font-extrabold" style={{ color: week.accent }}>{pct}%</p>
          <p className="text-[11px] text-slate-400">{completedCount}/{totalItems} items done</p>
          <button
            onClick={onOpenReview}
            className="mt-2 text-xs font-semibold rounded-full px-3 py-1.5 flex items-center gap-1 border border-slate-200 hover:bg-slate-50"
          >
            <ClipboardList size={12} /> Weekly Review
          </button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <SectionCard kind="tasks" items={week.tasks} overrides={taskOverrides} onCycle={onCycle} editable />
        <SectionCard kind="parallel" items={week.parallelTasks} overrides={taskOverrides} onCycle={onCycle} editable />
        <SectionCard kind="deliverables" items={week.deliverables} overrides={taskOverrides} onCycle={onCycle} editable />
        <CriteriaCard items={week.successCriteria} />
      </div>
      <Confetti trigger={celebrate} />
    </div>
  );
}

/* ============================== PLAN DETAILS VIEW ============================== */

function PlanDetailsView({ weeks, today, taskOverrides, weeklyReviews }) {
  const [openId, setOpenId] = useState(null);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-3">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2"><ClipboardList size={18}/> Full Summer Roadmap</h2>
      {weeks.map((w) => {
        const status = weekStatus(w, today);
        const { pct } = computeProgress(w, taskOverrides);
        const open = openId === w.id;
        const review = weeklyReviews[w.id];
        return (
          <div key={w.id} className="rounded-2xl border overflow-hidden" style={{ borderColor: open ? w.accent : "#E2E8F0" }}>
            <button
              onClick={() => setOpenId(open ? null : w.id)}
              className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-left">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: w.accent }}>
                  {w.weekNumber}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-800">{fmtShort(w.start)} – {fmtShort(w.end)}</p>
                  <p dir="auto" className="text-xs text-slate-500 line-clamp-1">{w.objective}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-sm font-bold" style={{ color: w.accent }}>{pct}%</span>
                <StatusPill status={status} />
                {open ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
              </div>
            </button>
            {open && (
              <div className="px-4 pb-4 pt-1 bg-slate-50/60 border-t border-slate-100">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
                  <SectionCard kind="tasks" items={w.tasks} overrides={taskOverrides} onCycle={() => {}} editable={false} />
                  <SectionCard kind="parallel" items={w.parallelTasks} overrides={taskOverrides} onCycle={() => {}} editable={false} />
                  <SectionCard kind="deliverables" items={w.deliverables} overrides={taskOverrides} onCycle={() => {}} editable={false} />
                  <CriteriaCard items={w.successCriteria} />
                </div>
                {review && (
                  <div className="mt-3 rounded-xl bg-white border border-slate-200 p-4">
                    <p className="text-xs font-bold text-indigo-500 mb-2 flex items-center gap-1"><ClipboardList size={12}/> Weekly Review</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {REVIEW_FIELDS.map(([key, label]) => review[key] ? (
                        <div key={key}>
                          <p className="text-[11px] font-semibold text-slate-400">{label}</p>
                          <p dir="auto" className="text-xs text-slate-700">{review[key]}</p>
                        </div>
                      ) : null)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================== MEETING SECTION ============================== */

function MeetingCard({ meeting, setMeeting }) {
  const [editing, setEditing] = useState(false);
  const [link, setLink] = useState(meeting.link);
  const [when, setWhen] = useState(meeting.when);
  const [agenda, setAgenda] = useState(meeting.agenda);

  return (
    <div className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: "linear-gradient(120deg,#0EA5E9,#22C55E)" }}>
      <div className="flex items-center justify-between">
        <div className="text-white">
          <p className="text-xs opacity-90 flex items-center gap-1"><Video size={13}/> Next meeting</p>
          <p className="font-bold text-sm">{meeting.when || "Not scheduled"}</p>
          {meeting.agenda && <p className="text-xs opacity-80 mt-0.5">{meeting.agenda}</p>}
        </div>
        <button onClick={() => setEditing(true)} className="text-white/80 hover:text-white"><Settings2 size={16}/></button>
      </div>
      <a
        href={meeting.link || "#"}
        target="_blank" rel="noreferrer"
        onClick={(e) => !meeting.link && e.preventDefault()}
        className="w-full text-center rounded-xl bg-white/95 hover:bg-white text-slate-800 font-bold py-2.5 flex items-center justify-center gap-2 transition-transform active:scale-95"
      >
        <Video size={16} style={{ color: "#0EA5E9" }} /> Join Google Meeting
      </a>
      {editing && (
        <Modal title="Meeting Settings" onClose={() => setEditing(false)}>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500">Google Meet link</label>
              <input value={link} onChange={(e) => setLink(e.target.value)} className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="https://meet.google.com/xxx-xxxx-xxx" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Next meeting date &amp; time</label>
              <input value={when} onChange={(e) => setWhen(e.target.value)} className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Saturday, 6:00 PM" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500">Agenda (optional)</label>
              <input value={agenda} onChange={(e) => setAgenda(e.target.value)} className="w-full mt-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Review Section 2.2 draft" />
            </div>
            <button
              onClick={() => { setMeeting({ link, when, agenda }); setEditing(false); }}
              className="rounded-xl py-2.5 font-bold text-white"
              style={{ background: "linear-gradient(90deg,#0EA5E9,#22C55E)" }}
            >
              Save
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* ============================== PROGRESS BAR ROW ============================== */

function ProgressBars({ week, overallPct, taskOverrides }) {
  const { pct, completedCount, totalItems, remaining, blockedCount } = computeProgress(week, taskOverrides);
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4 flex flex-col gap-4">
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-sm font-bold text-slate-700">Current Week Progress</p>
          <span className="text-sm font-extrabold" style={{ color: week.accent }}>{pct}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${week.accent}, #EC4899)` }} />
        </div>
        <div className="flex gap-3 mt-2 text-[11px] text-slate-500 flex-wrap">
          <span>{completedCount} of {totalItems} completed</span>
          <span>·</span>
          <span>{remaining} remaining</span>
          {blockedCount > 0 && <><span>·</span><span className="text-rose-500 font-semibold flex items-center gap-1"><AlertTriangle size={11}/> {blockedCount} blocked</span></>}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <p className="text-xs font-semibold text-slate-500">Overall Summer Progress</p>
          <span className="text-xs font-bold text-indigo-500">{overallPct}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${overallPct}%`, background: "linear-gradient(90deg,#6366F1,#8B5CF6)" }} />
        </div>
      </div>
    </div>
  );
}

/* ============================== PRE / POST PLAN STATES ============================== */

function PrePlanState({ weeks, daysUntilStart }) {
  const w1 = weeks[0];
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <Sparkles size={40} className="mx-auto mb-3" style={{ color: "#8B5CF6" }} />
      <h2 className="text-xl font-extrabold text-slate-800">The summer plan has not started yet</h2>
      <p className="text-sm text-slate-500 mt-1">Kickoff in {daysUntilStart} day{daysUntilStart === 1 ? "" : "s"} — here's a preview of Week 1</p>
      <div className="mt-6 text-left rounded-2xl border-2 p-5 bg-white" style={{ borderColor: w1.accent }}>
        <span className="text-xs font-bold uppercase rounded-full px-3 py-1 text-white" style={{ background: w1.accent }}>Week 1 Preview</span>
        <p className="text-sm text-slate-400 mt-2">{fmtShort(w1.start)} – {fmtShort(w1.end)}, 2026</p>
        <p className="text-slate-700 font-medium mt-1">{w1.objective}</p>
      </div>
    </div>
  );
}

function PostPlanState({ overallPct }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 text-center">
      <Trophy size={44} className="mx-auto mb-3 text-amber-400" />
      <h2 className="text-xl font-extrabold text-slate-800">Summer plan complete! 🎉</h2>
      <p className="text-sm text-slate-500 mt-1">The nine-week Hawkim research plan has concluded.</p>
      <div className="mt-6 inline-block rounded-2xl border border-slate-100 bg-white px-8 py-6 shadow-sm">
        <p className="text-4xl font-extrabold" style={{ color: "#8B5CF6" }}>{overallPct}%</p>
        <p className="text-xs text-slate-400 mt-1">Final overall completion</p>
      </div>
    </div>
  );
}

/* ============================== DEV PANEL ============================== */

function DevPanel({ simDate, setSimDate, show, setShow }) {
  if (!show) {
    return (
      <button onClick={() => setShow(true)} className="fixed bottom-3 left-3 z-40 text-[10px] text-slate-300 hover:text-slate-500 flex items-center gap-1">
        <Settings2 size={11} /> dev
      </button>
    );
  }
  return (
    <div className="fixed bottom-3 left-3 z-40 bg-slate-800 text-white rounded-xl p-3 text-xs shadow-xl flex items-center gap-2">
      <Settings2 size={13} />
      <span>Simulate date:</span>
      <input
        type="date"
        value={simDate}
        onChange={(e) => setSimDate(e.target.value)}
        className="rounded bg-slate-700 px-2 py-1 text-white"
      />
      <button onClick={() => setSimDate("")} className="text-slate-300 hover:text-white underline">reset</button>
      <button onClick={() => setShow(false)} className="text-slate-400 hover:text-white"><X size={13} /></button>
    </div>
  );
}

/* ============================== MAIN APP ============================== */

export default function HawkimTrack() {
  const weeks = useMemo(() => buildWeeks(), []);
  const [activeTab, setActiveTab] = useState("Week Plan");
  const [taskOverrides, setTaskOverrides] = useState(() => loadLS(LS_KEYS.tasks, {}));
  const [pulsePosts, setPulsePosts] = useState(() => loadLS(LS_KEYS.pulse, SEED_PULSE));
  const [currentMemberId, setCurrentMemberId] = useState(MEMBERS[0].id);
  const [weeklyStars, setWeeklyStars] = useState(() => loadLS(LS_KEYS.stars, {}));
  const [weeklyReviews, setWeeklyReviews] = useState(() => loadLS(LS_KEYS.reviews, {}));
  const [meeting, setMeeting] = useState(() => loadLS(LS_KEYS.meeting, { link: "", when: "Saturday, 6:00 PM", agenda: "" }));
  const [simDate, setSimDate] = useState(() => loadLS(LS_KEYS.simDate, ""));
  const [showDev, setShowDev] = useState(false);
  const [showStarModal, setShowStarModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [celebrate, setCelebrate] = useState(0);

  useEffect(() => saveLS(LS_KEYS.tasks, taskOverrides), [taskOverrides]);
  useEffect(() => saveLS(LS_KEYS.pulse, pulsePosts), [pulsePosts]);
  useEffect(() => saveLS(LS_KEYS.stars, weeklyStars), [weeklyStars]);
  useEffect(() => saveLS(LS_KEYS.reviews, weeklyReviews), [weeklyReviews]);
  useEffect(() => saveLS(LS_KEYS.meeting, meeting), [meeting]);
  useEffect(() => saveLS(LS_KEYS.simDate, simDate), [simDate]);

  const today = simDate ? new Date(simDate + "T12:00:00") : new Date();

  const activeIdx = findActiveWeekIndex(weeks, today);
  const currentWeek = activeIdx >= 0 ? weeks[activeIdx] : null;

  const overallPct = useMemo(() => {
    let total = 0, done = 0;
    weeks.forEach((w) => {
      [...w.tasks, ...w.parallelTasks, ...w.deliverables].forEach((item) => {
        total += item.weight;
        const status = taskOverrides[item.id]?.status ?? item.status;
        if (status === "Completed") done += item.weight;
      });
    });
    return total === 0 ? 0 : Math.round((done / total) * 100);
  }, [weeks, taskOverrides]);

  const handleCycle = useCallback((itemId, currentStatus) => {
    const next = ITEM_STATUS_CYCLE[(ITEM_STATUS_CYCLE.indexOf(currentStatus) + 1) % ITEM_STATUS_CYCLE.length];
    setTaskOverrides((prev) => {
      const updated = { ...prev, [itemId]: { status: next } };
      // check if this completes the whole current week
      if (currentWeek && next === "Completed") {
        const all = [...currentWeek.tasks, ...currentWeek.parallelTasks, ...currentWeek.deliverables];
        const allDone = all.every((it) => (it.id === itemId ? true : (updated[it.id]?.status ?? it.status) === "Completed"));
        if (allDone) setCelebrate((c) => c + 1);
      }
      return updated;
    });
  }, [currentWeek]);

  const daysUntilStart = activeIdx === -1 ? Math.max(1, daysBetween(new Date(today), new Date(PLAN_START))) : 0;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(180deg,#FAFAFF 0%,#FFFFFF 40%)", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header today={today} currentWeek={currentWeek} weeks={weeks} overallPct={overallPct} activeTab={activeTab} setActiveTab={setActiveTab} />

      {activeTab === "Week Plan" && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          {activeIdx === -1 && <PrePlanState weeks={weeks} daysUntilStart={daysUntilStart} />}
          {activeIdx === -2 && <PostPlanState overallPct={overallPct} />}
          {currentWeek && (
            <div className="grid lg:grid-cols-[1fr_280px] gap-4 items-start">
              <CurrentWeekCard
                week={currentWeek}
                today={today}
                taskOverrides={taskOverrides}
                onCycle={handleCycle}
                onOpenReview={() => setShowReviewModal(true)}
                celebrate={celebrate}
              />
              <WeeklyStarCard weekId={currentWeek.id} star={weeklyStars[currentWeek.id]} onEdit={() => setShowStarModal(true)} />
            </div>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-1.5"><TrendingUp size={15}/> Progress</h3>
            <div className="grid lg:grid-cols-[1fr_320px] gap-4 items-stretch">
              <ProgressChart weeks={weeks} taskOverrides={taskOverrides} />
              <div className="flex flex-col gap-4">
                {currentWeek ? (
                  <ProgressBars week={currentWeek} overallPct={overallPct} taskOverrides={taskOverrides} />
                ) : (
                  <div className="rounded-2xl bg-white border border-slate-100 p-4 text-xs text-slate-400 italic">No active week to show weekly progress for.</div>
                )}
                <TeamPulse posts={pulsePosts} setPosts={setPulsePosts} currentMemberId={currentMemberId} setCurrentMemberId={setCurrentMemberId} />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <MeetingCard meeting={meeting} setMeeting={setMeeting} />
          </div>
        </div>
      )}

      {activeTab === "Plan Details" && (
        <PlanDetailsView weeks={weeks} today={today} taskOverrides={taskOverrides} weeklyReviews={weeklyReviews} />
      )}

      {showStarModal && currentWeek && (
        <StarModal
          weekNumber={currentWeek.weekNumber}
          current={weeklyStars[currentWeek.id]}
          onClose={() => setShowStarModal(false)}
          onSave={(star) => { setWeeklyStars({ ...weeklyStars, [currentWeek.id]: star }); setShowStarModal(false); }}
        />
      )}

      {showReviewModal && currentWeek && (
        <WeeklyReviewModal
          weekNumber={currentWeek.weekNumber}
          existing={weeklyReviews[currentWeek.id]}
          onClose={() => setShowReviewModal(false)}
          onSave={(form) => { setWeeklyReviews({ ...weeklyReviews, [currentWeek.id]: form }); setShowReviewModal(false); }}
        />
      )}

      <DevPanel simDate={simDate} setSimDate={setSimDate} show={showDev} setShow={setShowDev} />
    </div>
  );
}
