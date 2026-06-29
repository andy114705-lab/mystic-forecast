import { marked } from 'marked';
import { useMemo } from 'react';

export default function Markdown({ text }) {
  const html = useMemo(() => {
    if (!text) return '';
    return marked(text, { breaks: true, gfm: true });
  }, [text]);

  return (
    <div
      className="prose prose-invert prose-sm max-w-none
        prose-headings:text-gold-400 prose-headings:font-semibold prose-headings:mt-6 prose-headings:mb-2
        prose-h3:text-base prose-h4:text-sm
        prose-p:text-white/75 prose-p:leading-relaxed prose-p:my-2
        prose-strong:text-white/90
        prose-ul:text-white/65 prose-li:my-1
        prose-hr:border-white/5"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
