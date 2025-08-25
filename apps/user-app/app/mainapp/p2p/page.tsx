"use client";
import {SendMoneyCard} from "@repo/ui/Sendmoneycard";
import { TransactionsCard } from "@repo/ui/TransactionsCard";
import { useState,useEffect } from "react";
import { addFriend,getTransactions } from "../../../actions/p2p";
;

import axios from "axios";

export default function P2P() {
    
    const[transactionsloading,setTransactionsLoading] = useState(true);
    const [refresh,setRefresh] = useState(false);
    const [people, setPeople] = useState<any[]>([]);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState<string>('');
    const mobileRowSpan =
  people.length === 0 || people.length <= 2 ? "max-sm:row-span-3":
  people.length <4 ? "max-sm:row-span-4"
  : people.length < 10 ? "max-sm:row-span-5"
  : "max-sm:row-span-6";

useEffect(() => {
    const fx = async () => {
        setTransactionsLoading(true);
        const transactions = await getTransactions();
        setTransactions(transactions);
        setTransactionsLoading(false);
        console.log(transactions);
    };
    fx();
}, [refresh]);



 useEffect(() => {

    if(query.length===0 || query == ""){
        setLoading(true);
        const fx = async () => {
            const friends = await axios.get(`/api/p2p/friends`).then(res => res.data);
            setPeople(friends as any[]);
            setLoading(false);
        };
     fx();
    }
 }, [query]);

    return (
        <div className=" h-[calc(100vh-100px)] max-sm:h-[calc(100vh-64px)] grid mx-20  max-sm:mx-2 max-sm:ml-14 grid-cols-3 max-sm:grid-cols-1 grid-rows-8 max-sm:grid-rows-10 gap-6 max-sm:gap-1 items-start "> 
        <div className="col-span-3 max-sm:col-span-1  flex flex-col justify-center items-center h-full  col-start-1 row-start-1 row-span-1">
            <h1 className="text-2xl max-sm:text-xl font-bold text-start w-[100%]">pay or get paid</h1>
            <p className="text-sm max-sm:text-xs text-gray-600 text-start w-[100%]">Send money to your friends</p>

            
            
        </div>
        <div className={`col-span-2 max-sm:col-span-1   justify-center items-center h-full w-[100%]  col-start-1  row-start-2 row-span-7 ${mobileRowSpan}`}>
            <SendMoneyCard loading={loading} setLoading={setLoading} setRefresh={setRefresh} query={query} setQuery={setQuery} setPeople={setPeople} onSendMoney={() => {}} onAddFriend={ addFriend} people={people} />
        </div>
        <div className={`col-span-1 max-sm:col-span-1  min-h-auto justify-center items-center h-full w-[100%] col-start-3 max-sm:col-start-1  row-span-7 max-sm:row-span-4 `}>
            <TransactionsCard mode="p2p" loading={transactionsloading} transactions={transactions} setRefresh={setRefresh} />
        </div>
            
        </div>
    );
}