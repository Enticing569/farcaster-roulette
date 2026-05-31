import { Frog, Button } from 'frog'
import { handle } from 'frog/vercel'

export const app = new Frog({
  basePath: '/api',
})

const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48'

app.frame('/', (c) => {
  return c.res({
    image: 'https://i.imgur.com/8Q8Q8Q8.png', // Вставь любую ссылку на картинку
    intents: [
      <Button.Transaction target="/spin">Крутить рулетку! 🚀</Button.Transaction>
    ],
  })
})

app.transaction('/spin', (c) => {
  return c.contract({
    abi: [{ inputs: [], name: "spin", outputs: [], stateMutability: "nonpayable", type: "function" }],
    chainId: 'eip155:11155111',
    functionName: 'spin',
    to: CONTRACT_ADDRESS,
  })
})

export const GET = handle(app)
export const POST = handle(app)
