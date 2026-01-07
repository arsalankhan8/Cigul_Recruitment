import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../components/ui/Background";
import { api } from "../lib/api";

function Column({ title, count, children, onDrop, onDragOver }) {
  return (
    <div className="bg-white/35 backdrop-blur border border-white/60 rounded-[26px] p-6 min-h-[560px] shadow-[0_12px_35px_-22px_rgba(0,0,0,0.35)]">
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

function CandidateCard({ a, onClick }) {
  const initials = (a.fullName || "A").slice(0, 1).toUpperCase();

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", a._id);
      }}
      className="bg-white/80 border border-white/70 rounded-[18px] p-4 shadow-[0_10px_25px_-18px_rgba(0,0,0,0.35)] cursor-grab active:cursor-grabbing"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-black/[0.04] flex items-center justify-center font-bold text-black/60">
          {initials}
        </div>
        <div className="text-[11px] text-black/35 font-semibold">#{a._id.slice(-4).toUpperCase()}</div>
      </div>

      <div className="mt-3 font-semibold text-black/80">{a.fullName}</div>

      <div className="mt-3 flex gap-2">
        <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-700 text-[11px] font-semibold">
          Exp: {a.expYears}
        </span>
        <span className="px-2 py-1 rounded-md bg-blue-500/10 text-blue-700 text-[11px] font-semibold">
          {a.liveInKarachi === "Yes" ? "Karachi" : "Remote"}
        </span>
      </div>
    </div>
  );
}

export default function PipelineJob() {
  const { jobId } = useParams();
  const nav = useNavigate();

  const [job, setJob] = useState(null);
  const [columns, setColumns] = useState({ applied: [], interview: [], rejected: [], hired: [] });
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
      <div className="max-w-6xl mx-auto px-8 py-10">
        <button
          onClick={() => nav("/dashboard/pipeline")}
          className="text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 hover:text-black/80"
        >
          ← Back to Dashboard
        </button>

        <div className="mt-2 flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-black/85">{title}</h1>
            <div className="mt-1 text-sm text-black/55">{job?.workModel || ""}</div>
          </div>

          <div className="px-4 py-2 rounded-lg bg-white/80 border border-white/70 text-[11px] tracking-[0.22em] uppercase text-black/55 font-semibold shadow-sm">
            Total Candidates: <span className="text-black/80 font-bold">{totalCandidates}</span>
          </div>
        </div>

        {loading ? (
          <div className="mt-8 text-sm text-black/50">Loading...</div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
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
                  onClick={() => nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)}
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
                  onClick={() => nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)}
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
                  onClick={() => nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)}
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
                  onClick={() => nav(`/dashboard/pipeline/${jobId}/candidate/${a._id}`)}
                />
              ))}
            </Column>
          </div>
        )}
      </div>
    </Background>
  );
}
