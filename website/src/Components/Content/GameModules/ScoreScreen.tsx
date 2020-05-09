import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";

declare interface ScoreScreenProps {
  setPageKey: (pageKey: string) => void;
  previousStep: () => void;
  classes: any;
}

const ScoreScreen: React.FunctionComponent<ScoreScreenProps> = ({
  setPageKey,
  previousStep,
  classes,
}) => {
  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h4">Great Job!</Typography>
      </Container>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        You earned a score!
      </Typography>
      <Button
        color="primary"
        fullWidth
        variant="contained"
        size="large"
        className={classes.marginedTopBottom}
        onClick={previousStep}
      >
        <Typography variant="h5">Replay the same dance</Typography>
      </Button>
      <Button
        color="primary"
        fullWidth
        variant="contained"
        size="large"
        className={classes.marginedTopBottom}
        onClick={() => {
          previousStep();
          previousStep();
        }}
      >
        <Typography variant="h5">Choose another dance</Typography>
      </Button>
      <Button
        color="primary"
        fullWidth
        variant="outlined"
        size="large"
        className={classes.marginedTopBottom}
        onClick={() => {
          setPageKey("home");
        }}
      >
        <Typography variant="h5">Return to Home</Typography>
      </Button>
    </Fragment>
  );
};

export default ScoreScreen;
