import { cx } from "class-variance-authority";
import { Link } from "next-view-transitions";

type Props = {
  children: React.ReactNode;
  pathname: string;
  className?: string;
};

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

export const Notebook = ({ children, className, pathname }: Props) => {
  const getBorderColor = () => {
    switch (pathname) {
      case "/":
        return "border-l-4 border-primary";
      case "/me":
        return "border-l-4 border-blue-500";
      case "/blog":
        return "border-l-4 border-green-500";
      case "/portfolio":
        return "border-l-4 border-yellow-500";
      default:
        return "border-l-4 border-gray-500";
    }
  };

  return (
    <div>
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
      <div
        className={cx(
          "bg-white shadow-lg p-6",
          "antialiased mx-auto min-h-96",
          "bg-[linear-gradient(hsl(var(--muted-foreground))_1px,transparent_1px)]",
          "bg-[length:100%_1.5rem]",
          "break-all",
          "rounded-tr-lg",
          getBorderColor(),
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};
