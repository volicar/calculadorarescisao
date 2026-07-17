// app/sitemap.js
import { blogPosts } from '@/data/blogPosts';

export default function sitemap() {
  const baseUrl = 'https://www.rescisaonline.com.br';

  const staticRoutes = ['', '/blog', '/sobre'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : 0.8,
  }));

  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.id}`,
    lastModified: new Date(post.date).toISOString(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes];
}
