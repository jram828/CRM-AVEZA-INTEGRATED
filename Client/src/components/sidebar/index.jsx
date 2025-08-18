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
      href: "/clientes",
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
        <IconCalendarWeek stroke={1} className="text-black group-hover/sidebar:text-black" />
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
          className="text-red-600" />),
      onClick: logout
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col h-screen bg-white dark:bg-neutral-900 border-r border-gray-200 absolute left-0 z-10"
      )}
    >
      <SidebarCambio open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* {open ? <Logo /> : <LogoIcon />} */}
            <LogoResponsive open={open} />

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
         
        </SidebarBody>
      </SidebarCambio>
    </div>
  );
}

// const Logo = () => (
//   <a
//     href="#"
//     className="relative z-20 flex items-center space-x-2 py-3 px-4 text-sm font-normal text-black dark:text-white"
//   >
//     <img
//       src="./logoaveza.png"
//       alt="Logo"
//       className="h-20 w-20 object-cover rounded"
//     />
//     <div className="flex flex-col">
//       <span className="font-bold text-4xl tracking-wide">AVEZA</span>
//       <span className="font-bold text-[8px]">MÁS QUE UNA SOLUCIÓN JÚRIDICA</span>
//     </div>
//   </a>
// );

// const LogoIcon = () => (
//   <a
//     href="#"
//     className="relative z-20 flex items-center space-x-2 py-3 px-4 text-sm font-normal text-black dark:text-white justify-center"
//   >
//     <img
//       src="./logoaveza.png"
//       alt="Logo"
//       className="h-10 w-10 object-cover rounded"
//     />
//   </a>
// );

const LogoResponsive = ({ open }) => (
  <a
    href="#"
    className={cn(
      "relative z-20 flex items-center space-x-2 py-3 px-4 text-sm font-normal text-black dark:text-white",
      !open && "justify-center" // Centrar solo si está cerrado
    )}
  >
    <img
      src="./logoaveza.png"
      alt="Logo"
      className={cn(
        "object-cover rounded transition-all duration-300 ease-in-out",
        open ? "h-20 w-20" : "h-10 w-10" // tamaño según estado
      )}
    />
    {open && (
      <div className="flex flex-col">
        <span className="font-bold text-4xl tracking-wide">AVEZA</span>
        <span className="font-bold text-[8px]">MÁS QUE UNA SOLUCIÓN JÚRIDICA</span>
      </div>
    )}
  </a>
);
