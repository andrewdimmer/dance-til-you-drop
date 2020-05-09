import { makeStyles, createStyles } from "@material-ui/styles";
import { Theme } from "@material-ui/core";
import { lightTheme as light, darkTheme as dark } from "./theme";

export const styles = makeStyles((theme: Theme) =>
  createStyles({
    padded: {
      padding: theme.spacing(2),
    },
    margined: {
      margin: theme.spacing(2),
    },
    marginedTopBottom: {
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    marginedPadded: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    marginRight: {
      marginRight: theme.spacing(2),
    },
    profileAvatarContainer: {
      width: "100%",
    },
    marginsAuto: {
      margin: "auto",
    },
    profileViewEditGrid: {
      padding: 0,
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    profileEditImageButton: {
      marginTop: "-60px",
    },
    centerText: {
      textAlign: "center",
    },
    pageTitle: {
      padding: theme.spacing(2),
      textAlign: "center",
    },
    playBox: {
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1075,
      backgroundColor: theme.palette.background.default,
    },
    fullSize: {
      width: "100%",
      height: "100%",
    },
    fab: {
      position: "absolute",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    themeBackgroundColor: {
      background: theme.palette.background.default,
    },
  })
);

export const lightTheme = light;
export const darkTheme = dark;
