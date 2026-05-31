import { Frog, Button } from 'frog';
import { handle } from 'frog/vercel';

export const app = new Frog({
  basePath: '/api',
  title: 'Roulette',
});

app.frame('/', (c) => {
  return c.res({
    action: '/result',
    image: 'https://i.imgur.com/8Q8Q8Q8.png', // Используй прямую ссылку на картинку
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

app.frame('/result', (c) => {
  return c.res({
    image: 'https://i.imgur.com/8Q8Q8Q8.png',
    intents: [Button.Reset('Назад')],
  });
});

export const GET = handle(app);
export const POST = handle(app);
