// 配额管理系统 (使用 localStorage，适配静态导出)
export interface UserQuota {
  used: number;
  total: number;
  resetDate: Date;
  plan: 'free' | 'pro' | 'business';
  isLoggedIn: boolean;
}

const QUOTA_KEY = 'image_remover_quota';
const QUOTA_VERSION = 'v1';

// 获取今日日期字符串
function getTodayKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

// 获取本月日期字符串
function getMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}`;
}

// 从 localStorage 获取配额数据
function getStoredQuota(): { used: number; date: string } | null {
  try {
    const data = localStorage.getItem(QUOTA_KEY);
    if (!data) return null;

    const parsed = JSON.parse(data);
    // 检查版本和日期
    if (parsed.version !== QUOTA_VERSION) return null;

    return parsed;
  } catch (error) {
    console.error('Failed to parse stored quota:', error);
    return null;
  }
}

// 保存配额数据到 localStorage
function setStoredQuota(used: number, date: string): void {
  try {
    localStorage.setItem(QUOTA_KEY, JSON.stringify({
      version: QUOTA_VERSION,
      used,
      date,
    }));
  } catch (error) {
    console.error('Failed to store quota:', error);
  }
}

// 获取用户配额
export async function getUserQuota(): Promise<UserQuota> {
  // 从 sessionStorage 检查登录状态
  const sessionStr = sessionStorage.getItem('user_session');
  const isLoggedIn = !!sessionStr;

  // 根据登录状态设置不同的配额
  const total = isLoggedIn ? 10 : 5; // 登录用户 10 次/月，未登录 5 次/天
  const plan: UserQuota['plan'] = 'free';

  // 获取存储的配额数据
  const stored = getStoredQuota();
  const todayKey = getTodayKey();
  const monthKey = getMonthKey();

  let used = 0;
  let resetDate = new Date();

  if (stored) {
    // 检查是否需要重置
    if (isLoggedIn) {
      // 登录用户：按月重置
      if (stored.date.startsWith(monthKey)) {
        used = stored.used;
      }
      // 设置为下个月1号
      resetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    } else {
      // 未登录用户：按天重置
      if (stored.date === todayKey) {
        used = stored.used;
      }
      // 设置为明天
      resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 1);
    }
  } else {
    // 首次使用，设置重置时间
    if (isLoggedIn) {
      resetDate = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    } else {
      resetDate = new Date();
      resetDate.setDate(resetDate.getDate() + 1);
    }
  }

  return {
    used,
    total,
    resetDate,
    plan,
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
  const quota = await getUserQuota();
  const isLoggedIn = quota.isLoggedIn;

  const stored = getStoredQuota();
  const todayKey = getTodayKey();
  const monthKey = getMonthKey();

  let newUsed = (stored?.used || 0) + 1;
  let newDate = isLoggedIn ? monthKey : todayKey;

  // 检查是否需要重置计数
  if (stored) {
    if (isLoggedIn) {
      // 登录用户：检查是否跨月
      if (!stored.date.startsWith(monthKey)) {
        newUsed = 1;
        newDate = monthKey;
      }
    } else {
      // 未登录用户：检查是否跨天
      if (stored.date !== todayKey) {
        newUsed = 1;
        newDate = todayKey;
      }
    }
  }

  setStoredQuota(newUsed, newDate);
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
