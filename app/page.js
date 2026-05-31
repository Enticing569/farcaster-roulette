import { getFrameMetadata } from 'frog/next';

export async function generateMetadata() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                  (process.env.VERCEL_URL && `https://${process.env.VERCEL_URL}`) || 
                  'http://localhost:3000';
    
  const frameTags = await getFrameMetadata(`${baseUrl}/api`);
  return { other: frameTags };
}

export default function Page() {
  return <div>Roulette is live</div>;
}
