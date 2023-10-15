import { component$ } from "@builder.io/qwik";
import { useTranslate } from "qwik-speak";
import { token } from "~/styled-system/tokens/index.mjs";

export interface OneSignalProps {}

export const OneSignal = component$<OneSignalProps>(() => {
  const appId = import.meta.env.PUBLIC_ONE_SIGNAL_APP_ID;
  const safariWebId = import.meta.env.PUBLIC_ONE_SIGNAL_SAFARI_WEB_ID;
  const t = useTranslate();
  return (
    <>
      <script
        src="https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js"
        defer
      ></script>
      <script
        dangerouslySetInnerHTML={`
        window.OneSignalDeferred = window.OneSignal || [];
        OneSignalDeferred.push(function(OneSignal) {
          OneSignal.init({
            appId: "${appId}",
            safari_web_id: "${safariWebId}",
            notifyButton: {
              enable: true
            }
          })
        });
        `}
      />
    </>
  );
});
