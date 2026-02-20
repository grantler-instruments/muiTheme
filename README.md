# muiTheme

Reusable MUI (Material UI) themes: dark (muted rose-gold, dusty mauve, warm charcoal) and light (warm coral-pink, lavender-blue).

## Install

**From GitHub:**

```bash
npm install git+ssh://git@github.com:grantler-instruments/muiTheme.git @mui/material @emotion/react @emotion/styled
```

Or with HTTPS:

```bash
npm install github:grantler-instruments/muiTheme @mui/material @emotion/react @emotion/styled
```

Your app must have `@mui/material` (and typically `@emotion/react` / `@emotion/styled`) installed; this package lists MUI as a peer dependency.

## Usage

```tsx
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "muiTheme";

// Dark theme
<ThemeProvider theme={darkTheme}>
  <CssBaseline />
  <App />
</ThemeProvider>

// Light theme
<ThemeProvider theme={lightTheme}>
  <CssBaseline />
  <App />
</ThemeProvider>

// Toggle by preference (e.g. from state or system)
const theme = prefersDark ? darkTheme : lightTheme;
<ThemeProvider theme={theme}>
  <CssBaseline />
  <App />
</ThemeProvider>
```

## Exports

- **`darkTheme`** – Dark palette: muted rose-gold primary, dusty mauve secondary, warm charcoal backgrounds.
- **`lightTheme`** – Light palette: warm coral-pink primary, lavender-blue secondary, soft backgrounds.

## License

MIT
