import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const wsRef = useRef(null);

  useEffect(() => {
    wsRef.current = new WebSocket(url);
    wsRef.current.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    return () => wsRef.current?.close();
  }, [url]);

  const send = (data) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
    }
  };

  return { messages, send };
};
