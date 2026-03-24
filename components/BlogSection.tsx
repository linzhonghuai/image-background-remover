'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FolderOpen, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/useLanguage';

export default function BlogSection() {
  const { t } = useLanguage();

  const articles = [
    {
      slug: 'background-removal-ecommerce',
      title: t.blog.article1.title,
      excerpt: t.blog.article1.excerpt,
      date: t.blog.article1.date,
      category: t.blog.article1.category,
      readMore: t.blog.article1.readMore,
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    },
    {
      slug: 'design-perfect-ads',
      title: t.blog.article2.title,
      excerpt: t.blog.article2.excerpt,
      date: t.blog.article2.date,
      category: t.blog.article2.category,
      readMore: t.blog.article2.readMore,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
    },
    {
      slug: 'ai-background-removal-technology',
      title: t.blog.article3.title,
      excerpt: t.blog.article3.excerpt,
      date: t.blog.article3.date,
      category: t.blog.article3.category,
      readMore: t.blog.article3.readMore,
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    },
  ];

  return (
    <section className="py-16 px-4 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t.blog.title}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.blog.subtitle}
          </p>
        </motion.div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={article.date}>{article.date}</time>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read More Link */}
                <a
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold hover:gap-3 transition-all"
                >
                  {article.readMore}
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
