"use client";

import { useState } from "react";

export default function PasswordModal({
  onSubmit,
  error,
}: {
  onSubmit: (pwd: string) => void;
  error?: string;
}) {
  const [password, setPassword] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Enter Password to View PDF
        </h2>

        <input
          type="password"
          className="w-full border rounded-lg px-3 py-2 outline-none focus:ring focus:ring-blue-300"
          placeholder="Enter PDF Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && (
          <p className="text-red-600 mt-2 text-sm text-center">{error}</p>
        )}

        <button
          onClick={() => onSubmit(password)}
          className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
