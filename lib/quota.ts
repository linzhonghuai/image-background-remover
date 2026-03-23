// 配额管理系统 (使用 Cloudflare D1 + Workers API，localStorage 作为降级方案)
export interface UserQuota {
  used: number;
  total: number;
  resetDate: Date;
  plan: 'free' | 'pro' | 'business';
  isLoggedIn: boolean;
}

const API_BASE = '/api'; // Cloudflare Workers 路径
const QUOTA_KEY = 'image_remover_quota_fallback';

// 获取用户配额
export async function getUserQuota(): Promise<UserQuota> {
  try {
    const response = await fetch(`${API_BASE}/quota`);
    if (response.ok) {
      const data = await response.json();
      return {
        used: data.used,
        total: data.total,
        resetDate: new Date(data.resetDate),
        plan: data.plan,
        isLoggedIn: data.isLoggedIn,
      };
    }
  } catch (error) {
    console.error('Failed to fetch quota from API, falling back to localStorage:', error);
  }

  // 降级到 localStorage（API 失败时的备用方案）
  return getLocalQuota();
}

// 从 localStorage 获取配额（降级方案）
function getLocalQuota(): UserQuota {
  const sessionStr = sessionStorage.getItem('user_session');
  const isLoggedIn = !!sessionStr;
  const total = isLoggedIn ? 10 : 5;

  try {
    const data = localStorage.getItem(QUOTA_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      const now = new Date();
      const resetDate = new Date(parsed.resetDate);

      // 检查是否需要重置
      if (now >= resetDate) {
        // 重置配额
        const newResetDate = isLoggedIn
          ? new Date(now.getFullYear(), now.getMonth() + 1, 1)
          : new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        localStorage.setItem(QUOTA_KEY, JSON.stringify({
          used: 0,
          resetDate: newResetDate.toISOString(),
        }));

        return {
          used: 0,
          total,
          resetDate: newResetDate,
          plan: 'free',
          isLoggedIn,
        };
      }

      return {
        used: parsed.used || 0,
        total,
        resetDate,
        plan: 'free',
        isLoggedIn,
      };
    }
  } catch (error) {
    console.error('Failed to parse local quota:', error);
  }

  // 默认配额
  const resetDate = isLoggedIn
    ? new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
    : new Date(new Date().setDate(new Date().getDate() + 1));

  return {
    used: 0,
    total,
    resetDate,
    plan: 'free',
    isLoggedIn,
  };
}

// 检查是否可以使用
export async function canProcessImage(): Promise<{ canUse: boolean; reason?: string; remaining?: number }> {
  const quota = await getUserQuota();

  if (quota.used >= quota.total) {
    return {
      canUse: false,
      reason: 'quota_exceeded',
      remaining: 0,
    };
  }

  return {
    canUse: true,
    remaining: quota.total - quota.used,
  };
}

// 记录使用
export async function recordUsage(): Promise<void> {
  try {
    const response = await fetch(`${API_BASE}/usage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      return; // API 记录成功
    }
  } catch (error) {
    console.error('Failed to record usage via API, falling back to localStorage:', error);
  }

  // 降级到 localStorage 记录
  const quota = await getUserQuota();
  const isLoggedIn = quota.isLoggedIn;

  try {
    const data = localStorage.getItem(QUOTA_KEY);
    const now = new Date();
    let used = 1;
    let resetDate: Date;

    if (isLoggedIn) {
      resetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    } else {
      resetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    }

    if (data) {
      const parsed = JSON.parse(data);
      const storedReset = new Date(parsed.resetDate);

      if (now < storedReset) {
        used = (parsed.used || 0) + 1;
        resetDate = storedReset;
      }
    }

    localStorage.setItem(QUOTA_KEY, JSON.stringify({
      used,
      resetDate: resetDate.toISOString(),
    }));
  } catch (error) {
    console.error('Failed to record usage to localStorage:', error);
  }
}

// 获取套餐配额配置
export function getPlanConfig(plan: UserQuota['plan']) {
  const configs = {
    free: {
      total: 10,
      maxResolution: 5, // MP
    },
    pro: {
      total: 100,
      maxResolution: 25, // MP
    },
    business: {
      total: 500,
      maxResolution: 50, // MP
    },
  };

  return configs[plan] || configs.free;
}
