import React from 'react';
import { View, Text } from 'react-native';
import Markdown from '@ronradtke/react-native-markdown-display';
import { IMessage, Sender } from '@/store/api/useChatMessagesStore';

type Props = {
  message: IMessage;
  isUser: boolean;
};

const MessageContent = ({ message, isUser }: Props) => {
  return (
    <View className={`p-2 rounded ${isUser ? 'bg-[#2f2f2f]' : 'bg-[#222]'}`}>
      <Markdown
        style={{
          body: { color: 'white', backgroundColor: isUser ? '#2f2f2f' : '#222' },
          heading1: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          heading2: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          heading3: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          heading4: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          heading5: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          heading6: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          hr: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          strong: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          em: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          s: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          blockquote: { backgroundColor: isUser ? '#2f2f2f' : '#111' },
          bullet_list: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          ordered_list: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          list_item: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          code_inline: { backgroundColor: isUser ? '#2f2f2f' : '#111' },
          code_block: { backgroundColor: isUser ? '#2f2f2f' : '#111' },
          fence: { backgroundColor: isUser ? '#2f2f2f' : '#111' },
          table: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          thead: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          tbody: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          th: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          tr: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          td: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          link: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          blocklink: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          image: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          text: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          textgroup: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          paragraph: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          hardbreak: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          softbreak: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          pre: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          inline: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
          span: { backgroundColor: isUser ? '#2f2f2f' : '#222' },
        }}
      >
        {message.content || '...'}
      </Markdown>

      <Text className="text-xs text-gray-400 text-right">
        {new Date(message.createdAt).toLocaleTimeString()}
      </Text>
    </View>
  );
};

export default MessageContent;
