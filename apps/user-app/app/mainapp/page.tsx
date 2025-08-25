"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, IndianRupee } from "lucide-react";
import { getRampTransactions } from "../../actions/transfer";
import { balancechart31, balancechart30, balancechart28, balancechartmonthly } from "../../lib/chartdata";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    CartesianGrid
} from "recharts";
import { getTransactions } from "../../actions/p2p";
import { getBalance } from "../../actions/transfer";
import { mockChartData } from "../../lib/chartdata";
import {
    dailyChartData31,
    dailtchartData30 as dailyChartData30,
    dailtchartData28 as dailyChartData28,
} from "../../lib/chartdata";


// Reusable card component for key metrics
const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    detail,
    loading,
}: {
    title: string;
    value: string;
    icon: any;
    color: string;
    detail: string;
    loading?: boolean;
}) => (
    <motion.div
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col justify-between"
        whileHover={{ y: -5, boxShadow: "0px 15px 25px -5px rgba(0, 0, 0, 0.1)" }}
        transition={{ type: "spring", stiffness: 300 }}
    >
        <div className="flex justify-between items-start">
            <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                {loading ? (
                    <p className="text-3xl font-bold text-gray-800 mt-1">Loading...</p>
                ) : (
                    <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
                )}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
        {!loading && <p className="text-xs text-gray-400 mt-4">{detail}</p>}
    </motion.div>
);

