import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import bgImg from "../assets/careers-hero.png";
import Hero from "../components/Hero";
import Footer from "../components/footer";
const tones = {
  orange: {
    // soft UI
    pillBg: "bg-[#fff7ed]",
    pillText: "text-[#ef5518]",
    pillRing: "ring-[#ef5518]/20",

    tagBg: "bg-[#fff7ed]",
    tagText: "text-[#ef5518]",
    tagRing: "ring-[#ef5518]/20",

    // card styling
    cardBg: "bg-gradient-to-br from-white via-white to-[#ef5518]/10",
    cardHoverBorder: "hover:border-[#ef5518]/30",
    glowA: "bg-[#ef5518]/25",
    glowB: "bg-[#ef5518]/18",
    shadowHover: "hover:shadow-[#ef5518]/15",

    // buttons
    btnSolid: "bg-[#ef5518] hover:bg-[#d94b16] focus-visible:outline-[#ef5518]",
  },

  indigo: {
    // soft UI
    pillBg: "bg-[#eef2ff]",
    pillText: "text-[#4f46e5]",
    pillRing: "ring-[#4f46e5]/20",

    tagBg: "bg-[#eef2ff]",
    tagText: "text-[#4f46e5]",
    tagRing: "ring-[#4f46e5]/20",

    // card styling
    cardBg: "bg-gradient-to-br from-white via-white to-[#4f46e5]/10",
    cardHoverBorder: "hover:border-[#4f46e5]/30",
    glowA: "bg-[#4f46e5]/25",
    glowB: "bg-[#4f46e5]/18",
    shadowHover: "hover:shadow-[#4f46e5]/15",

    // buttons
    btnSolid: "bg-[#4f46e5] hover:bg-[#4338ca] focus-visible:outline-[#4f46e5]",
  },
};

function DotPill({ label, tone = "orange" }) {
  const t = tones[tone] || tones.orange;
  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5",
        "text-[10px] font-semibold tracking-[0.22em] uppercase",
        t.pillBg,
        t.pillText,
        "ring-1",
        t.pillRing,
      ].join(" ")}
    >
      {label}
    </div>
  );
}

function Icon({ name, className = "text-slate-600" }) {
  if (name !== "pin") return null;

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M12 2c3.87 0 7 3.13 7 7c0 5.25-7 13-7 13S5 14.25 5 9c0-3.87 3.13-7 7-7m0 9.5A2.5 2.5 0 0 0 14.5 9A2.5 2.5 0 0 0 12 6.5A2.5 2.5 0 0 0 9.5 9A2.5 2.5 0 0 0 12 11.5Z"
      />
    </svg>
  );
}

function Tag({ label, tone = "orange", icon = null }) {
  const t = tones[tone] || tones.orange;

  return (
    <div
      className={[
        "inline-flex items-center gap-2 rounded-md px-3 py-1.5",
        "text-[12px] font-semibold",
        t.tagBg,
        t.tagText,
        "ring-1",
        t.tagRing,
      ].join(" ")}
    >
      {icon ? (
        <span className="grid h-6 w-6 place-items-center rounded-lg bg-white/70 ring-1 ring-black/5">
          <Icon name={icon} className={t.tagText} />
        </span>
      ) : null}

      {label}
    </div>
  );
}

function ApplyButton({ tone = "orange", onClick }) {
  const t = tones[tone] || tones.orange;

  return (
    <button
      onClick={onClick}
      className={[
        "mt-10 w-full rounded-2xl px-6 py-4",
        "flex items-center justify-between",
        "text-white text-[11px] font-semibold tracking-[0.24em] uppercase",
        "shadow-[0_22px_55px_rgba(15,23,42,0.20)] transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        t.btnSolid,
      ].join(" ")}
    >
      <span>Apply Now</span>

      <span className="grid h-10 w-10 place-items-center rounded-full bg-white/20 ring-1 ring-white/25">
        <svg width="16" height="16" viewBox="0 0 24 24" className="text-white">
          <path
            fill="currentColor"
            d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8Z"
            transform="scale(-1,1) translate(-24,0)"
          />
        </svg>
      </span>
    </button>
  );
}

function formatPKRRange(min, max) {
  const fmt = (n) =>
    new Intl.NumberFormat("en-PK", { maximumFractionDigits: 0 }).format(n);

  if (min == null && max == null) return null;
  if (min != null && max != null) return `PKR ${fmt(min)} - ${fmt(max)}`;
  if (min != null) return `From PKR ${fmt(min)}`;
  return `Up to PKR ${fmt(max)}`;
}

function buildDesc(job) {
  const req = Array.isArray(job?.requirements)
    ? job.requirements.filter(Boolean)
    : [];
  const resp = Array.isArray(job?.responsibilities)
    ? job.responsibilities.filter(Boolean)
    : [];
  const top = (req.length ? req : resp).slice(0, 2);

  const salary = formatPKRRange(job?.salaryMinPKR, job?.salaryMaxPKR);
  const salaryLine = salary ? `Salary: ${salary}.` : "";

  if (top.length) return `${top.join(" ")} ${salaryLine}`.trim();
  return salaryLine || "Details will be shared after shortlisting.";
}

