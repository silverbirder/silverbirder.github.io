"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Github,
  Twitter,
  ExternalLink,
  Lightbulb,
  Briefcase,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TechIcon } from "@/components/tech-icon";
import {
  topSkills,
  skillCategories,
  workExperiences,
  artifacts,
  notableContent,
} from "@/data/portfolio.data";

export const Portfolio = () => {
  return (
    <div className="mx-auto p-6">
      <div className="flex flex-col gap-12">
        <section className="flex flex-col gap-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-12 h-12">
              <AvatarImage src="/favicon.svg" alt="@silverbirder" />
              <AvatarFallback>SB</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl leading-[3rem] font-bold">
                @silverbirder
              </h2>
              <p className="text-xs text-muted leading-6">
                Webソフトウェアエンジニア
              </p>
            </div>
          </div>
          <div>
            <p className="text-base leading-6">
              大学でWebアプリ開発に出会い、価値提供の喜びを知る。個人開発を積極的に。
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-[3rem] font-bold">お気に入りの技術</h2>
          <div className="flex flex-row gap-6 flex-wrap">
            {topSkills.map((skill, index) => (
              <TechIcon key={index} skill={skill} />
            ))}
          </div>
        </section>
        <section>
          <div className="flex justify-start items-center">
            <h2 className="text-xl leading-[3rem] font-bold">経験のある技術</h2>
          </div>
          <div className="rounded-md border-2 border-yellow-500 -m-[2px]">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="skills">
                <AccordionTrigger className="rounded-md text-lg leading-[3rem] font-bold p-3 bg-yellow-100 hover:bg-yellow-200 transition-colors">
                  経験技術一覧を表示
                </AccordionTrigger>
                <AccordionContent className="rounded-md pb-6 bg-white px-6">
                  <div className="space-y-6">
                    {skillCategories.map((category, categoryIndex) => (
                      <div key={categoryIndex}>
                        <h3 className="text-base">{category.name}</h3>
                        <div className="flex flex-wrap gap-6">
                          {category.skills.map((skill, skillIndex) => (
                            <TechIcon key={skillIndex} skill={skill} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-[3rem] font-bold">職歴</h2>
          <div className="flex items-center space-x-6 mb-6 ml-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full mr-2 flex items-center justify-center">
                <Briefcase className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm leading-6">正社員</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full mr-2 flex items-center justify-center">
                <Users className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm leading-6">業務委託</span>
            </div>
          </div>
          <div className="relative mt-12 flex flex-col gap-6">
            {workExperiences.map((exp, index) => (
              <div key={index} className="ml-6 relative">
                <div
                  className={`absolute -left-[9px] top-0 bottom-0 w-0.5 ${
                    exp.type === "fulltime" ? "bg-blue-500" : "bg-yellow-500"
                  }`}
                ></div>
                <span
                  className={`flex absolute -left-5 -top-6 justify-center items-center w-6 h-6 ${
                    exp.type === "fulltime" ? "bg-blue-500" : "bg-yellow-500"
                  } rounded-full`}
                >
                  {exp.type === "fulltime" ? (
                    <Briefcase className="w-3 h-3 text-white" />
                  ) : (
                    <Users className="w-3 h-3 text-white" />
                  )}
                </span>
                <div className="relative -top-6 left-6">
                  <h3 className="flex items-center text-base font-bold text-gray-900">
                    {exp.company}
                  </h3>
                  <p className="text-base text-gray-500">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-[3rem] font-bold">成果物</h2>
          <h3 className="text-lg leading-[3rem] font-bold">書籍</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artifacts.books.map((book, index) => (
              <a
                key={index}
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-48 block select-none border border-gray-200 rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-36 max-h-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <p className="text-sm font-bold text-center leading-6 break-all">
                  {book.title}
                </p>
              </a>
            ))}
          </div>
          <h3 className="text-lg leading-[3rem] font-bold">Webサービス</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {artifacts.webServices.map((service, index) => (
              <a
                key={index}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
                className="h-48 block select-none border border-gray-200 rounded-md overflow-hidden bg-white hover:shadow-md transition-shadow"
              >
                <div className="h-24 flex items-center justify-center p-2">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="max-h-full max-w-full w-auto object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold mb-2">{service.title}</h4>
                  <p className="text-xs text-gray-600 line-clamp-3">
                    {service.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <h3 className="text-lg leading-[3rem] font-bold">
            GitHubプロジェクト
          </h3>
          <ul className="list-disc pl-6">
            {artifacts.githubProjects.map((project, index) => (
              <li key={index} className="ml-6">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-base inline-flex items-center"
                >
                  {project.name}
                  <ExternalLink className="ml-1 w-3 h-3" />
                </a>
                <ul className="list-disc ml-6">
                  <li className="text-sm text-gray-600 leading-6">
                    {project.description}
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-xl leading-[3rem] font-bold">過去の活動履歴</h2>
          <div className="flex flex-col gap-6">
            {notableContent.map((content, index) => (
              <div
                key={index}
                className="bg-yellow-100 flex flex-col p-6 rounded-lg"
              >
                <h3 className="text-base font-bold">{content.title}</h3>
                <Badge
                  variant="secondary"
                  className="my-1 mb-6 w-fit h-5 leading-5 py-0"
                >
                  {content.type}
                </Badge>
                <p className="text-sm text-gray-600 mb-6 leading-6">
                  {content.description}
                </p>
                <a
                  href={content.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base text-blue-600 hover:underline flex items-center"
                >
                  詳細を見る
                  <ExternalLink className="ml-1 w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xl leading-[3rem] font-bold">
            技術支援・メンタリング
          </h2>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md relative">
            <div className="absolute -top-3 -left-3 w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
              <Lightbulb className="w-6 h-6 text-yellow-500" />
            </div>
            <p className="text-lg font-bold leading-[3rem]">
              技術的なサポートが必要ですか？
            </p>
            <p className="text-gray-700 mb-6 text-base">
              Web開発やフロントエンドの技術、テストに関する基礎を、初心者向けにわかりやすく指導します。MENTAを通じて、これから学び始める方をサポートします。
            </p>
            <div className="flex justify-center">
              <Button
                variant="default"
                className="h-12 mt-6 py-0 bg-[#13B1C0] hover:bg-[#13B1C0]/90"
              >
                <a
                  href="https://menta.work/user/6835"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-base text-white"
                >
                  詳細を見る
                  <ExternalLink className="ml-2 w-6 h-6" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        <section className="text-center">
          <h2 className="text-xl leading-[3rem] font-bold">コンタクト</h2>
          <div className="flex justify-center space-x-4">
            <a
              href="https://github.com/silverbirder"
              target="_blank"
              rel="noopener noreferrer"
              className="leading-6 text-yellow-500 hover:text-yellow-600"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://twitter.com/silverbirder"
              target="_blank"
              rel="noopener noreferrer"
              className="text-yellow-500 hover:text-yellow-600"
            >
              <Twitter className="w-6 h-6" />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};
