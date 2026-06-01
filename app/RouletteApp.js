"use client";

import { useState } from 'react';

const OUTCOMES = [
  'Вы выиграли! 🎉',
  'Почти получилось — попробуйте ещё.',
  'Сегодня не ваш день, но вы можете сыграть снова.',
  'Джекпот! Отличный спин!',
  'Немного не хватило, попробуйте ещё раз.',
];

export default function RouletteApp() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSpin = () => {
    setLoading(true);
    setResult('');

    setTimeout(() => {
      const next = OUTCOMES[Math.floor(Math.random() * OUTCOMES.length)];
      setResult(next);
      setLoading(false);
    }, 600);
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
      <div style={{ maxWidth: 520 }}>
        <h1 style={{ margin: 0, fontSize: '2.4rem' }}>Farcaster Roulette</h1>
        <p style={{ margin: '1rem 0 2rem', fontSize: '1rem', lineHeight: 1.7 }}>
          Одна страница, один спин и результат тут же. Никаких дополнительных маршрутов.
        </p>
      </div>

      <button
        onClick={handleSpin}
        disabled={loading}
        style={{
          width: 220,
          padding: '14px 18px',
          fontSize: '1rem',
          fontWeight: 700,
          color: '#0f172a',
          background: '#f8b500',
          border: 'none',
          borderRadius: 12,
          cursor: loading ? 'wait' : 'pointer',
          boxShadow: '0 14px 30px rgba(248,181,0,0.28)',
        }}
      >
        {loading ? 'Крутится…' : 'SPIN'}
      </button>

      {result ? (
        <div
          style={{
            marginTop: 28,
            padding: '18px 22px',
            borderRadius: 18,
            background: '#172554',
            minWidth: 320,
            fontSize: '1.05rem',
          }}
        >
          {result}
        </div>
      ) : null}
    </div>
  );
}
