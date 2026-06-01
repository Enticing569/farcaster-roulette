# Farcaster Roulette

Короткая инструкция по деплою на Vercel.

1. Установите Vercel CLI (опционально):

```
npm i -g vercel
```

2. В корне репозитория выполните деплой:

```
vercel --prod
```

3. В настройках проекта на Vercel добавьте переменную окружения (если нужно):

- `NEXT_PUBLIC_FRAME_URL` — URL для фрейма (по умолчанию `/api`).

4. Скрипты сборки: `npm run build` (Next.js). Node должен быть >=18.
