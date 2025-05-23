// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

// your driver’s UUID (from auth or config)
const DRIVER_ID = 'faccaf3a-59f9-416d-a508-a7d0d891f70e';

// unlock code
const ACCESS_CODE = "1234";

// numeric status → human label
const STATUS_LABELS: Record<number,string> = {
  0: "On the way to OCM",
  1: "On the way to WSU",
  2: "At OCM",
  3: "At WSU",
};

// Rocket brand palette
const BRAND_RED      = "#E03C31";
const BRAND_RED_DARK = "#B52A2A";
const BG_LIGHT_GRAY  = "#F5F5F5";
const CARD_BG        = "#FFFFFF";

export default function Home() {
  const [mode,          setMode]          = useState<null|"driver"|"viewer">(null);
  const [codeInput,     setCodeInput]     = useState('');
  const [unlocked,      setUnlocked]      = useState(false);
  const [driverKey,     setDriverKey]     = useState<number|null>(null);
  const [currentStatus, setCurrentStatus] = useState<string|null>(null);
  const [loading,       setLoading]       = useState(false);

  // Clear driver state
  const resetDriver = () => {
    setUnlocked(false);
    setDriverKey(null);
    setCurrentStatus(null);
    setCodeInput('');
  };

  // Fetch live status when mode flips
  useEffect(() => {
    if (mode === 'driver' || mode === 'viewer') {
      setLoading(true);
      fetch('/api/get-status', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ id: DRIVER_ID })
      })
      .then(r => r.json())
      .then(json => {
        if (!json.error && typeof json.status === 'number') {
          setDriverKey(json.status);
          setCurrentStatus(STATUS_LABELS[json.status]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    }
  }, [mode]);

  // Update both UI and server
  const handleStatusChange = async (num: number) => {
    setDriverKey(num);
    setCurrentStatus(STATUS_LABELS[num]);
    const res = await fetch('/api/update', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ id: DRIVER_ID, status: num })
    });
    const json = await res.json();
    if (json.error) {
      console.error(json.error);
      alert('Failed to update status');
    }
  };

  // Status display
  const StatusDisplay = (
    <div className="mt-6 text-center text-lg font-semibold" style={{ color: BRAND_RED_DARK }}>
      {loading
        ? 'Loading…'
        : currentStatus
          ? `Current Status: ${currentStatus}`
          : 'No status set'
      }
    </div>
  );

  return (
    <>
      <main className={`min-h-screen flex items-center justify-center bg-[${BG_LIGHT_GRAY}] p-6 font-sans`}>
        <div className={`w-full max-w-md bg-[${CARD_BG}] rounded-2xl shadow-xl p-8`}>
          {/* Title */}
          <h1 className="text-4xl font-bold text-center mb-4" style={{ color: BRAND_RED }}>
            Driver Status
          </h1>

          {/* Centered bus track with percentage-based drive+fade */}
          <div className="relative w-full h-12 overflow-hidden mb-6">
            <div className="bus">
              <Image src="/bus.png" alt="Bus" width={48} height={48} />
            </div>
          </div>

          {/* Flow selector */}
          {mode === null && (
            <div className="space-y-4">
              <button
                onClick={() => (resetDriver(), setMode('driver'))}
                className="w-full py-3 rounded-lg text-white font-semibold"
                style={{
                  backgroundColor: BRAND_RED,
                  boxShadow: `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
                }}
              >
                I'm a Driver
              </button>
              <button
                onClick={() => (resetDriver(), setMode('viewer'))}
                className="w-full py-3 rounded-lg font-semibold border border-gray-300"
              >
                I'm a Viewer
              </button>
            </div>
          )}

          {/* Driver locked */}
          {mode === 'driver' && !unlocked && (
            <>
              <input
                type="password"
                value={codeInput}
                onChange={e => setCodeInput(e.target.value)}
                placeholder="Enter Access Code"
                className="w-full p-3 mb-4 border border-gray-300 rounded-lg text-center"
              />
              <button
                onClick={() => {
                  codeInput === ACCESS_CODE
                    ? setUnlocked(true)
                    : alert('Wrong access code!');
                }}
                className="w-full py-3 rounded-lg text-white font-semibold"
                style={{
                  backgroundColor: BRAND_RED,
                  boxShadow: `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
                }}
              >
                Unlock Driver Panel
              </button>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode(null))}
                className="mt-6 block mx-auto text-sm underline text-gray-600"
              >
                ← Back
              </button>
            </>
          )}

          {/* Driver unlocked */}
          {mode === 'driver' && unlocked && (
            <>
              <div className="space-y-3">
                {Object.entries(STATUS_LABELS).map(([key,label]) => {
                  const num = +key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(num)}
                      className="w-full py-3 rounded-lg font-semibold transition"
                      style={{
                        backgroundColor: driverKey === num ? BRAND_RED : '#E5E5E5',
                        color:           driverKey === num ? CARD_BG  : '#333333',
                        boxShadow:       driverKey === num
                          ? `0 4px 6px -1px ${BRAND_RED}88, 0 2px 4px -2px ${BRAND_RED}88`
                          : undefined
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
                className="mt-6 block mx-auto text-sm underline text-gray-600"
              >
                ← Back
              </button>
            </>
          )}

          {/* Viewer */}
          {mode === 'viewer' && (
            <>
              {StatusDisplay}
              <button
                onClick={() => (resetDriver(), setMode(null))}
                className="mt-6 w-full py-2 rounded-lg font-semibold border border-gray-300"
              >
                ← Back
              </button>
            </>
          )}
        </div>
      </main>

      {/* Drive + fade animation uses only % values */}
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
            transform: translateY(-50%) translateX(400%);  /* move 120% of container */
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
