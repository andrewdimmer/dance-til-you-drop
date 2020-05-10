import { Button, Container, Typography, Slider } from "@material-ui/core";
import React, { Fragment } from "react";

declare interface SelectDanceProps {
  nextStep: () => void;
  previousStep: () => void;
  skipStep: () => void;
  classes: any;
  setDanceName: (name: string) => void;
  setSpeed: (speed: number) => void;
}

const SelectDance: React.FunctionComponent<SelectDanceProps> = ({
  nextStep,
  previousStep,
  skipStep,
  classes,
  setDanceName,
  setSpeed,
}) => {
  const [dances, setDances] = React.useState<string[]>([]);

  const handleSpeedChange = (event: any, newValue: number | number[]) => {
    setSpeed(
      10000 - (typeof newValue !== "number" ? newValue[0] : newValue) * 8
    );
  };

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
      <Container>
        <Slider
          defaultValue={0}
          aria-labelledby="discrete-slider-custom"
          step={25}
          valueLabelDisplay="off"
          onChange={handleSpeedChange}
          marks={[
            {
              value: 0,
              label: '"Normal" Speed',
            },
            {
              value: 25,
              label: "Light Speed",
            },
            {
              value: 50,
              label: "Ridiculous Speed",
            },
            {
              value: 75,
              label: "Ludicrous Speed",
            },
            {
              value: 100,
              label: "Plaid",
            },
          ]}
        />
      </Container>
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
