"use client";

import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export const BlueskyLogo = () => {
  const [timelineHtml, setTimelineHtml] = useState<string>("");

  useEffect(() => {
    const existing = document.querySelector(
      'link[href="https://embedbsky.com/embedbsky.com-master-min.css"]'
    );
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://embedbsky.com/embedbsky.com-master-min.css";
      document.head.appendChild(link);
    }

    const targetUrl = `https://embedbsky.com/feeds/daaca49e00d4cfc864894611956d63a6f338f7edcdb50dffa0e596f1e79c8fe1.html?v=${new Date().toISOString()}`;
    const fetchHtml = async () => {
      try {
        const res = await fetch(targetUrl);
        if (!res.ok) {
          setTimelineHtml(
            "<p><strong>No feed data could be located</strong></p>"
          );
          return;
        }
        const html = await res.text();
        setTimelineHtml(html);
      } catch {
        setTimelineHtml("<p><strong>Feed 読み込みに失敗しました</strong></p>");
      }
    };

    fetchHtml();

    const container = document.getElementById("embedbsky-com-timeline-embed");
    if (container) {
      container.style.width = "100%";
      container.style.height = "50dvh";
    }
  }, []);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button">
          <img
            src="/bluesky-brands-solid-full.svg"
            alt="Bluesky"
            className="h-5 w-5"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="bg-white w-[90dvw] max-w-5xl p-4 space-y-0"
        align="end"
      >
        <div className="flex flex-col gap-0 w-full">
          <div className="pb-3">
            <p className="text-sm leading-6">
              クリックありがとう！
              <br />
              よかったら、私のタイムラインを見てね！
            </p>
          </div>
          <div className="-mx-4 border-t border-gray-200 border-2" />
          <div className="py-3">
            <div
              id="embedbsky-com-timeline-embed"
              className="overflow-hidden"
              style={{ width: "100%", height: "50dvh" }}
              dangerouslySetInnerHTML={{ __html: timelineHtml }}
            />
          </div>
          <div className="-mx-4 border-t border-gray-200 border-2" />
          <div className="pt-3">
            <Button asChild size="sm" className="w-full" variant="link">
              <a
                href="https://bsky.app/profile/silverbirder.bsky.social"
                target="_blank"
                rel="noopener noreferrer"
              >
                続きを見る！
              </a>
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};
