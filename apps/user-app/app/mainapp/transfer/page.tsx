"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { onrampHandler, getRampTransactions, getBalance } from "../../../actions/transfer";
import { AddMoneyCard } from "@repo/ui/AddMoneyCard";
import { BalanceCard } from "@repo/ui/BalanceCard";
import { TransactionsCard } from "@repo/ui/TransactionsCard";
import Loading from "@repo/ui/Loading";
import Image from "next/image";



export default function Transfer() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const HDFC = "/assets/HDFC.png";
  const ICICI = "/assets/ICICI.png";
  const KOTAK = "/assets/KOTAK.png";
  const [bank, setBank] = useState("HDFC");
  const [value, setValue] = useState(0);
  const [transactions, setTransactions] = useState<any>([]);
  const [balance, setBalance] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  

  useEffect(() => {
    
    
    const fx = async () => {
      setLoading(true);
      const rampTransactions: any = await getRampTransactions();
      const balance: any = await getBalance();
      setBalance(balance);
      setTransactions(Array.isArray(rampTransactions) ? rampTransactions: []);
      setLoading(false);
    };
    fx();
  }, [refresh]);

  return (
    <div className="min-h-screen    bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Page heading */}
        <div className="mb-6  translate-x-[4%] lg:translate-x-[0%]">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transfer</h1>
          <p className="mt-1 text-sm text-gray-600">Top up your account and review transactions.</p>
        </div>

        {/* Responsive grid: mobile 1col, md 12-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-12  gap-6 max-sm:gap-1 items-start">
          {/* Add Money - left column (compact) */}
          <div className="col-span-12 md:col-span-3">
            {/* center on mobile, left align on desktop; prevents clipping with sidebars */}
            <div className="flex justify-center md:justify-start">
              <AddMoneyCard
                bank={bank}
                setBank={setBank}
                value={value}
                setValue={setValue}
                onAdd={async () => {
                  await onrampHandler(value, bank);
                  setRefresh((prev) => !prev);
                  setLoading(true);
                }}
              />
            </div>
          </div>

          {/* Balance - compact center column */}
          <div className="col-span-12 md:col-span-3 flex  flex-col justify-center items-center md:items-center">
            <BalanceCard loading={loading} balance={balance} />
                  <div className="mt-4 text-center md:text-center max-sm:hidden">
          <h2 className="text-xl font-semibold text-gray-900">Your details</h2>
        </div>
          </div>

          {/* Transactions - main content column (wider) */}
          <div className="col-span-12 md:col-span-6">
            

            <TransactionsCard mode="transfer" transactions={transactions.map((tx: any) =>{ tx.image = tx.provider === "HDFC" ? HDFC : tx.provider === "ICICI" ? ICICI : KOTAK; return tx})} loading={loading} setRefresh={setRefresh} />
          </div>
        </div>

        {/* Your details (keeps the same content, visually placed below on small screens) */}
     
      </div>
    </div>
  );
}
