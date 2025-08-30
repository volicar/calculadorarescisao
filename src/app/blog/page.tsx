'use client';

import { useState } from 'react';
import Link from 'next/link';
import { blogPosts } from '@/data/blogPosts';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Search, Calendar, Clock, Tag, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Legislação', 'Cálculos', 'FGTS', 'Direitos'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header do Blog */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center text-primary-400 hover:text-primary-300 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para Calculadora
          </Link>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Blog Rescisão
            <span className="block text-primary-400">2025</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Artigos atualizados sobre direitos trabalhistas, cálculos de rescisão e mudanças na legislação brasileira.
          </p>
        </div>

        {/* Busca e Filtros */}
        <div className="mb-8 space-y-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filtros de Categoria */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'Todos' : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Lista de Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:border-primary-500 transition-all duration-300 group cursor-pointer">
              <Link href={`/blog/${post.id}`}>
                <div className="space-y-4">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Categoria */}
                  <div className="inline-block px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                    {post.category}
                  </div>

                  {/* Título */}
                  <h2 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {post.title}
                  </h2>

                  {/* Descrição */}
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {post.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <div key={tag} className="flex items-center space-x-1 text-xs text-gray-400">
                        <Tag className="w-3 h-3" />
                        <span>{tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* Call to Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-sm text-gray-400">Por {post.author}</span>
                    <span className="text-primary-400 text-sm font-medium group-hover:text-primary-300 transition-colors">
                      Ler mais →
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>

        {/* Nenhum resultado */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg mb-4">
              Nenhum artigo encontrado para "{searchTerm}"
            </div>
            <Button onClick={() => setSearchTerm('')} variant="outline">
              Limpar busca
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gray-800 border border-gray-700 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Precisa Calcular sua Rescisão?
          </h2>
          <p className="text-gray-300 mb-6">
            Use nossa calculadora gratuita e descubra quanto você tem direito a receber.
          </p>
          <Link href="/">
            <Button size="lg">
              Calcular Agora
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}