"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import Spiral from "./char/spiral";
import { usePathname } from "next/navigation";
import { cx } from "class-variance-authority";
import { Link } from "next-view-transitions";

export default function Header() {
  const pathname = usePathname();
  const getTopLevelPath = () => pathname.split("/")[1] || "/";
  const getStokeColor = () => {
    switch (getTopLevelPath()) {
      case "/":
        return "stroke-primary";
      case "me":
        return "stroke-blue-500";
      case "blog":
        return "stroke-green-500";
      case "portfolio":
        return "stroke-yellow-500";
      default:
        return "stroke-gray-500";
    }
  };
  return (
    <header>
      <div className="text-sm sm:text-base md:text-lg font-bold flex items-center mb-6">
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
      <nav className="flex justify-start space-x-1">
        <Tab
          href="/"
          label="トップ"
          color={"bg-primary"}
          isActive={pathname === "/"}
        />
        <Tab
          href="/me"
          label="自己紹介"
          color={"bg-blue-500"}
          isActive={pathname === "/me"}
        />
        <Tab
          href="/blog"
          label="技術ブログ"
          color={"bg-green-500"}
          isActive={pathname === "/blog"}
        />
        <Tab
          href="/portfolio"
          label="ポートフォリオ"
          color={"bg-yellow-500"}
          isActive={pathname === "/portfolio"}
        />
      </nav>
    </header>
  );
}

type TabProps = {
  href: string;
  label: string;
  color: string;
  isActive: boolean;
};

const Tab = ({ href, label, color, isActive }: TabProps) => (
  <div
    className={cx(
      "px-2 py-1 rounded-t-lg transition-all duration-300",
      color,
      isActive ? "font-bold -mb-3 z-10" : "opacity-70 hover:opacity-100"
    )}
  >
    <Link
      href={href}
      className={cx(
        "text-primary-foreground font-bold text-xs sm:text-sm md:text-base",
        isActive ? "border-primary-foreground" : ""
      )}
    >
      {label}
    </Link>
  </div>
);
