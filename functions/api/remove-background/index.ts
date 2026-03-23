interface Env {
  REMOVEBG_API_KEY: string;
}

export async function onRequest(context: { request: Request; env: Env }) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return new Response(JSON.stringify({ error: '未提供图片文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: '不支持的图片格式。请使用 JPG、PNG、WebP 或 GIF 格式' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const maxSize = 12 * 1024 * 1024;
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: '图片大小超过限制。最大支持 12MB' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: '服务器配置错误：未设置 Remove.bg API 密钥' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', file);
    removeBgFormData.append('size', 'auto');

    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: { 'X-Api-Key': apiKey },
      body: removeBgFormData,
    });

    if (!response.ok) {
      let errorMessage = '背景移除失败';
      if (response.status === 401) errorMessage = 'API 密钥无效';
      else if (response.status === 402) errorMessage = 'API 配额已用完，请充值';
      else if (response.status === 403 || response.status === 429) errorMessage = '请求过于频繁，请稍后再试';
      else if (response.status === 413) errorMessage = '图片过大';

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const blob = await response.blob();
    return new Response(blob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-background.png"',
      },
    });

  } catch (error) {
    return new Response(
      JSON.stringify({
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
