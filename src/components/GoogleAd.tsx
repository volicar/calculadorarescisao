'use client';

import { useEffect, useRef } from 'react';

// Publisher ID do AdSense — não alterar
const PUBLISHER_ID = 'ca-pub-5155326548013471';

// ============================================================
// SLOTS DE ANÚNCIO — substitua os IDs após criar no painel:
// adsense.google.com → Anúncios → Por unidade → Display
// ============================================================
export const AD_SLOTS = {
  resultadoTopo:  'XXXXXXXXXX', // Unidade: "resultado-topo"
  resultadoMeio:  'XXXXXXXXXX', // Unidade: "resultado-meio"
  blogArtigo:     'XXXXXXXXXX', // Unidade: "blog-artigo"
  homepageMeio:   'XXXXXXXXXX', // Unidade: "homepage-meio"
} as const;

type SlotKey = keyof typeof AD_SLOTS;

interface GoogleAdProps {
  slot: SlotKey;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
  label?: boolean;
}

export const GoogleAd = ({ slot, format = 'auto', className = '', label = true }: GoogleAdProps) => {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  const slotId = AD_SLOTS[slot];

  // Não renderiza enquanto os IDs forem placeholder
  if (slotId === 'XXXXXXXXXX') {
    return null;
  }

  useEffect(() => {
    if (pushed.current) return;
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      pushed.current = true;
    } catch (e) {
      // AdSense bloqueado por ad blocker — silencioso
    }
  }, []);

  return (
    <div className={`text-center ${className}`}>
      {label && <p className="text-xs text-gray-500 mb-1">Publicidade</p>}
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={PUBLISHER_ID}
        data-ad-slot={slotId}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
