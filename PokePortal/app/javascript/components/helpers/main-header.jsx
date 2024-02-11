import React, { useContext } from "react";
import { MainNav } from "./main-nav";
import "@/app/globals.css";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

/** Created a Header Skeleton to that we can use in every page.  */
export function MainHeader() {
  const { token, logout } = useContext(AuthContext);

  if (token) {
    return (
      <div className="flex flex-1 flex-row justify-between p-6">
        <div className="flex flex-auto flex-row space-x-14 w-4/5">
          <Link
            to="/forum"
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5x text-violet-400"
          >
            PokePortal
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-auto justify-end items-center w-1/5 pr-20">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-10 w-10 border-2">
                <AvatarImage className="bg-red-400" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/settings/profile"> Settings </a>
              </DropdownMenuItem>
              <DropdownMenuItem href="/settings/profile">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/settings/posts">My Posts</a>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <a href="/settings/battles">My Battles</a>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <button onClick={logout}>Sign Out</button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-1 flex-row justify-between p-6">
        <div className="flex flex-auto flex-row space-x-14 w-4/5">
          <Link
            to="/forum"
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl"
          >
            PokePortal
          </Link>
          <MainNav />
        </div>
        <div className="flex flex-auto justify-end items-center w-1/5 pr-20 space-x-10">
          <Link to="/login"> Login </Link>
          <Link to="/signup"> Sign Up </Link>
        </div>
      </div>
    );
  }
}
