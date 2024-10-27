import { Link } from "next-view-transitions";
import { User, Code, Briefcase } from "lucide-react";

type TOCSubItem = {
  page: number;
  title: string;
  path: string;
};

type TOCItem = {
  title: string;
  icon: React.ElementType;
  subItems: TOCSubItem[];
};

const tocItems: TOCItem[] = [
  {
    title: "初めての方",
    icon: User,
    subItems: [{ page: 1, title: "自己紹介", path: "/me" }],
  },
  {
    title: "エンジニアの方",
    icon: Code,
    subItems: [{ page: 2, title: "技術ブログ", path: "/blog" }],
  },
  {
    title: "お仕事ご依頼・技術支援をご希望の方",
    icon: Briefcase,
    subItems: [{ page: 3, title: "ポートフォリオ", path: "/portfolio" }],
  },
];

const TableOfContents = () => {
  return (
    <div className="max-w-2xl">
      <div className="space-y-6">
        {tocItems.map((item, index) => (
          <div key={index}>
            <h2 className="text-lg leading-[3rem] font-bold flex flex-row items-center flex-wrap">
              <item.icon className="w-6 h-6 mr-2" />
              {item.title}
            </h2>
            <div>
              {item.subItems.map((subItem, subIndex) => (
                <div key={subIndex} className="mb-6 flex items-center">
                  <div>
                    <Link
                      href={subItem.path}
                      className="text-primary hover:underline leading-6"
                    >
                      {subItem.title}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Page() {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <p className="leading-6 text-foreground">
          ようこそ！私は@silverbirderです。ウェブ開発に関わるソフトウェアエンジニアです。
        </p>
      </div>
      <TableOfContents />
    </div>
  );
}
