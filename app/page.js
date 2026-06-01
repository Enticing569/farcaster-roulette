"use client"; // Обязательно для использования React hooks

import { useEffect } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { getFrameMetadata } from 'frog/next';

// Примечание: generateMetadata работает только на сервере, 
// поэтому логику SDK выносим в клиентский компонент.

export default function Page() {
  useEffect(() => {
    // Вызов готовности для скрытия splash screen
    sdk.actions.ready();
  }, []);

  return <div>Roulette is live</div>;
}
