import React, { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { MainHeader } from "../helpers/main-header";
import { Separator } from "../ui/separator";
import SidebarNav from "./sidebar-nav";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import { ScrollArea } from "../ui/scroll-area";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Posts",
    href: "/settings/posts",
  },
  {
    title: "Battles",
    href: "/settings/battles",
  },
];

/** Side Column having: Public Profile, Account, Posts, Battles */

export default function Settings({ children }) {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/forum");
    }
  }, [token]);
  return (
    <div>
      <MainHeader />
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your account settings and your online persona.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <ScrollArea className="flex-1 lg:max-w-2xl">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
