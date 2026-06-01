"use client";

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

export default function Page() {
  useEffect(() => {
    // Сообщаем SDK, что приложение готово
    sdk.actions.ready();
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Вставляем наш Frame API как iframe */}
      <iframe 
        src="/api" 
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Roulette Game"
      />
    </div>
  );
}
