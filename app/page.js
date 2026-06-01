import dynamic from 'next/dynamic';

const RouletteApp = dynamic(() => import('./RouletteApp'), { ssr: false });

export default function Page() {
  return <RouletteApp />;
}
