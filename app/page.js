import { getFrameMetadata } from 'frog/next';

export async function generateMetadata() {
  const frameTags = await getFrameMetadata('https://farcaster-roulette-zeta.vercel.app/api');
  return {
    other: frameTags,
  };
}

export default function Home() {
  return <h1>Farcaster Roulette Frame</h1>;
}
