import { Frog, Button } from 'frog';
import { handle } from 'frog/vercel';

export const app = new Frog({
  title: 'Roulette',
});

app.frame('/', (c) => {
  return c.res({
    action: '/spin',
    image: 'https://i.imgur.com/8Q8Q8Q8.png',
    intents: [
      Button.Transaction({ target: '/spin' }, 'Крутить рулетку! 🚀'),
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

// Это критическая строка для Vercel Functions
export default handle(app);
