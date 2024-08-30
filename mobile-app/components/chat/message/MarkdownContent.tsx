import React from 'react';
import Markdown from '@ronradtke/react-native-markdown-display';

type Props = {
  content: string;
  isUser: boolean;
};

const MarkdownContent = ({ content, isUser }: Props) => {
  const styles = {
    darker: {
      backgroundColor: isUser ? '#2f2f2f' : '#111',
    },
    default: {
      backgroundColor: isUser ? '#2f2f2f' : '#222',
    },
  };

  return (
    <Markdown
      style={{
        body: { color: 'white', ...styles.default },
        heading1: { ...styles.default },
        heading2: { ...styles.default },
        heading3: { ...styles.default },
        heading4: { ...styles.default },
        heading5: { ...styles.default },
        heading6: { ...styles.default },
        hr: { ...styles.default },
        strong: { ...styles.default },
        em: { ...styles.default },
        s: { ...styles.default },
        blockquote: { ...styles.darker },
        bullet_list: { ...styles.default },
        ordered_list: { ...styles.default },
        list_item: { ...styles.default },
        code_inline: { ...styles.darker },
        code_block: { ...styles.darker },
        fence: { ...styles.darker },
        table: { ...styles.default },
        thead: { ...styles.default },
        tbody: { ...styles.default },
        th: { ...styles.default },
        tr: { ...styles.default },
        td: { ...styles.default },
        link: { ...styles.default },
        blocklink: { ...styles.default },
        image: { ...styles.default },
        text: { ...styles.default },
        textgroup: { ...styles.default },
        paragraph: { ...styles.default },
        hardbreak: { ...styles.default },
        softbreak: { ...styles.default },
        pre: { ...styles.default },
        inline: { ...styles.default },
        span: { ...styles.default },
      }}
    >
      {content || '...'}
    </Markdown>
  );
};

export default MarkdownContent;
