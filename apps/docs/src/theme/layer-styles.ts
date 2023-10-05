import { defineLayerStyles } from "@pandacss/dev";

export const layerStyles = defineLayerStyles({
  beginnerIcon: {
    value: {
      backgroundColor: "white",
      borderRadius: "8px",
      borderWidth: "1px",
      borderColor: "green.300",
      padding: "2px",
      boxShadow: "1px 1px 1px token(colors.green.300)",
    },
  },
  middleIcon: {
    value: {
      backgroundColor: "white",
      borderRadius: "8px",
      borderWidth: "1px",
      borderColor: "yellow.300",
      padding: "2px",
      boxShadow: "1px 1px 1px token(colors.yellow.300)",
    },
  },
  advancedIcon: {
    value: {
      backgroundColor: "white",
      borderRadius: "8px",
      borderWidth: "1px",
      borderColor: "red.300",
      padding: "2px",
      boxShadow: "1px 1px 1px token(colors.red.300)",
    },
  },
});
