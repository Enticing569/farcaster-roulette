import { Frog } from 'frog';
import { createServer } from 'node:http';
import { handle } from 'frog/server';

const app = new Frog({
  basePath: '/',
  title: 'Roulette',
});

app.frame('/', (c) => {
  return c.res({
    image: 'https://i.imgur.com/8Q8Q8Q8.png',
    intents: [
      <Button.Transaction target="/spin">Spin</Button.Transaction>
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

const server = createServer(handle(app));

server.listen(process.env.PORT || 3000, () => {
  console.log('Server running on port', process.env.PORT || 3000);
});
