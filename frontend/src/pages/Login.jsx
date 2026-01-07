import { useState } from "react";
import { api } from "../lib/api";

import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("CigulRecruitment");
  const [password, setPassword] = useState("cigulR!e@c#r$u%i^tment(!#^)");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", { username, password });
    
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    
      navigate("/dashboard/pipeline");
    } catch (e) {
      setErr(e?.response?.data?.message || "Login failed");
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* soft corner gradient */}
      <div className="absolute right-0 top-0 h-full w-[45%] bg-gradient-to-l from-orange-100/60 to-transparent" />

      <div className="relative flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-[420px] rounded-[22px] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.18)] border border-black/5 overflow-hidden">
          {/* top gradient strip */}
          <div className="h-1.5 bg-gradient-to-r from-orange-500 via-purple-500 to-blue-500" />

          <div className="p-8">
            <h1 className="text-center text-xl font-semibold text-black">
              Talent OS Locked
            </h1>
            <p className="text-center mt-1 text-[11px] font-semibold tracking-[0.18em] uppercase text-black/45">
              Restricted Access
            </p>

            <form onSubmit={onSubmit} className="mt-7 space-y-5">
              <div>
                <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-black/60">
                  Internal ID
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-2 w-full rounded-xl bg-black/[0.03] border border-black/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="CigulRecruitment"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold tracking-[0.18em] uppercase text-black/60">
                  Passkey
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="mt-2 w-full rounded-xl bg-black/[0.03] border border-black/5 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="••••••••••"
                />
              </div>

              {err ? (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2">
                  {err}
                </div>
              ) : null}

              <button
                disabled={loading}
                className="w-full rounded-xl bg-black text-white py-3 text-[11px] font-semibold tracking-[0.18em] uppercase shadow-[0_12px_30px_rgba(0,0,0,0.25)] hover:bg-black/90 transition disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Authenticate"}
              </button>

              <div className="text-center text-[11px] text-black/40">
                Use your admin credentials.
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
