import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import FullScreenWebcamOverlay from "../FullScreenWebcamOverlay";

declare interface DanceProps {
  nextStep: () => void;
  previousStep: () => void;
  classes: any;
}

const Dance: React.FunctionComponent<DanceProps> = ({
  nextStep,
  previousStep,
  classes,
}) => {
  const [dancing, setDancing] = React.useState<boolean>(false);

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h4">Dance!</Typography>
      </Container>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        Ready? Press the button below to start!
      </Typography>
      <Button
        color="primary"
        fullWidth
        variant="contained"
        size="large"
        className={classes.marginedTopBottom}
        disabled={dancing}
        onClick={() => {
          setDancing(true);
        }}
      >
        <Typography variant="h5">Start Dancing!</Typography>
      </Button>
      <Button
        color="primary"
        variant="outlined"
        className={classes.marginedTopBottom}
        disabled={dancing}
        onClick={previousStep}
      >
        <Typography variant="body1">Choose another dance</Typography>
      </Button>
      {dancing && (
        <FullScreenWebcamOverlay
          onClose={() => {
            setDancing(false);
            nextStep();
          }}
          classes={classes}
        />
      )}
    </Fragment>
  );
};

export default Dance;
