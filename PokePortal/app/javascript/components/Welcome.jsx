import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/app/javascript/components/ui/button";

export default () => (
  <div>
    <div class="h-screen flex flex-col items-center justify-center space-y-8">
      <h1 class="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        PokePortal
      </h1>
      <p>A central hub for all of your Pokemon needs.</p>
      <Button asChild>
        <Link to="/forum"> Home </Link>
      </Button>
    </div>
  </div>
);
