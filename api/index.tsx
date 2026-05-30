import { Button, Frog } from 'frog'

export const app = new Frog({
  title: 'Sepolia Roulette',
})

// Твой адрес контракта в сети Sepolia
const CONTRACT_ADDRESS = '0xC7084fAC1EDFc9337e84A62285097D4586421c48'

app.frame('/', (c) => {
  return c.res({
    action: '/result',
    image: (
      <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1b4b', width: '100%', height: '100%', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: 60, marginBottom: 10 }}>🎰 Sepolia Roulette 🎰</h1>
        <p style={{ fontSize: 32, color: '#a5b4fc' }}>Выиграй 0.00001 ETH</p>
        <p style={{ fontSize: 20, color: '#818cf8', marginTop: 15 }}>Раз в 24 часа • Сеть Sepolia</p>
      </div>
    ),
    intents: [
      <Button.Transaction target="/spin">Крутить рулетку! 🚀</Button.Transaction>
    ],
  })
})

app.transaction('/spin', (c) => {
  return c.contract({
    abi: [
      {
        inputs: [],
        name: "spin",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
      }
    ],
    chainId: 'eip155:11155111', // ID сети Sepolia
    functionName: 'spin',
    to: CONTRACT_ADDRESS,
  })
})

app.frame('/result', (c) => {
  const { transactionId } = c
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e1b4b', width: '100%', height: '100%', fontFamily: 'sans-serif', padding: 40 }}>
        <h1 style={{ fontSize: 50, color: '#4ade80' }}>Готово! 🎉</h1>
        <p style={{ fontSize: 24, textAlign: 'center', color: '#a5b4fc', marginTop: 20 }}>
          Транзакция отправлена в сеть Sepolia.
        </p>
        <p style={{ fontSize: 18, textAlign: 'center', color: '#94a3b8', marginTop: 10 }}>
          Результат появится в кошельке после подтверждения.
        </p>
        {transactionId && (
          <p style={{ fontSize: 16, color: '#818cf8', marginTop: 20, wordBreak: 'break-all' }}>
            TX: {transactionId.slice(0, 30)}...
          </p>
        )}
      </div>
    ),
    intents: [<Button.Reset>Попробовать завтра</Button.Reset>]
  })
})
