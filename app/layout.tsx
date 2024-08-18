import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import LayoutWrapper from "@/components/SidebarLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clarum Takehome Project",
  description:
    "Goal: creating my own bar charts without using any other external libraries for the charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
      <body className={cn("antialiased", inter.className)}>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
