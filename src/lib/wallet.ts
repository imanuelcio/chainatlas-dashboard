import { ethers } from "ethers";
import { toast } from "react-hot-toast";

export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    toast.error("MetaMask not detected! Please install MetaMask.");
    return null;
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (!accounts || accounts.length === 0) {
      toast.error("No accounts found");
      return null;
    }

    return accounts[0];
  } catch (error) {
    console.error("Error connecting wallet:", error);
    toast.error("Failed to connect wallet");
    return null;
  }
}

export async function signMessage(
  address: string,
  message: string
): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    toast.error("MetaMask not detected! Please install MetaMask.");
    return null;
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await provider.getSigner(address);
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    toast.error("Failed to sign message");
    return null;
  }
}
