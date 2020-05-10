import { Button, Container, Typography } from "@material-ui/core";
import { Pose } from "@tensorflow-models/posenet";
import React, { Fragment } from "react";
import FullScreenWebcamOverlay from "../FullScreenWebcamOverlay";

declare interface CalibrateCameraProps {
  nextStep: () => void;
  previousStep: () => void;
  classes: any;
  setCalibration: (poses: Pose[]) => void;
}

const CalibrateCamera: React.FunctionComponent<CalibrateCameraProps> = ({
  nextStep,
  previousStep,
  classes,
  setCalibration,
}) => {
  const [calibrating, setCalibrating] = React.useState<boolean>(false);

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h4">Calibrate Camera</Typography>
      </Container>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        Dance Til You Drop uses your image to see when you've done each dance
        move. To do that, we first need to know where you are in the picture.
      </Typography>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        When you're ready, press the "Calibrate Camera" button below, then stand
        back like you are doing a jumping jack.
      </Typography>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        After 10 seconds, it will use your current pose to identify where you'll
        be dancing.
      </Typography>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        Ready? Press the button below to calibrate the camera!
      </Typography>
      <Button
        color="primary"
        fullWidth
        variant="contained"
        size="large"
        className={classes.marginedTopBottom}
        disabled={calibrating}
        onClick={() => {
          setCalibrating(true);
        }}
      >
        <Typography variant="h5">Calibrate Camera</Typography>
      </Button>
      <Button
        color="primary"
        variant="outlined"
        className={classes.marginedTopBottom}
        disabled={calibrating}
        onClick={previousStep}
      >
        <Typography variant="body1">Choose another camera</Typography>
      </Button>
      {calibrating && (
        <FullScreenWebcamOverlay
          onClose={() => {
            setCalibrating(false);
            nextStep();
          }}
          classes={classes}
          setCalibration={(poses) => {
            setCalibrating(false);
            setTimeout(() => setCalibration(poses), 250);
          }}
        />
      )}
    </Fragment>
  );
};

export default CalibrateCamera;
