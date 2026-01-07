export default function Background({ children }) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] relative overflow-hidden">
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
  
        {/* soft glow */}
        <div className="absolute -right-40 -top-20 w-[520px] h-[520px] rounded-full bg-orange-200/35 blur-[120px]" />
        <div className="absolute -left-40 bottom-0 w-[520px] h-[520px] rounded-full bg-indigo-200/35 blur-[120px]" />
  
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
  