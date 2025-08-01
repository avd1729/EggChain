import { useState, useEffect } from 'react';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ethereum?: any;
  }
}

const WalletConnect = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) {
      console.log("MetaMask is not installed");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
      } else {
        setWalletAddress(null);
      }
    } catch (error) {
      console.error("Error checking wallet connection", error);
      setWalletAddress(null);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask");
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWalletAddress(accounts[0]);
    } catch (error) {
      console.error("Failed to connect wallet", error);
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();

    const handleAccountsChanged = (accounts: string[]) => {
      setWalletAddress(accounts[0] || null);
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    // Cleanup listener on unmount
    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  return (
    <div>
      <button onClick={connectWallet}>
        {walletAddress ? `Connected: ${walletAddress.slice(0, 6)}...` : "Connect Wallet"}
      </button>
    </div>
  );
};

export default WalletConnect;
