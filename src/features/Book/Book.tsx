import { type Bid, useBookData } from "./BookDataProvider.tsx";

export function Book() {
  const context = useBookData();
  const { bids, asks, mid } = context;
  return (
    <div>
      {asks.map((bid, index) => (
        <BidItem key={index} bid={bid} type="ask" />
      ))}
      <span>{Number(mid).toFixed(2)}</span> // TODO figure out color logic
      {bids.map((bid, index) => (
        <BidItem key={index} bid={bid} type="bid" />
      ))}
    </div>
  );
}

function BidItem({
  bid: [price, quantity],
  type,
}: {
  bid: Bid;
  type: "bid" | "ask";
}) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span
        style={{ color: type === "ask" ? "red" : "green", flex: "0 0 33.33%" }}
      >
        {Number(price).toFixed(2)}
      </span>
      <span style={{ flex: "0 0 33.33%" }}>{Number(quantity).toFixed(5)}</span>
      <span style={{ flex: "0 0 33.33%" }}>
        {(Number(price) * Number(quantity)).toFixed(5)}
      </span>
    </div>
  );
}
