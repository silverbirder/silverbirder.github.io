"use client";

import { cx } from "class-variance-authority";
import { Coffee } from "lucide-react";
import { usePathname } from "next/navigation";

type Props = {
  children: React.ReactNode;
};

const Main = ({ children }: Props) => {
  const pathname = usePathname();
  const getTopLevelPath = () => pathname.split("/")[1] || "/";
  const getBorderColor = () => {
    switch (getTopLevelPath()) {
      case "/":
        return "border-l-4 border-primary";
      case "me":
        return "border-l-4 border-blue-500";
      case "blog":
        return "border-l-4 border-green-500";
      case "portfolio":
        return "border-l-4 border-yellow-500";
      default:
        return "border-l-4 border-gray-500";
    }
  };

  return (
    <main
      className={cx([
        "bg-white shadow-lg p-6",
        "antialiased mx-auto min-h-96",
        "bg-[linear-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]",
        "bg-[length:100%_1.5rem]",
        "break-all",
        "rounded-tr-lg",
        "relative",
        getBorderColor(),
      ])}
    >
      {children}
      <div className="absolute bottom-4 right-4 pointer-events-none">
        <Coffee className="w-32 h-32 text-primary opacity-5" />
      </div>
    </main>
  );
};

export default Main;
