import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import Footer from "../components/footer";
const tone = {
  orange: {
    accent: "#ef5518",
    pillBg: "bg-[#fff7ed]",
    pillText: "text-[#ea580c]",
    pillRing: "ring-[#ef5518]/20",
    btn: "bg-[#ef5518] hover:bg-[#d94b16]",
  },
  indigo: {
    accent: "#4f46e5",
    pillBg: "bg-[#4f46e5]/10",
    pillText: "text-[#4f46e5]",
    pillRing: "ring-[#4f46e5]/20",
    btn: "bg-[#4f46e5] hover:bg-[#4338ca]",
  },
};

const defaultForm = {
  fullName: "",
  email: "",
  portfolioUrl: "",
  country: "Pakistan",
  liveInKarachi: "Yes",
  area: "",
  expYears: "",
  pkrExpectation: "",
  resumeFile: null,
};

function explodeBullets(arr) {
  if (!Array.isArray(arr)) return [];

  const stripHeadings = (s) =>
    s
      .replace(/\bRequirements\b/gi, "")
      .replace(/\bResponsibilities\b/gi, "")
      .replace(/\bPerks\b/gi, "");

  const protectParentheses = (s) =>
    s.replace(/\(([^)]*)\)/g, (m) => m.replace(/,/g, "§§COMMA§§"));

  const restoreParentheses = (s) => s.replace(/§§COMMA§§/g, ",");

  return arr.flatMap((x) => {
    if (!x) return [];
    let s = stripHeadings(String(x).trim());
    s = s.replace(/\r?\n+/g, " ");
    s = protectParentheses(s);

    const parts = s
      .split(/\.\s*,\s*|\. +|,\s*/g)
      .map((p) => restoreParentheses(p).trim())
      .filter(Boolean);

    return parts;
  });
}

function SectionList({ title, items, accent = "#ef5518" }) {
  if (!items?.length) return null;

  return (
    <div>
      <h3 className="text-[13px] font-semibold tracking-[0.18em] uppercase text-black/50">
        {title}
      </h3>
      <ul className="mt-4 space-y-3">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="flex gap-3 text-[14px] leading-6 text-slate-700 items-center"
          >
            <span
              className="mt-1 inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: accent }}
            />
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GridBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-70"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "46px 46px",
      }}
    />
  );
}

function CornerGlow() {
  return (
    <>
      <div className="pointer-events-none absolute -left-24 -bottom-24 h-[420px] w-[420px] rounded-full bg-slate-200/35 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full bg-orange-200/35 blur-3xl" />
    </>
  );
}

