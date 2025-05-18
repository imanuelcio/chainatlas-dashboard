"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/10 to-black text-white">
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes gradient-x {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        @keyframes typing {
          from {
            width: 0;
          }
          to {
            width: 100%;
          }
        }
        @keyframes blink {
          from,
          to {
            border-color: transparent;
          }
          50% {
            border-color: rgb(139, 92, 246);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0px);
          }
        }
        @keyframes glow {
          0% {
            text-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
          }
          50% {
            text-shadow: 0 0 20px rgba(139, 92, 246, 0.8),
              0 0 30px rgba(167, 139, 250, 0.6);
          }
          100% {
            text-shadow: 0 0 5px rgba(139, 92, 246, 0.5);
          }
        }

        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 8s ease infinite;
        }
        .animate-typing {
          width: 0;
          animation: typing 3.5s steps(40, end) forwards,
            blink 0.75s step-end infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease 3s forwards;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* Single large hero section with modern Web3 styling */}
      <main className="flex items-center justify-center w-full h-screen px-6 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute w-full h-full inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full opacity-20 filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full opacity-10 filter blur-3xl animate-pulse-slow"></div>

          {/* Grid lines for cyber effect */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px)] bg-[size:40px_100%] opacity-5"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:100%_40px] opacity-5"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Logo/icon with float animation */}
          <div className="mb-8 animate-float">
            <div className="h-20 w-20 mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-10 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Main headline with animated gradient text */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight relative">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500 animate-gradient-x animate-glow">
              ChainAtlas
            </span>
            <span className="absolute -inset-1 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 blur-xl opacity-30 animate-pulse"></span>
          </h1>

          {/* Welcoming subheadline with typewriter effect */}
          <h2 className="text-3xl md:text-4xl font-light mb-8 text-white/90 overflow-hidden border-r-4 border-violet-500 whitespace-nowrap animate-typing">
            Welcome to the ChainAtlas Dashboard
          </h2>
          {/* CTA button with the requested gradients */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-full opacity-70 group-hover:opacity-100 blur-sm transition duration-300"></div>
            <Link
              href="/login"
              className="relative px-10 py-5 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium text-lg transition-all duration-300 flex items-center group-hover:scale-105"
            >
              Login to Dashboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </div>

          {/* Decorative elements - stats or badges with staggered fade-in */}
          {/* <div className="flex flex-wrap justify-center gap-8 mt-20">
            {[
              { label: "Transactions Tracked", value: "3.2M+", delay: "0.2s" },
              { label: "Community Members", value: "87K+", delay: "0.4s" },
              { label: "Connected Chains", value: "20+", delay: "0.6s" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center backdrop-blur-md bg-black/40 px-6 py-4 rounded-2xl border border-purple-900/30 opacity-0"
                style={{
                  animation: `fade-in 0.8s ease ${stat.delay} forwards`,
                }}
              >
                <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
                  {stat.value}
                </p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </main>
    </div>
  );
}
