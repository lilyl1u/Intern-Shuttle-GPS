// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const DRIVER_ID = "faccaf3a-59f9-416d-a508-a7d0d891f70e";
const ACCESS_CODE = "1234";

const STATUS_LABELS: Record<number, string> = {
  0: "On the way to OCM",
  1: "On the way to WSU",
  2: "At OCM",
  3: "At WSU",
};

const BRAND_RED = "#E03C31";
const BRAND_RED_DARK = "#B52A2A";
const CARD_BG = "#FFFFFF";

export default function Home() {
  const [mode, setMode] = useState<null | "driver" | "viewer">(null);
  const [codeInput, setCodeInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [driverKey, setDriverKey] = useState<number | null>(null);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetDriver = () => {
    setUnlocked(false);
    setDriverKey(null);
    setCurrentStatus(null);
    setCodeInput("");
  };

  useEffect(() => {
    if (mode === "driver" || mode === "viewer") {
      setLoading(true);
      const interval = setInterval(() => {
        fetch("/api/get-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: DRIVER_ID }),
        })
          .then((r) => r.json())
          .then((json) => {
            if (!json.error && typeof json.status === "number") {
              setDriverKey(json.status);
              setCurrentStatus(STATUS_LABELS[json.status]);
            }
          })
          .catch(console.error)
          .finally(() => setLoading(false));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [mode]);

  const handleStatusChange = async (num: number) => {
    setDriverKey(num);
    setCurrentStatus(STATUS_LABELS[num]);
    const res = await fetch("/api/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: DRIVER_ID, status: num }),
    });
    const json = await res.json();
    if (json.error) {
      console.error(json.error);
      alert("Failed to update status");
    }
  };

  const StatusDisplay = (
    <div
      className="mt-6 text-center text-lg font-semibold"
      style={{ color: BRAND_RED_DARK }}
    >
      {loading
        ? "Loading…"
        : currentStatus
          ? `Current Status: ${currentStatus}`
          : "No status set"}
    </div>
  );

  return (
    <>
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
        {/* Animated gradient background */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#f57c8a] via-[#f9b3b8] to-[#ffe3e3] animate-linear-gradient bg-[length:100%_200%]" />

        {/* Grain texture overlay */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] grain-overlay" />

        {/* Card container */}
        <div
          className="relative z-10 w-full max-w-md rounded-2xl shadow-2xl p-8"
          style={{ backgroundColor: CARD_BG }}
        >
          <h1
            className="text-4xl font-bold text-center mb-6"
            style={{ color: BRAND_RED }}
          >
            Driver Status
          </h1>

          <div className="relative w-full h-12 mb-6 overflow-hidden">
            <div className="bus">
              <Image src="/bus.png" alt="Bus" width={48} height={48} />
            </div>
          </div>

          {mode === null && (
            <div className="space-y-4">
              <button
                onClick={() => (resetDriver(), setMode("driver"))}
                className="w-full py-3 rounded-lg text-white font-semibold transition hover:brightness-110"
                style={{
                  backgroundColor: BRAND_RED,
                  boxShadow: `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`,
                }}
              >
                I&apos;m a Driver
              </button>
              <button
                onClick={() => (resetDriver(), setMode("viewer"))}
                className="w-full py-3 rounded-lg font-semibold border border-gray-300 text-gray-800 transition-transform transform hover:-translate-y-0.5 hover:shadow-md hover:bg-gray-100"
              >
                I&apos;m a Viewer
              </button>
            </div>
          )}

          {mode === "driver" && !unlocked && (
            <>
              <input
                type="password"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter Access Code"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-200"
              />
              <button
                onClick={() =>
                  codeInput === ACCESS_CODE
                    ? setUnlocked(true)
                    : alert("Wrong access code!")
                }
                className="w-full py-3 rounded-lg text-white font-semibold transition hover:brightness-110"
                style={{
                  backgroundColor: BRAND_RED,
                  boxShadow: `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`,
                }}
              >
                Unlock Driver Panel
              </button>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode(null))}
                className="mt-6 block mx-auto text-sm font-medium text-gray-800 hover:text-black hover:scale-[1.02] transition-transform duration-200"
              >
                ← Back
              </button>
            </>
          )}

          {mode === "driver" && unlocked && (
            <>
              <div className="space-y-3">
                {Object.entries(STATUS_LABELS).map(([key, label]) => {
                  const num = +key;
                  const isActive = driverKey === num;
                  return (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(num)}
                      className="w-full py-3 rounded-lg font-semibold transition hover:scale-[1.01]"
                      style={{
                        backgroundColor: isActive ? BRAND_RED : "#F0F0F0",
                        color: isActive ? CARD_BG : "#333",
                        boxShadow: isActive
                          ? `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
                          : undefined,
                        border: isActive ? "none" : "1px solid #ddd",
                      }}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode(null))}
                className="mt-6 block mx-auto text-sm font-medium text-gray-800 hover:text-black hover:scale-[1.02] transition-transform duration-200"
              >
                ← Back
              </button>
            </>
          )}

          {mode === "viewer" && (
            <>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode(null))}
                className="mt-6 block mx-auto text-sm font-medium text-gray-800 hover:text-black hover:scale-[1.02] transition-transform duration-200"
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </main>

      <style jsx>{`
        .bus {
          position: absolute;
          top: 50%;
          left: 10%;
          transform: translateY(-50%);
          animation: move 2.75s linear infinite;
        }

        @keyframes move {
          0% {
            transform: translateY(-50%) translateX(0);
            opacity: 0;
          }
          7.5% {
            opacity: 0.5;
          }
          15% {
            opacity: 1;
          }
          95% {
            opacity: 1;
          }
          100% {
            transform: translateY(-50%) translateX(400%);
            opacity: 0;
          }
        }

        @keyframes gradientVerticalShift {
          0% {
            background-position: top;
          }
          50% {
            background-position: bottom;
          }
          100% {
            background-position: top;
          }
        }

        .animate-linear-gradient {
          animation: gradientVerticalShift 12s ease-in-out infinite;
        }

        .grain-overlay {
          background-image:
            radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
            radial-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px);
          background-size: 3px 3px;
          background-position:
            0 0,
            1.5px 1.5px;
        }
      `}</style>
    </>
  );
}
