/** @jsxImportSource frog/jsx */
import { Frog } from 'frog'
import { handle } from 'frog/vercel'

export const app = new Frog({
  basePath: '/api',
})

// Используем обычный JS объект для кнопок, чтобы не вызывать TS ошибки
app.frame('/', (c) => {
  return c.res({
    image: (
      <div style={{ color: 'white', display: 'flex', fontSize: 60 }}>
        Привет! Нажми кнопку.
      </div>
    ),
    intents: [
      <button value="spin">Крутить</button>
    ],
  })
})

export const GET = handle(app)
export const POST = handle(app)
