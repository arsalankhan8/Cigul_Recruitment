// frontend > src > components > modals > JobPost.jsx

import { useEffect, useMemo, useState } from "react";
import { api } from "../../lib/api";

const WORK_MODELS = ["In-house (Karachi)", "Remote (Global)"];

function arrayToLines(arr) {
  if (!arr) return "";
  if (typeof arr === "string") return arr;
  return arr.join("\n");
}

function linesToArray(text) {
  return String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export default function JobPost({ isOpen, onClose, onSaved, editJob = null }) {
  const isEdit = !!editJob?._id;

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [workModel, setWorkModel] = useState("");
  const [salaryMinPKR, setSalaryMinPKR] = useState("");
  const [salaryMaxPKR, setSalaryMaxPKR] = useState("");

  const [requirements, setRequirements] = useState("");
  const [responsibilities, setResponsibilities] = useState("");
  const [perks, setPerks] = useState("");

  // Close on ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // Prefill when editing
  useEffect(() => {
    if (!isOpen) return;

    setErr("");

    if (editJob) {
      setTitle(editJob.title || "");
      setDepartment(editJob.department || "");
      setWorkModel(editJob.workModel || "");
      setSalaryMinPKR(editJob.salaryMinPKR ?? "");
      setSalaryMaxPKR(editJob.salaryMaxPKR ?? "");

      setRequirements(arrayToLines(editJob.requirements));
      setResponsibilities(arrayToLines(editJob.responsibilities));
      setPerks(arrayToLines(editJob.perks));
    } else {
      setTitle("");
      setDepartment("");
      setWorkModel("");
      setSalaryMinPKR("");
      setSalaryMaxPKR("");
      setRequirements("");
      setResponsibilities("");
      setPerks("");
    }
  }, [isOpen, editJob]);

  const canSubmit = useMemo(() => {
    return title.trim() && department.trim() && workModel.trim();
  }, [title, department, workModel]);

  async function handleSubmit(publish = true) {
    if (!canSubmit) {
      setErr("Please fill Job Title, Department and Work Model.");
      return;
    }

    setLoading(true);
    setErr("");

    const payload = {
      title: title.trim(),
      department: department.trim(),
      workModel,
      salaryMinPKR: salaryMinPKR === "" ? null : Number(salaryMinPKR),
      salaryMaxPKR: salaryMaxPKR === "" ? null : Number(salaryMaxPKR),
      requirements: linesToArray(requirements),
      responsibilities: linesToArray(responsibilities),
      perks: linesToArray(perks),
      status: publish ? "published" : "draft",
    };

    try {
      let res;

      if (isEdit) {
        res = await api.put(`/api/jobs/${editJob._id}`, payload);
      } else {
        res = await api.post(`/api/jobs`, payload);
      }

      onSaved?.(res.data);
      onClose();
    } catch (e) {
      setErr(e?.response?.data?.message || "Failed to save job.");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl mx-4 rounded-3xl bg-white border border-black/10 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
        {/* Header */}
        <div className="px-8 py-6 border-b border-black/10 flex items-center justify-between">
          <div>
            <h2 className="text-[20px] font-semibold tracking-tight">
              {isEdit ? "Edit Listing" : "Setup Listing"}
            </h2>
            <p className="text-[12px] text-black/45">
              Define role details and requirements
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full hover:bg-black/5 text-black/40 hover:text-black transition"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-8 py-6 space-y-5 md:max-h-[70vh] max-h-[60vh] overflow-y-auto">
          {err ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">
              {err}
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Job Title"
              placeholder="e.g. Lead Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Department"
              placeholder="Engineering"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
            <Select
              label="Work Model"
              options={WORK_MODELS}
              value={workModel}
              onChange={(e) => setWorkModel(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Min Salary (PKR)"
              type="number"
              value={salaryMinPKR}
              onChange={(e) => setSalaryMinPKR(e.target.value)}
            />
            <Input
              label="Max Salary (PKR)"
              type="number"
              value={salaryMaxPKR}
              onChange={(e) => setSalaryMaxPKR(e.target.value)}
            />
          </div>

          <Textarea
            label="Requirements (one per line)"
            value={requirements}
            onChange={(e) => setRequirements(e.target.value)}
          />
          <Textarea
            label="Responsibilities (one per line)"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
          <Textarea
            label="Offerings / Perks (one per line)"
            value={perks}
            onChange={(e) => setPerks(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-black/10 flex flex-wrap md:justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-black/40 hover:text-black hover:bg-black/5 transition"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={() => handleSubmit(false)}
            className="px-5 py-2 rounded-full bg-black/5 text-black text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-black/10 transition"
            disabled={loading}
            type="button"
            title="Save as draft"
          >
            {loading ? "Saving..." : "Save Draft"}
          </button>

          <button
            onClick={() => handleSubmit(true)}
            className="px-5 py-2 rounded-full bg-black text-white text-[11px] font-semibold tracking-[0.18em] uppercase hover:bg-black/90 transition shadow-sm"
            disabled={loading || !canSubmit}
            type="button"
          >
            {loading ? "Publishing..." : isEdit ? "Update Listing" : "Publish Listing"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Helpers ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-black">
        {label}
      </label>
      <input
        {...props}
        className="w-full h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none focus:border-black/30 transition"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block mb-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-black">
        {label}
      </label>
      <textarea
        rows={4}
        {...props}
        className="w-full rounded-xl border border-black/10 px-3 py-2 text-[13px] outline-none focus:border-black/30 transition resize-none"
      />
    </div>
  );
}

function Select({ label, options = [], ...props }) {
  return (
    <div>
      <label className="block mb-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-black">
        {label}
      </label>

      <select
        {...props}
        className="w-full h-11 rounded-xl border border-black/10 px-3 text-[13px] outline-none bg-white focus:border-black/30 transition"
      >
        <option value="" disabled>
          Select work model
        </option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
