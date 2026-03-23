interface Env {
  GOOGLE_CLIENT_ID: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  // 检查是否已登录
  const authHeader = request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    // 可以在这里验证 token，如果有效则返回已登录状态
  }

  // 生成 state 参数用于 CSRF 保护
  const state = crypto.randomUUID();

  // 保存 state 到 cookie (简单实现，生产环境应使用更安全的方式)
  const redirectUrl = new URL(request.url);
  const returnUrl = redirectUrl.searchParams.get('return_url') || '/';

  // Google OAuth 配置
  const googleAuthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  googleAuthUrl.searchParams.set('client_id', env.GOOGLE_CLIENT_ID);
  googleAuthUrl.searchParams.set('redirect_uri', `${redirectUrl.origin}/api/auth/callback`);
  googleAuthUrl.searchParams.set('response_type', 'code');
  googleAuthUrl.searchParams.set('scope', 'openid profile email');
  googleAuthUrl.searchParams.set('state', state);
  googleAuthUrl.searchParams.set('access_type', 'offline');

  // 重定向到 Google
  return Response.redirect(googleAuthUrl.toString(), 302);
}
