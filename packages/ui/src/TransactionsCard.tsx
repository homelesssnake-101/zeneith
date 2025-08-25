import React from "react";

import Loading from "@repo/ui/Loading";
import { motion } from "framer-motion";
import {RefreshCcw,IndianRupee} from "lucide-react";

import Image from "next/image";
export function TransactionsCard({ transactions, loading,setRefresh,mode }: { transactions: any[]; loading: boolean; setRefresh: (refresh: boolean| ((prev: boolean) => boolean)) => void; mode: "p2p" | "transfer" }) {
  return (
    <motion.div className="w-full  max-w-lg rounded-2xl bg-white relative shadow-md overflow-hidden max-h-[100%]" layout style={{ minHeight: loading ? "200px" : "auto" }}>
      <motion.div layout className="sticky top-0 px-3 bg-white z-10 border-b py-3 flex justify-center items-center text-center md:text-lg max-sm:text-md font-bold text-gray-800 shadow-sm">
       <div className="flex-1 justify-center"> <div className="translate-x-1  max-sm:translate-x-2">Transactions</div></div>
        <button disabled={loading} onClick={() => setRefresh((prev) => !prev)}  className={` ${loading ? "animate-spin" : ""} text-gray-600 hover:text-gray-800 transition-colors`}><RefreshCcw className="w-5 h-5" /></button>
      </motion.div>

      {/* overlay loader centered in the card so Loading top prop works as before */}
      {loading && (
        <div className="flex items-center justify-center z-20 pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Loading  />
        </div>
      )}

      <div className="max-h-[56vh] overflow-y-scroll p-3">
        {!loading && transactions.length === 0 && (
          <div className="text-center text-sm text-gray-500 py-6">No transactions yet</div>
        )}

        {!loading &&
          transactions.map((tx: any) => (
            
            <motion.div layout key={tx.id} className="bg-gray-50 rounded-lg p-3 mb-3 shadow-sm">
              <div className="grid grid-cols-3 grid-rows-2 gap-2 text-sm text-gray-700">
                 
                  {mode==="transfer" && (
                    <><Image src={tx.image} alt={tx.provider} width={50} height={50} className="col-span-1 row-span-2" />
                <div className=" text-center text-xs">status: <span className={`${tx.status === "Success" ? "text-green-500" : "text-red-500"} font-semibold font-normal`}>{tx.status}</span></div>
                <div className="text-right text-xs flex justify-end font-semibold items-center"> +<IndianRupee size={10} /> {tx.amount}</div>
                <div className="text-center text-xs"> provider:{tx.provider}</div>
                <div className="text-right text-xs text-gray-500">{new Date(tx.startTime).toDateString()}</div> 
                </>
                )}


                {mode==="p2p" && (
                    <>

                    <div className=" flex flex-col justify-center items-start col-span-1 p-2 row-span-2">
                    <Image src={tx.receiveduser?.imageUrl||tx.receiveduser?.imageUrl||"/assets/DEFAULT.png"} alt={tx.receiveduser?.name||tx.receiveduser?.name||"DEFAULT"} width={20} height={20} className="w-10 h-10  rounded-full object-cover flex-1"/>
                    <div className=" text-center text-sm font-semibold flex-1">{tx.receiveduser?.name||tx.sentuser?.name}</div>
                </div>
                {tx.note && (
                <div className="col-span-1 row-span-2 text-center itaic"> "{tx.note}"</div>
                )}
                {!tx.note && (
                <div className="col-span-1 row-span-2 itaic font-extralight text-center text-xs italic"> No note </div>
                )}
                
                <div className={`text-right text-sm p-2 col-span-1 row-span-1 flex justify-end items-center font-semibold ${tx.sentuser? "text-green-500" : "text-red-500"}`}> {tx.sentuser? "+" : "-"} <IndianRupee size={15} />{tx.amount}</div>
       
                <div className="text-right text-xs p-2 col-span-1 row-span-1 text-gray-500">{new Date(tx.startTime).toDateString().slice(0,-4)}</div> 
                </>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
}