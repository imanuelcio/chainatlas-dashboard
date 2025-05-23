// File: src/app/auth/callback/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { Suspense } from "react";

// Loading component that will be shown during suspense
function AuthCallbackLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Completing Authentication...
        </h2>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}

// The main component that handles the authentication logic
function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ekstrak token dari searchParams
    const token = searchParams?.get("token");

    if (!token) {
      setError("No authentication token received");
      setLoading(false);
      toast.error("Authentication failed: No token received");
      return;
    }

    // Simpan token ke local storage
    try {
      // Opsional: Dapatkan data user
      localStorage.setItem("auth_token", token);
      toast.success("Successfully logged in!");
      router.push("/dashboard");
    } catch (err) {
      console.error("Error during authentication callback:", err);
      setError("Authentication process failed");
      setLoading(false);
      toast.error("Authentication failed");
    }
  }, [searchParams, router]);

  if (loading) {
    return <AuthCallbackLoading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Authentication Failed</h2>
          <p className="text-red-500">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // Ini seharusnya tidak terlihat karena kita redirect sebelum loading selesai
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">
          Authentication Successful
        </h2>
        <p>Redirecting you...</p>
      </div>
    </div>
  );
}

// Main component exported with Suspense boundary
export default function AuthCallback() {
  return (
    <Suspense fallback={<AuthCallbackLoading />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
