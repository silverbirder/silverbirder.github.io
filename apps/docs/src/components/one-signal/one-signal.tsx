import { component$ } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { useTranslate } from "qwik-speak";
import { token } from "~/styled-system/tokens/index.mjs";

export interface OneSignalProps {}

export const OneSignal = component$<OneSignalProps>(() => {
  const l = useLocation();
  const debug = l.url.searchParams.get("debug") === "1";
  if (!debug) {
    return <></>;
  }
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
            allowLocalhostAsSecureOrigin: true,
            welcomeNotification: {
              message: "${t("notification.welcome.message")}"
            },
            notifyButton: {
              enable: true,
              size: 'small',
              theme: 'default',
              position: 'bottom-right',
              showCredit: false,
              text: {
                  'tip.state.unsubscribed': "${t(
                    "notification.tip.state.unsubscribed"
                  )}",
                  'tip.state.subscribed': "${t(
                    "notification.tip.state.subscribed"
                  )}",
                  'tip.state.blocked': "${t("notification.tip.state.blocked")}",
                  'message.prenotify': "${t("notification.message.prenotify")}",
                  'message.action.subscribed': "${t(
                    "notification.message.action.subscribe"
                  )}",
                  'message.action.resubscribed': "${t(
                    "notification.message.action.resubscribed"
                  )}",
                  'message.action.unsubscribed': "${t(
                    "notification.message.action.unsubscribed"
                  )}",
                  'dialog.main.title': "${t("notification.dialog.main.title")}",
                  'dialog.main.button.subscribe': "${t(
                    "notification.dialog.main.button.subscribe"
                  )}",
                  'dialog.main.button.unsubscribe': "${t(
                    "notification.dialog.main.button.unsubscribe"
                  )}",
                  'dialog.blocked.title': "${t(
                    "notification.dialog.blocked.title"
                  )}",
                  'dialog.blocked.message': "${t(
                    "notification.dialog.blocked.message"
                  )}"
              },
              colors: {
                 'circle.background': '${token("colors.text.link")}',
                 'circle.foreground': 'white',
                 'badge.background': '${token("colors.text.link")}',
                 'badge.foreground': 'white',
                 'badge.bordercolor': 'white',
                 'pulse.color': 'white',
                 'dialog.button.background.hovering': '${token(
                   "colors.text.linkActive"
                 )}',
                 'dialog.button.background.active': '${token(
                   "colors.text.linkActive"
                 )}',
                 'dialog.button.background': '${token("colors.text.link")}',
                 'dialog.button.foreground': 'white'
              },
            }
          })
        });
        `}
      />
    </>
  );
});
