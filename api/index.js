import { Frog } from 'frog'
import { handle } from 'frog/vercel' // Используем встроенный хендлер

export const app = new Frog({
  basePath: '/api', // Возвращаем /api для стабильности путей внутри Vercel
  title: 'Sepolia Roulette',
})

const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48'

app.frame('/', (c) => {
  return c.res({
    action: '/result',
    image: '/image-main',
    intents: [
      {
        type: 'transaction',
        target: '/spin',
        label: 'Крутить рулетку! 🚀'
      }
    ],
  })
})

app.image('/image-main', (c) => {
  return c.res({
    html: `
      <div style="color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #1e1b4b; width: 100%; height: 100%; font-family: sans-serif; display: flex;">
        <h1 style="font-size: 60px;">🎰 Sepolia Roulette 🎰</h1>
        <p style="font-size: 30px;">Выиграй 0.00001 ETH</p>
      </div>
    `
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

app.frame('/result', (c) => {
  return c.res({
    image: '/image-result',
    intents: [{ type: 'reset', label: 'Назад' }]
  })
})

app.image('/image-result', (c) => {
  return c.res({
    html: `
      <div style="color: white; display: flex; align-items: center; justify-content: center; background-color: #1e1b4b; width: 100%; height: 100%; font-family: sans-serif; display: flex;">
        <h1 style="font-size: 40px;">Транзакция отправлена! 🎉</h1>
      </div>
    `
  })
})

export const GET = handle(app)
export const POST = handle(app)
