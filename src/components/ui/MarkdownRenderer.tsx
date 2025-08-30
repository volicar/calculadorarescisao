'use client';

import { ReactNode } from 'react';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
  const renderInlineFormatting = (text: string): ReactNode[] => {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="text-white font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      } else if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="bg-gray-900 text-green-400 px-2 py-1 rounded text-sm font-mono">
            {part.slice(1, -1)}
          </code>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const renderContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: JSX.Element[] = [];
    let currentListItems: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];

    const flushList = (index: number) => {
      if (currentListItems.length > 0) {
        elements.push(
          <ul key={`list-${index}`} className="space-y-2 mb-6 ml-6">
            {currentListItems}
          </ul>
        );
        currentListItems = [];
      }
    };

    const flushCodeBlock = (index: number) => {
      if (codeBlockContent.length > 0) {
        elements.push(
          <pre key={`code-${index}`} className="bg-gray-900 border border-gray-700 text-green-400 p-4 rounded-lg overflow-x-auto mb-6 text-sm">
            <code>{codeBlockContent.join('\n')}</code>
          </pre>
        );
        codeBlockContent = [];
      }
    };

    lines.forEach((line, index) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock(index);
          inCodeBlock = false;
        } else {
          flushList(index);
          inCodeBlock = true;
        }
        return;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        return;
      }

      const trimmedLine = line.trim();

      // Empty lines
      if (trimmedLine === '') {
        flushList(index);
        elements.push(<div key={index} className="h-4" />);
        return;
      }

      // Headers
      if (trimmedLine.startsWith('# ')) {
        flushList(index);
        elements.push(
          <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4 first:mt-0">
            {trimmedLine.slice(2)}
          </h1>
        );
      } else if (trimmedLine.startsWith('## ')) {
        flushList(index);
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">
            {trimmedLine.slice(3)}
          </h2>
        );
      } else if (trimmedLine.startsWith('### ')) {
        flushList(index);
        elements.push(
          <h3 key={index} className="text-xl font-semibold text-white mt-4 mb-2">
            {trimmedLine.slice(4)}
          </h3>
        );
      } else if (trimmedLine.startsWith('#### ')) {
        flushList(index);
        elements.push(
          <h4 key={index} className="text-lg font-semibold text-white mt-3 mb-2">
            {trimmedLine.slice(5)}
          </h4>
        );
      }
      // List items
      else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        const content = trimmedLine.slice(2);
        currentListItems.push(
          <li key={index} className="text-gray-300 flex items-start">
            <span className="text-primary-400 mr-2 mt-1">•</span>
            <span>{renderInlineFormatting(content)}</span>
          </li>
        );
      }
      // Numbered lists
      else if (trimmedLine.match(/^\d+\. /)) {
        flushList(index);
        const match = trimmedLine.match(/^(\d+)\. (.+)/);
        if (match) {
          const [, number, content] = match;
          elements.push(
            <div key={index} className="text-gray-300 mb-3 ml-4 flex items-start">
              <span className="text-primary-400 font-semibold mr-3 mt-1">{number}.</span>
              <span>{renderInlineFormatting(content)}</span>
            </div>
          );
        }
      }
      // Regular paragraphs
      else {
        flushList(index);
        elements.push(
          <p key={index} className="text-gray-300 mb-4 leading-relaxed">
            {renderInlineFormatting(trimmedLine)}
          </p>
        );
      }
    });

    // Flush any remaining items
    flushList(lines.length);
    flushCodeBlock(lines.length);

    return elements;
  };

  return (
    <div className="prose prose-gray max-w-none">
      {renderContent(content)}
    </div>
  );
};