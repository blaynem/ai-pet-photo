# Photoshot

Copied from an open-source AI avatar generator web app

[![Photoshot](https://photoshot.app/og-cover.jpg)
](https://user-images.githubusercontent.com/1102595/206658000-d349ef06-e4f2-4626-9deb-6c8a246f7553.mp4)

## Stack

- ▲ [Next.js](https://nextjs.org/) for webapp
- 🖼 [Chakra UI](https://chakra-ui.com/) for UI components
- 🧠 [Replicate](https://replicate.com/), a platform for running machine learning models in the cloud
- 💰 [Stripe](https://stripe.com/) for payments
- 👩‍🎨 [Stable Diffusion](https://replicate.com/stability-ai/stable-diffusion) an open-source text-to-image generation model

## Getting Started

Install dependencies:

```bash
yarn install
```

Setup environment variables:

```bash
cp .env.example .env.local
```

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## TODO:

Create a bunch of templates like profilepicture.ai does.

Change naming conventions:
- `studio` to `model`
- `shot` to `image`

Setup these Accounts:
- DATABASE_URL=
- NEXTAUTH_URL=
- NEXT_PUBLIC_URL=
- S3_UPLOAD_KEY=
- S3_UPLOAD_SECRET=
- S3_UPLOAD_BUCKET=
- S3_UPLOAD_REGION=
- REPLICATE_API_TOKEN=
- REPLICATE_USERNAME=
- SECRET=
- EMAIL_FROM=
- EMAIL_SERVER=smtp://localhost:1080
- STRIPE_SECRET_KEY=
- NEXT_PUBLIC_STRIPE_API_KEY=
- NEXT_PUBLIC_STRIPE_STUDIO_PRICE=
- NEXT_PUBLIC_STUDIO_SHOT_AMOUNT=
