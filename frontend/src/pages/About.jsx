import React from "react";
import Hero from "../components/Hero";
import bgImg from "../assets/careers-hero.png";
import Background from "../components/ui/Background";
import { useNavigate } from "react-router-dom";
import Footer from "../components/footer";
function About() {
    const navigate = useNavigate(); 
  return (
    <>
      <Background>
        <div className="relative mx-auto max-w-7xl px-6 py-[20px] md:py-10">
          <Hero bgImg={bgImg} />
        </div>

        <div className="mx-auto max-w-7xl px-6 py-[20px] md:py-10 gap-20 flex flex-col">

          <div>
            <div className="rounded-2xl bg-black shadow-xl">
              <div className="grid grid-cols-1 gap-y-6 divide-y divide-white/10 px-6 py-6 text-center sm:grid-cols-4 sm:gap-y-0 sm:divide-y-0 sm:divide-x sm:px-10 sm:py-8">
                {/* Item 1 */}
                <div>
                  <div className="text-[#ef5518] leading-8 lg:text-[32px] text-[25px] font-bold">
                    Karachi
                  </div>
                  <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-white/60">
                    Headquarters
                  </div>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="text-[#ef5518] leading-8 lg:text-[32px] text-[25px] font-bold">
                    Dubai & London
                  </div>
                  <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-white/60">
                    Global Offices
                  </div>
                </div>

                {/* Item 3 */}
                <div>
                  <div className="text-[#ef5518] leading-8 lg:text-[32px] text-[25px] font-bold">
                    150+
                  </div>
                  <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-white/60">
                    Projects Delivered
                  </div>
                </div>

                {/* Item 4 */}
                <div>
                  <div className="text-[#ef5518] leading-8 lg:text-[32px] text-[25px] font-bold">
                    35+
                  </div>
                  <div className="mt-1 text-[11px] tracking-[0.22em] uppercase text-white/60">
                    Team Strength
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 ">
              {/* Left Content */}
              <div className="space-y-6">
                {/* Mission */}
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                  <div
                    className="text-[11px] font-semibold tracking-[0.22em] uppercase"
                    style={{ color: "#ef5518" }}
                  >
                    Drive
                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-slate-900">
                    Our Mission
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-5 text-slate-600">
                    To bridge the gap between aesthetic excellence and robust
                    engineering. We believe that software should not only
                    function perfectly but also inspire delight in every
                    interaction.
                  </p>
                </div>

                {/* Vision */}
                <div className="rounded-2xl bg-[#0e1320] p-8 shadow-sm">
                  <div
                    className="text-[11px] font-semibold tracking-[0.22em] uppercase"
                    style={{ color: "#ef5518" }}
                  >
                    Future
                  </div>

                  <h3 className="mt-2 text-2xl font-bold text-white">
                    Our Vision
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-5 text-white/70">
                    To become the premier technology partner for ambitious
                    brands, fostering a culture where creativity and logic
                    coexist to produce world-class digital products.
                  </p>
                </div>
              </div>

              {/* Right Image */}
              <div className="relative lg:h-[500px] md:h-[400px] rotate-1 transition-transform duration-500 ease-out hover:rotate-0">
                <div
                  className="absolute -inset-3 rounded-3xl transition-transform duration-500 ease-out hover:rotate-0"
                  style={{ backgroundColor: "#ef5518", opacity: 0.1 }}
                />
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop"
                  alt="Team collaboration"
                  className="relative z-10 h-full w-full rounded-3xl object-cover -rotate-1 transition-transform duration-500 ease-out hover:rotate-0"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="rounded-3xl bg-gradient-to-r from-[#0b1733] via-[#050608] to-[#1a0b06] px-6 py-10 md:px-12 md:py-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
                Ready to build something amazing?
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm md:text-base leading-5 text-white/65">
                We are always looking for top tier talent to join our ranks.
                Check out our open positions and start your journey.
              </p>

              <div className="mt-8">
                <button
                  onClick={() => navigate("/")} // <-- navigate to /
                  className="rounded-xl bg-white px-6 py-3 text-[11px] font-semibold tracking-[0.22em] uppercase text-black shadow-sm transition hover:scale-[1.03] hover:shadow-md"
                >
                  View Careers
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </div>
      </Background>
    </>
  );
}

export default About;
