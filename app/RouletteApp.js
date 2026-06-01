"use client";

import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48';
const COOLDOWN_PERIOD_SECONDS = 24 * 60 * 60;
const SPIN_ABI = [
  { inputs: [], name: 'spin', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'lastSpinTime',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'player', type: 'address' },
      { indexed: false, internalType: 'bool', name: 'won', type: 'bool' },
    ],
    name: 'Result',
    type: 'event',
  },
];
const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_CHAIN_HEX = '0xaa36a7';

export default function RouletteApp() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Ready to spin.');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');
  const [contractBalance, setContractBalance] = useState('');
  const [lastSpinTime, setLastSpinTime] = useState(0);
  const [nextSpinAvailable, setNextSpinAvailable] = useState('Now');

  useEffect(() => {
    const handleChainChanged = async (chainId) => {
      const numericChainId = parseInt(chainId, 16);
      if (numericChainId === SEPOLIA_CHAIN_ID) {
        setStatus('Connected to Sepolia network.');
        await refreshBalance();
      } else {
        setStatus('Please switch your wallet to Sepolia network.');
        setContractBalance('');
      }
    };

    const handleAccountsChanged = async (accounts) => {
      setAccount(accounts[0] || '');
      if (accounts[0]) {
        await refreshBalance();
      }
    };

    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const formatTimestamp = (timestamp) => new Date(timestamp * 1000).toLocaleString();

  const getRevertReason = (error) => {
    const message = error?.message || '';
    const fallback = 'Transaction failed.';

    if (message.includes('Wait 24h')) {
      return 'Transaction reverted: wait 24h before spinning again.';
    }
    if (message.includes('cannot estimate gas')) {
      return 'Cannot estimate gas: the transaction may fail, likely because cooldown is still active.';
    }
    return fallback;
  };

  const refreshCooldown = async (accountAddress) => {
    if (!window.ethereum || !accountAddress) {
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, SPIN_ABI, provider);
      const lastTime = await contract.lastSpinTime(accountAddress);
      const lastTimeNumber = lastTime.toNumber();
      setLastSpinTime(lastTimeNumber);

      if (lastTimeNumber === 0) {
        setNextSpinAvailable('Now');
        return;
      }

      const nextAvailable = lastTimeNumber + COOLDOWN_PERIOD_SECONDS;
      if (Math.floor(Date.now() / 1000) >= nextAvailable) {
        setNextSpinAvailable('Now');
      } else {
        setNextSpinAvailable(formatTimestamp(nextAvailable));
      }
    } catch (error) {
      setNextSpinAvailable('N/A');
    }
  };

  const refreshBalance = async () => {
    try {
      if (!window.ethereum) {
        return;
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(CONTRACT_ADDRESS);
      setContractBalance(ethers.utils.formatEther(balance));
      if (account) {
        await refreshCooldown(account);
      }
    } catch (error) {
      setContractBalance('N/A');
      setNextSpinAvailable('N/A');
    }
  };

  const getCurrentChainId = async () => {
    try {
      if (!window.ethereum) {
        return null;
      }
      const chainIdHex = await window.ethereum.request({ method: 'eth_chainId' });
      return parseInt(chainIdHex, 16);
    } catch {
      return null;
    }
  };

  const switchToSepolia = async () => {
    try {
      if (!window.ethereum) {
        setStatus('No wallet detected. Install MetaMask or use a Web3-enabled browser.');
        return false;
      }

      const currentChainId = await getCurrentChainId();
      if (currentChainId === SEPOLIA_CHAIN_ID) {
        setStatus('Sepolia network already selected.');
        return true;
      }

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_HEX }],
      });
      setStatus('Switched wallet to Sepolia network.');
      return true;
    } catch (switchError) {
      if (switchError?.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_HEX,
                chainName: 'Sepolia',
                nativeCurrency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setStatus('Sepolia added to wallet.');
          return true;
        } catch (addError) {
          setStatus(addError?.message || 'Failed to add Sepolia network to wallet.');
          return false;
        }
      }
      setStatus(switchError?.message || 'Failed to switch network.');
      return false;
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus('No wallet detected. Install MetaMask or use a Web3-enabled browser.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setStatus('Wallet connected. Attempting to switch to Sepolia...');

      const switched = await switchToSepolia();
      if (switched) {
        await refreshBalance();
      }
    } catch (error) {
      setStatus(error?.message || 'Wallet connection failed.');
    }
  };

  const handleSpin = async () => {
    try {
      if (!window.ethereum) {
        setStatus('No wallet detected. Install MetaMask or use a Web3-enabled browser.');
        return;
      }

      setLoading(true);
      setStatus('Preparing transaction...');
      setTxHash('');

      const switched = await switchToSepolia();
      if (!switched) {
        setLoading(false);
        return;
      }

      const currentChainId = await getCurrentChainId();
      if (currentChainId !== SEPOLIA_CHAIN_ID) {
        setStatus('Please switch your wallet to Sepolia network.');
        setLoading(false);
        return;
      }

      if (nextSpinAvailable !== 'Now') {
        setStatus(`Cooldown active. Next spin available: ${nextSpinAvailable}`);
        setLoading(false);
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, SPIN_ABI, signer);
      const tx = await contract.spin();

      setStatus('Transaction sent. Waiting for confirmation...');
      const receipt = await tx.wait();
      const resultTopic = contract.interface.getEventTopic('Result');
      const resultLog = receipt.events?.find((event) => event.topics[0] === resultTopic);
      let winMessage = '';

      if (resultLog) {
        const parsed = contract.interface.parseLog(resultLog);
        winMessage = parsed.args.won ? 'You won 0.00001 ETH!' : 'No prize this time.';
      }

      setTxHash(receipt.transactionHash);
      setStatus(`Spin confirmed! ${winMessage}`);
      await refreshBalance();
    } catch (error) {
      setStatus(getRevertReason(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#0f172a',
        color: '#e2e8f0',
        padding: 24,
        textAlign: 'center',
      }}
    >
      <div style={{ maxWidth: 620 }}>
        <h1 style={{ margin: 0, fontSize: '2.6rem' }}>Sepolia Roulette Faucet</h1>
        <p style={{ margin: '1rem 0 2rem', fontSize: '1rem', lineHeight: 1.8, color: '#cbd5e1' }}>
          Connect your wallet, switch to Sepolia automatically, and run a faucet-style spin transaction.
        </p>
        <p style={{ margin: '0 0 2rem', fontSize: '0.95rem', lineHeight: 1.7, color: '#94a3b8' }}>
          This faucet lets you call the contract's free `spin()` function once every 24 hours. If the contract has enough funds and you win,
          it sends you a small reward of 0.00001 ETH. The app checks your cooldown, network, and contract balance before submitting the transaction.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
        <button
          onClick={connectWallet}
          style={{
            minWidth: 150,
            padding: '14px 18px',
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#0f172a',
            background: '#38bdf8',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          {account ? 'Wallet connected' : 'Connect wallet'}
        </button>

        <button
          onClick={handleSpin}
          disabled={loading}
          style={{
            minWidth: 150,
            padding: '14px 18px',
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#fff',
            background: '#f59e0b',
            border: 'none',
            borderRadius: 12,
            cursor: loading ? 'wait' : 'pointer',
            opacity: loading ? 0.75 : 1,
          }}
        >
          {loading ? 'Spinning…' : 'Spin'}
        </button>

        <button
          onClick={refreshBalance}
          style={{
            minWidth: 150,
            padding: '14px 18px',
            fontSize: '0.98rem',
            fontWeight: 700,
            color: '#0f172a',
            background: '#a3e635',
            border: 'none',
            borderRadius: 12,
            cursor: 'pointer',
          }}
        >
          Refresh
        </button>
      </div>

      <div
        style={{
          marginTop: 28,
          width: '100%',
          maxWidth: 620,
          padding: 20,
          borderRadius: 18,
          background: '#111827',
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.35)',
          textAlign: 'left',
        }}
      >
        <p style={{ margin: 0, color: '#94a3b8' }}>Status</p>
        <p style={{ margin: '10px 0 0', fontSize: '1rem', lineHeight: 1.6 }}>{status}</p>
        {account ? (
          <>
            <p style={{ margin: '12px 0 0', color: '#94a3b8' }}>Account: {account}</p>
            <p style={{ margin: '12px 0 0', color: '#94a3b8' }}>
              Next spin available: {nextSpinAvailable}
            </p>
          </>
        ) : null}
        {contractBalance ? (
          <p style={{ margin: '12px 0 0', color: '#a5f3fc' }}>
            Contract balance: {contractBalance} ETH
          </p>
        ) : null}
        {txHash ? (
          <p style={{ margin: '12px 0 0', color: '#a5f3fc', wordBreak: 'break-all' }}>
            Tx hash: {txHash}
          </p>
        ) : null}
      </div>
    </div>
  );
}
