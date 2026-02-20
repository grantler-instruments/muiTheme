import { Button, FormControlLabel, Paper, Switch, Typography } from "@mui/material";

type AppProps = {
  mode: "dark" | "light";
  onModeChange: (mode: "dark" | "light") => void;
};

export default function App({ mode, onModeChange }: AppProps) {
  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={mode === "dark"}
            onChange={(_, checked) => onModeChange(checked ? "dark" : "light")}
            color="primary"
          />
        }
        label={mode === "dark" ? "Dark" : "Light"}
        sx={{ position: "absolute", top: 16, right: 16 }}
      />
      <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", mt: 4 }}>
        <Typography variant="h1" gutterBottom>
          muiTheme
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          If this looks styled with your theme (rose-gold / mauve, warm charcoal), the package works.
        </Typography>
        <Button variant="contained" color="primary">
          Primary
        </Button>
        <Button variant="contained" color="secondary" sx={{ ml: 1 }}>
          Secondary
        </Button>
      </Paper>
    </>
  );
}
