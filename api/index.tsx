/** @jsxImportSource frog/jsx */
import { Button, Frog } from 'frog'
import { handle } from 'frog/next'

export const app = new Frog({
  basePath: '/api',
  title: 'Sepolia Roulette',
})

const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48'

// Главный экран
app.frame('/', (c) => {
  return c.res({
    action: '/result',
    image: (
      <div style={{ 
        color: 'white', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#1e1b4b', 
        width: '100%', 
        height: '100%', 
        fontFamily: 'sans-serif' 
      }}>
        <h1 style={{ fontSize: '60px', marginBottom: '10px' }}>🎰 Sepolia Roulette 🎰</h1>
        <p style={{ fontSize: '30px', color: '#a5b4fc' }}>Выиграй 0.00001 ETH</p>
      </div>
    ),
    intents: [
      <Button.Transaction target="/spin">Крутить рулетку! 🚀</Button.Transaction>
    ],
  })
})

// Настройка транзакции
app.transaction('/spin', (c) => {
  return c.contract({
    abi: [{ 
      inputs: [], 
      name: "spin", 
      outputs: [], 
      stateMutability: "nonpayable", 
      type: "function" 
    }],
    chainId: 'eip155:11155111', // Sepolia
    functionName: 'spin',
    to: CONTRACT_ADDRESS,
  })
})

// Экран результата
app.frame('/result', (c) => {
  return c.res({
    image: (
      <div style={{ 
        color: 'white', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: '#1e1b4b', 
        width: '100%', 
        height: '100%', 
        fontFamily: 'sans-serif' 
      }}>
        <h1 style={{ fontSize: '40px', color: '#4ade80' }}>Транзакция отправлена! 🎉</h1>
      </div>
    ),
    intents: [
      <Button.Reset>Назад</Button.Reset>
    ]
  })
})

export const GET = handle(app)
export const POST = handle(app)
