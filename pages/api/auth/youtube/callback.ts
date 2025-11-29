// pages/api/auth/youtube/callback.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
const DEPLOY_URL = process.env.DEPLOY_URL!;
const REDIRECT_URI = `${DEPLOY_URL}/api/auth/youtube/callback`;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const code = req.query.code as string;

    if (!code) return res.status(400).json({ error: "code missing" });

    // TOKEN OLYAPMIZ
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokens = await tokenRes.json();

    if (!tokens.refresh_token) {
      return res.status(400).json({
        error: "⚠️ refresh_token qaytmadi. Ruxsat berish oynasida 'Allow' bosdingizmi?",
        googleMessage: tokens,
      });
    }

    // SUPABASEga SAQLAYAPMIZ
    const { error } = await supabase
      .from("youtube_tokens")
      .upsert(
        {
          id: 1,
          refresh_token: tokens.refresh_token,
        },
        { onConflict: "id" }
      );

    if (error) throw new Error(error.message);

    res.status(200).json({
      success: true,
      message: "🎉 refresh_token saqlandi!",
      preview: tokens.refresh_token.substring(0, 20) + "...",
    });
  } catch (err: any) {
    res.status(500).json({
      error: "Server error",
      details: err.message,
    });
  }
        }
