// JWT 配置
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_ISSUER = 'purebgremover.com';

export interface JWTPayload {
  userId: string;
  email: string;
  name: string;
  picture?: string;
  exp: number;
  iat: number;
}

// 生成 JWT token
export async function generateToken(payload: Omit<JWTPayload, 'exp' | 'iat'>): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const tokenPayload: JWTPayload = {
    ...payload,
    exp: now + 7 * 24 * 60 * 60, // 7 天过期
    iat: now,
  };

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(tokenPayload));

  const data = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(data, JWT_SECRET);

  return `${data}.${signature}`;
}

// 验证 JWT token
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await sign(data, JWT_SECRET);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload: JWTPayload = JSON.parse(atob(encodedPayload));

    // 检查是否过期
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

// HMAC-SHA256 签名
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

  const signature = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    messageData
  );

  const signatureArray = Array.from(new Uint8Array(signature));
  const signatureString = btoa(String.fromCharCode(...signatureArray));

  // 转换为 URL-safe base64
  return signatureString.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
