import { createContext, type ReactNode, useContext } from "react";
import { useWebsocketData } from "../Websockets/useWebsocketData.ts";

export type Bid = [number, number];

type BookData = {
  bids: Array<Bid>;
  asks: Array<Bid>;
  mid: number;
};

const DEFAULT_DATA = { bids: [], asks: [], mid: 0 };

const BookDataProviderContext = createContext<BookData>(DEFAULT_DATA);

const ITEM_COUNT = 17;
function parseBookDataMessage(data: string) {
  const obj = JSON.parse(data);
  if (obj && typeof obj === "object" && "bids" in obj && "asks" in obj) {
    const { bids, asks } = obj;
    if (
      Array.isArray(bids) &&
      bids[0].length === 2 &&
      Array.isArray(asks) &&
      asks[0].length === 2
    ) {
      return {
        asks: asks
          .sort(([a], [b]) => b - a)
          .slice(bids.length - ITEM_COUNT, bids.length - 1),
        bids: bids.sort(([a], [b]) => b - a).slice(0, ITEM_COUNT),
        mid: (Number(asks[asks.length - 1][0]) + Number(bids[0][0])) / 2,
      };
    }
  }
  return null;
}

export function BookDataProvider({ children }: { children: ReactNode }) {
  const data = useWebsocketData<BookData>({
    stream: "btcusdt@depth20",
    defaultData: DEFAULT_DATA,
    parseMessage: parseBookDataMessage,
  });

  return (
    <BookDataProviderContext.Provider value={data}>
      {children}
    </BookDataProviderContext.Provider>
  );
}

export function useBookData() {
  return useContext(BookDataProviderContext);
}
