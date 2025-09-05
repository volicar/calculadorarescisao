"use client";
import Script from "next/script";
import React from "react";

const AdsterraAd: React.FC = () => {
  return (
    <div style={{ width: 300, height: 250 }}>
      <Script id="adsterra-config" strategy="beforeInteractive">
        {`
          try {
            atOptions = {
              'key' : '5723724e6cffdec49f9c8c9537a79dc5',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          } catch(e) {
            console.warn('Adsterra config failed', e);
          }
        `}
      </Script>

      <Script
        strategy="lazyOnload"
        src="//www.highperformanceformat.com/5723724e6cffdec49f9c8c9537a79dc5/invoke.js"
      />
    </div>
  );
};

export default AdsterraAd;
