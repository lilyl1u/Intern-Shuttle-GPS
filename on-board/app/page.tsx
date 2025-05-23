'use client';

import { useState } from 'react';

const ACCESS_CODE = "1234"; // Set your own code here

const statusLabels = {
  apartment: "At Apartment",
  on_the_way: "On the Way",
  office: "At Office"
};

export default function Home() {
  const [enteredCode, setEnteredCode] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [driverStatus, setDriverStatus] = useState<keyof typeof statusLabels | null>(null);

  const handleUnlock = () => {
    if (enteredCode === ACCESS_CODE) {
      setUnlocked(true);
    } else {
      alert("Wrong access code!");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-xs bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center gap-6">
        <h1 className="text-2xl font-bold mb-2 text-center">Driver Status</h1>

        {!unlocked ? (
          <>
            <input
              type="password"
              value={enteredCode}
              onChange={e => setEnteredCode(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full p-3 rounded-lg border mb-2 text-center"
            />
            <button
              onClick={handleUnlock}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold"
            >
              Unlock Driver Panel
            </button>
            <div className="text-gray-500 text-sm text-center">Enter code to update status</div>
            <div className="text-lg font-semibold mt-6 text-blue-700">
              {driverStatus ? `Current Status: ${statusLabels[driverStatus]}` : "No status set"}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col w-full gap-3">
              {Object.entries(statusLabels).map(([key, label]) => (
                <button
                  key={key}
                  className={`w-full py-3 rounded-xl font-bold 
                    ${driverStatus === key ? 'bg-blue-700 text-white' : 'bg-gray-200 text-gray-800'}
                  `}
                  onClick={() => setDriverStatus(key as keyof typeof statusLabels)}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-5 text-lg font-semibold text-blue-700 text-center">
              {driverStatus ? `Current Status: ${statusLabels[driverStatus]}` : "No status set"}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
