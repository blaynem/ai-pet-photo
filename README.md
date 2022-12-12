# Photoshot

Copied from Photoshot, an open-source AI avatar generator web app

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

- Create business name, and LLC? kms
- Decide on App name

Create a bunch of templates like profilepicture.ai does.

- Also create a cool builder tool for them to add their own templates. Throw that under customization or something paid.

Change naming conventions:

- `studio` to `model`
- `shot` to `image`
- `photoshot` to idk yet

**Setup the Supabase magic link auth.** -https://next-auth.js.org/providers/email

- Refactor the @core/db piece.
  Upload.tsx needs to upload
  api/projects needs to fetch the bucket
  api/projects[id] needs to fetch the bucket too

Need to set up Domain and DNS records before we can send emails

- I AM SO BORED OF THIS, I WANT TO MAKE THE OTHER THINGS WORK FIRST. I WILL COME BACK
- Use sendgrid once we have a domain name

Setup Stripe Pricing:

- NEXT_PUBLIC_STRIPE_STUDIO_PRICE= Set to $14.99 for now.
- NEXT_PUBLIC_STUDIO_SHOT_AMOUNT= Set to max of 50 for now.

Security:

- Add row level security to the database's storage so people can't alter things!
- There are under storage/policies in supabase
- We need to only allow users to view their own bucket
