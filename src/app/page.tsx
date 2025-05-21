"use client";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black text-white">
      {/* Custom animations */}
      <style jsx global>{`
        @keyframes gradient-xy {
          0% {
            background-position: 0% 0%;
          }
          25% {
            background-position: 100% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          75% {
            background-position: 0% 100%;
          }
          100% {
            background-position: 0% 0%;
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
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(-2deg);
          }
          50% {
            transform: translateY(-20px) rotate(0deg);
          }
          75% {
            transform: translateY(-15px) rotate(2deg);
          }
          100% {
            transform: translateY(0px) rotate(0deg);
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes glow {
          0% {
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.7);
          }
          50% {
            text-shadow: 0 0 30px rgba(139, 92, 246, 1),
              0 0 50px rgba(167, 139, 250, 0.8);
          }
          100% {
            text-shadow: 0 0 10px rgba(139, 92, 246, 0.7);
          }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes particle-float {
          0% {
            transform: translateY(0) translateX(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) translateX(15px) rotate(90deg);
          }
          50% {
            transform: translateY(-25px) translateX(0) rotate(180deg);
          }
          75% {
            transform: translateY(-15px) translateX(-15px) rotate(270deg);
          }
          100% {
            transform: translateY(0) translateX(0) rotate(360deg);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-gradient-xy {
          background-size: 400% 400%;
          animation: gradient-xy 15s ease infinite;
        }
        .animate-typing {
          width: 0;
          animation: typing 3.5s steps(40, end) forwards,
            blink 0.75s step-end infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease forwards;
        }
        .animate-float {
          animation: float 9s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        .animate-glow {
          animation: glow 2.5s ease-in-out infinite;
        }
        .animate-pulse-ring {
          animation: pulse-ring 3s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
        }
        .animate-particle-float {
          animation: particle-float 15s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        /* Responsive adjustments for smaller screens */
        @media (max-width: 640px) {
          .animate-typing {
            animation: typing 3s steps(30, end) forwards,
              blink 0.75s step-end infinite;
          }
        }

        /* 3D transform effects */
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>

      {/* Navigation Bar */}
      <header className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-2">
                <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center">
                  <Image
                    src={"/logo/logo.svg"}
                    width={16}
                    height={16}
                    alt="logo"
                    className="rounded-full"
                  />
                </div>
              </div>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500 font-bold text-lg">
                ChainAtlas
              </span>
            </div>
            <div className="space-x-2 sm:space-x-4">
              <Link
                href="/login"
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-indigo-900/30 hover:bg-indigo-800/50 border border-indigo-700/30 text-indigo-300 transition-colors duration-300 text-sm"
              >
                Login
              </Link>
              {/* <Link
                href="/about"
                className="px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-transparent hover:bg-indigo-900/20 text-indigo-300 transition-colors duration-300 text-sm"
              >
                About
              </Link> */}
            </div>
          </div>
        </div>
      </header>

      {/* Main hero section with modern Web3 styling */}
      <main className="flex items-center justify-center w-full min-h-screen px-4 sm:px-6 py-12 relative overflow-hidden">
        {/* Abstract background elements */}
        <div className="absolute w-full h-full inset-0 z-0">
          {/* Animated gradient blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-indigo-600/30 to-purple-600/30 rounded-full opacity-30 filter blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 rounded-full opacity-30 filter blur-[80px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full opacity-20 filter blur-[60px] animate-pulse"></div>

          {/* Grid lines for cyber effect */}
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

          {/* Animated particles */}
          <div className="stars-container">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animation: `twinkle ${
                    Math.random() * 4 + 3
                  }s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                }}
              ></div>
            ))}
          </div>

          {/* Decorative geometric shapes */}
          <div
            className="absolute top-[15%] right-[10%] w-20 h-20 border-2 border-indigo-600/20 rounded-lg transform rotate-45 animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-[20%] left-[15%] w-16 h-16 border-2 border-purple-600/20 rounded-full animate-float"
            style={{ animationDelay: "1.5s" }}
          ></div>
          <div
            className="absolute top-[70%] right-[20%] w-24 h-24 border-2 border-fuchsia-600/20 rounded-lg transform rotate-12 animate-particle-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center px-4">
          {/* Logo with enhanced animation */}
          <div className="mb-8 sm:mb-10 perspective-1000 relative group">
            <div className="absolute -inset-10 rounded-full opacity-75 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-fuchsia-600/20 blur-3xl group-hover:opacity-100 transition duration-700"></div>
            <div className="animate-float relative">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600/40 to-purple-600/40 animate-pulse-ring"></div>
              <div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600/40 to-fuchsia-600/40 animate-pulse-ring"
                style={{ animationDelay: "1s" }}
              ></div>

              {/* Main logo container */}
              <div className="h-24 w-24 sm:h-32 sm:w-32 mx-auto relative transform-style-3d group-hover:rotate-y-180 transition-transform duration-1000">
                {/* Front face */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-gradient-xy"></div>
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <Image
                      src={"/logo/logo.svg"}
                      className="rounded-full h-4/5 w-4/5 animate-spin-slow"
                      width={120}
                      height={120}
                      alt="logo"
                    />
                  </div>
                </div>

                {/* Back face */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full animate-gradient-xy"></div>
                  <div className="absolute inset-2 bg-black rounded-full flex items-center justify-center">
                    <svg
                      className="h-3/5 w-3/5 text-indigo-400 animate-spin-slow"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main headline with enhanced visual effects */}
          <div className="relative perspective-1000 mb-4 sm:mb-6">
            <div className="absolute -inset-x-10 -inset-y-6 bg-gradient-to-r from-indigo-900/10 via-purple-900/10 to-fuchsia-900/10 blur-3xl opacity-50 animate-pulse"></div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-500 animate-gradient-xy animate-glow">
                ChainAtlas
              </span>
            </h1>
          </div>

          {/* Tagline with typing effect */}
          <div className="relative mb-10 sm:mb-12">
            <p className="text-xl sm:text-2xl text-indigo-100/80 font-light">
              Manage your information on ChainAtlas
            </p>
            <div className="h-px w-24 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto mt-4"></div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-16 sm:mb-20">
            <div className="relative group perspective-1000">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-70 group-hover:opacity-100 blur-md group-hover:blur-lg transition-all duration-1000 animate-gradient-xy"></div>
              <Link
                href="/login"
                className="relative px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-base sm:text-lg transition-all duration-300 flex items-center shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transform group-hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Enter Dashboard
                <div className="absolute inset-0 rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            </div>

            {/* <Link
              href="/learn"
              className="px-8 sm:px-10 py-4 sm:py-5 rounded-xl bg-indigo-900/30 hover:bg-indigo-800/40 text-indigo-300 hover:text-white font-medium text-base sm:text-lg transition-all duration-300 flex items-center border border-indigo-700/30 hover:border-indigo-600/50 shadow-lg shadow-indigo-900/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Learn More
            </Link> */}
          </div>

          {/* Stats with enhanced styling */}
          {/* <div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl mx-auto opacity-0 animate-fade-in"
            style={{ animationDelay: "0.5s" }}
          >
            {[
              {
                label: "Transactions Tracked",
                value: "3.2M+",
                delay: "0.2s",
                icon: (
                  <svg
                    className="h-6 w-6 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                ),
              },
              {
                label: "Community Members",
                value: "87K+",
                delay: "0.4s",
                icon: (
                  <svg
                    className="h-6 w-6 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                ),
              },
              {
                label: "Connected Chains",
                value: "20+",
                delay: "0.6s",
                icon: (
                  <svg
                    className="h-6 w-6 text-indigo-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                ),
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center backdrop-blur-xl bg-indigo-900/20 p-6 rounded-xl border border-indigo-700/30 shadow-xl shadow-indigo-900/10 hover:shadow-indigo-900/20 hover:bg-indigo-900/30 transition-all duration-300 opacity-0 animate-fade-in transform hover:scale-105 group"
                style={{
                  animationDelay: stat.delay,
                }}
              >
                <div className="flex justify-center mb-4">
                  <div className="h-12 w-12 rounded-lg bg-indigo-900/50 border border-indigo-700/30 flex items-center justify-center group-hover:bg-indigo-800/50 transition-colors duration-300">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent animate-gradient-xy">
                  {stat.value}
                </p>
                <p className="text-indigo-100/70 mt-2">{stat.label}</p>
              </div>
            ))}
          </div> */}
        </div>
      </main>

      {/* Footer with subtle branding */}
      <footer className="relative z-10 border-t border-indigo-900/30 bg-black/50 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="h-6 w-6 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-2">
              <div className="h-4 w-4 rounded-full bg-black flex items-center justify-center">
                <Image
                  src={"/logo/logo.svg"}
                  width={10}
                  height={10}
                  alt="logo"
                  className="rounded-full"
                />
              </div>
            </div>
            <span className="text-indigo-100/80 text-sm">
              © 2025 ChainAtlas
            </span>
          </div>

          <div className="flex items-center space-x-6">
            <a
              href="#"
              className="text-indigo-300/80 hover:text-indigo-300 transition-colors duration-200 text-sm"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-indigo-300/80 hover:text-indigo-300 transition-colors duration-200 text-sm"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-indigo-300/80 hover:text-indigo-300 transition-colors duration-200 text-sm"
            >
              Documentation
            </a>
          </div>
        </div>
      </footer>

      {/* Add the CSS for the grid pattern */}
      <style jsx>{`
        .bg-grid-pattern {
          background-image: linear-gradient(
              to right,
              rgba(99, 102, 241, 0.1) 1px,
              transparent 1px
            ),
            linear-gradient(
              to bottom,
              rgba(99, 102, 241, 0.1) 1px,
              transparent 1px
            );
          background-size: 40px 40px;
        }

        @keyframes rotate-y-180 {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(180deg);
          }
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
