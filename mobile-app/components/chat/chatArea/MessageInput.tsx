import React, { useState } from 'react';
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import BlockLoading from '@/components/BlockLoading';

type Props = {
  onSendMessage: (message: string) => void;
  loading: boolean;
};

const MessageInput = ({ onSendMessage, loading }: Props) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async () => {
    if (newMessage.trim() !== '') {
      Keyboard.dismiss();
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  return (
    <View className="flex flex-row items-center p-2">
      <TextInput
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Message AI"
        className="flex-1 border rounded p-2 bg-[#2f2f2f] text-white"
        placeholderTextColor={'#9b9b9b'}
        multiline
      />
      {loading ? (
        <BlockLoading />
      ) : (
        <TouchableOpacity
          onPress={handleSendMessage}
          disabled={newMessage.trim() === ''}
          className="ml-2"
        >
          <MaterialIcons name="send" color={newMessage.trim() === '' ? 'gray' : 'blue'} size={24} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default MessageInput;
