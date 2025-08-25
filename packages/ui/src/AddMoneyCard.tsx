// File: @repo/ui/AddMoneyCard.tsx
import React from "react";
import { motion } from "framer-motion";

export type AddMoneyProps = {
  bank: string;
  setBank: (b: string) => void;
  value: number;
  setValue: (v: number) => void;
  onAdd: () => Promise<void> | void;
};

export function AddMoneyCard({ bank, setBank, value, setValue, onAdd }: AddMoneyProps) {
  return (
    <div className="w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] bg-amber-100 rounded-2xl  shadow-md p-4 sm:p-5 mx-auto md:mx-0 md:ml-6 max-h-[340px] sm:max-h-none overflow-hidden">
      <div className="flex flex-col gap-2 max-sm:gap-0 h-full">
        <div>
          <h3 className="md:text-lg text-md font-semibold text-gray-800">Add money</h3>
          <p className="text-xs text-gray-600 mt-1 hidden sm:block">Quick top-up to your account</p>
        </div>

        <label className="md:text-sm text-xs font-medium text-gray-700">Bank</label>
        <select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option>HDFC</option>
          <option>ICICI</option>
          <option>KOTAK</option>
        </select>

        <label className="md:text-sm text-xs font-medium text-gray-700">Amount</label>
        <input
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          type="number"
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
        />

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onAdd}
          className="w-full bg-green-600 md:text-sm text-xs hover:bg-green-700 text-white px-3 py-2 rounded-lg font-semibold shadow mt-auto"
        >
          Add money
        </motion.button>
      </div>
    </div>
  );
}