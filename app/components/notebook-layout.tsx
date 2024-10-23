"use client";

import Spiral from "@/components/char/spiral";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Notebook } from "@/components/notebook";
import { Coffee } from "lucide-react";

type Props = {
  pathname: string;
  children: React.ReactNode;
};

export const NotebookLayout = ({ pathname, children }: Props) => {
  const getStokeColor = () => {
    switch (pathname) {
      case "/":
        return "stroke-primary";
      case "/me":
        return "stroke-blue-500";
      case "/blog":
        return "stroke-green-500";
      case "/portfolio":
        return "stroke-yellow-500";
      default:
        return "stroke-gray-500";
    }
  };
  return (
    <section>
      <div className="mb-6 text-sm sm:text-base md:text-lg font-bold flex items-center">
        <Avatar className="w-6 h-6">
          <AvatarImage src={"/favicon.svg"} alt="silverbirder" />
          <AvatarFallback className="bg-background">S</AvatarFallback>
        </Avatar>
        <h1>ジブンノート</h1>
        <Spiral
          className="h-6 w-12 ml-4"
          startDelay={0.0}
          duration={3.0}
          strokeColor={getStokeColor()}
        />
      </div>
      <div className="relative">
        <Notebook pathname={pathname}>{children}</Notebook>
        <div className="absolute bottom-4 right-4 pointer-events-none">
          <Coffee className="w-32 h-32 text-primary opacity-5" />
        </div>
      </div>
    </section>
  );
};
