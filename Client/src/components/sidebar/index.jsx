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
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 20 20"
        >
          <g fill="black" fillRule="evenodd" clipRule="evenodd">
            <path d="M5 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 1a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
            <path d="M3.854 8.896a.5.5 0 0 1 0 .708l-.338.337A3.47 3.47 0 0 0 2.5 12.394v1.856a.5.5 0 1 1-1 0v-1.856a4.47 4.47 0 0 1 1.309-3.16l.337-.338a.5.5 0 0 1 .708 0m11.792-.3a.5.5 0 0 0 0 .708l.338.337A3.469 3.469 0 0 1 17 12.094v2.156a.5.5 0 0 0 1 0v-2.156a4.47 4.47 0 0 0-1.309-3.16l-.337-.338a.5.5 0 0 0-.708 0"></path>
            <path d="M14 9a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0 1a3 3 0 1 1 0-6a3 3 0 0 1 0 6m-4.5 3.25a2.5 2.5 0 0 0-2.5 2.5v1.3a.5.5 0 0 1-1 0v-1.3a3.5 3.5 0 0 1 7 0v1.3a.5.5 0 1 1-1 0v-1.3a2.5 2.5 0 0 0-2.5-2.5"></path>
            <path d="M9.5 11.75a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 1a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
          </g>
        </svg>),
    },
    {
      label: "Prospectos",
      href: "/prospectos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 20 20"
        >
          <g fill="black" fillRule="evenodd" clipRule="evenodd">
            <path d="M5 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 1a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
            <path d="M3.854 8.896a.5.5 0 0 1 0 .708l-.338.337A3.47 3.47 0 0 0 2.5 12.394v1.856a.5.5 0 1 1-1 0v-1.856a4.47 4.47 0 0 1 1.309-3.16l.337-.338a.5.5 0 0 1 .708 0m11.792-.3a.5.5 0 0 0 0 .708l.338.337A3.469 3.469 0 0 1 17 12.094v2.156a.5.5 0 0 0 1 0v-2.156a4.47 4.47 0 0 0-1.309-3.16l-.337-.338a.5.5 0 0 0-.708 0"></path>
            <path d="M14 9a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0 1a3 3 0 1 1 0-6a3 3 0 0 1 0 6m-4.5 3.25a2.5 2.5 0 0 0-2.5 2.5v1.3a.5.5 0 0 1-1 0v-1.3a3.5 3.5 0 0 1 7 0v1.3a.5.5 0 1 1-1 0v-1.3a2.5 2.5 0 0 0-2.5-2.5"></path>
            <path d="M9.5 11.75a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 1a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
          </g>
        </svg>),
    },
    {
      label: "Clientes",
      href: "/clientes", // Podés cambiarlo por una ruta real o futura
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 20 20"
        >
          <g fill="black" fillRule="evenodd" clipRule="evenodd">
            <path d="M5 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 1a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
            <path d="M3.854 8.896a.5.5 0 0 1 0 .708l-.338.337A3.47 3.47 0 0 0 2.5 12.394v1.856a.5.5 0 1 1-1 0v-1.856a4.47 4.47 0 0 1 1.309-3.16l.337-.338a.5.5 0 0 1 .708 0m11.792-.3a.5.5 0 0 0 0 .708l.338.337A3.469 3.469 0 0 1 17 12.094v2.156a.5.5 0 0 0 1 0v-2.156a4.47 4.47 0 0 0-1.309-3.16l-.337-.338a.5.5 0 0 0-.708 0"></path>
            <path d="M14 9a2 2 0 1 1 0-4a2 2 0 0 1 0 4m0 1a3 3 0 1 1 0-6a3 3 0 0 1 0 6m-4.5 3.25a2.5 2.5 0 0 0-2.5 2.5v1.3a.5.5 0 0 1-1 0v-1.3a3.5 3.5 0 0 1 7 0v1.3a.5.5 0 1 1-1 0v-1.3a2.5 2.5 0 0 0-2.5-2.5"></path>
            <path d="M9.5 11.75a2 2 0 1 0 0-4a2 2 0 0 0 0 4m0 1a3 3 0 1 0 0-6a3 3 0 0 0 0 6"></path>
          </g>
        </svg>),
    },
    {
      label: "Casos",
      href: "/casos",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="black"
            d="m2.3 20.28l9.6-9.6l-1.4-1.42l-.72.71a.996.996 0 0 1-1.41 0l-.71-.71a.996.996 0 0 1 0-1.41l5.66-5.66a.996.996 0 0 1 1.41 0l.71.71c.39.39.39 1.02 0 1.41l-.71.69l1.42 1.43a.996.996 0 0 1 1.41 0c.39.39.39 1.03 0 1.42l1.41 1.41l.71-.71c.39-.39 1.03-.39 1.42 0l.7.71c.39.39.39 1.03 0 1.42l-5.65 5.65c-.39.39-1.03.39-1.42 0l-.7-.7a.99.99 0 0 1 0-1.42l.7-.71l-1.41-1.41l-9.61 9.61a.996.996 0 0 1-1.41 0c-.39-.39-.39-1.03 0-1.42M20 19a2 2 0 0 1 2 2v1H12v-1a2 2 0 0 1 2-2z"
          ></path>
        </svg>),
    },

    {
      label: "Agenda",
      href: "/agendarcitas",
      icon: (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1.2em"
            height="1.2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="black"
              d="M5 11q-.825 0-1.412-.587T3 9V5q0-.825.588-1.412T5 3h14q.825 0 1.413.588T21 5v4q0 .825-.587 1.413T19 11zm0-2h14V5H5zm0 12q-.825 0-1.412-.587T3 19v-4q0-.825.588-1.412T5 13h14q.825 0 1.413.588T21 15v4q0 .825-.587 1.413T19 21zm0-2h14v-4H5zM5 5v4zm0 10v4z"
            ></path>
          </svg>
        ),
    },

    {
      label: "Pagos",
      href: "/pagos",
      icon: (
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="M19.435 4.065H4.565a2.5 2.5 0 0 0-2.5 2.5v10.87a2.5 2.5 0 0 0 2.5 2.5h14.87a2.5 2.5 0 0 0 2.5-2.5V6.565a2.5 2.5 0 0 0-2.5-2.5m1.5 9.93h-6.42a2 2 0 0 1 0-4h6.42Zm-6.42-5a3 3 0 0 0 0 6h6.42v2.44a1.5 1.5 0 0 1-1.5 1.5H4.565a1.5 1.5 0 0 1-1.5-1.5V6.565a1.5 1.5 0 0 1 1.5-1.5h14.87a1.5 1.5 0 0 1 1.5 1.5v2.43Z"
              ></path>
              <circle cx={14.519} cy={11.996} r={1} fill="white"></circle>
            </svg>
            ),
    },

    {
      label: "Consultas",
      href: "/verconsultas",
      icon: (
        <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1.2em"
              height="1.2em"
              viewBox="0 0 24 24"
            >
              <path
                fill="black"
                d="M12 7q.425 0 .713-.288T13 6t-.288-.712T12 5t-.712.288T11 6t.288.713T12 7m0 8q.425 0 .713-.288T13 14v-4q0-.425-.288-.712T12 9t-.712.288T11 10v4q0 .425.288.713T12 15m-6 3l-2.3 2.3q-.475.475-1.088.213T2 19.575V4q0-.825.588-1.412T4 2h16q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-.85-2H20V4H4v13.125zM4 16V4z"
              ></path>
            </svg>
            ),
    },

    {
      label: "Salir",
      href: "/",
      icon: (
        <IconArrowLeft
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
