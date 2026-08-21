import React, { useEffect, useRef } from 'react';
import katex from 'katex';

interface MathFormulaProps {
  formula: string;
  block?: boolean;
}

export const MathFormula: React.FC<MathFormulaProps> = ({ formula, block }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Ensure the browser is in Standards Mode. document.compatMode should be "CSS1Compat".
      // We fixed the DOCTYPE in index.html, but we catch errors here to prevent app crashes.
      try {
        katex.render(formula, containerRef.current, {
          throwOnError: false,
          displayMode: block,
          trust: true,
          strict: false
        });
      } catch (error) {
        console.warn("KaTeX rendering error (possibly Quirks Mode):", error);
        // Fallback: show the raw LaTeX string if rendering fails
        containerRef.current.textContent = formula;
      }
    }
  }, [formula, block]);

  return (
    <div className={`math-font ${block ? 'w-full overflow-x-auto overflow-y-hidden py-1 text-center scrollbar-thin' : 'inline-block max-w-full overflow-x-auto align-middle'}`}>
      <span ref={containerRef} className="inline-block max-w-full" />
    </div>
  );
};