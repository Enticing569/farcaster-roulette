import { getFrameMetadata } from 'frog/next';

export async function generateMetadata() {
  const frameTags = await getFrameMetadata('https://farcaster-roulette-zeta.vercel.app/api');
  return {
    other: frameTags,
  };
}

export default function Page() {
  return (
    <html>
      <head>
        <title>Roulette</title>
      </head>
      <body>
        <h1>Roulette Frame</h1>
      </body>
    </html>
  );
}
