import { jaMessages } from "@repo/message";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  return {
    locale: "ja",
    messages: jaMessages,
  };
});
