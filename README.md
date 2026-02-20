# muiTheme

Reusable MUI (Material UI) themes: dark (muted rose-gold, dusty mauve, warm charcoal) and light (warm coral-pink, lavender-blue).

## Install

**From npm (recommended):**

```bash
npm install @grantler-instruments/muiTheme @mui/material @emotion/react @emotion/styled
```

**From GitHub (same scoped package name, use any of these):**

```bash
npm install github:grantler-instruments/muiTheme @mui/material @emotion/react @emotion/styled
```

Or with SSH:

```bash
npm install git+ssh://git@github.com:grantler-instruments/muiTheme.git @mui/material @emotion/react @emotion/styled
```

Your app must also have `@mui/material`, `@emotion/react`, and `@emotion/styled` installed (they are peer dependencies). If you only add muiTheme, install them:

```bash
npm install @mui/material @emotion/react @emotion/styled
```

**If you see `Operation not permitted` on `.git/hooks/`** (e.g. in Cursor’s sandbox): run `npm install` in a normal terminal, or install from a tarball so npm doesn’t clone via git:

```bash
npm install https://github.com/grantler-instruments/muiTheme/archive/refs/heads/main.tar.gz
```

(Use `main` or your branch name in the URL.) In all cases you still import from `@grantler-instruments/muiTheme`.

## Usage

```tsx
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { darkTheme, lightTheme } from "@grantler-instruments/muiTheme";

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
