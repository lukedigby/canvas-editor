import { useEffect, useRef, useState } from "react";

export function useWebsocketData<T>({
  defaultData,
  parseMessage,
  stream,
}: {
  defaultData: T;
  parseMessage: (data: string) => T | null;
  stream: string;
}) {
  const [data, setData] = useState<T>(defaultData);
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(
        `wss://stream.binance.com:443/ws/${stream}`,
      );
    }
    const websocket = websocketRef.current;
    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: [stream],
          id: null,
        }),
      );
    };

    websocket.onmessage = (m) => {
      const newData = parseMessage(m.data);
      if (newData) {
        setData(newData);
      }
    };

    websocket.onerror = (err) => console.error(err);
  }, [parseMessage, stream]);
  return data;
}
