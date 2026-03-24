import { Metadata } from 'next';
import { Calendar, User, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: '设计师必备：如何用AI抠图制作完美广告素材 | PureBG Remover',
  description: '掌握AI抠图技巧，快速制作专业的广告设计素材。从社交媒体图片到大型广告牌，提升设计效率。',
};

export default function BlogPost2() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
            设计
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            2024-03-10
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            10 分钟阅读
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          设计师必备：如何用AI抠图制作完美广告素材
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
          在快节奏的设计工作中，AI抠图工具可以大幅提升你的工作效率。
          本文将分享从基础到进阶的实用技巧，助你快速制作专业的广告素材。
        </p>
      </header>

      {/* Featured Image */}
      <div className="mb-12 rounded-2xl overflow-hidden shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop"
          alt="AI抠图在设计中的应用"
          className="w-full h-auto"
        />
      </div>

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            为什么设计师需要AI抠图工具？
          </h2>
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>
              传统抠图方法是设计师最耗时的工作之一：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>钢笔工具抠图：精细但极其耗时，一张复杂图片可能需要数小时</li>
              <li>魔棒工具：适合简单背景，但对复杂场景效果不佳</li>
              <li>通道抠图：技术门槛高，新手难以掌握</li>
            </ul>
            <p className="mt-4">
              而AI抠图工具能够：
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>秒级处理：</strong>点击即用，立即获得透明背景</li>
              <li><strong>高精度识别：</strong>准确区分主体与背景，保留发丝等细节</li>
              <li><strong>批量处理：</strong>一次性处理数十张图片</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            广告设计实战案例
          </h2>

          <div className="space-y-8">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-300 mb-4">
                案例 1：社交媒体广告
              </h3>
              <p className="text-purple-800 dark:text-purple-200 mb-4">
                Facebook、Instagram 广告要求视觉冲击力强。使用AI抠图后：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-purple-800 dark:text-purple-200">
                <li>产品主体突出，快速吸引注意力</li>
                <li>灵活更换背景以匹配品牌色调</li>
                <li>添加动态效果，提升互动率</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-300 mb-4">
                案例 2：Banner横幅广告
              </h3>
              <p className="text-blue-800 dark:text-blue-200 mb-4">
                网站Banner需要多产品组合展示：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-blue-800 dark:text-blue-200">
                <li>快速抠取多个产品，自由组合构图</li>
                <li>统一尺寸，确保视觉平衡</li>
                <li>添加文字和促销信息，提升点击率</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 p-8 rounded-2xl">
              <h3 className="text-2xl font-bold text-orange-900 dark:text-orange-300 mb-4">
                案例 3：产品宣传册
              </h3>
              <p className="text-orange-800 dark:text-orange-200 mb-4">
                印刷品设计需要高质量输出：
              </p>
              <ul className="list-disc pl-6 space-y-2 text-orange-800 dark:text-orange-200">
                <li>保持高分辨率，确保印刷清晰</li>
                <li>透明背景便于后期排版调整</li>
                <li>批量处理产品线图片，风格统一</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            进阶技巧：让抠图效果更专业
          </h2>

          <div className="space-y-6">
            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                1. 边缘优化
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                抠图后使用"调整边缘"功能，让边缘更加自然柔和，
                避免生硬的切边感。特别是对于头发、毛绒等物体。
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                2. 添加阴影
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                为抠图对象添加投影或阴影，增强立体感和真实感。
                阴影的模糊度和透明度需要根据场景光线调整。
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                3. 色彩校正
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                根据新背景的环境光线调整抠图对象的色彩平衡，
                让整体画面更加和谐统一。
              </p>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                4. 使用高质量的PNG格式
              </h3>
              <p className="text-gray-700 dark:text-gray-300">
                保存时选择PNG-24格式，确保透明度和图像质量。
                对于网络使用，可以适当压缩以优化加载速度。
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            常见设计场景应用
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">🛍️</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                电商产品图
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                快速制作白底图、场景图，提升产品吸引力
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                APP界面设计
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                为移动应用制作图标、插图和UI元素
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">🎬</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                视频制作
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                为视频素材移除背景，方便后期合成
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                演示文稿
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                制作专业的PPT素材，提升演示效果
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            工具对比：选择最适合你的方案
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="p-4 text-left text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">
                    特性
                  </th>
                  <th className="p-4 text-left text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">
                    AI抠图工具
                  </th>
                  <th className="p-4 text-left text-gray-900 dark:text-white border-b-2 border-gray-200 dark:border-gray-700">
                    手动抠图
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700">
                    处理速度
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-green-600">
                    ⚡ 秒级
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-red-600">
                    ⏰ 分钟到小时
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700">
                    学习成本
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-green-600">
                    🟢 零门槛
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-red-600">
                    🔴 需要专业训练
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700">
                    批量处理
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-green-600">
                    ✅ 支持
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-red-600">
                    ❌ 不现实
                  </td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700">
                    成本
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-green-600">
                    💰 低成本
                  </td>
                  <td className="p-4 border-b border-gray-200 dark:border-gray-700 text-yellow-600">
                    ⏱️ 时间成本高
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
            总结
          </h2>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl">
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
              AI抠图工具已经成熟到可以处理大多数设计场景的需求。
              对于设计师而言，掌握这类工具能够大幅提升工作效率，
              将更多时间投入到创意构思而非重复性操作上。
            </p>
            <p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed mb-6">
              开始使用AI抠图工具，让你的设计工作更加高效、专业！
            </p>
            <a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
            >
              免费尝试 AI 抠图
            </a>
          </div>
        </section>
      </div>

      {/* Author */}
      <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
            P
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">PureBG Team</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              发布于 2024年3月10日
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
}
