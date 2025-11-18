import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export type Bid = [number, number];

type BookData = {
  bids: Array<Bid>;
  asks: Array<Bid>;
  mid: number;
};
const BookDataProviderContext = createContext<BookData>({
  bids: [],
  asks: [],
  mid: 0,
});

export function BookDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<BookData>({ bids: [], asks: [], mid: 0 });
  const websocketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!websocketRef.current) {
      websocketRef.current = new WebSocket(
        "wss://stream.binance.com:443/ws/btcusdt@depth20",
      );
    }
    const websocket = websocketRef.current;
    websocket.onopen = () => {
      websocket.send(
        JSON.stringify({
          method: "SUBSCRIBE",
          params: ["btcusdt@depth20"],
          id: null,
        }),
      );
    };

    websocket.onmessage = (m) => {
      const obj = JSON.parse(m.data);
      if (obj && typeof obj === "object" && "bids" in obj && "asks" in obj) {
        const { bids, asks } = obj;

        setData({
          bids: bids.sort(([a], [b]) => b - a),
          asks: asks.sort(([a], [b]) => b - a),
          mid: (Number(asks[asks.length - 1][0]) + Number(bids[0][0])) / 2,
        });
      }
    };

    websocket.onerror = (err) => console.error(err);
  }, []);

  return (
    <BookDataProviderContext.Provider value={data}>
      {children}
    </BookDataProviderContext.Provider>
  );
}

export function useBookData() {
  return useContext(BookDataProviderContext);
}
