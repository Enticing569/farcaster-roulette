
export const metadata = {
  title: 'Farcaster Roulette',
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: 'https://farcaster-roulette-one.vercel.app/og-image.png',
      button: {
        title: 'Play',
        action: {
          type: 'launch_frame',
          name: 'Farcaster Roulette',
          url: 'https://farcaster-roulette-one.vercel.app',
          splashImageUrl: 'https://farcaster-roulette-one.vercel.app/splash.png',
          splashBackgroundColor: '#1a1a2e',
        },
      },
    }),
  },
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
