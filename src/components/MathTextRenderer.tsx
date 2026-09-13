import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextRendererProps {
  text: string;
  className?: string;
  inline?: boolean;
}

export const MathTextRenderer: React.FC<MathTextRendererProps> = ({
  text,
  className = '',
  inline = false,
}) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Helper to safely render KaTeX string
    const renderKatexSafe = (latex: string, displayMode: boolean = false): string => {
      try {
        return katex.renderToString(latex, {
          displayMode,
          throwOnError: false,
          output: 'htmlAndMathml',
        });
      } catch {
        return latex;
      }
    };

    // Pre-processing: Convert common text-based math patterns into LaTeX if not already enclosed in $
    // e.g. "c² = a² + b²" -> "$c^2 = a^2 + b^2$"
    // or "√169" -> "$\sqrt{169}$"
    // or "\frac{a}{b}" without $ -> "$\frac{a}{b}$"
    let normalized = text;

    // Pattern 1: Convert explicit [math]...[/math] or $$...$$
    // Regex for inline ($...$) and block ($$...$$)
    // We split by LaTeX delimiters
    const parts: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];

    // Match $$...$$ or $...$
    const mathRegex = /(\$\$[\s\S]*?\$\$|\$[^\$\n]+?\$)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = mathRegex.exec(normalized)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: normalized.substring(lastIndex, match.index),
        });
      }

      const matchStr = match[0];
      if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
        parts.push({
          type: 'block-math',
          content: matchStr.slice(2, -2).trim(),
        });
      } else {
        parts.push({
          type: 'inline-math',
          content: matchStr.slice(1, -1).trim(),
        });
      }

      lastIndex = match.index + matchStr.length;
    }

    if (lastIndex < normalized.length) {
      parts.push({
        type: 'text',
        content: normalized.substring(lastIndex),
      });
    }

    return parts.map((part, index) => {
      if (part.type === 'block-math') {
        const html = renderKatexSafe(part.content, true);
        return (
          <span
            key={`math-block-${index}`}
            className="block my-2 text-center overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else if (part.type === 'inline-math') {
        const html = renderKatexSafe(part.content, false);
        return (
          <span
            key={`math-inline-${index}`}
            className="inline-block align-middle mx-0.5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } else {
        // Plain text: handle line breaks and common math superscripts
        // If the text contains auto-detectable math like √169 or c² = a² + b²
        return (
          <React.Fragment key={`text-${index}`}>
            {part.content.split('\n').map((line, lineIdx, arr) => (
              <React.Fragment key={`line-${lineIdx}`}>
                {renderTextWithSuperscripts(line)}
                {lineIdx < arr.length - 1 && <br />}
              </React.Fragment>
            ))}
          </React.Fragment>
        );
      }
    });
  }, [text]);

  if (inline) {
    return <span className={className}>{renderedContent}</span>;
  }

  return <div className={className}>{renderedContent}</div>;
};

/**
 * Renders small inline superscripts (², ³, m², cm³, √x) cleanly in standard text
 */
function renderTextWithSuperscripts(line: string): React.ReactNode {
  // Check if line has square roots like √144 or √169
  if (line.includes('√')) {
    const parts = line.split(/(√\d+)/g);
    return parts.map((part, i) => {
      if (part.startsWith('√')) {
        const num = part.slice(1);
        try {
          const html = katex.renderToString(`\\sqrt{${num}}`, { throwOnError: false });
          return (
            <span
              key={i}
              className="inline-block align-middle mx-0.5"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return part;
        }
      }
      return part;
    });
  }

  return line;
}
