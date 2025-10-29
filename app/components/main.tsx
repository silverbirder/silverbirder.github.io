"use client";

import { cx } from "class-variance-authority";
import { Coffee } from "lucide-react";

type Props = {
  children: React.ReactNode;
};

const Main = ({ children }: Props) => {
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
