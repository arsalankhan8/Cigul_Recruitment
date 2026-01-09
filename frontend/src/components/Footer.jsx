import React from "react"

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="mt-14">
      <div className="flex flex-wrap items-center justify-between gap-5 text-[11px] tracking-[0.14em] uppercase text-black/30">
        <div>© 2026 CIGUL | TALENT OS. All rights reserved.</div>

        <div className="flex items-center gap-6">
          <a
            href="https://cigul.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-black/50"
          >
            Visit main site
          </a>

          <button
            onClick={scrollToTop}
            className="transition hover:text-black/50"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  )
}

export default Footer
