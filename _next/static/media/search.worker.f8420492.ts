import { buildSearchIndex, searchIndex, type SearchIndexItem } from "./search";

type ErrorResponse = {
  payload: { message: string };
  type: "error";
};

type LoadMessage = {
  payload: { json: string };
  type: "load";
};

type ReadyResponse = {
  payload: { count: number };
  type: "ready";
};

type ResultsResponse = {
  payload: { query: string; results: ReturnType<typeof searchIndex> };
  type: "results";
};

type SearchMessage = {
  payload: { limit?: number; query: string };
  type: "search";
};

type WorkerMessage = LoadMessage | SearchMessage;

let documents = buildSearchIndex([]);

const post = (message: ErrorResponse | ReadyResponse | ResultsResponse) => {
  self.postMessage(message);
};

self.addEventListener("message", (event: MessageEvent<WorkerMessage>) => {
  const message = event.data;

  if (message.type === "load") {
    try {
      const items = JSON.parse(message.payload.json) as SearchIndexItem[];
      documents = buildSearchIndex(items);
      post({ payload: { count: documents.length }, type: "ready" });
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : "Failed to load search index";
      post({ payload: { message: messageText }, type: "error" });
    }
    return;
  }

  if (message.type === "search") {
    const results = searchIndex(
      documents,
      message.payload.query,
      message.payload.limit,
    );
    post({
      payload: { query: message.payload.query, results },
      type: "results",
    });
  }
});
