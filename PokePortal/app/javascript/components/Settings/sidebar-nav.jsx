import React from "react";
import { buttonVariants } from "../ui/button";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SidebarNav({ className, items, ...props }) {
  const pathname = window.location.pathname;

  return (
    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
      {items.map((item) => (
        <Link
          key={item.title}
          to={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
