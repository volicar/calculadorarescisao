'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { getBlogPost, getRelatedPosts } from '@/data/blogPosts';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Clock, Tag, Share2, Copy } from 'lucide-react';
import { useState } from 'react';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = getBlogPost(slug);
  const relatedPosts = getRelatedPosts(slug);
  const [copied, setCopied] = useState(false);

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Artigo não encontrado</h1>
          <Link href="/blog">
            <Button variant="outline">Voltar ao Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post.title,
        text: post.description,
        url: window.location.href,
      });
    } catch (err) {
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  // Renderizar markdown simples
  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      line = line.trim();
      
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">{line.slice(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">{line.slice(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">{line.slice(4)}</h3>;
      } else if (line.startsWith('```')) {
        return null; // Ignorar por simplicidade
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        return <li key={index} className="text-gray-300 ml-4 mb-1">{line.slice(2)}</li>;
      } else if (line.startsWith('1. ') || line.match(/^\d+\. /)) {
        return <li key={index} className="text-gray-300 ml-4 mb-1 list-decimal">{line.replace(/^\d+\. /, '')}</li>;
      } else if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="text-gray-300 mb-3 leading-relaxed">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
            )}
          </p>
        );
      } else if (line.length > 0) {
        return <p key={index} className="text-gray-300 mb-3 leading-relaxed">{line}</p>;
      }
      return <br key={index} />;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
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
                  <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
                <div className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                  {post.category}
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {post.title}
              </h1>

              <p className="text-xl text-gray-300 leading-relaxed mb-6">
                {post.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <div key={tag} className="flex items-center space-x-1 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    <Tag className="w-3 h-3" />
                    <span>{tag}</span>
                  </div>
                ))}
              </div>

              {/* Botões de Compartilhar */}
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  {copied ? 'Copiado!' : 'Copiar Link'}
                </Button>
              </div>
            </div>

            {/* Conteúdo do Artigo */}
            <div className="prose prose-gray prose-lg max-w-none">
              {renderContent(post.content)}
            </div>

            {/* Autor */}
            <div className="border-t border-gray-700 pt-6 mt-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {post.author.charAt(0)}
                  </span>
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
                        <span>{new Date(relatedPost.date).toLocaleDateString('pt-BR')}</span>
                        <span>{relatedPost.readTime}</span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      
                      <p className="text-gray-300 text-sm">
                        {relatedPost.description}
                      </p>
                      
                      <div className="text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                        Ler artigo →
                      </div>
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* CTA Final */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-500/10 to-primary-600/10 border border-primary-500/20 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Gostou do Artigo? Calcule sua Rescisão!
          </h2>
          <p className="text-gray-300 mb-6">
            Use nossa calculadora gratuita e descubra exatamente quanto você tem direito a receber.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-primary-500 hover:bg-primary-600">
              Calcular Rescisão Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}