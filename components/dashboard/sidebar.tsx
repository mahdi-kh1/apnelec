"use client";

import React from 'react';
import { Button, Tooltip, Avatar, Progress } from "@nextui-org/react";
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  Users,
  CreditCard,
  Folder,
  Calendar,
  MessageSquare,
  BarChart,
  Crown,
  Menu,
  X
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuthentication } from "@/states";
import { useModalController } from "@/modals";
import Image from 'next/image'; // Import the Image component

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const DashboardSidebar = ({
  isOpen,
  onClose
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const pathname = usePathname();
  const { user: currentUser } = useAuthentication();
  const { setModalId } = useModalController();

  const sidebarItems: SidebarItemProps[] = [
    {
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Overview"
    },
    {
      href: "/dashboard/projects",
      icon: <Folder size={20} />,
      label: "Projects"
    },
    {
      href: "/dashboard/calendar",
      icon: <Calendar size={20} />,
      label: "Calendar"
    },
    {
      href: "/dashboard/messages",
      icon: <MessageSquare size={20} />,
      label: "Messages"
    },
    {
      href: "/dashboard/billing",
      icon: <CreditCard size={20} />,
      label: "Billing"
    }
  ];

  const handleUpgrade = () => {
    setModalId("upgrade-plan");
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 bottom-0 left-0 z-50
        w-64 bg-background border-r border-divider
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-divider flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src="https://www.apnelec.co.uk/Portals/0/apnelec-Logo-02.png"
                alt="ApnElec Logo"
                width={32} // Specify the width
                height={32} // Specify the height
                className="w-8 h-8"
              />
              <span className="font-bold text-xl">ApnElec</span>
            </Link>
            <Button
              isIconOnly
              variant="light"
              className="lg:hidden"
              onPress={onClose}
            >
              <X size={20} />
            </Button>
          </div>

          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={onClose}>
                <Button
                  fullWidth
                  className={`justify-start ${pathname === item.href
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-transparent hover:bg-default-100'
                    }`}
                  startContent={item.icon}
                  variant={pathname === item.href ? "solid" : "light"}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-divider">
            {currentUser?.subscription ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium">Pro Plan</span>
                  </div>
                  <span className="text-xs text-default-500">
                    {currentUser.subscription.daysLeft !== undefined ? `${currentUser.subscription.daysLeft} days left` : "Unknown days left"}
                  </span>
                </div>
                {currentUser.subscription.daysLeft !== undefined && (
                  <Progress
                    size="sm"
                    value={(currentUser.subscription.daysLeft / 30) * 100}
                    color="warning"
                    className="max-w-full"
                  />
                )}
              </div>
            ) : (
              <Button
                fullWidth
                color="warning"
                variant="flat"
                startContent={<Crown className="w-4 h-4" />}
                onPress={handleUpgrade}
              >
                Upgrade to Pro
              </Button>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