export default function DashboardPage() {
    const { data: session } = useSession();
    const [chartmode, setChartMode] = useState<"monthly" | "daily">("monthly");

    const user: any = session?.user as any;
    const [totalSent, setTotalSent] = useState({ sum: 0, count: 0 });
    const [totalReceived, setTotalReceived] = useState({ sum: 0, count: 0 });
    const [transactions, setTransactions] = useState<any[]>([]);
    const [transactionsLoading, setTransactionsLoading] = useState(false);
    const [balanceLoading, setBalanceLoading] = useState(false);
    const [rampTransactions, setRampTransactions] = useState<any[]>([]);
    const [balanceMode, setBalanceMode] = useState<"monthly" | "daily">("daily");
    const [balance, setBalance] = useState(0);
    const [chartData, setChartData] = useState([...mockChartData]);
    const [balanceChartData, setBalanceChartData] = useState([...balancechartmonthly]);

    const fx = async () => {
        setTransactionsLoading(true);
        if (!user) {
            setTransactionsLoading(false);
            return;
        }

        const transactions = await getTransactions();
        setTransactions(transactions);

        let newChartData;
        if (chartmode === "daily") {
            const month = new Date().getMonth();
            newChartData = JSON.parse(
                JSON.stringify(
                    month === 1 // February is month 1 (0-indexed)
                        ? dailyChartData28
                        : [0, 2, 4, 6, 7, 9, 11].includes(month)
                            ? dailyChartData31
                            : dailyChartData30
                )
            );
        } else {
            newChartData = JSON.parse(JSON.stringify(mockChartData));
        }

        transactions.forEach((tx) => {
            if (!tx.startTime) return;
            const date = new Date(tx.startTime);
            const timePart = chartmode === "monthly" ? date.toLocaleString('default', { month: 'short' }) : String(date.getDate());
            if (!timePart) return;

            const dataPoint = newChartData.find((d: { name: string }) => String(d.name) === timePart);
            if (dataPoint) {
                if (tx.sentuserNumber === user?.number) {
                    dataPoint.sent = (dataPoint.sent || 0) + Number(tx.amount);
                } else {
                    dataPoint.received = (dataPoint.received || 0) + Number(tx.amount);
                }
            }
        });

        setChartData(newChartData);

        const sent = await transactions.reduce(
            (total, transaction) => {
                if (transaction.sentuserNumber === user?.number) {
                    return { sum: total.sum + transaction.amount, count: total.count + 1 };
                }
                return total;
            }, { sum: 0, count: 0 }
        );
        setTotalSent(sent);

        const received = await transactions.reduce(
            (total, transaction) => {
                if (transaction.receiveduserNumber === user?.number) {
                    return { sum: total.sum + transaction.amount, count: total.count + 1, };
                }
                return total;
            }, { sum: 0, count: 0 }
        );
        setTotalReceived(received);
        setTransactionsLoading(false);
    };

    const fx2 = async () => {
        setBalanceLoading(true);
        if (!user) {
            setBalanceLoading(false);
            return;
        }
        const balances: any = await getBalance();
        setBalance(balances?.amount);
        setBalanceLoading(false);
    };

    const fx3 = async () => {
        const rampTxns: any = await getRampTransactions();
        setRampTransactions(rampTxns);
        const alltransactions = [...rampTxns, ...transactions];

        let newChartData;
        if (balanceMode === "daily") {
            const month = new Date().getMonth();
            newChartData = JSON.parse(
                JSON.stringify(
                    month === 1 ? balancechart28 : [0, 2, 4, 6, 7, 9, 11].includes(month) ? balancechart31 : balancechart30
                )
            );
        } else {
            newChartData = JSON.parse(JSON.stringify(balancechartmonthly));
        }

        alltransactions.forEach((tx) => {
            if (!tx.startTime) return;
            const date = new Date(tx.startTime);
            const timePart = balanceMode === "monthly" ? date.toLocaleString('default', { month: 'short' }) : String(date.getDate());
            if (!timePart) return;

            const dataPoint = newChartData.find((d: { name: string }) => String(d.name) === timePart);
            if (dataPoint) {
              if(tx.sentuserNumber === user?.number) {
                dataPoint.amount = (dataPoint.amount || 0) - Number(tx.amount);
              }
              else if(tx.receiveduserNumber === user?.number) {
                dataPoint.amount = (dataPoint.amount || 0) + Number(tx.amount);
              }else if(tx.status === "Success") {
                dataPoint.amount = (dataPoint.amount || 0)+Number(tx.amount);
              }
            }
        });

        setBalanceChartData(newChartData);
    };

    useEffect(() => {
        if(user) {
            fx2();
        }
    }, [user]);

    useEffect(() => {
        if(user) {
            fx();
        }
    }, [user, chartmode]);

    useEffect(() => {
        if (user && transactions.length > 0) {
            fx3();
        }
    }, [user, balanceMode, transactions]);

    return (
        <main className="flex-1 max-sm:ml-10 bg-gray-50/50 p-6 md:p-8 lg:pl-24 lg:pt-8 transition-all duration-300">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                {user && (
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Welcome back, {user?.name?.split(" ")[0] || "User"}!
                        </h1>
                        <p className="text-gray-500 mt-1">
                            Here's a summary of your financial activity.
                        </p>
                    </header>
                )}
                {!user && (
                    <header className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-800">
                            Please login to view your dashboard!
                        </h1>
                        <p className="text-gray-500 mt-1">
                            here you can view your financial activity.
                        </p>
                    </header>
                )}

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Current Balance"
                        value={`₹${balance}`}
                        icon={IndianRupee}
                        color="bg-indigo-500"
                        detail=""
                        loading={balanceLoading}
                    />
                    <StatCard
                        title="Total Sent"
                        value={`₹${totalSent.sum}`}
                        icon={ArrowUpRight}
                        color="bg-red-500"
                        detail={`Across ${totalSent.count} transactions`}
                        loading={transactionsLoading}
                    />
                    <StatCard
                        title="Total Received"
                        value={`₹${totalReceived.sum}`}
                        loading={transactionsLoading}
                        icon={ArrowDownLeft}
                        color="bg-green-500"
                        detail={`From ${totalReceived.count} contacts`}
                    />
                </div>

                {/* Main Content Area: Chart and Balance History */}
                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Transaction Chart */}
                    <motion.div
                        className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">
                                {`${chartmode.charAt(0).toUpperCase() + chartmode.slice(1)} Overview`}
                            </h2>
                            <div className="flex items-center bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setChartMode('daily')}
                                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${chartmode === 'daily' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Daily
                                </button>
                                <button
                                    onClick={() => setChartMode('monthly')}
                                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${chartmode === 'monthly' ? 'bg-indigo-500 text-white' : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>

                        <div style={{ width: "100%", height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                    <YAxis stroke="#888888" fontSize={12} />
                                    <Tooltip wrapperClassName="!bg-white !border-gray-200 !rounded-lg !shadow-lg" />
                                    <Legend />
                                    <Bar
                                        dataKey="received"
                                        fill="#22c55e"
                                        name="Received"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="sent"
                                        fill="#ef4444"
                                        name="Sent"
                                        radius={[4, 4, 0, 0]}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Balance History Line Chart */}
                    <motion.div
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-gray-800">Balance History</h2>
                             <div className="flex items-center bg-gray-100 rounded-full p-1">
                                <button
                                    onClick={() => setBalanceMode('daily')}
                                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${balanceMode === 'daily' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Daily
                                </button>
                                <button
                                    onClick={() => setBalanceMode('monthly')}
                                    className={`px-3 py-1 text-sm font-semibold rounded-full transition-colors duration-200 ${balanceMode === 'monthly' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                >
                                    Monthly
                                </button>
                            </div>
                        </div>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <LineChart
                                    data={balanceChartData}
                                    margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                                    <YAxis stroke="#888888"   fontSize={12} />
                                    <Tooltip wrapperClassName="!bg-white !border-gray-200 !rounded-lg !shadow-lg" />
                                    <Legend />
                                    <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} name="Balance (₹)" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    );
}