// auth.ts
import { fetchFromAPI, queryClient } from "./api";
import { connectWallet, signMessage } from "./wallet";
import { User } from "../types/user";

// Types for auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  token: string | null;
}

// Function to handle wallet authentication
export async function walletAuth(): Promise<AuthState | null> {
  try {
    const walletAddress = await connectWallet();

    if (!walletAddress) {
      return null;
    }

    // Generate nonce using direct API call
    const nonceResponse = await fetchFromAPI<{
      userId: any;
      success: boolean;
      nonce: string;
      message: string;
    }>("/auth/wallet/nonce/", {
      method: "POST",
      data: { address: walletAddress },
    });

    console.log(nonceResponse);

    const message = `Sign this message to authenticate: ${nonceResponse.nonce}`;
    const signature = await signMessage(walletAddress, message);
    const userId = nonceResponse.userId; // Make sure this is a valid MongoDB ObjectId

    if (!signature) {
      return null;
    }

    // Verify signature using direct API call
    const authResponse = await fetchFromAPI<{
      success: boolean;
      token: string;
      user: any;
    }>("/auth/wallet/verify", {
      method: "POST",
      data: {
        address: walletAddress,
        userId,
        signature,
      },
    });

    // Store token
    if (authResponse.token) {
      localStorage.setItem("auth_token", authResponse.token);

      // Invalidate queries to refresh data
      if (queryClient) {
        queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      }
    }

    return {
      user: authResponse.user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
      token: authResponse.token,
    };
  } catch (error) {
    console.error("Wallet authentication error", error);
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: "Authentication failed",
      token: null,
    };
  }
}

// Function to handle Discord authentication
export async function discordAuth() {
  try {
    // Direct API call for Discord redirect
    const response = await fetchFromAPI<{
      success: boolean;
      redirectUrl: string;
    }>("/auth/discord");

    window.location.href = response.redirectUrl;
  } catch (error) {
    console.error("Discord auth error", error);
  }
}

// Function to handle logout
export function logout() {
  // Clear local token
  localStorage.removeItem("auth_token");

  // Call logout endpoint (non-blocking)
  fetchFromAPI<{ success: boolean; message: string }>("/logout", {
    method: "POST",
  }).catch((error) => {
    console.error("Logout error:", error);
  });

  // Invalidate queries
  if (queryClient) {
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    queryClient.clear();
  }

  // Redirect to login page
  window.location.href = "/login";
}
