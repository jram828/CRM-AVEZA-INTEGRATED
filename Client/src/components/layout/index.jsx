// Layout.jsx
import React, { useState } from "react";
import { SidebarCambio, SidebarBody, SidebarLink } from "../ui/index.jsx"; // tu sidebar importado
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { IconBriefcase, IconCalendarWeek, IconCornerDownLeft, IconDevicesQuestion, IconFileDescription, IconGavel, IconReceiptDollar, IconUsersGroup } from "@tabler/icons-react";

export default function Layout({ children }) {




  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}


      {/* Contenedor principal */}
      <main className="flex-1 overflow-auto bg-[#E1EAEE] dark:bg-neutral-900 p-4 flex items-center justify-center h-full">
        {children}
      </main>
    </div>
  );
}

