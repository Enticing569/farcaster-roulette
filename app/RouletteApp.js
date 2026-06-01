"use client";

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function RouletteApp() {
  useEffect(() => {
    sdk.actions.ready();
  }, []);

  const frameUrl = "https://farcaster-roulette-one.vercel.app/api";

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <iframe
        src={frameUrl}
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Roulette Game"
      />
    </div>
  );
}
