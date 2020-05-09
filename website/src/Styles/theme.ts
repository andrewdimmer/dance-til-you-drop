import { createMuiTheme } from "@material-ui/core";
import { deepOrange, orange } from "@material-ui/core/colors";

export const lightTheme = createMuiTheme({
  palette: {
    primary: deepOrange,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: orange,
    secondary: undefined,
    success: undefined,
    error: undefined,
    info: undefined,
    warning: undefined,
  },
});
