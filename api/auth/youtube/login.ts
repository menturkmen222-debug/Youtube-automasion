// pages/api/auth/youtube/login.ts
import { NextApiRequest, NextApiResponse } from 'next';

// Vercel deploy URL — O'ZINGIZNI URLINGIZGA O'ZGARTIRING!
const DEPLOY_URL = 'https://automasion-tm.vercel.app';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const REDIRECT_URI = `${DEPLOY_URL}/api/auth/youtube/callback`;
const SCOPE = 'https://www.googleapis.com/auth/youtube.upload';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPE)}` +
    `&response_type=code` +
    `&access_type=offline` +
    `&prompt=consent`;

  res.redirect(authUrl);
}
