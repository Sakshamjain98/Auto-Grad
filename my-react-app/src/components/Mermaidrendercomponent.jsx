// MermaidRenderer.jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const MermaidRenderer = ({ chart }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (chart && containerRef.current) {
      mermaid.initialize({ startOnLoad: false });
      mermaid.render('generatedChart', chart, (svgCode) => {
        containerRef.current.innerHTML = svgCode;
      });
    }
  }, [chart]);

  return <div ref={containerRef} />;
};

export default MermaidRenderer;
