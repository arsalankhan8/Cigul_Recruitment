import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../components/ui/Background";
import { api } from "../lib/api";

function InfoStat({ label, value }) {
  return (
    <div className="flex-1">
      <div className="text-[11px] tracking-[0.22em] uppercase text-black/35 font-semibold">
        {label}
      </div>
      <div className="mt-1 text-[16px] font-semibold text-black/75">{value}</div>
    </div>
  );
}

export default function CandidateDetail() {
  const { jobId, appId } = useParams();
  const nav = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/pipeline/applications/${appId}`);
      setApplication(data.application);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appId]);

  async function setStatus(status) {
    await api.patch(`/api/pipeline/applications/${appId}/status`, { status });
    await load();
    nav(`/dashboard/pipeline/${jobId}`);
  }

  const a = application;
  const initials = useMemo(() => (a?.fullName || "A").slice(0, 1).toUpperCase(), [a]);

  if (loading) {
    return (
      <Background>
        <div className="max-w-6xl mx-auto px-8 py-10 text-sm text-black/50">
          Loading...
        </div>
      </Background>
    );
  }

  if (!a) {
    return (
      <Background>
        <div className="max-w-6xl mx-auto px-8 py-10 text-sm text-black/50">
          Candidate not found.
        </div>
      </Background>
    );
  }

  const resumeUrl = a.resume?.path ? `http://localhost:5000${a.resume.path}` : null;

  return (
    <Background>
      <div className="max-w-6xl mx-auto px-8 py-10">
        <button
          onClick={() => nav(`/dashboard/pipeline/${jobId}`)}
          className="text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 hover:text-black/80"
        >
          ← Back to Pipeline
        </button>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-7">
          {/* left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 border border-white/70 rounded-[26px] p-7 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.4)]">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 rounded-2xl bg-black/[0.04] flex items-center justify-center font-extrabold text-black/55">
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="text-[11px] tracking-[0.22em] uppercase text-black/45 font-semibold">
                    {a.liveInKarachi === "Yes" ? "In-house" : "Remote"} • Role:{" "}
                    {a.job?.title || "—"}
                  </div>
                  <div className="mt-1 text-[26px] font-bold text-black/85">
                    {a.fullName}
                  </div>
                  <div className="mt-2 text-sm text-black/55">
                    {a.email} • {a.area || "Global"}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-black/5 flex gap-6">
                <InfoStat label="Experience" value={`${a.expYears} Years`} />
                <InfoStat label="Expectation" value={`${a.pkrExpectation?.toLocaleString()} PKR`} />
                <InfoStat label="Status" value={a.status} />
              </div>
            </div>

            <div className="bg-white/80 border border-white/70 rounded-[26px] p-7 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.4)]">
              <div className="text-[12px] tracking-[0.22em] uppercase text-black/45 font-semibold">
                Resume / CV
              </div>

              <div className="mt-4 flex items-center justify-between bg-black/[0.02] border border-black/5 rounded-[18px] px-5 py-4">
                <div className="text-sm font-semibold text-black/70">
                  {a.resume?.originalName || "No file"}
                </div>

                {resumeUrl ? (
                  <a
                    href={resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl border border-black/10 bg-white text-[12px] font-semibold text-black/70 hover:bg-black/[0.02]"
                  >
                    Download File
                  </a>
                ) : null}
              </div>

              <div className="mt-6 text-[12px] tracking-[0.22em] uppercase text-black/45 font-semibold">
                Portfolio / Work Link
              </div>
              <a
                href={a.portfolioUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block bg-black/[0.02] border border-black/5 rounded-[18px] px-5 py-4 text-sm text-orange-600 break-all hover:underline"
              >
                {a.portfolioUrl}
              </a>
            </div>
          </div>

          {/* right actions */}
          <div className="space-y-6">

            <div className="bg-white/80 border border-white/70 rounded-[26px] p-6 shadow-[0_14px_40px_-26px_rgba(0,0,0,0.4)] space-y-3">
              <button
                onClick={() => setStatus("interview")}
                className="w-full py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold tracking-wide"
              >
                Move to Interview
              </button>
              <button
                onClick={() => setStatus("hired")}
                className="w-full py-3 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold tracking-wide"
              >
                Hire Candidate
              </button>
              <button
                onClick={() => setStatus("rejected")}
                className="w-full py-3 rounded-2xl bg-white border border-black/10 hover:bg-black/[0.02] text-orange-600 font-bold tracking-wide"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
}
