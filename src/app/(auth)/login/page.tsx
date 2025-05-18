"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { walletAuth, discordAuth } from "../../../lib/auth";
import toast from "react-hot-toast";
import { loginWithDiscord } from "@/lib/api";
import Image from "next/image";

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
      loginWithDiscord();
      // discordAuth();
      // Note: This will redirect to Discord, so we don't need to handle success case here
    } catch (error) {
      console.error("Discord login error:", error);
      toast.error("Discord login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-purple-900/10 to-black flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">
              ChainAtlas Dashboard
            </h1>
          </Link>
          <p className="mt-2 text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        <div className="relative">
          {/* Animated gradient border */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-lg blur opacity-75"></div>

          <div className="relative bg-gray-900 rounded-lg border border-purple-900/30 backdrop-blur-sm overflow-hidden">
            <div className="p-6 border-b border-purple-900/30">
              <h2 className="text-xl font-semibold text-white text-center">
                Login
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <button
                onClick={handleWalletLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-purple-500/20"
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
                    <span>Connecting...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg
                      className="w-5 h-5 mr-2"
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
                    <span>Connect Wallet</span>
                  </div>
                )}
              </button>

              <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-purple-900/30"></div>
                <span className="flex-shrink mx-4 text-gray-400">or</span>
                <div className="flex-grow border-t border-purple-900/30"></div>
              </div>

              <button
                onClick={handleDiscordLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-[#5865F2]/20"
              >
                <div className="flex items-center justify-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 127.14 96.36"
                    fill="currentColor"
                  >
                    <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" />
                  </svg>
                  <span>Login with Discord</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
