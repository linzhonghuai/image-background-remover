import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface RemoveBgResponse {
  data: {
    result_b64: string;
  };
  errors?: Array<{
    title: string;
    detail: string;
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '未提供图片文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '不支持的图片格式。请使用 JPG、PNG、WebP 或 GIF 格式' },
        { status: 400 }
      );
    }

    // 验证文件大小（Remove.bg 限制：免费版 12MB，付费版 25MB）
    const maxSize = 12 * 1024 * 1024; // 12MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: '图片大小超过限制。最大支持 12MB' },
        { status: 400 }
      );
    }

    // 获取 API 密钥
    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: '服务器配置错误：未设置 Remove.bg API 密钥' },
        { status: 500 }
      );
    }

    // 准备发送到 Remove.bg 的表单数据
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', file);
    removeBgFormData.append('size', 'auto'); // 自动调整输出大小

    // 调用 Remove.bg API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey,
      },
      body: removeBgFormData,
    });

    // 检查 API 错误
    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = '背景移除失败';

      if (response.status === 401) {
        errorMessage = 'API 密钥无效';
      } else if (response.status === 402) {
        errorMessage = 'API 配额已用完，请充值';
      } else if (response.status === 403 || response.status === 429) {
        errorMessage = '请求过于频繁，请稍后再试';
      } else if (response.status === 413) {
        errorMessage = '图片过大';
      }

      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      );
    }

    // 获取处理后的图片（PNG 格式）
    const blob = await response.blob();

    // 返回图片数据
    return new NextResponse(blob, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="removed-background.png"',
      },
    });

  } catch (error) {
    console.error('Background removal error:', error);
    return NextResponse.json(
      {
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : '未知错误'
      },
      { status: 500 }
    );
  }
}
