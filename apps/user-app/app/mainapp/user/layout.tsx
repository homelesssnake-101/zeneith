import react from "react";      
export default function UserLayout({children}: {children: React.ReactNode}) {
    return <div className="max-md:translate-x-[2%] px-2 ">{children}</div>
}