function mapWorkModel(workModel) {
  const isRemote = workModel === "Remote (Global)";
  return {
    pillLabel: isRemote ? "REMOTE" : "IN-HOUSE",
    tone: isRemote ? "indigo" : "orange", // ✅ FIXED
    locationTag: isRemote ? "Global" : "Karachi",
  };
}

function JobCard({ jobUI, onApply }) {
  const t = tones[jobUI?.pill?.tone] || tones.orange;

  return (
    <div
      onClick={() => onApply?.(jobUI)}
      className={[
        "group relative flex h-full cursor-pointer flex-col overflow-hidden",
        "rounded-[32px] border border-white/60",
        t.cardBg,
        "p-7 transition-all duration-500",
        "hover:-translate-y-2",
        t.cardHoverBorder,
        "hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)]",
        t.shadowHover,
        "active:scale-[0.98]",
      ].join(" ")}
    >
      {/* glowing blobs */}
      <div
        className={[
          "pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full blur-[80px] opacity-0 transition-opacity duration-700 group-hover:opacity-100",
          t.glowA,
        ].join(" ")}
      />
      <div
        className={[
          "pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full blur-[60px] opacity-0 transition-opacity duration-700 group-hover:opacity-50",
          t.glowB,
        ].join(" ")}
      />

      {/* pill */}
      <div className="relative z-10 mb-6">
        <DotPill label={jobUI.pill.label} tone={jobUI.pill.tone} />
      </div>

      {/* content */}
      <div className="relative z-10 mb-auto">
        <h3 className="mb-4 text-3xl font-bold leading-[1.1] tracking-tight text-gray-900 transition-colors group-hover:text-black">
          {jobUI.title}
        </h3>

        <p className="line-clamp-3 text-sm font-medium leading-relaxed text-gray-500">
          {jobUI.desc}
        </p>
      </div>

      {/* tags */}
      <div className="relative z-10 mt-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {jobUI.tags.map((tg, i) => (
            <Tag key={i} label={tg.label} tone={tg.tone} icon={tg.icon} />
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onApply?.(jobUI);
          }}
          className={[
            "flex w-full items-center justify-between",
            "rounded-2xl px-6 py-4",
            "text-xs font-bold uppercase tracking-widest text-white",
            "shadow-lg transition-all duration-300",
            t.btnSolid,
            "group-hover:scale-[1.02]",
          ].join(" ")}
        >
          <span>Apply Now</span>

          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 shadow-sm transition-colors group-hover:bg-white/30">
            <svg
              className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await api.get("/api/jobs?limit=100");
        const raw = res?.data?.items;

        if (!alive) return;
        setJobs(Array.isArray(raw) ? raw : []);
      } catch (e) {
        if (!alive) return;
        setErr(
          e?.response?.data?.message || e?.message || "Failed to load jobs."
        );
        setJobs([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  const uiJobs = useMemo(() => {
    return jobs
      .filter((j) => j?.status === "published")
      .map((j) => {
        const wm = mapWorkModel(j?.workModel);
        const dept = j?.department || "General";

        return {
          _id: j?._id,
          pill: { label: wm.pillLabel, tone: wm.tone },
          title: j?.title || "Untitled role",
          desc: buildDesc(j),
          tags: [
            { label: dept, tone: wm.tone, icon: null },
            { label: wm.locationTag, tone: wm.tone, icon: "pin" },
          ],
        };
      });
  }, [jobs]);

  // ✅ background tint: purple if ANY remote exists, else orange
  const hasRemote = uiJobs.some((j) => j?.pill?.tone === "indigo");

  return (
    <div className="relative min-h-screen bg-[#FBFBFD]">
      {/* Background grid */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(15,23,42,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          className={[
            "absolute right-0 top-0 h-[100%] w-[38%] bg-gradient-to-l to-transparent",
            hasRemote
              ? "from-[#4f46e5]/15 via-[#4f46e5]/5"
              : "from-[#ef5518]/15 via-[#ef5518]/5",
          ].join(" ")}
        />

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/[0.04] to-transparent" />
      </div>

      <div
        className="relative mx-auto max-w-7xl px-6 py-[20px] md:py-10
"
      >
        {/* hero  */}
        <Hero bgImg={bgImg} loading={loading} err={err} uiJobs={uiJobs} />

        {/* Cards */}
        <div className="mt-16">
          {!loading && !err && uiJobs.length === 0 ? (
            <div className="rounded-[28px] bg-white p-10 shadow-[0_26px_70px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
              <p className="text-[14px] font-semibold text-slate-900">
                No jobs available right now.
              </p>
              <p className="mt-2 text-[13px] leading-7 text-slate-500">
                Please check back later — new roles are posted frequently.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {uiJobs.map((job) => (
                <JobCard
                  key={job._id || job.title}
                  jobUI={job}
                  onApply={(j) => navigate(`/jobs/${j._id}`)}
                />
              ))}
            </div>
          )}
        </div>
                              {/* footer  */}
    <Footer/>
      </div>
    </div>
  );
}
