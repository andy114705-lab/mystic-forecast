import { marked } from 'marked';
import { useMemo } from 'react';

export default function Markdown({ text }) {
  const html = useMemo(() => {
    if (!text) return '';
    // Normalize: trim leading spaces before headings (LLM sometimes adds them)
    const normalized = text.replace(/^[ \t]+(#{1,6}\s)/gm, '$1');
    return marked.parse(normalized, { breaks: true, gfm: true });
  }, [text]);

  return (
    <div className="prose-custom" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
