import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  styles: {
    global: {
      "html, body": {
        color: "#C996CC",
        backgroundColor: "#1C0C5B",
      },
    },
  },
});

export default theme;

// "900": "#1C0C5B",
// "600": "#3D2C8D",
// "300": "#916BBF",
// "100": "#C996CC",
