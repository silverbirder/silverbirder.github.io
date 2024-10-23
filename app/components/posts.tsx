"use client";

import { formatDate, type Metadata } from "@/lib/utils";
import { Link } from "next-view-transitions";
import { useState, useMemo } from "react";

type Props = {
  allBlogs: {
    metadata: Metadata;
    slug: string;
    content: string;
  }[];
};

export function BlogPosts({ allBlogs }: Props) {
  const [selectedYear, setSelectedYear] = useState<number | null>(
    new Date().getFullYear()
  );

  const blogsByYear = useMemo(() => {
    const sorted = allBlogs
      .filter((blog) => !!blog.metadata.publishedAt)
      .sort(
        (a, b) =>
          new Date(b.metadata.publishedAt).getTime() -
          new Date(a.metadata.publishedAt).getTime()
      );

    return sorted.reduce((acc, post) => {
      const year = new Date(post.metadata.publishedAt).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    }, {} as Record<number, typeof allBlogs>);
  }, [allBlogs]);

  const years = Object.keys(blogsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  const filteredBlogs = selectedYear ? blogsByYear[selectedYear] : allBlogs;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mb-6 md:mb-0 md:mr-8">
        <div className="flex flex-wrap md:flex-col gap-6">
          {years.map((year) => (
            <button
              key={year}
              className={`min-w-14 leading-6 px-2 rounded-full text-base font-medium transition-colors duration-200 ease-in-out ${
                selectedYear === year
                  ? "bg-green-500 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-green-500 hover:text-white"
              }`}
              onClick={() =>
                setSelectedYear(year)
              }
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow">
        {filteredBlogs.map((post) => (
          <Link
            key={post.slug}
            className="flex flex-col mb-6 rounded-lg hover:bg-green-500 hover:text-white transition-colors duration-200 ease-in-out"
            href={`/blog/contents/${post.slug}`}
          >
            <div className="flex flex-col">
              <p className="text-xs leading-6">
                {formatDate(post.metadata.publishedAt)}
              </p>
              <h3 className="text-base font-semibold">{post.metadata.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
