import { Frog } from 'frog'
import { handle } from 'frog/vercel'

export const app = new Frog({
  basePath: '/api',
  title: 'Sepolia Roulette',
})

const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48'

// Главный экран фрейма
app.frame('/', (c) => {
  return c.res({
    action: '/result',
    image: '/image-main', // Используем эндпоинт для генерации картинки вместо JSX
    intents: [
      {
        type: 'transaction',
        target: '/spin',
        label: 'Крутить рулетку! 🚀'
      }
    ],
  })
})

// Хэндлер для генерации первой картинки
app.image('/image-main', (c) => {
  return c.res({
    html: `
      <div style="color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; background-color: #1e1b4b; width: 100%; height: 100%; font-family: sans-serif;">
        <h1 style="font-size: 60px; margin-bottom: 10px;">🎰 Sepolia Roulette 🎰</h1>
        <p style="font-size: 30px; color: #a5b4fc;">Выиграй 0.00001 ETH</p>
      </div>
    `
  })
})

// Настройка блокчейн-транзакции
app.transaction('/spin', (c) => {
  return c.contract({
    abi: [{ inputs: [], name: "spin", outputs: [], stateMutability: "nonpayable", type: "function" }],
    chainId: 'eip155:11155111', // Sepolia Testnet
    functionName: 'spin',
    to: CONTRACT_ADDRESS,
  })
})

// Экран результата
app.frame('/result', (c) => {
  return c.res({
    image: '/image-result',
    intents: [
      {
        type: 'reset',
        label: 'Назад'
      }
    ]
  })
})

// Хэндлер для генерации картинки результата
app.image('/image-result', (c) => {
  return c.res({
    html: `
      <div style="color: white; display: flex; align-items: center; justify-content: center; background-color: #1e1b4b; width: 100%; height: 100%; font-family: sans-serif;">
        <h1 style="font-size: 40px; color: #4ade80;">Транзакция отправлена! 🎉</h1>
      </div>
    `
  })
})

export const GET = handle(app)
export const POST = handle(app)
