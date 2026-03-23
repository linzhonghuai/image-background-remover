interface Env {
  JWT_SECRET: string;
}

interface SessionRequestBody {
  token: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;
  const method = request.method;

  // 处理 OPTIONS 预检请求
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  // GET - 验证会话
  if (method === 'GET') {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.substring(7);
    const payload = await verifyToken(token, env.JWT_SECRET);

    if (!payload) {
      return new Response(JSON.stringify({ user: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = {
      id: payload.userId,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    return new Response(JSON.stringify({ user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // POST - 创建会话（验证 token 并返回用户信息）
  if (method === 'POST') {
    try {
      const body: SessionRequestBody = await request.json();
      const { token } = body;

      if (!token) {
        return new Response(JSON.stringify({ error: 'Missing token' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const payload = await verifyToken(token, env.JWT_SECRET);

      if (!payload) {
        return new Response(JSON.stringify({ error: 'Invalid token' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const user = {
        id: payload.userId,
        email: payload.email,
        name: payload.name,
        picture: payload.picture,
      };

      return new Response(JSON.stringify({ user }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // DELETE - 删除会话
  if (method === 'DELETE') {
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // 其他方法不支持
  return new Response('Method not allowed', { status: 405 });
}

// JWT 验证函数
async function verifyToken(token: string, secret: string): Promise<any> {
  try {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    const data = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await sign(data, secret);

    if (signature !== expectedSignature) {
      return null;
    }

    const payload = JSON.parse(atob(encodedPayload));

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

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
  const signatureArray = Array.from(new Uint8Array(signature));

  return btoa(String.fromCharCode(...signatureArray))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
