// app/labs/ott/page.tsx
"use client";
import { useEffect, useState } from "react";

const API = "http://localhost:4000"; // ← puerto del backend OTT (docker compose)

export default function OttLab() {
  const [health, setHealth] = useState<string>("?");
  const [videos, setVideos] = useState<any[]>([]);
  const [faults, setFaults] = useState<any>({});

  const fetchHealth = async () => {
    try {
      const r = await fetch(`${API}/health`);
      setHealth(`${r.status} ${(await r.json()).status}`);
    } catch (e:any) {
      setHealth(`ERR ${e?.message || e}`);
    }
  };

  const fetchVideos = async () => {
    try {
      const r = await fetch(`${API}/videos`);
      const j = await r.json();
      setVideos(Array.isArray(j) ? j : []);
    } catch {
      setVideos([]);
    }
  };

  const fetchFaults = async () => {
    const r = await fetch(`${API}/faults`);
    setFaults(await r.json());
  };

  const toggle = async (k: string, val: boolean) => {
    await fetch(`${API}/faults`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [k]: val }),
    });
    fetchFaults();
    fetchHealth();
  };

  useEffect(() => {
    fetchHealth(); fetchVideos(); fetchFaults();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">OTT Lab</h1>

      <div className="space-y-2">
        <div><b>Health:</b> {health}</div>
        <div className="flex gap-2">
          {["api_down","db_down","drm_fail","cdn_slow"].map(k => (
            <label key={k} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!faults[k]}
                onChange={(e) => toggle(k, e.target.checked)}
              />
              {k}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-2">Videos</h2>
        <ul className="list-disc pl-6">
          {videos.map(v => (
            <li key={v.id}>
              {v.title} — DRM: {v.drm} — status: {v.status}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-x-4">
        <a className="underline" href="http://localhost:9090" target="_blank">Prometheus</a>
        <a className="underline" href="http://localhost:3001" target="_blank">Grafana</a>
      </div>
    </div>
  );
}
