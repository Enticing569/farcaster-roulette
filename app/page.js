import { getFrameMetadata } from 'frog/next';

export async function generateMetadata() {
  const frameTags = await getFrameMetadata(`${process.env.VERCEL_URL || 'http://localhost:3000'}/api`);
  return { other: frameTags };
}

export default function Page() {
  return <div>Frame Ready</div>;
}
