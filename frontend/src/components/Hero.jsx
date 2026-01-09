import { useLocation } from "react-router-dom"

export default function Hero({ bgImg, loading, err, uiJobs = [] }) {
  const { pathname } = useLocation()
  const isAbout = pathname === "/about"

  return (
    <div className="grid items-start gap-10 lg:grid-cols-2">
      {/* Left Content */}
      <div className="pt-10">
        {!isAbout && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            <span className="text-[11px] font-semibold tracking-[0.14em] text-gray-900 uppercase">
              We Are Hiring
            </span>
          </div>
        )}

        <h1 className="mt-2 leading-tight text-[50px] md:text-[70px] font-bold tracking-tight text-slate-900">
          {isAbout ? "About Us" : "Careers at Cigul"}
        </h1>

        <p className="mt-4 max-w-md text-[14px] leading-5 text-slate-500">
          {isAbout
            ? "We build digital future. Cigul is a design-driven engineering collective. We partner with global brands to craft immersive web experiences that convert."
            : "Join a team of designers, engineers, and strategists building the digital future for clients Worldwide!"}
        </p>

        {/* Status (only for careers) */}
        {!isAbout && (
          <div className="mt-6">
            {loading && (
              <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                Loading jobs...
              </p>
            )}
            {!loading && err && (
              <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-red-500">
                {err}
              </p>
            )}
            {!loading && !err && (
              <p className="text-[12px] font-semibold tracking-[0.18em] uppercase text-slate-400">
                {uiJobs.length} open role{uiJobs.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Right Image */}
      <div className="lg:justify-self-end">
        <div className="relative overflow-hidden rounded-[26px] shadow-[0_26px_70px_rgba(0,0,0,0.22)] ring-1 ring-black/10">
          <img
            src={bgImg}
            alt="Cigul team"
            className="
              h-[320px]
              w-[620px]
              lg:w-[620px]
              max-lg:w-[-webkit-fill-available]
              object-cover
            "
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <div className="absolute bottom-6 left-6">
            <p className="text-[14px] font-semibold text-white">
              {isAbout ? "Design. Engineering. Impact." : "Build the extraordinary."}
            </p>
            <p className="mt-1 text-[11px] font-semibold tracking-[0.26em] uppercase text-white/80">
              KARACHI HQ
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
