import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/app/javascript/components/ui/button";
import { MainNav } from "./helpers/main-nav";
import { MainHeader } from "./helpers/main-header";
import { Separator } from "./ui/separator";
import { Toaster } from "./ui/toaster";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function Forum() {
  return (
    <div>
      <MainHeader />
      <div className="space-y-6 p-10 pb-16 md:block">
        <div className="md:flex md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-2xl font-bold tracking-tight">
              PokePortal Forum Hub
            </h2>
            <p className="text-muted-foreground">
              A Hub for all discussions related to Pokemon
            </p>
          </div>
        </div>
        <Separator className="my-4" />
        <Link to="/forum/news">
          <Card className="my-4 bg-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">News</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                Stay updated and discuss about the newest announcements from
                Pokemon.
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/forum/competitive">
          <Card className="my-4 bg-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Competitive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                Discuss recent VGC / Smogon updates, tournaments, and all things
                Competitive Pokemon.
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/forum/games">
          <Card className="my-4 bg-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Games</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                Watch out for the newest Pokemon games and discuss new releases,
                teams, etc...
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/forum/trading">
          <Card className="my-4 bg-sky-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Trading</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium">
                Set up times and trading agreements with other trainers a part
                of the PokePortal community.
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <Toaster />
    </div>
  );
}
