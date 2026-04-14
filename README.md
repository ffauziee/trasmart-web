This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel (Free)

Follow these steps to deploy for free on the [Vercel Hobby tier](https://vercel.com/pricing):

### 1. Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Fill in:
   - **Application name**: `trasmart-web` (or anything you like)
   - **Homepage URL**: `https://<your-vercel-domain>` (update after deploy)
   - **Authorization callback URL**: `https://<your-vercel-domain>/api/auth/callback/github`
3. Save the generated **Client ID** and **Client Secret**.

### 2. Deploy to Vercel

1. Create a free account at <https://vercel.com>.
2. Click **Add New → Project** and import `ffauziee/trasmart-web` from GitHub.
3. Keep all build settings at their defaults (Next.js is detected automatically).
4. Under **Environment Variables**, add the following (see `.env.example` for reference):

   | Name | Value |
   |------|-------|
   | `GITHUB_ID` | Client ID from step 1 |
   | `GITHUB_SECRET` | Client Secret from step 1 |
   | `NEXTAUTH_URL` | `https://<your-vercel-domain>` |
   | `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` to generate |

5. Click **Deploy**.

### 3. Update the GitHub OAuth App callback URL

After deployment Vercel will give you a URL like `https://trasmart-web-xxxx.vercel.app`.  
Go back to your GitHub OAuth App and update both **Homepage URL** and **Authorization callback URL** with that domain.

### 4. Verify

- Homepage loads at your Vercel URL.
- `/api/auth/signin` shows the GitHub sign-in button.
- GitHub sign-in completes successfully.

### Local development

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Then run the dev server:

```bash
npm run dev
```
