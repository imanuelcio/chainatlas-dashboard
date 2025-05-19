// src/lib/wallet.ts

// Check if window is defined (browser environment)
const isWindowDefined = typeof window !== "undefined";

// Get the Ethereum provider from the browser window
export const getEthereumProvider = () => {
  if (!isWindowDefined) return null;
  return (window as any).ethereum;
};

// Connect wallet and return the wallet address
export const connectWallet = async (): Promise<string | null> => {
  try {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      console.error(
        "Ethereum provider not found. Make sure you have MetaMask installed."
      );
      throw new Error("No Ethereum provider found. Please install MetaMask.");
    }

    // Request account access
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });

    if (accounts && accounts.length > 0) {
      return accounts[0];
    }

    return null;
  } catch (error) {
    console.error("Error connecting wallet:", error);
    throw error;
  }
};

// Sign a message with the wallet
export const signMessage = async (
  address: string,
  message: string
): Promise<string | null> => {
  try {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      console.error("Ethereum provider not found");
      return null;
    }

    // Sign the message
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [message, address],
    });

    return signature;
  } catch (error) {
    console.error("Error signing message:", error);
    return null;
  }
};

// Get the current connected address
export const getCurrentAddress = async (): Promise<string | null> => {
  try {
    const ethereum = getEthereumProvider();

    if (!ethereum) {
      return null;
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts && accounts.length > 0) {
      return accounts[0];
    }

    return null;
  } catch (error) {
    console.error("Error getting current address:", error);
    return null;
  }
};

// Listen for account changes
export const addWalletListener = (callback: (accounts: string[]) => void) => {
  if (!isWindowDefined) return;

  const ethereum = getEthereumProvider();

  if (ethereum) {
    ethereum.on("accountsChanged", callback);
  }
};

// Remove account change listener
export const removeWalletListener = (
  callback: (accounts: string[]) => void
) => {
  if (!isWindowDefined) return;

  const ethereum = getEthereumProvider();

  if (ethereum) {
    ethereum.removeListener("accountsChanged", callback);
  }
};
