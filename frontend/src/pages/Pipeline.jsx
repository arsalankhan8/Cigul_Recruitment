import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Background from "../components/ui/Background";
import { api } from "../lib/api";

function DeptPill({ label }) {
  return (
    <div className="text-[11px] tracking-[0.24em] uppercase text-black/40 font-semibold mt-1">
      {label}
    </div>
  );
}

function StatusPill({ children, tone = "muted" }) {
  const tones = {
    muted: "bg-black/[0.04] text-black/55 border-black/10",
    orange: "bg-orange-500 text-white border-orange-500",
  };
  return (
    <div className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${tones[tone]}`}>
      {children}
    </div>
  );
}

function JobCard({ job, onClick }) {
  const total = job?.pipeline?.total ?? 0;
  const new24 = job?.pipeline?.newLast24h ?? 0;

  return (
    <button
      onClick={onClick}
      className="text-left w-full bg-white/80 backdrop-blur border border-white/70 rounded-[22px] p-6 shadow-[0_10px_30px_-18px_rgba(0,0,0,0.25)] hover:shadow-[0_18px_45px_-22px_rgba(0,0,0,0.35)] transition"
    >
      <div className="flex items-center justify-between">
        <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center font-bold text-black/70">
          {job.title?.[0]?.toUpperCase() || "J"}
        </div>

        {new24 > 0 ? (
          <StatusPill tone="orange">{new24} NEW APPLICANTS</StatusPill>
        ) : (
          <StatusPill>ALL CAUGHT UP</StatusPill>
        )}
      </div>

      <div className="mt-5">
        <div className="text-[18px] font-semibold text-black/85 leading-snug">
          {job.title}
        </div>
        <DeptPill label={job.department} />
      </div>

      <div className="mt-6 pt-5 border-t border-black/5 flex items-center justify-between">
        <div>
          <div className="text-[11px] tracking-[0.22em] uppercase text-black/35 font-semibold">
            Total Pipeline
          </div>
          <div className="mt-1 text-[22px] font-bold text-black/80">{total}</div>
        </div>

        <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center text-black/50">
          →
        </div>
      </div>
    </button>
  );
}

export default function Pipeline() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/api/pipeline");
        setItems(data.items || []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Background>
      <div className="max-w-6xl mx-auto px-8 py-12">
        <h1 className="text-[28px] font-bold text-black/85">Talent Dashboard</h1>
        <p className="mt-2 text-sm text-black/55">
          Overview of recruitment pipelines by role.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-7">
          {loading ? (
            <div className="text-sm text-black/50">Loading...</div>
          ) : (
            items.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onClick={() => navigate(`/dashboard/pipeline/${job._id}`)}
              />
            ))
          )}
        </div>
      </div>
    </Background>
  );
}
