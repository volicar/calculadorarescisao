"use client";

import { useEffect, useState } from "react";

export default function AdsterraAd() {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    setShowAd(true); // só ativa no client-side
  }, []);

  if (!showAd) return null;

  return (
    <div style={{ width: 300, height: 250 }}>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : '5723724e6cffdec49f9c8c9537a79dc5',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `,
        }}
      />
      <script
        type="text/javascript"
        src="//www.highperformanceformat.com/5723724e6cffdec49f9c8c9537a79dc5/invoke.js"
      ></script>
    </div>
  );
}
