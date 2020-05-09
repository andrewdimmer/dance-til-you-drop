import {
  CircularProgress,
  createStyles,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React, { Fragment } from "react";

declare interface LoadingProps {
  loadingMessage: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loadingContainer: {
      width: "100vw",
      height: "100vh",
      position: "fixed",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1350,
      color: theme.palette.getContrastText(theme.palette.background.default),
      backgroundColor: theme.palette.background.default,
    },
    loadingCircle: {
      margin: "40px",
    },
  })
);

/**
 * Loading Screen
 * @description A self contained loading screen that covers all other content on the screen while it loads. For ease of use, put it at the bottom of the main page of the react app.
 * @param param0 A LoadingProps object with the busy message to display on the loading screen
 */
const LoadingScreen: React.FunctionComponent<LoadingProps> = ({
  loadingMessage: busyMessage,
}) => {
  const localClasses = useStyles();

  if (busyMessage) {
    return (
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        className={localClasses.loadingContainer}
      >
        <Grid item>
          <CircularProgress
            color="primary"
            className={localClasses.loadingCircle}
          />
        </Grid>
        <Grid item>
          <Typography variant="h3">{busyMessage}</Typography>
        </Grid>
      </Grid>
    );
  } else {
    return <Fragment />;
  }
};

export default LoadingScreen;
