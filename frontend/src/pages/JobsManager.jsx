// frontedn src > pages > JobsManager.jsx

import { useEffect, useMemo, useState } from "react";
import JobPost from "../components/modals/JobPost";
import { api } from "../lib/api";
import Footer from "../components/footer";

function Badge({ children, tone = "gray" }) {
  const tones = {
    gray: "bg-black/5 text-black/50 border-black/10",
    green: "bg-green-50 text-green-700 border-green-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return (
    <span
      className={[
        "inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium border",
        tones[tone] || tones.gray,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-2 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-black/40 hover:text-black hover:bg-black/5 transition"
      type="button"
    >
      {children}
    </button>
  );
}

function PrimaryBtn({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-black/90 transition shadow-sm"
      type="button"
    >
      {children}
    </button>
  );
}

function getTag(job) {
  // backend status: draft/published/archived
  if (job.status === "draft") return { label: "Draft", tone: "gray" };
  if (job.status === "archived") return { label: "Archived", tone: "amber" };

  // published
  if (job.workModel?.toLowerCase().includes("remote"))
    return { label: "Remote", tone: "blue" };
  return { label: "In-house", tone: "green" };
}

function JobCard({ job, onEdit, onArchive, onPublish }) {
  const initial = (job.title?.[0] || "J").toUpperCase();
  const tag = getTag(job);

  return (
    <div className="rounded-2xl bg-white border border-black/10 shadow-[0_8px_24px_rgba(0,0,0,0.06)]">
      <div className="px-5 py-4 flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-black/5 border border-black/10 flex items-center justify-center font-semibold text-black/70">
            {initial}
          </div>

          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-3 min-w-0">
              <div className="font-semibold text-[15px] text-black truncate">
                {job.title}
              </div>
              <Badge tone={tag.tone}>{tag.label}</Badge>
            </div>

            <div className="mt-1 text-[11px] tracking-[0.14em] uppercase text-black/35">
              {job.department} · {job.workModel}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {job.status === "draft" ? (
            <>
              <GhostBtn onClick={onEdit}>Edit</GhostBtn>
              <GhostBtn onClick={onPublish}>Publish</GhostBtn>
              <GhostBtn onClick={onArchive}>Archive</GhostBtn>
            </>
          ) : job.status === "published" ? (
            <>
              <button
                onClick={onEdit}
                className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-blue-100 transition"
                type="button"
              >
                Edit
              </button>
              <GhostBtn onClick={onArchive}>Archive</GhostBtn>
            </>
          ) : (
            <>
              <GhostBtn onClick={onEdit}>Edit</GhostBtn>
              <GhostBtn onClick={onPublish}>Publish</GhostBtn>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function JobsManager() {
  const [query, setQuery] = useState("");
  const [showJobModal, setShowJobModal] = useState(false);
  const [editJob, setEditJob] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function fetchJobs() {
    try {
      setLoading(true);
      setErr("");
      const res = await api.get("/api/jobs?limit=100");
      setJobs(res.data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return jobs;
    return jobs.filter((j) => (j.title || "").toLowerCase().includes(q));
  }, [jobs, query]);

  const handleNew = () => {
    setEditJob(null);
    setShowJobModal(true);
  };

  const onSaved = (savedJob) => {
    // update list without refetch
    setJobs((prev) => {
      const idx = prev.findIndex((x) => x._id === savedJob._id);
      if (idx === -1) return [savedJob, ...prev];
      const copy = [...prev];
      copy[idx] = savedJob;
      return copy;
    });
  };

  const onEdit = (job) => {
    setEditJob(job);
    setShowJobModal(true);
  };

  const onArchive = async (job) => {
    try {
      const res = await api.patch(`/api/jobs/${job._id}/archive`);
      onSaved(res.data);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to archive job.");
    }
  };

  const onPublish = async (job) => {
    try {
      const res = await api.patch(`/api/jobs/${job._id}/publish`);
      onSaved(res.data);
    } catch (e) {
      alert(e?.response?.data?.message || "Failed to publish job.");
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] relative">
      <JobPost
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        onSaved={onSaved}
        editJob={editJob}
      />

      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px), radial-gradient(900px 500px at 0% 50%, rgba(59,130,246,0.10), transparent 60%), radial-gradient(900px 500px at 100% 50%, rgba(245,158,11,0.10), transparent 60%)",
          backgroundSize: "48px 48px, 48px 48px, auto, auto",
          backgroundPosition: "center, center, left center, right center",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex items-start justify-between gap-6 flex-col md:flex-row">
          <div>
            <h1 className="text-[26px] font-semibold tracking-tight text-black">
              Jobs Console
            </h1>
            <p className="mt-1 text-[13px] text-black/45">
              Provisioning talent requirements.
            </p>
          </div>

          <PrimaryBtn onClick={handleNew}>
            <span className="text-base leading-none">＋</span> New Requirement
          </PrimaryBtn>
        </div>

        <div className="mt-7">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search roles…"
            className="w-full h-12 rounded-2xl bg-white/70 backdrop-blur border border-black/10 px-4 text-[13px] outline-none focus:bg-white focus:border-black/20 transition"
          />
        </div>

        <div className="mt-6 space-y-4">
          {err ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
              {err}
            </div>
          ) : loading ? (
            <div className="text-[12px] text-black/45">Loading jobs…</div>
          ) : filtered.length === 0 ? (
            <div className="text-[12px] text-black/45">No jobs found.</div>
          ) : (
            filtered.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onEdit={() => onEdit(job)}
                onArchive={() => onArchive(job)}
                onPublish={() => onPublish(job)}
              />
            ))
          )}
        </div>

        {/* footer  */}
    <Footer/>
      </div>
    </div>
  );
}
