"use client";

import {
  Sidebar,
  SidebarBody,
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
            <SidebarSection>
              <SidebarHeading>Custom Symbol</SidebarHeading>
              <Search />
            </SidebarSection>
          </SidebarHeader>
          <SidebarBody>
            <SidebarHeading>Symbols</SidebarHeading>
            <SidebarSection>
              {symbols.map((symbol) => (
                <SidebarItem
                  key={symbol}
                  href={`/${symbol}`}
                  current={pathname === `/${symbol}`}
                >
                  <SidebarLabel>${symbol}</SidebarLabel>
                </SidebarItem>
              ))}
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  );
}
