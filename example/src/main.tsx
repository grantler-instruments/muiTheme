import React, { useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "muiTheme";
import App from "./App";

function Example() {
  const [mode, setMode] = useState<"dark" | "light">("dark");
  const theme = useMemo(
    () => (mode === "dark" ? darkTheme : lightTheme),
    [mode]
  );
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App mode={mode} onModeChange={setMode} />
    </ThemeProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Example />
  </React.StrictMode>
);
