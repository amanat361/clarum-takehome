"use client";

import {
  Sidebar,
  SidebarBody,
  SidebarDivider,
  SidebarFooter,
  SidebarHeader,
  SidebarHeading,
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "@/components/primitives/sidebar";
import { SidebarLayout } from "@/components/primitives/sidebar-layout";
import { symbols } from "@/lib/symbols";
import { Input } from "./primitives/input";
import { redirect, usePathname } from "next/navigation";
import Search from "./Search";
import { ChartBarIcon, CurrencyDollarIcon, HomeIcon } from "@heroicons/react/16/solid";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarLayout
      navbar={<></>}
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <SidebarHeading>View All Stocks</SidebarHeading>
            <SidebarItem href="/" current={pathname === "/"}>
              <HomeIcon />
              <SidebarLabel>Home</SidebarLabel>
            </SidebarItem>
          </SidebarHeader>
          <SidebarBody>
            <SidebarHeading>Individual Symbols</SidebarHeading>
            <SidebarSection>
              {symbols.map((symbol) => (
                <SidebarItem
                  key={symbol}
                  href={`/${symbol}`}
                  current={pathname === `/${symbol}`}
                >
                  <ChartBarIcon />
                  <SidebarLabel>${symbol}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
          <SidebarFooter>
            <SidebarSection>
              <SidebarHeading>Search For Custom Symbol</SidebarHeading>
              <Search />
            </SidebarSection>
          </SidebarFooter>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
