import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";
import { Calibration } from "../../../Scripts/danceCalibration";
import FullScreenWebcamOverlay from "../FullScreenWebcamOverlay";

declare interface DanceProps {
  nextStep: () => void;
  previousStep: () => void;
  classes: any;
  calibration: Calibration;
  danceName?: string;
  speed?: number;
}

const Dance: React.FunctionComponent<DanceProps> = ({
  nextStep,
  previousStep,
  classes,
  calibration,
  danceName,
  speed,
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
          calibration={calibration}
          danceName={danceName}
          speed={speed}
        />
      )}
    </Fragment>
  );
};

export default Dance;
