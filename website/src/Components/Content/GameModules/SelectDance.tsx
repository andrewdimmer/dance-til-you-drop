import { Button, Container, Typography } from "@material-ui/core";
import React, { Fragment } from "react";

declare interface SelectDanceProps {
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  classes: any;
}

const SelectDance: React.FunctionComponent<SelectDanceProps> = ({
  nextStep,
  previousStep,
  skipStep,
  classes,
}) => {
  const [dances, setDances] = React.useState<string[]>([]);

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h4">Select a Dance</Typography>
      </Container>
      {dances.length === 0 && (
        <Typography variant="body1">
          No pre-made dances are available at this time.
        </Typography>
      )}
      <Container className={classes.pageTitle}>
        <Typography variant="h4" className={classes.marginedTopBottom}>
          Dance Party Mode!
        </Typography>
      </Container>

      <Typography variant="body1" className={classes.marginedTopBottom}>
        Dance to for as long as you can.
      </Typography>
      <Typography variant="body1" className={classes.marginedTopBottom}>
        Try to match the random pose before the time runs out. Get the pose
        faster, and earn more points!
      </Typography>
      <Button
        color="primary"
        fullWidth
        variant="contained"
        size="large"
        className={classes.marginedTopBottom}
        onClick={skipStep}
      >
        <Typography variant="h5">Dance Party!</Typography>
      </Button>
      <Button
        color="primary"
        variant="outlined"
        className={classes.marginedTopBottom}
        onClick={previousStep}
      >
        <Typography variant="body1">Recalibrate camera</Typography>
      </Button>
    </Fragment>
  );
};

export default SelectDance;
