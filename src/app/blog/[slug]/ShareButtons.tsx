'use client';

import { Button } from '@/components/ui/Button';
import { Share2, Copy } from 'lucide-react';
import { useState } from 'react';

interface ShareButtonsProps {
  title: string;
  description: string;
}

export const ShareButtons = ({ title, description }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erro ao copiar:', err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: description, url: window.location.href });
      } catch {
        // usuário cancelou o compartilhamento nativo
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-2">
        <Share2 className="w-4 h-4" />
        Compartilhar
      </Button>
      <Button variant="outline" size="sm" onClick={handleCopy} className="flex items-center gap-2">
        <Copy className="w-4 h-4" />
        {copied ? 'Copiado!' : 'Copiar Link'}
      </Button>
    </div>
  );
};
