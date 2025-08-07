// Sidebar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
  IconUsersGroup,
  IconGavel,
  IconFileDescription,
  IconBriefcase,
  IconCalendarWeek,
  IconReceiptDollar,
  IconDevicesQuestion,
  IconCornerDownLeft,
} from "@tabler/icons-react";
import { SidebarCambio, SidebarBody, SidebarLink } from "../ui/index.jsx";
import { cn } from "../../utils/cn";

export default function SidebarDemo({ logout }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);

  const links = [
    {
      label: "Abogados",
      href: "/abogados",
      icon: (
        <IconGavel stroke={1} />)
    },
    {
      label: "Prospectos",
      href: "/prospectos",
      icon: (
        <IconFileDescription stroke={1} />),
    },
    {
      label: "Clientes",
      href: "/clientes", // Podés cambiarlo por una ruta real o futura
      icon: (
        <IconUsersGroup stroke={1} />),
    },
    {
      label: "Casos",
      href: "/casos",
      icon: (
        <IconBriefcase stroke={1} />),
    },

    {
      label: "Agenda",
      href: "/agendarcitas",
      icon: (
        <IconCalendarWeek stroke={1} />
        ),
    },

    {
      label: "Pagos",
      href: "/pagos",
      icon: (
        <IconReceiptDollar stroke={1} />
            ),
    },

    {
      label: "Consultas",
      href: "/verconsultas",
      icon: (
        <IconDevicesQuestion stroke={1} />
            ),
    },

    {
      label: "Salir",
      href: "/",
      icon: (
        <IconCornerDownLeft stroke={1}
        className="text-red-600"/>),
      onClick: logout
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-gray-100 dark:bg-neutral-900 border-r dark:border-neutral-700 absolute left-0 z-10"
      )}
    >
      <SidebarCambio open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={() => {
                    if (link.onClick) {
                      link.onClick();
                    } else {
                      navigate(link.href);
                    }
                  }}
                />
              ))}
            </div>
          </div>
          <div className="p-4 text-xs text-neutral-500 dark:text-neutral-400">
            AVEZA CRM
          </div>
        </SidebarBody>
      </SidebarCambio>
    </div>
  );
}

const Logo = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-3 px-4 text-sm font-normal text-black dark:text-white"
  >
    <div className="h-6 w-6 bg-black dark:bg-white rounded" />
    <span className="font-bold text-lg">CRM AVEZA</span>
  </a>
);

const LogoIcon = () => (
  <a
    href="#"
    className="relative z-20 flex items-center space-x-2 py-3 px-4 text-sm font-normal text-black dark:text-white"
  >
    <div className="h-6 w-6 bg-black dark:bg-white rounded" />
  </a>
);
