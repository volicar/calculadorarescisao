import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { blogPosts, getBlogPost, getRelatedPosts } from '@/data/blogPosts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Clock, Tag } from 'lucide-react';
import { GoogleAd } from '@/components/GoogleAd';
import { LeadGenCard } from '@/components/LeadGenCard';
import { JsonLd } from '@/components/JsonLd';
import { ShareButtons } from './ShareButtons';

const BASE_URL = 'https://www.rescisaonline.com.br';

// Gera todas as páginas de post estaticamente
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.id }));
}

// Metadata por post (title, description, OG, canonical) — antes o layout raiz servia
// o mesmo title para todos os artigos, prejudicando o SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Artigo não encontrado | Rescisão Online' };

  const url = `${BASE_URL}/blog/${post.id}`;
  return {
    title: `${post.title} | Rescisão Online`,
    description: post.description,
    keywords: post.tags.join(', '),
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      siteName: 'Rescisão Online',
      locale: 'pt_BR',
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      authors: [post.author],
    },
  };
}

// Renderiza markdown simples do conteúdo do post
const renderContent = (content: string) =>
  content.split('\n').map((raw, index) => {
    const line = raw.trim();
    if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
    if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>;
    if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>;
    if (line.startsWith('```')) return null;
    if (line.startsWith('> ')) return <p key={index} className="text-gray-300 border-l-2 border-primary-500/40 pl-4 italic my-3">{line.slice(2)}</p>;
    if (line.startsWith('- ') || line.startsWith('* ')) return <li key={index} className="text-gray-300 ml-4 mb-1">{line.slice(2)}</li>;
    if (line.match(/^\d+\. /)) return <li key={index} className="text-gray-300 ml-4 mb-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
    if (line.includes('**')) {
      const parts = line.split('**');
      return (
        <p key={index} className="text-gray-300 mb-3 leading-relaxed">
          {parts.map((part, i) => (i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part))}
        </p>
      );
    }
    if (line.length > 0) return <p key={index} className="text-gray-300 mb-3 leading-relaxed">{line}</p>;
    return <br key={index} />;
  });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(slug);
  const url = `${BASE_URL}/blog/${post.id}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: { '@type': 'Organization', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Rescisão Online',
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/metadata_og.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: `${BASE_URL}/metadata_og.png`,
    inLanguage: 'pt-BR',
  };

  return (
    <div className="grid-canvas min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <JsonLd data={articleSchema} />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Navegação */}
        <div className="mb-8">
          <Link href="/blog" className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao Blog
          </Link>
        </div>

        {/* Artigo Principal */}
        <article className="mb-12">
          <Card className="prose prose-invert max-w-none">
            {/* Header do Artigo */}
            <div className="border-b border-gray-700 pb-6 mb-8">
              <div className="flex flex-wrap items-center gap-4 mb-4 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date.split('-').reverse().join('/')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                  {post.category}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">{post.title}</h1>

              <p className="text-xl text-gray-300 leading-relaxed mb-6">{post.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-1 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>

              <ShareButtons title={post.title} description={post.description} />
            </div>

            {/* Conteúdo do Artigo */}
            <div className="prose prose-gray prose-lg max-w-none">{renderContent(post.content)}</div>

            {/* Anúncio no meio do artigo */}
            <div className="my-8">
              <GoogleAd slot="blogArtigo" format="rectangle" />
            </div>

            {/* Autor */}
            <div className="border-t border-gray-700 pt-6 mt-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-gray-900 font-bold text-lg">{post.author.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-white font-semibold">{post.author}</div>
                  <div className="text-gray-400 text-sm">Especialista em Direito Trabalhista</div>
                </div>
              </div>
            </div>
          </Card>
        </article>

        {/* Artigos Relacionados */}
        {relatedPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-white mb-6">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost.id} className="hover:border-primary-500 transition-all duration-300 group">
                  <Link href={`/blog/${relatedPost.id}`}>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{relatedPost.date.split('-').reverse().join('/')}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">{relatedPost.title}</h3>
                      <p className="text-gray-300 text-sm">{relatedPost.description}</p>
                      <div className="text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">Ler artigo →</div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Lead Gen no blog */}
        <LeadGenCard className="mt-8" />

        {/* CTA Final */}
        <div className="mt-8 text-center bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Gostou do Artigo? Calcule sua Rescisão!</h2>
          <p className="text-gray-300 mb-6">Use nossa calculadora gratuita e descubra exatamente quanto você tem direito a receber.</p>
          <Link href="/">
            <Button size="lg">Calcular Rescisão Agora</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
