import "./globals.css";
import "@radix-ui/themes/styles.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import AuthProvider from "../context/AuthProvider";
import { Theme } from "@radix-ui/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timed Test",
  description: "Website for test prep!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="w-screen" lang="en">
      <body className={`${inter.className} overflow-x-hidden`}>
        <AuthProvider>
          <Theme>
            <div className="flex flex-col items-center">
              <div className="w-[80%] max-w-[1024px]">
                <>{children}</>
              </div>
            </div>
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
