import { authAPI } from "./api";
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

    // Generate nonce - this should return the userId correctly
    const nonceResponse = await authAPI.generateNonce(walletAddress);
    console.log(nonceResponse);
    const message = `Sign this message to authenticate: ${nonceResponse.nonce}`;
    const signature = await signMessage(walletAddress, message);
    const userId = nonceResponse.userId; // Make sure this is a valid MongoDB ObjectId

    if (!signature) {
      return null;
    }

    // Verify signature
    const authResponse = await authAPI.verifySignature(
      userId, // This should be the MongoDB ObjectId, not the wallet address
      walletAddress, // This is the wallet address
      signature
    );

    // Store token and user data
    localStorage.setItem("auth_token", authResponse.token);

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
export function discordAuth() {
  authAPI
    .getDiscordRedirect()
    .then((response) => {
      window.location.href = response.redirectUrl;
    })
    .catch((error) => {
      console.error("Discord auth error", error);
    });
}

// Function to handle logout
export function logout() {
  localStorage.removeItem("auth_token");
  window.location.href = "/login";
}
