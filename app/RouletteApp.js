"use client";

import { useEffect, useState } from 'react';
import { Web3Provider, Contract } from 'ethers';

const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48';
const SPIN_ABI = [
  { inputs: [], name: 'spin', outputs: [], stateMutability: 'nonpayable', type: 'function' },
];

export default function RouletteApp() {
  const [account, setAccount] = useState('');
  const [status, setStatus] = useState('Ready to spin.');
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setStatus('No wallet detected. Install MetaMask or use a Web3-enabled browser.');
        return;
      }

      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);
      setStatus('Wallet connected. Ready to spin.');
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

      const provider = new Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111) {
        setStatus('Please switch your wallet to Sepolia network.');
        setLoading(false);
        return;
      }

      const signer = provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, SPIN_ABI, signer);
      const tx = await contract.spin();

      setStatus('Transaction sent. Waiting for confirmation...');
      const receipt = await tx.wait();
      setTxHash(receipt.transactionHash);
      setStatus('Spin confirmed! Transaction completed.');
    } catch (error) {
      setStatus(error?.message || 'Transaction failed.');
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
        <h1 style={{ margin: 0, fontSize: '2.6rem' }}>Farcaster Roulette</h1>
        <p style={{ margin: '1rem 0 2rem', fontSize: '1rem', lineHeight: 1.8, color: '#cbd5e1' }}>
          Click Spin to send a transaction to the Sepolia contract and get a test result.
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
          <p style={{ margin: '12px 0 0', color: '#94a3b8' }}>Account: {account}</p>
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
