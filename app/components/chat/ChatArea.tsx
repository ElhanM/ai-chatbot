import React, { useRef, useState } from 'react';
import { Button, Text, View } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

type Props = {};

const ChatArea = (props: Props) => {
  const webviewRef = useRef<WebView>(null);
  const [message, setMessage] = useState<string>('');

  const getStreamData = () => {
    setMessage('');

    const injectScript = `
    (async()=>{
      const postMessage = window.ReactNativeWebView.postMessage;
      const response = await fetch('http://192.168.0.12:5019/api/v1/protected/chats/message/stream/20e15d71-316f-4c26-9d26-da5ece3faebf?content=Teach%20me%20Golang', {
          method: 'GET',
          headers: {
            'Authorization': '632133e6-c400-43fe-b4c9-357d05cde8ee'
          }
      });
  
      async function *streamAsyncIterable(stream) {
          const reader = stream.getReader()
          try {
              while (true) {
                  const {done, value} = await reader.read()
                  if (done) {
                      return
                  }
                  yield value
              }
          } finally {
              reader.releaseLock()
          }
      }
  
      for await(const chunk of streamAsyncIterable(response?.body)) {
          const str = new TextDecoder().decode(chunk);
          postMessage(new Date().toLocaleTimeString() + " " + str);
      }
  
    })()
    `;
    webviewRef?.current?.injectJavaScript(injectScript);
  };

  const handleMessage = (event: WebViewMessageEvent) => {
    const data = event.nativeEvent.data;
    setMessage((prev) => prev + data);
  };

  return (
    <>
      <WebView
        ref={webviewRef}
        style={{
          height: 80,
          width: '100%',
        }}
        source={{ uri: 'http://192.168.0.12:5019/' }}
        onMessage={handleMessage}
      />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{message}</Text>
        <Button title="Press me" onPress={getStreamData}></Button>
      </View>
    </>
  );
};

export default ChatArea;
