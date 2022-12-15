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

Replicate Client:

- Actually split out the replicate API calls to the replicate class so we can call it easier.

Pipeline:

- Upload the image
- Training Pipeline (major 🔑)
- Prompt Pipeline (minor 🔑)

Better User Flow:

- Allow the naming of the studio, not only the subject.
- Enable a debug mode to change the training settings

Dreambooth:

- We should also flip the images to the opposite view as this allows us to double the training for free.
- Test how the frick it works?
- Setup the webhook completion. See: `webhook_completed` in `api/projects/[id]/train.

Bugs:

- Let user press 'x' to delete image they don't want before they upload it.
- Set image size limits + file types
- Under "My Studios" under "unlock now" button the images don't load.
- Enforce certain image files, unsure what they are but need to look.
- Set different buckets for the initial upload of photos, and the final output of the model. This will allow us to delete the initial bucket after the model is trained.

Create a bunch of templates like profilepicture.ai does.

- Also create a cool builder tool for them to add their own templates. Throw that under customization or something paid.

Change naming conventions:

- `studio` to `model`
- `shot` to `image`
- `photoshot` to idk yet

Need to set up Domain and DNS records before we can send emails

- I AM SO BORED OF THIS, I WANT TO MAKE THE OTHER THINGS WORK FIRST. I WILL COME BACK
- Use sendgrid once we have a domain name
- Create business name, and LLC? kms
- Decide on App name

Setup Stripe Pricing:

- Under api/checkout/session stripe lists the product descriptions, we will need to change those.
- Once we determine "Credits" that should also be added to api/projects/index fetch where we create the entry with 'credits' set to 50.
- NEXT_PUBLIC_STRIPE_STUDIO_PRICE= Set to $14.99 for now.
- NEXT_PUBLIC_STUDIO_SHOT_AMOUNT= Set to max of 50 for now.

Security:

- Add row level security to the database's storage so people can't alter things!
- There are under storage/policies in supabase
- We need to only allow users to view their own bucket

Replicate "train" modelStatus will have statuses "starting" of "pushing", and "succeeded"
