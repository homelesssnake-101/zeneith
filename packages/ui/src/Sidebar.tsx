"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Home, ArrowLeftRight, ReceiptText, Gift, Compass, ArrowUpRight,User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export const Sidebar = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
    const pathname = usePathname();
  const navItems = [
    { name: "Home", icon: Home, href: "/mainapp" },
    { name: "Transfer", icon: ArrowLeftRight, href: "/mainapp/transfer" },
    { name: "Transactions", icon: ReceiptText, href: "#" },
    { name: "Rewards", icon: Gift, href: "#" },
    { name: "Explore", icon: Compass, href: "#" },
    {name: "p2p transfer", icon: ArrowUpRight, href: "/mainapp/p2p"},
    {name: "profile", icon: User, href: "/mainapp/user"}
  ];

  return (
    <motion.div
      initial={{ width: "50px" }}
      animate={{ width: open ? 220 : "50px"}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 h-screen bg-white z-50 shadow-lg overflow-hidden border b-red-50"
    >
      
        <div className="flex justify-start px-2">
            <div className="flex items-center h-[50px]">
            {open && <div className="text-md font-bold text-start ">Venmo</div> }
                <motion.button
            onClick={()=>{onClose();}}
            animate={{rotate:open ? 0 : 180}}
            transition={{type:"spring",stiffness:300,damping:30}}
            
            
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
          >
            <ChevronLeft className="w-[20px] h-[20px]" />
          </motion.button>
          </div>
          <nav className="mt-12  absolute left-1 flex flex-col  w-[80%] space-y-4">
            {navItems.map(({ name, icon: Icon, href }) => (
              <Link
                key={name}
                href={href}
                className={`${pathname === href ? "bg-blue-100" : ""} flex items-center justify-start gap-3 px-1 py-2  text-gray-700 hover:bg-gray-100  rounded-md`}
              >
                <Icon className="w-[20px] h-[20px] translate-x-1" />
                {open && (
                <span>{name}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      
    </motion.div>
  );
};
