import { WebView } from 'react-native-webview';

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*
const getStreamData = (
  processedMessage: string,
  conversationId: string,
  userId: string,
  webviewRef: React.RefObject<WebView>
) => {
  const injectScript = `
  (async()=>{
    const response = await fetch('${process.env.EXPO_PUBLIC_API_URL}/api/v1/protected/chats/message/stream/${conversationId}?content=${processedMessage}', {
        method: 'GET',
        responseType: 'stream',
        headers: {
          'Authorization': '${userId}'
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
        const str = new TextDecoder().decode(chunk, {stream: true});
        window.ReactNativeWebView.postMessage(str);
    }
  })()
  `;
  webviewRef?.current?.injectJavaScript(injectScript);
};

export default getStreamData;
