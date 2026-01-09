import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../components/ui/Background";
import { api } from "../lib/api";
import Footer from "../components/footer";

function Column({ title, count, children, onDrop, onDragOver }) {
  return (
    <div className="min-w-[320px] lg:min-w-0 bg-white/35 backdrop-blur border border-white/60 rounded-[26px] p-6 min-h-[560px] shadow-[0_12px_35px_-22px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-2">
        <div className="text-[11px] tracking-[0.22em] uppercase text-black/55 font-semibold">
          {title}
        </div>
        <div className="w-6 h-6 rounded-full bg-orange-500 text-white text-[11px] flex items-center justify-center font-bold">
          {count}
        </div>
      </div>

      <div
        className="mt-4 rounded-[18px] border border-dashed border-black/10 bg-white/30 h-[92px] flex items-center justify-center text-[11px] tracking-[0.22em] uppercase text-black/25 font-semibold"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        DROP HERE
      </div>

      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Pill({ children, tone = "orange" }) {
  const tones = {
    orange: "bg-orange-500/10 text-orange-700 border-orange-500/15",
    purple: "bg-purple-500/10 text-purple-700 border-purple-500/15",
    slate: "bg-black/[0.04] text-black/55 border-black/10",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function CandidateCard({ a, onClick }) {
  const initials = (a.fullName || "A").slice(0, 1).toUpperCase();
  const shortId = `#${(a._id || "").slice(-4).toUpperCase()}`;

  return (
    <button
      type="button"
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", a._id)}
      onClick={onClick}
      className="w-full text-left group relative overflow-hidden rounded-[22px] bg-white border border-black/5 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.35)] hover:shadow-[0_24px_55px_-30px_rgba(0,0,0,0.45)] transition-all active:scale-[0.99]"
    >
      {/* right red accent bar */}
      <div className="absolute inset-y-0 right-0 w-[5px] bg-red-500/90" />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center font-bold text-black/60">
            {initials}
          </div>

          <div className="text-[11px] font-semibold text-black/35 tracking-[0.14em]">
            {shortId}
          </div>
        </div>

        <div className="mt-3 text-[15px] font-semibold text-black/85 leading-tight">
          {a.fullName}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {/* Experience */}
          <Pill tone="orange">Exp: {a.expYears ?? 0} yrs</Pill>

          {/* Source / Location */}
          <Pill tone="purple">
            {a.liveInKarachi === "Yes" ? "Karachi" : "Remote"}
          </Pill>
        </div>
      </div>
    </button>
  );
}

export default function PipelineJob() {
  const { jobId } = useParams();
  const nav = useNavigate();

  const [job, setJob] = useState(null);
  const [columns, setColumns] = useState({
    applied: [],
    interview: [],
    rejected: [],
    hired: [],
  });
  const [totalCandidates, setTotalCandidates] = useState(0);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/pipeline/jobs/${jobId}`);
      setJob(data.job);
      setColumns(data.columns);
      setTotalCandidates(data.totalCandidates || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const title = useMemo(() => job?.title || "Pipeline", [job]);

  async function updateStatus(appId, status) {
    await api.patch(`/api/pipeline/applications/${appId}/status`, { status });
    await load();
  }

  function makeDrop(status) {
    return async (e) => {
      const appId = e.dataTransfer.getData("text/plain");
      if (!appId) return;
      await updateStatus(appId, status);
    };
  }

  return (
    <Background>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <button
          onClick={() => nav("/dashboard/pipeline")}
          className="text-[12px]  font-semibold tracking-[0.2em] uppercase text-black/60 hover:text-black/80"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" className="text-black inline-block">
            {" "}
            <path
              fill="currentColor"
              d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8Z"
            />{" "}
          </svg>  Back to Dashboard{" "}
         
        </button>

        <div className="mt-2 flex flex-col items-start gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
          <div>
            <h1 className="text-[28px] leading-tight font-bold text-black/85">
              {title}
            </h1>
            <div className="mt-1 text-sm text-black/55">
              {job?.workModel || ""}
            </div>
          </div>

          <div className="px-4 py-2 rounded-lg bg-white/80 border border-white/70 text-[11px] tracking-[0.22em] uppercase text-black/55 font-semibold shadow-sm">
            Total Candidates:{" "}
            <span className="text-black/80 font-bold">{totalCandidates}</span>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-sm text-black/50">Loading...</div>
        ) : (
          <div className="mt-8 lg:grid lg:grid-cols-4 lg:gap-6 flex gap-6 overflow-x-auto lg:overflow-x-visible pb-2">
            <Column
              title="Applied"
              count={columns.applied.length}
              onDrop={makeDrop("applied")}
              onDragOver={(e) => e.preventDefault()}
            >
              {columns.applied.map((a) => (
                <CandidateCard
                  key={a._id}
                  a={a}
                  onClick={() =>
                    nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)
                  }
                />
              ))}
            </Column>

            <Column
              title="Interview"
              count={columns.interview.length}
              onDrop={makeDrop("interview")}
              onDragOver={(e) => e.preventDefault()}
            >
              {columns.interview.map((a) => (
                <CandidateCard
                  key={a._id}
                  a={a}
                  onClick={() =>
                    nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)
                  }
                />
              ))}
            </Column>

            <Column
              title="Rejected"
              count={columns.rejected.length}
              onDrop={makeDrop("rejected")}
              onDragOver={(e) => e.preventDefault()}
            >
              {columns.rejected.map((a) => (
                <CandidateCard
                  key={a._id}
                  a={a}
                  onClick={() =>
                    nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)
                  }
                />
              ))}
            </Column>

            <Column
              title="Hired"
              count={columns.hired.length}
              onDrop={makeDrop("hired")}
              onDragOver={(e) => e.preventDefault()}
            >
              {columns.hired.map((a) => (
                <CandidateCard
                  key={a._id}
                  a={a}
                  onClick={() =>
                    nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)
                  }
                />
              ))}
            </Column>
          </div>
        )}

        {/* footer  */}
    <Footer/>
      </div>

    </Background>
  );
}