function ProcessingScreen({ accent = "#ef5518" }) {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden">
      <GridBackdrop />
      <CornerGlow />

      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4">
        <div className="text-center">
          {/* spinner */}
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center">
            <div
              className="h-14 w-14 rounded-full border-[4px] border-black/10 border-t-[4px]"
              style={{ borderTopColor: accent }}
            />
          </div>

          <h1 className="text-[28px] sm:text-[34px] font-semibold tracking-tight text-slate-900">
            Processing Application
          </h1>
          <p className="mt-3 text-[14px] text-slate-500">
            Ingesting candidate profile and performing AI Analysis...
          </p>
        </div>
      </div>

      {/* CSS-only spin */}
      <style>{`
        .border-t-\\[4px\\] { animation: spin 0.9s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

function SuccessScreen({ onReturn }) {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-hidden">
      <GridBackdrop />
      <CornerGlow />

      <div className="relative mx-auto flex mt-[100px] max-w-6xl items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-slate-900 text-white shadow-[0_18px_60px_rgba(15,23,42,0.25)]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path
                d="M20 6L9 17l-5-5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1 className="text-[34px] sm:text-[44px] font-semibold tracking-tight text-slate-900">
            Application Sent
          </h1>

          <p className="mt-3 text-[14px] text-slate-500">
            Your profile has been ingested into our Talent OS. Our team reviews
            <br className="hidden sm:block" />
            profiles within 48 hours.
          </p>

          <button
            onClick={onReturn}
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-black px-8 py-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_16px_45px_rgba(0,0,0,0.25)] transition hover:opacity-95 active:scale-[0.99]"
            type="button"
          >
            Return to Jobs
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JobApply() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState(() => ({ ...defaultForm }));
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fileKey, setFileKey] = useState(0);
  const isRemote = useMemo(() => job?.workModel === "Remote (Global)", [job]);

  // NEW: stage controls the full-screen UI
  const [stage, setStage] = useState("form"); // "form" | "processing" | "success"

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get(`/api/jobs/${jobId}`);
        if (!alive) return;
        if (!res.data || res.data.status === "archived") {
          setError("This job is not available.");
          setJob(null);
          return;
        }
        setJob(res.data);
      } catch (e) {
        if (!alive) return;
        setError(
          e?.response?.data?.message || "Unable to load this job right now."
        );
        setJob(null);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [jobId]);

  useEffect(() => {
    setForm((p) => {
      if (isRemote) {
        return {
          ...p,
          liveInKarachi: "", // or "Yes" if you want default hidden value (not recommended)
          area: "",
        };
      }
      return {
        ...p,
        country: "Pakistan", // or "" if you want cleared
      };
    });
  }, [isRemote]);

  const t = useMemo(() => {
    const isRemote = job?.workModel === "Remote (Global)";
    return isRemote ? tone.indigo : tone.orange;
  }, [job]);

  const lists = useMemo(() => {
    return {
      requirements: explodeBullets(job?.requirements),
      responsibilities: explodeBullets(job?.responsibilities),
      perks: explodeBullets(job?.perks),
    };
  }, [job]);

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setForm((prev) => ({ ...prev, resumeFile: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback(null);

    if (!form.resumeFile) {
      setFeedback({
        type: "error",
        text: "Please attach your resume (PDF/DOC).",
      });
      return;
    }

    try {
      setSubmitting(true);
      setStage("processing"); // ✅ show processing screen

      const data = new FormData();
      data.append("fullName", form.fullName);
      data.append("email", form.email);
      data.append("portfolioUrl", form.portfolioUrl);
      if (isRemote) {
        data.append("country", form.country);
      } else {
        data.append("liveInKarachi", form.liveInKarachi);
        data.append("area", form.area);
      }

      data.append("expYears", form.expYears);
      data.append("pkrExpectation", form.pkrExpectation);
      data.append("resume", form.resumeFile);

      await api.post(`/api/jobs/${jobId}/apply`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // reset form (optional)
      setForm({ ...defaultForm });
      setFileKey((k) => k + 1);

      // ✅ show success screen
      setStage("success");
    } catch (err) {
      setStage("form"); // ✅ go back to form if fail
      setFeedback({
        type: "error",
        text:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to submit your application.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ FULL SCREEN STATES
  if (stage === "processing") return <ProcessingScreen accent={t.accent} />;
  if (stage === "success")
    return <SuccessScreen onReturn={() => navigate("/jobs")} />;

  // ✅ NORMAL FORM PAGE
  return (
    <div className="relative min-h-screen bg-[#f8fafc] pb-16 overflow-hidden">
      <GridBackdrop />
      <CornerGlow />

      <div className="relative mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-[15px] md:text-[12px] font-semibold text-black/70 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-[1px] hover:shadow-md"
          type="button"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            className="text-black"
          >
            <path
              fill="currentColor"
              d="M12 4l1.41 1.41L8.83 10H20v2H8.83l4.58 4.59L12 18l-8-8Z"
            />
          </svg>{" "}
          Back
        </button>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="">
            {loading ? (
              <p className="text-[13px] text-black/50">Loading job details…</p>
            ) : error ? (
              <p className="text-[13px] text-red-600">{error}</p>
            ) : (
              <>
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={[
                      "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase ring-1",
                      t.pillBg,
                      t.pillText,
                      t.pillRing,
                    ].join(" ")}
                  >
                    {job?.workModel}
                  </span>
                  <span className="text-[12px] font-semibold text-slate-500"></span>

                  <span
                    className={[
                      "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] uppercase ring-1",
                      t.pillBg,
                      t.pillText,
                      t.pillRing,
                    ].join(" ")}
                  >
                    {job?.department || "General"}
                  </span>
                </div>

                <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                  {job?.title}
                </h1>

                <p className="mt-2 text-[13px] text-slate-500">
                  {job?.salaryMinPKR || job?.salaryMaxPKR
                    ? "Salary range shared during hiring process."
                    : "Competitive salary; details shared during hiring process."}
                </p>

                <div className="mt-8 space-y-8">
                  <SectionList
                    title="Requirements"
                    items={lists.requirements}
                    accent={t.accent}
                  />
                  <SectionList
                    title="Responsibilities"
                    items={lists.responsibilities}
                    accent={t.accent}
                  />
                  <SectionList
                    title="Perks"
                    items={lists.perks}
                    accent={t.accent}
                  />
                </div>
              </>
            )}
          </div>

          <div className="rounded-[30px] border border-black/10 bg-white shadow-[0_26px_70px_rgba(0,0,0,0.10)] max-h-max">
            <div className="border-b border-black/5 px-8 py-6">
              <h3 className="text-[30px] font-extrabold  text-black">
                Apply Now
              </h3>
              <p className="mt-1 text-[14px] font-semibold text-slate-800">
                Please fill out the form below to be considered.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-8 py-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                  Full Name *
                  <input
                    required
                    name="fullName"
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    className="h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                    placeholder="e.g. Ali Khan"
                  />
                </label>

                <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                  Email *
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                    placeholder="ali@example.com"
                  />
                </label>
              </div>
              {feedback ? (
                <div
                  className={[
                    "rounded-2xl px-4 py-3 text-[13px]",
                    feedback.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200",
                  ].join(" ")}
                >
                  {feedback.text}
                </div>
              ) : null}
              <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                {" "}
                Portfolio / Best Work *{" "}
                <input
                  required
                  name="portfolioUrl"
                  value={form.portfolioUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, portfolioUrl: e.target.value }))
                  }
                  className="h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                  placeholder="cigul.com or https://behance.net/..."
                />{" "}
              </label>{" "}
              <div className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                {" "}
                Resume (PDF/DOC, max 500KB) *{" "}
                <label
                  className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-black/[0.015] px-4 py-6 text-center transition hover:border-black/25"
                  style={{ color: t.accent }}
                >
                  {" "}
                  <input
                    key={fileKey}
                    type="file"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={onFileChange}
                  />{" "}
                  <div className="flex flex-col items-center gap-2 text-[13px] font-semibold text-slate-600">
                    {" "}
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                      {" "}
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        {" "}
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />{" "}
                      </svg>{" "}
                    </div>{" "}
                    <span className="text-[13px] text-black/70">
                      {" "}
                      {form.resumeFile
                        ? form.resumeFile.name
                        : "Click to upload or drag and drop"}{" "}
                    </span>{" "}
                    <span className="text-[12px] text-slate-500">
                      {" "}
                      PDF, DOC, or DOCX{" "}
                    </span>{" "}
                  </div>{" "}
                </label>{" "}
              </div>{" "}
              {isRemote ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                    Country *
                    <select
                      value={form.country}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, country: e.target.value }))
                      }
                      className="h-11 rounded-xl border border-black/10 bg-white px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                      required
                    >
                      <option value="Pakistan">Pakistan</option>
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="Others">Others</option>
                    </select>
                  </label>

                  {/* optional: keep 2-col layout clean */}
                  <div className="hidden sm:block" />
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                    Live in Karachi? *
                    <select
                      value={form.liveInKarachi}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          liveInKarachi: e.target.value,
                        }))
                      }
                      className="h-11 rounded-xl border border-black/10 bg-white px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                      required
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </label>

                  <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                    Area
                    <input
                      name="area"
                      value={form.area}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, area: e.target.value }))
                      }
                      className="h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                      placeholder="e.g. DHA Phase 6"
                    />
                  </label>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {" "}
                <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                  {" "}
                  Experience (years) *{" "}
                  <input
                    required
                    type="number"
                    min="0"
                    name="expYears"
                    value={form.expYears}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, expYears: e.target.value }))
                    }
                    className="h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                    placeholder="e.g. 5"
                  />{" "}
                </label>{" "}
                <label className="flex flex-col gap-2 text-[12px] font-semibold text-slate-600">
                  {" "}
                  PKR Expectation *{" "}
                  <input
                    required
                    type="number"
                    min="0"
                    name="pkrExpectation"
                    value={form.pkrExpectation}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, pkrExpectation: e.target.value }))
                    }
                    className="h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none ring-1 ring-transparent transition focus:border-black/20 focus:ring-black/10"
                    placeholder="e.g. 150000"
                  />{" "}
                </label>{" "}
              </div>
              <button
                type="submit"
                disabled={submitting || loading || !!error || !job}
                className={[
                  "mt-2 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-white shadow-[0_22px_55px_rgba(15,23,42,0.20)] transition",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  t.btn,
                  submitting || loading || !!error || !job
                    ? "opacity-70 cursor-not-allowed"
                    : "active:scale-[0.99]",
                ].join(" ")}
              >
                {submitting ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        </div>

        {/* footer  */}
        <Footer />
      </div>
    </div>
  );
}
