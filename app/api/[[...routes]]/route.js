/** @jsxImportSource frog/jsx */
import { Frog } from 'frog';
import { handle } from 'frog/next';

const app = new Frog({
  basePath: '/api',
  title: 'Roulette',
});

app.frame('/', (c) => {
  return c.res({
    image: 'https://i.imgur.com/8Q8Q8Q8.png',
    intents: [
      <Button.Transaction target="/spin">Крутить рулетку! 🚀</Button.Transaction>,
    ],
  });
});

app.transaction('/spin', (c) => {
  return c.contract({
    abi: [{ inputs: [], name: "spin", outputs: [], stateMutability: "nonpayable", type: "function" }],
    chainId: 'eip155:11155111',
    functionName: 'spin',
    to: '0xC7084fAC1EDFc9337e84A62285097D4586421c48',
  });
});

export const GET = handle(app);
export const POST = handle(app);
