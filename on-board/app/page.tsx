"use client";

import { useState, useEffect } from "react";

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
  const [mode, setMode] = useState<"driver" | "viewer">("viewer");
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
    <div className="mt-6 text-center text-xl font-semibold" style={{ color: BRAND_RED_DARK }}>
      {loading ? "Loading…" : currentStatus ? `Current Status: ${currentStatus}` : "No status set"}
    </div>
  );

  return (
    <>
      <main className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans px-4">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#fff5f5] via-[#fbcfd4] to-[#fff5f5] animate-linear-gradient bg-[length:100%_200%]" />
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.08] grain-overlay" />

        <div className="relative z-10 w-full max-w-sm md:max-w-md rounded-[2rem] shadow-2xl p-8" style={{ backgroundColor: CARD_BG }}>
          <h1 className="text-4xl font-bold text-center mb-6 text-red-600">Driver Location</h1>

          <div className="relative w-full h-12 mb-8 overflow-hidden">
            <div className="bus">
              <img src="/bus.png" alt="Bus" width={48} height={48} />
            </div>
          </div>

          {mode === "driver" && !unlocked && (
            <>
              <input
                type="password"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Enter Access Code"
                className="w-full p-3 mb-4 border border-red-200 rounded-xl text-center text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-300"
              />
              <button
                onClick={() =>
                  codeInput === ACCESS_CODE ? setUnlocked(true) : alert("Wrong access code!")
                }
                className="w-full py-3 rounded-xl text-white font-semibold bg-red-600 shadow-md hover:brightness-110 transition"
              >
                Unlock Driver Panel
              </button>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode("viewer"))}
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
                      className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                        isActive ? "bg-red-500 text-white shadow-lg" : "bg-red-100 text-red-800 hover:bg-red-200"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode("viewer"))}
                className="mt-6 block mx-auto text-sm font-medium text-gray-800 hover:text-black hover:scale-[1.02] transition-transform duration-200"
              >
                ← Back
              </button>
            </>
          )}

          {mode === "viewer" && (
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full flex justify-center">
                <div className="w-24 h-24 rounded-full overflow-hidden relative bg-gradient-to-br from-red-400 to-red-200 shadow-inner">
                  <img
                    src={
                      driverKey === 0 || driverKey === 1
                        ? "/otw.png"
                        : "/herePin.png"
                    }
                    alt="Bus"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                </div>
                <div className="text-center text-2xl font-bold text-red-700">
                  {loading ? "Loading..." : currentStatus ?? "No status"}
                </div>
              </div>
            </>
          )}
        </div>

        {mode !== "driver" && (
          <button
            onClick={() => (resetDriver(), setMode("driver"))}
            className="fixed bottom-4 right-4 z-20 text-sm text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded-full shadow-md transition-transform hover:scale-105"
          >
            Driver? Log in →
          </button>
        )}
      </main>

      <style>{`
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
          background-position: 0 0, 1.5px 1.5px;
        }
      `}</style>
    </>
  );
}
