'use client';

import { useState } from 'react';

// your access code
const ACCESS_CODE = "1234";

// status options
const statusLabels = {
  apartment:   "At Apartment",
  on_the_way:  "On the Way",
  office:      "At Office"
};

// brand colors (Rocket)
const BRAND_RED       = "#E03C31";
const BRAND_RED_DARK  = "#B52A2A";
const BG_LIGHT_GRAY   = "#F5F5F5";
const CARD_BG         = "#FFFFFF";

export default function Home() {
  // select your flow
  const [mode, setMode] = useState<null | "driver" | "viewer">(null);

  // driver state
  const [enteredCode,  setEnteredCode ]  = useState('');
  const [unlocked,     setUnlocked    ]  = useState(false);
  const [driverStatus, setDriverStatus]  = useState<keyof typeof statusLabels | null>(null);

  const handleUnlock = () => {
    if (enteredCode === ACCESS_CODE) {
      setUnlocked(true);
    } else {
      alert("Wrong access code!");
    }
    setEnteredCode('');
  };

  // helper to render the status box:
  const StatusDisplay = (
    <div className="mt-8 text-center text-lg font-semibold" style={{ color: BRAND_RED_DARK }}>
      {driverStatus
        ? `Current Status: ${statusLabels[driverStatus]}`
        : "No status set"
      }
    </div>
  );

  return (
    <main className={`min-h-screen flex items-center justify-center bg-[${BG_LIGHT_GRAY}] p-6 font-sans`}>
      <div className={`w-full max-w-md bg-[${CARD_BG}] rounded-2xl shadow-xl p-8`}>
        <h1 className="text-4xl font-bold text-center mb-6" style={{ color: BRAND_RED }}>
          Driver Status
        </h1>

        {mode === null && (
          <div className="space-y-4">
            <button
              onClick={() => setMode("driver")}
              className="w-full py-3 rounded-lg font-semibold text-white transition"
              style={{
                backgroundColor: BRAND_RED,
                boxShadow: `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
              }}
            >I'm a Driver</button>
            <button
              onClick={() => setMode("viewer")}
              className="w-full py-3 rounded-lg font-semibold border border-gray-300"
            >I'm a Viewer</button>
          </div>
        )}

        {mode === "driver" && !unlocked && (
          <>
            <input
              type="password"
              value={enteredCode}
              onChange={e => setEnteredCode(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-center focus:outline-none"
            />
            <button
              onClick={handleUnlock}
              className="w-full py-3 rounded-lg font-semibold text-white transition"
              style={{
                backgroundColor: BRAND_RED,
                boxShadow: `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
              }}
            >
              Unlock Driver Panel
            </button>
            {StatusDisplay}
            <button
              onClick={() => setMode(null)}
              className="mt-6 text-center text-sm underline text-gray-600"
            >← Back</button>
          </>
        )}

        {mode === "driver" && unlocked && (
          <>
            <div className="space-y-3">
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setDriverStatus(key as keyof typeof statusLabels)}
                  className="w-full py-3 rounded-lg font-semibold transition"
                  style={{
                    backgroundColor: driverStatus === key ? BRAND_RED : "#E5E5E5",
                    color: driverStatus === key ? CARD_BG : "#333333",
                    boxShadow: driverStatus === key
                      ? `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
                      : undefined
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {StatusDisplay}
            <button
              onClick={() => setMode(null)}
              className="mt-6 text-center text-sm underline text-gray-600"
            >← Back</button>
          </>
        )}

        {mode === "viewer" && (
          <>
            {StatusDisplay}
            <button
              onClick={() => setMode(null)}
              className="mt-6 w-full py-2 rounded-lg font-semibold border border-gray-300"
            >
              ← Back
            </button>
          </>
        )}
      </div>
    </main>
  );
}
