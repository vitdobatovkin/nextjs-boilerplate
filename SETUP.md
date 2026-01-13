# Инструкция по настройке Base App

## Шаг 1: Установка зависимостей

```bash
npm install wagmi viem @tanstack/react-query --legacy-peer-deps
```

Или если используете yarn:
```bash
yarn add wagmi viem @tanstack/react-query
```

## Шаг 2: Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
NEXT_PUBLIC_ROOT_URL=https://based-me.vercel.app
```

## Шаг 3: Подготовка изображений для Base App

Добавьте следующие изображения в папку `public/`:

- `screenshot-portrait.png` - скриншот приложения (портретная ориентация)
- `icon.png` - иконка приложения (рекомендуется 512x512px)
- `splash.png` - изображение для splash screen
- `hero.png` - главное изображение (опционально)
- `og-image.png` - изображение для Open Graph (опционально)

## Шаг 4: Деплой на Vercel

1. Загрузите код в GitHub
2. Подключите репозиторий к Vercel
3. Установите переменную окружения `NEXT_PUBLIC_ROOT_URL` в настройках Vercel
4. Отключите Deployment Protection:
   - Зайдите в Settings → Deployment Protection
   - Отключите "Vercel Authentication"
   - Сохраните изменения

## Шаг 5: Ассоциация аккаунта Farcaster

1. Перейдите на https://base.dev/preview
2. Введите URL вашего приложения (например, `https://based-me.vercel.app`)
3. Нажмите "Submit"
4. Нажмите "Verify" и следуйте инструкциям
5. Скопируйте объект `accountAssociation`
6. Откройте `app/config/minikit.config.ts` и вставьте скопированные данные:

```typescript
accountAssociation: {
  "header": "...",
  "payload": "...",
  "signature": "..."
}
```

## Шаг 6: Тестирование

1. Перейдите на https://base.dev/preview
2. Добавьте URL вашего приложения
3. Проверьте:
   - Embed изображение отображается корректно
   - Кнопка "Launch" открывает приложение
   - Вкладка "Account association" показывает успешную ассоциацию
   - Вкладка "Metadata" показывает все необходимые поля

## Шаг 7: Публикация

Создайте пост в Base App с URL вашего приложения. Ваше мини-приложение будет доступно в Base App!

## Полезные ссылки

- [Документация Base App Mini Apps](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [Base Build Preview](https://base.dev/preview)
- [Wagmi Documentation](https://wagmi.sh)
