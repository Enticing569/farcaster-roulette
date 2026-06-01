/** @jsxImportSource frog/jsx */
import { Frog, Button } from 'frog';
import { handle } from 'frog/next';

const app = new Frog({ basePath: '/api' });

const SPIN_ABI = [
  { inputs: [], name: 'spin', outputs: [], stateMutability: 'nonpayable', type: 'function' }
];

app.frame('', (c) => {
  return c.res({
    imageAspectRatio: '1:1',
    image: 'https://placehold.co/600x600/1a1a2e/ffffff?text=%F0%9F%8E%B0+Roulette',
    intents: [
      <Button.Transaction target="spin" action="result">Spin</Button.Transaction>
    ],
  });
});

app.transaction('spin', (c) => {
  return c.contract({
    abi: SPIN_ABI,
    chainId: 'eip155:11155111',
    functionName: 'spin',
    to: '0xC7084fAC1EDFc9337e84A62285097D4586421c48',
  });
});

app.frame('result', (c) => {
  const transactionId = c.transactionId;
  const statusMessage = transactionId ? 'Transaction+sent!' : 'Transaction+failed';
  const txDisplay = transactionId
    ? `ID:+${transactionId.slice(0, 10)}...`
    : 'Please+try+again';

  return c.res({
    imageAspectRatio: '1:1',
    image: `https://placehold.co/600x600/1a1a2e/ffffff?text=${statusMessage}%0A${txDisplay}`,
    intents: [<Button action="/">Play again</Button>],
  });
});

const handler = handle(app);
export default handler;
