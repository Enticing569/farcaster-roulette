import { Frog, Button } from 'frog';
import { handle } from 'frog/next';

const app = new Frog({ basePath: '/api' });

const SPIN_ABI = [
  { inputs: [], name: "spin", outputs: [], stateMutability: "nonpayable", type: "function" }
];

app.frame('/', (c) => {
  return c.res({
    imageAspectRatio: '1:1',
    image: (
      <div style={{ display: 'flex', background: '#1a1a2e', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: 'white', fontSize: 60 }}>🎰 Roulette</span>
      </div>
    ),
    intents: [
      <Button.Transaction target="/spin" action="/result">Spin</Button.Transaction>
    ],
  });
});

app.transaction('/spin', (c) => {
  return c.contract({
    abi: SPIN_ABI,
    chainId: 'eip155:11155111',
    functionName: 'spin',
    to: '0xC7084fAC1EDFc9337e84A62285097D4586421c48',
  });
});

app.frame('/result', (c) => {
  const transactionId = c.transactionId;
  let statusMessage = 'Transaction sent!';
  let txDisplay = 'Processing...';

  if (!transactionId) {
    statusMessage = 'Transaction failed or rejected';
    txDisplay = 'Please try again';
  } else {
    txDisplay = `ID: ${transactionId.slice(0, 10)}...`;
  }

  return c.res({
    imageAspectRatio: '1:1',
    image: (
      <div style={{ display: 'flex', background: '#1a1a2e', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ color: 'white', fontSize: 40 }}>{statusMessage}</span>
        {transactionId && <span style={{ color: '#aaa', fontSize: 20 }}>{txDisplay}</span>}
      </div>
    ),
    intents: [<Button action="/">Play again</Button>],
  });
});

export const GET = handle(app);
export const POST = handle(app);
