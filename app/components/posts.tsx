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
  const latestYear = useMemo(() => {
    if (allBlogs.length === 0) return null;
    return new Date(
      Math.max(
        ...allBlogs.map((blog) => new Date(blog.metadata.publishedAt).getTime())
      )
    ).getFullYear();
  }, [allBlogs]);

  const [selectedYear, setSelectedYear] = useState<number | null>(latestYear);

  const blogsByYear = useMemo(() => {
    const sorted = allBlogs.sort(
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

  const filteredBlogs = selectedYear
    ? blogsByYear[selectedYear] ?? []
    : allBlogs;

  return (
    <div className="flex flex-col md:flex-row">
      <div className="mb-6 md:mb-0 md:mr-8">
        <div className="flex flex-wrap md:flex-col gap-6">
          {years.map((year) => (
            <button
              key={year}
              className={`min-w-16 leading-6 px-2 rounded-full text-base transition-colors duration-200 ease-in-out ${
                selectedYear === year
                  ? "bg-green-500 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-green-500 hover:text-white"
              }`}
              onClick={() => setSelectedYear(year)}
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
            href={`/blog/contents/${post.slug}/`}
          >
            <div className="flex flex-col">
              <time
                className="text-xs leading-6"
                dateTime={post.metadata.publishedAt}
              >
                {formatDate(post.metadata.publishedAt)}
              </time>
              <h3 className="text-base font-bold">{post.metadata.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
