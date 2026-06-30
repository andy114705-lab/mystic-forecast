import { marked } from 'marked';
import { useMemo } from 'react';

export default function Markdown({ text }) {
  const html = useMemo(() => {
    if (!text) return '';
    return marked.parse(text, { breaks: true, gfm: true });
  }, [text]);

  return (
    <div className="prose-custom" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
