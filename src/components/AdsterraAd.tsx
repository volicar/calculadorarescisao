'use client';

import { useEffect, useRef } from 'react';

interface AdsterraAdProps {
  width?: number;
  height?: number;
}

export const AdsterraAd = ({ width = 320, height = 50 }: AdsterraAdProps) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.hasChildNodes()) {
      // Configurar as opções
      (window as any).atOptions = {
        'key': '167803ea1387e4b7bd5426aae2aa9a8a',
        'format': 'iframe',
        'height': height,
        'width': width,
        'params': {}
      };

      // Criar e adicionar o script
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//www.highperformanceformat.com/167803ea1387e4b7bd5426aae2aa9a8a/invoke.js';
      script.async = true;
      
      adRef.current.appendChild(script);
    }
  }, [width, height]);

  return (
    <div className="text-center my-4">
      <div className="text-xs text-gray-400 mb-2">Publicidade</div>
      <div 
        ref={adRef}
        style={{ width, height, margin: '0 auto' }}
        className=""
      />
    </div>
  );
};