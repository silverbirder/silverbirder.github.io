export type TimelineItem = {
  compiledSource: string;
  date: string;
  key: string;
  type: "bookmark" | "share" | "tweet";
};
