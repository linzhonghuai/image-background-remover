interface Env {
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  JWT_SECRET: string;
}

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  locale: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!code) {
      return new Response('Missing authorization code', { status: 400 });
    }

    // 交换授权码获取 token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: `${url.origin}/api/auth/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      return new Response(`Failed to exchange token: ${errorText}`, { status: 400 });
    }

    const tokenData: GoogleTokenResponse = await tokenResponse.json();

    // 获取用户信息
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });

    if (!userInfoResponse.ok) {
      return new Response('Failed to fetch user info', { status: 400 });
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    // 生成 JWT token
    const token = await generateToken(
      env.JWT_SECRET || 'default-secret',
      {
        userId: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        picture: userInfo.picture,
      }
    );

    // 重定向到首页，带上 token
    const redirectTo = `${url.origin}/?token=${token}`;
    return Response.redirect(redirectTo, 302);

  } catch (error) {
    console.error('OAuth callback error:', error);
    return new Response('Authentication failed', { status: 500 });
  }
}

// JWT 生成函数
async function generateToken(secret: string, payload: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload = {
    ...payload,
    exp: now + 7 * 24 * 60 * 60,
    iat: now,
  };

  const header = { alg: 'HS256', typ: 'JWT' };

  const encodedHeader = base64Url(JSON.stringify(header));
  const encodedPayload = base64Url(JSON.stringify(tokenPayload));

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(data, secret);

  return `${data}.${signature}`;
}

function base64Url(str: string): string {
  return btoa(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

async function sign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const messageData = encoder.encode(data);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));
  return btoa(String.fromCharCode(...signatureArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
