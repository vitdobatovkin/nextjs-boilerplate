"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useEffect, useState } from "react";

export function WalletButton() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  if (isConnected && address) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            fontSize: "13px",
            color: "rgba(10, 10, 10, 0.65)",
            fontFamily: "monospace",
          }}
        >
          {`${address.slice(0, 6)}...${address.slice(-4)}`}
        </div>
        <button
          onClick={() => disconnect()}
          style={{
            border: "1px solid rgba(10, 10, 10, 0.14)",
            borderRadius: "12px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: "600",
            cursor: "pointer",
            background: "#fff",
            color: "rgba(10, 10, 10, 0.85)",
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  const availableConnector = connectors.find((c) => c.id === "injected") || connectors[0];

  return (
    <button
      onClick={() => availableConnector && connect({ connector: availableConnector })}
      disabled={!availableConnector || isPending}
      style={{
        border: "1px solid rgba(10, 10, 10, 0.14)",
        borderRadius: "12px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "700",
        cursor: "pointer",
        background: "#0000ff",
        color: "#fff",
        boxShadow: "0 4px 12px rgba(0, 0, 255, 0.2)",
      }}
    >
      {isPending ? "Connecting..." : "Connect Wallet"}
    </button>
  );
}
