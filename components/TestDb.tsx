"use client";

export default function TestDb() {
  let hasDb: boolean;

  try {
    // si db existe en cliente, va a estar undefined
    const { db } = require("@/lib/db");
    hasDb = !!db;
  } catch {
    hasDb = false;
  }

  return (
    <div style={{ padding: "1rem", background: "#222", color: "#0f0" }}>
      Client side: db loaded? {hasDb ? "✅ YES" : "❌ NO (correct)"}
    </div>
  );
}
