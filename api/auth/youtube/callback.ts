// pages/api/auth/youtube/callback.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ifqmauakhfchtuycszyk.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const DEPLOY_URL = 'https://youtube-auto-upload.vercel.app';
const REDIRECT_URI = `${DEPLOY_URL}/api/auth/youtube/callback`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code missing' });
  }

  // Google’dan token olish
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: code as string,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
    }),
  });

  const tokens = await tokenRes.json();

  if (!tokens.refresh_token) {
    return res.status(400).json({
      error: 'No refresh_token! Ruxsat berishda xatolik yoki noto‘g‘ri hisob.',
      details: tokens
    });
  }

  // Supabase’ga saqlash
  const { error } = await supabase
    .from('youtube_tokens')
    .upsert({ id: 1, refresh_token: tokens.refresh_token }, { onConflict: 'id' });

  if (error) {
    return res.status(500).json({ error: 'Supabase xatosi: ' + error.message });
  }

  res.status(200).json({
    success: true,
    message: '✅ Muvaffaqiyatli! YouTube refresh_token saqlandi.',
    preview: tokens.refresh_token.substring(0, 20) + '...'
  });
}
