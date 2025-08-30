'use client';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: JSX.Element[] = [];
    let inCodeBlock = false;
    let inList = false;
    let listItems: JSX.Element[] = [];

    const flushList = (index: number) => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {listItems}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, index) => {
      line = line.trim();

      // Code blocks
      if (line.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        return;
      }

      if (inCodeBlock) {
        elements.push(
          <pre key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 text-sm">
            <code>{line}</code>
          </pre>
        );
        return;
      }

      // Headers
      if (line.startsWith('# ')) {
        flushList(index);
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        flushList(index);
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        flushList(index);
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      // List items
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.slice(2);
        listItems.push(
          <li key={index} className="text-gray-300">
            {renderInlineFormatting(content)}
          </li>
        );
        inList = true;
      }
      // Numbered lists
      else if (line.match(/^\d+\. /)) {
        flushList(index);
        const content = line.replace(/^\d+\. /, '');
        elements.push(
          <div key={index} className="text-gray-300 mb-2 ml-4">
            <strong className="text-primary-400">{line.match(/^\d+/)?.[0]}.</strong> {renderInlineFormatting(content)}
          </div>
        );
      }
      // Paragraphs
      else if (line.length > 0) {
        if (inList) {
          flushList(index);
          inList = false;
        }
        elements.push(
          <p key={index} className="text-gray-300 mb-4 leading-relaxed">
            {renderInlineFormatting(line)}
          </p>
        );
      }
      // Empty lines
      else {
        if (inList) {
          flushList(index);
          inList = false;
        }
        elements.push(<br key={index} />);
      }
    });

    // Flush any remaining list items
    flushList(lines.length);

    return elements;
  };

  const renderInlineFormatting = (text: string) => {
    // Bold text
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="prose prose-gray max-w-none">
      {renderContent(content)}
    </div>
  );
};