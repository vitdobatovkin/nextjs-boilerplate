# Based Me - Base App Mini App

A fun "How based are you in 2026?" spinner game with wallet connection and Base App integration.

## Features

- 🎰 Interactive spinner game
- 🔗 Wallet connection (MetaMask, Base Wallet, etc.)
- 📱 Base App Mini App ready
- 🎨 Beautiful UI with confetti animations

## Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

**Note:** If you encounter peer dependency conflicts with React versions, use:
```bash
npm install --legacy-peer-deps
```

### 2. Set Up Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_ROOT_URL=https://based-me.vercel.app
```

Optional (for WalletConnect support):
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Base App Integration

### Step 1: Deploy to Vercel

1. Push your code to GitHub
2. Deploy to Vercel: [https://vercel.com](https://vercel.com)
3. Make sure your domain is accessible

### Step 2: Configure Manifest

1. Update `minikit.config.ts` with your app details
2. Add screenshots, icons, and images to `public/` folder:
   - `screenshot-portrait.png` (required)
   - `icon.png` (required)
   - `splash.png` (required)
   - `hero.png` (optional)
   - `og-image.png` (optional)

### Step 3: Associate Account

1. Go to [Base Build Account Association Tool](https://base.dev/preview)
2. Enter your app URL (e.g., `https://based-me.vercel.app`)
3. Click "Verify" and follow instructions
4. Copy the `accountAssociation` object
5. Update `minikit.config.ts` with the `accountAssociation` credentials

### Step 4: Test Your App

1. Go to [base.dev/preview](https://base.dev/preview)
2. Add your app URL
3. Test the embed and launch functionality
4. Verify account association in the "Account association" tab

### Step 5: Publish

1. Create a post in Base App with your app's URL
2. Your mini app will be available in Base App!

## Project Structure

```
├── app/
│   ├── .well-known/
│   │   └── farcaster.json/route.ts  # Base App manifest endpoint
│   ├── api/
│   │   └── webhook/route.ts         # Webhook handler for Base App
│   ├── components/
│   │   └── wallet-button.tsx        # Wallet connection button
│   ├── layout.tsx                    # Root layout with wallet provider
│   ├── page.tsx                     # Main game page
│   └── wallet-provider.tsx          # Wagmi wallet provider
├── minikit.config.ts                 # Base App configuration
└── public/                           # Static assets
```

## Learn More

- [Base App Mini Apps Documentation](https://docs.base.org/mini-apps/quickstart/create-new-miniapp)
- [Wagmi Documentation](https://wagmi.sh)
- [Next.js Documentation](https://nextjs.org/docs)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Make sure to:
1. Set `NEXT_PUBLIC_ROOT_URL` environment variable in Vercel
2. Disable Deployment Protection for account association
3. Deploy to production branch
