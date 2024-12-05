'use client';

import {
  TypographyStylesProvider,
  TypographyStylesProviderProps,
} from '@mantine/core';
import dompurify from 'dompurify';
import { marked } from 'marked';
import { ComponentPropsWithoutRef, useMemo } from 'react';

interface MarkdownProps
  extends TypographyStylesProviderProps,
    Omit<ComponentPropsWithoutRef<'div'>, keyof TypographyStylesProviderProps> {
  content: string;
}

export function Markdown({ content, ...props }: MarkdownProps) {
  const markdown = useMemo(() => {
    const markdown = marked.parse(content);

    if (typeof markdown !== 'string') {
      return '';
    }

    return dompurify.sanitize(markdown);
  }, [content]);

  return (
    <TypographyStylesProvider {...props}>
      <div dangerouslySetInnerHTML={{ __html: markdown }} />
    </TypographyStylesProvider>
  );
}
