import { type Bid, useBookData } from "./BookDataProvider.tsx";

export function Book() {
  const context = useBookData();
  const { bids, asks, mid } = context;
  return (
    <div style={{ width: 320 }}>
      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <span
          style={{
            fontSize: 12,
            flex: "0 0 33.33%",
          }}
        >
          Price(USDT)
          {/* TODO get from context */}
        </span>
        <span style={{ fontSize: 12, flex: "0 0 33.33%" }}>
          Amount(BTC)
          {/* TODO get from context */}
        </span>
        <span style={{ fontSize: 12, flex: "0 0 33.33%" }}>Total</span>
      </div>
      {asks.map((bid, index) => (
        <BidItem key={index} bid={bid} type="ask" />
      ))}
      <span style={{ fontSize: 20 }}>{Number(mid).toFixed(2)}</span>{" "}
      {/* TODO color based on change up or down (add arrow) */}
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
        style={{
          fontSize: 12,
          color: type === "ask" ? "red" : "green",
          flex: "0 0 33.33%",
        }}
      >
        {Number(price).toFixed(2)}
      </span>
      <span style={{ fontSize: 12, flex: "0 0 33.33%" }}>
        {Number(quantity).toFixed(5)}
      </span>
      <span style={{ fontSize: 12, flex: "0 0 33.33%" }}>
        {(Number(price) * Number(quantity)).toFixed(5)}
      </span>
    </div>
  );
}
