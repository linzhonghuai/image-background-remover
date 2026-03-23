/**
 * Cloudflare Worker API for Background Remover
 * 处理用户配额、使用记录等数据库操作
 */

import { Router } from 'itty-router';

const router = Router();

// CORS 预检请求
router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
});

// 健康检查
router.get('/health', () => {
  return Response.json({ status: 'ok', timestamp: Date.now() });
});

/**
 * 获取用户配额
 * GET /api/quota
 */
router.get('/api/quota', async (request, env) => {
  try {
    const session = getSession(request);
    if (!session?.userId) {
      // 未登录用户：返回 localStorage 配额信息
      return Response.json({
        used: 0,
        total: 5,
        resetDate: getNextDay(),
        plan: 'free',
        isLoggedIn: false,
      });
    }

    // 查询用户配额
    const quota = await env.DB.prepare(`
      SELECT used, total, reset_date, plan
      FROM quotas
      WHERE user_id = ?
    `).bind(session.userId).first();

    if (!quota) {
      // 创建新用户配额
      const resetDate = getNextMonth();
      await env.DB.prepare(`
        INSERT INTO quotas (user_id, used, total, reset_date, plan)
        VALUES (?, 0, 10, ?, 'free')
      `).bind(session.userId, resetDate).run();

      return Response.json({
        used: 0,
        total: 10,
        resetDate,
        plan: 'free',
        isLoggedIn: true,
      });
    }

    // 检查是否需要重置配额
    const now = new Date();
    const resetDate = new Date(quota.reset_date);

    if (now >= resetDate) {
      // 重置配额
      const newResetDate = getNextMonth();
      await env.DB.prepare(`
        UPDATE quotas
        SET used = 0, reset_date = ?
        WHERE user_id = ?
      `).bind(newResetDate.toISOString(), session.userId).run();

      return Response.json({
        used: 0,
        total: quota.total,
        resetDate: newResetDate.toISOString(),
        plan: quota.plan,
        isLoggedIn: true,
      });
    }

    return Response.json({
      used: quota.used,
      total: quota.total,
      resetDate: quota.reset_date,
      plan: quota.plan,
      isLoggedIn: true,
    });
  } catch (error) {
    console.error('Error fetching quota:', error);
    return Response.json({ error: 'Failed to fetch quota' }, { status: 500 });
  }
});

/**
 * 记录使用
 * POST /api/usage
 */
router.post('/api/usage', async (request, env) => {
  try {
    const session = getSession(request);
    if (!session?.userId) {
      // 未登录用户不记录
      return Response.json({ success: false, message: 'Not logged in' });
    }

    // 检查配额
    const quota = await env.DB.prepare(`
      SELECT used, total, reset_date
      FROM quotas
      WHERE user_id = ?
    `).bind(session.userId).first();

    if (!quota) {
      return Response.json({ error: 'Quota not found' }, { status: 404 });
    }

    // 检查是否需要重置
    const now = new Date();
    const resetDate = new Date(quota.reset_date);
    if (now >= resetDate) {
      // 重置配额
      await env.DB.prepare(`
        UPDATE quotas
        SET used = 0, reset_date = ?
        WHERE user_id = ?
      `).bind(getNextMonth().toISOString(), session.userId).run();
    }

    // 增加使用次数
    await env.DB.prepare(`
      UPDATE quotas
      SET used = used + 1
      WHERE user_id = ?
    `).bind(session.userId).run();

    // 记录使用详情
    const recordId = crypto.randomUUID();
    const body = await request.json().catch(() => ({}));
    await env.DB.prepare(`
      INSERT INTO usage_records (id, user_id, image_size, resolution_mp, status)
      VALUES (?, ?, ?, ?, 'completed')
    `).bind(
      recordId,
      session.userId,
      body.imageSize || null,
      body.resolutionMp || null
    ).run();

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error recording usage:', error);
    return Response.json({ error: 'Failed to record usage' }, { status: 500 });
  }
});

/**
 * 同步/创建用户
 * POST /api/sync-user
 */
router.post('/api/sync-user', async (request, env) => {
  try {
    const session = getSession(request);
    if (!session?.userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { googleId, email, name, picture } = body;

    // 检查用户是否存在
    const existingUser = await env.DB.prepare(`
      SELECT id FROM users WHERE google_id = ?
    `).bind(googleId).first();

    let userId;
    if (!existingUser) {
      // 创建新用户
      userId = crypto.randomUUID();
      await env.DB.prepare(`
        INSERT INTO users (id, google_id, email, name, picture, plan)
        VALUES (?, ?, ?, ?, ?, 'free')
      `).bind(userId, googleId, email, name, picture).run();

      // 创建配额
      await env.DB.prepare(`
        INSERT INTO quotas (user_id, used, total, reset_date, plan)
        VALUES (?, 0, 10, ?, 'free')
      `).bind(userId, getNextMonth().toISOString()).run();
    } else {
      userId = existingUser.id;
    }

    return Response.json({ success: true, userId });
  } catch (error) {
    console.error('Error syncing user:', error);
    return Response.json({ error: 'Failed to sync user' }, { status: 500 });
  }
});

// 辅助函数
function getSession(request: Request): { userId: string } | null {
  const cookie = request.headers.get('Cookie');
  if (!cookie) return null;

  const sessionMatch = cookie.match(/user_session=([^;]+)/);
  if (!sessionMatch) return null;

  try {
    const session = JSON.parse(atob(sessionMatch[1]));
    return { userId: session.userId || session.sub };
  } catch {
    return null;
  }
}

function getNextDay(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

function getNextMonth(): string {
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);
  nextMonth.setDate(1);
  nextMonth.setHours(0, 0, 0, 0);
  return nextMonth.toISOString();
}

// 404 处理
router.all('*', () => Response.json({ error: 'Not found' }, { status: 404 }));

// 导出 Worker
export default {
  fetch: (request: Request, env: any, ctx: any) => {
    return router.handle(request, env, ctx).catch((error) => {
      console.error('Worker error:', error);
      return Response.json({ error: 'Internal server error' }, { status: 500 });
    });
  },
};
