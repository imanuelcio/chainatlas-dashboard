"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { walletAuth } from "../../../lib/auth";
import toast from "react-hot-toast";
import { loginWithDiscord } from "@/lib/api";
import { useEffect } from "react";
export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleWalletLogin = async () => {
    setIsLoading(true);
    try {
      const authResult = await walletAuth();
      if (authResult && authResult.isAuthenticated) {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else if (authResult && authResult.error) {
        toast.error(authResult.error);
      } else if (!authResult) {
        // If wallet connection was cancelled or failed
        toast.error("Wallet connection failed or cancelled");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDiscordLogin = () => {
    setIsLoading(true);
    try {
      // Using the direct function from api.ts
      loginWithDiscord();
      // Note: This will redirect to Discord, so we don't need to handle success case here
    } catch (error) {
      console.error("Discord login error:", error);
      toast.error("Discord login failed. Please try again.");
      setIsLoading(false);
    }
  };
  const authStatus = localStorage.getItem("auth_token");
  useEffect(() => {
    if (authStatus) {
      router.push("/dashboard");
    }
  }, []);

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full filter blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

        {/* Animated stars */}
        <div className="stars-container">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                opacity: Math.random() * 0.5 + 0.3,
                animation: `twinkle ${
                  Math.random() * 4 + 3
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-md z-10 px-2">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group">
            <div className="flex items-center justify-center mb-2">
              <div className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-all duration-300 mr-3">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
                ChainAtlas
              </h1>
            </div>
            <p className="text-lg font-light tracking-wide text-indigo-100/80">
              Dashboard
            </p>
          </Link>
          <p className="mt-3 text-indigo-100/60 max-w-sm mx-auto">
            Sign in to your account to access your profile, badges, and
            community events
          </p>
        </div>

        <div className="relative group">
          {/* Animated gradient border with improved animation */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-70 group-hover:opacity-100 blur-md group-hover:blur-lg transition-all duration-1000 animate-gradient-xy"></div>

          <div className="relative bg-slate-900/90 backdrop-blur-xl rounded-xl border border-indigo-900/40 shadow-2xl shadow-purple-900/20 overflow-hidden">
            <div className="p-6 border-b border-indigo-900/40 flex items-center justify-center">
              <div className="bg-indigo-900/30 p-2 rounded-lg mr-3">
                <svg
                  className="h-5 w-5 text-indigo-400"
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
              </div>
              <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
            </div>

            <div className="p-8 space-y-6">
              <button
                onClick={handleWalletLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Connecting Wallet...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    <span>Connect with Wallet</span>
                  </div>
                )}
              </button>

              <div className="relative flex py-3 items-center">
                <div className="flex-grow border-t border-indigo-900/40"></div>
                <span className="flex-shrink mx-4 text-indigo-100/60 text-sm">
                  or continue with
                </span>
                <div className="flex-grow border-t border-indigo-900/40"></div>
              </div>

              <button
                onClick={handleDiscordLogin}
                disabled={isLoading}
                className="w-full py-3.5 px-4 rounded-xl bg-[#5865F2]/90 hover:bg-[#5865F2] text-white font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-[#5865F2]/20 hover:shadow-[#5865F2]/30 transform hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-3"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 127.14 96.36"
                    fill="currentColor"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  <span>Login with Discord</span>
                </div>
              </button>

              {/* New feature: Guest exploration option */}
              {/* <div className="pt-2 text-center">
                <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors duration-200 flex items-center justify-center mx-auto">
                  <svg
                    className="h-3.5 w-3.5 mr-1.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Explore as Guest
                </button>
              </div> */}
            </div>

            {/* Added footer with privacy links */}
            {/* <div className="p-4 border-t border-indigo-900/40 bg-indigo-950/30">
              <div className="flex justify-center space-x-4 text-xs text-indigo-100/60">
                <a
                  href="#"
                  className="hover:text-indigo-300 transition-colors duration-200"
                >
                  Privacy Policy
                </a>
                <span>•</span>
                <a
                  href="#"
                  className="hover:text-indigo-300 transition-colors duration-200"
                >
                  Terms of Service
                </a>
                <span>•</span>
                <a
                  href="#"
                  className="hover:text-indigo-300 transition-colors duration-200"
                >
                  Help
                </a>
              </div>
            </div> */}
          </div>
        </div>

        {/* Trust indicators */}
        {/* <div className="mt-8 text-center">
          <p className="text-indigo-100/60 text-xs mb-2">Protected by</p>
          <div className="flex justify-center items-center space-x-6">
            <div className="text-indigo-100/80 text-xs flex items-center">
              <svg
                className="h-4 w-4 mr-1.5 text-indigo-400"
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
              <span>256-bit SSL</span>
            </div>
            <div className="text-indigo-100/80 text-xs flex items-center">
              <svg
                className="h-4 w-4 mr-1.5 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>Secure Auth</span>
            </div>
          </div>
        </div> */}
      </div>

      {/* Add the CSS for animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.8;
          }
        }

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

        .animate-gradient-xy {
          animation: gradient-xy 15s ease infinite;
          background-size: 400% 400%;
        }

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
      `}</style>
    </div>
  );
}
