import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Background from "../components/ui/Background";
import { api } from "../lib/api";
import { Mail, MapPin, FileText, Download } from "lucide-react";
import Footer from "../components/footer";
function Pill({ children, tone = "green" }) {
  const tones = {
    green: "bg-emerald-50 text-[#16a34a] border-emerald-100",
    gray: "bg-black/[0.03] text-black/55 border-black/10",
  };
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-semibold tracking-[0.22em] uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/45">
      {children}
    </div>
  );
}

function KVRow({ left, right, rightTone = "normal" }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/[0.02] border border-black/[0.04] px-5 py-4">
      <div className="text-[13px] font-semibold text-black/55">{left}</div>
      <div
        className={
          rightTone === "success"
            ? "text-[13px] font-semibold text-emerald-600"
            : "text-[13px] font-semibold text-black/70"
        }
      >
        {right}
      </div>
    </div>
  );
}

function InfoStat({ label, value }) {
  return (
    <div className="flex-1">
      <div className="text-[11px] tracking-[0.22em] uppercase text-black/35 font-semibold">
        {label}
      </div>
      <div className="mt-1 text-[16px] font-semibold text-black/75">
        {value}
      </div>
    </div>
  );
}

export default function CandidateDetail() {
  const { jobId, appId } = useParams();
  const nav = useNavigate();

  const btnBase =
    "w-full text-[12px] font-bold tracking-wide p-[15px] rounded-[12px] transition-colors";

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const a = application;

  const resumeUrl = a?.resume?.path
    ? new URL(a.resume.path, api.defaults.baseURL).toString()
    : null;

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

  async function setStatus(nextStatus) {
    await api.patch(`/api/pipeline/applications/${appId}/status`, {
      status: nextStatus,
    });
    await load();
    nav(`/dashboard/pipeline/${jobId}`);
  }

  async function deleteCandidate() {
    const ok = window.confirm(
      "Delete this candidate application and resume file permanently?"
    );
    if (!ok) return;

    try {
      setDeleting(true);
      await api.delete(`/api/pipeline/applications/${appId}`);
      nav(`/dashboard/pipeline/${jobId}`);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete candidate");
    } finally {
      setDeleting(false);
    }
  }

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

  return (
    <Background>
      {/* light grid feel */}
      <div className="min-h-screen bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:42px_42px]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <button
            onClick={() => nav(`/dashboard/pipeline/${jobId}`)}
            className="text-[12px] font-semibold tracking-[0.2em] uppercase text-black/60 hover:text-black/80"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className="text-black inline-block"
            >
              {" "}
              <path
                fill="currentColor"
                d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8Z"
              />{" "}
            </svg>{" "}
            Back to Pipeline
          </button>

          <div className="mt-8 flex flex-col gap-10 md:flex-row md:justify-between">
            <div className="flex flex-col justify-between md:w-[70%] gap-10 w-full">
              {/* TOP CARD */}

              <div className="rounded-[28px] bg-white border border-black/[0.06] shadow-[0_12px_35px_-24px_rgba(0,0,0,0.35)]">
                <div className="p-7">
                  <div className="flex flex-col md:flex-row items-start gap-5">
                    {/* avatar */}
                    <div className="h-14 w-14 rounded-2xl bg-black/[0.04] flex items-center justify-center text-black/35 font-extrabold text-xl">
                      {(a.fullName || "A").slice(0, 1).toUpperCase()}
                    </div>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <Pill tone="green">
                          {a.liveInKarachi === "Yes" ? "IN-HOUSE" : "REMOTE"}
                        </Pill>
                        <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/35">
                          ROLE: {a.job?.title || "—"}
                        </div>
                      </div>

                      <div className="mt-2 text-[18px] md:text-[28px] leading-tight font-extrabold text-black/85">
                        {a.fullName}
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-6 text-[13px] font-semibold">
                        <div className="inline-flex items-center gap-2 text-orange-600">
                          <Mail size={16} />
                          {a.email}
                        </div>
                        <div className="inline-flex items-center gap-2 text-black/45">
                          <MapPin size={16} />
                          {a.area || "Global"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="h-px w-full bg-black/[0.05]" />

                {/* stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-7">
                  <div>
                    <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/30">
                      EXPERIENCE
                    </div>
                    <div className="mt-2 text-[14px] font-extrabold text-black/75">
                      {a.expYears ?? "—"} Years
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/30">
                      EXPECTATION
                    </div>
                    <div className="mt-2 text-[14px] font-extrabold text-black/75">
                      {(a.pkrExpectation ?? 0).toLocaleString()} PKR
                    </div>
                  </div>

                  <div>
                    <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/30">
                      AVAILABILITY
                    </div>
                    <div className="mt-2 text-[14px] font-extrabold text-black/75">
                      {a.availability || "Immediately"}
                    </div>
                  </div>
                </div>
              </div>

              {/* ASSESSMENT CARD */}

              <div className="rounded-[28px] bg-white border border-black/[0.06] shadow-[0_12px_35px_-24px_rgba(0,0,0,0.35)]">
                <div className="p-7 space-y-4">
                  <SectionTitle>ASSESSMENT CONTEXT</SectionTitle>

                  <KVRow
                    left="Karachi Residence"
                    right={a.liveInKarachi === "Yes" ? "Confirmed" : "No"}
                    rightTone={a.liveInKarachi === "Yes" ? "success" : "normal"}
                  />
                  <KVRow left="Office Commute Area" right={a.area || "—"} />

                  {/* Resume block */}
                  <div className="rounded-2xl bg-black/[0.02] border border-black/[0.04] p-5">
                    <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/30">
                      RESUME / CV
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-xl bg-white border border-black/[0.06] flex items-center justify-center text-black/45">
                          <FileText size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-extrabold text-black/75">
                            {a.resume?.originalName || "No file"}
                          </div>
                        </div>
                      </div>

                      {resumeUrl ? (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-black/[0.10] bg-white px-4 py-2 text-[11px] font-extrabold tracking-[0.18em] uppercase text-black/70 hover:bg-black/[0.02]"
                        >
                          <Download size={16} />
                          Download File
                        </a>
                      ) : null}
                    </div>
                  </div>

                  {/* Portfolio */}
                  <div className="rounded-2xl bg-black/[0.02] border border-black/[0.04] p-5">
                    <div className="text-[11px] font-bold tracking-[0.22em] uppercase text-black/30">
                      PORTFOLIO / WORK LINK
                    </div>

                    {a.portfolioUrl ? (
                      <a
                        href={a.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 block text-[13px] font-extrabold text-orange-600 break-all hover:underline"
                      >
                        {a.portfolioUrl}
                      </a>
                    ) : (
                      <div className="mt-3 text-[13px] font-semibold text-black/45">
                        No link provided.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* button  */}

            <div className="rounded-[28px] md:w-[30%] max-h-max bg-white border border-black/[0.06] shadow-[0_12px_35px_-24px_rgba(0,0,0,0.35)] p-6 space-y-3 w-full">
              {a.status !== "interview" && (
                <button
                  onClick={() => setStatus("interview")}
                  className={`${btnBase} bg-orange-600 hover:bg-orange-700 text-white`}
                >
                  Move to Interview
                </button>
              )}

              {a.status !== "hired" && (
                <button
                  onClick={() => setStatus("hired")}
                  className={`${btnBase} bg-emerald-600 hover:bg-emerald-700 text-white`}
                >
                  Hire Candidate
                </button>
              )}

              {a.status !== "rejected" && (
                <button
                  onClick={() => setStatus("rejected")}
                  className={`${btnBase} bg-white border border-black/10 hover:bg-black/[0.02] text-orange-600`}
                >
                  Reject
                </button>
              )}

              <button
                onClick={deleteCandidate}
                disabled={deleting}
                className={`${btnBase} ${
                  deleting
                    ? "bg-black/10 text-black/40 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700 text-white"
                }`}
              >
                {deleting ? "Deleting..." : "Delete Candidate"}
              </button>
            </div>
          </div>

                            {/* footer  */}
    <Footer/>
        </div>
        
      </div>
      
    </Background>
  );
}
