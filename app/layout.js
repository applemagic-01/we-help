import { Outfit } from "next/font/google";
import "./globals.css";
import Header from "./_components/Header";
import NextAuthSessionProvider from "./provider";
import { Toaster } from "@/components/ui/sonner";

const inter = Outfit({ subsets: ["latin"] });



export const metadata = {
  title: "WeHelp",
  description: "WeHelp",
};

export default function RootLayout({ children,params }) {
  const { pathname } = params;
  return (
    <html lang="en">
      <body className={inter.className}>
      <NextAuthSessionProvider>
        <div className=" mx-6 md:mx-16">
        {pathname !== "/login" && pathname !== "/admin" && <Header />}
          <Toaster />
        {children}
        </div>
       </NextAuthSessionProvider>
        </body>
    </html>
  );
}
