import {
  Container,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@material-ui/core";
import { Pose } from "@tensorflow-models/posenet";
import React, { Fragment } from "react";
import { PageProps } from ".";
import { Calibration, getCalibration } from "../../Scripts/danceCalibration";
import CalibrateCamera from "../Content/GameModules/CalibrateCamera";
import Dance from "../Content/GameModules/Dance";
import GrantCameraAccess from "../Content/GameModules/GrantCameraAccess";
import ScoreScreen from "../Content/GameModules/ScoreScreen";
import SelectDance from "../Content/GameModules/SelectDance";
import ErrorPage from "./ErrorPage";

const PlayPage: React.FunctionComponent<PageProps> = ({
  currentUser,
  currentUserProfile,
  setPageKey,
  setNotification,
  setLoadingMessage,
  handleLoadUserData,
  classes,
}) => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [calibration, setCalibration] = React.useState<Calibration | null>(
    null
  );
  const [danceName, setDanceName] = React.useState<string>("");
  const [speed, setSpeed] = React.useState<number>(10000);
  const steps = [
    "Grant Camera Permission",
    "Calibrate Camera",
    "Select a Dance",
    "Dance!",
  ];

  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return (
          <GrantCameraAccess
            setNotification={setNotification}
            nextStep={handleNext}
            classes={classes}
          />
        );
      case 1:
        return (
          <CalibrateCamera
            nextStep={handleNext}
            previousStep={handleBack}
            classes={classes}
            setCalibration={handleCalibration}
          />
        );
      case 2:
        return (
          <SelectDance
            nextStep={handleNext}
            previousStep={handleBack}
            skipStep={handleSkip}
            classes={classes}
          />
        );
      case 3:
        if (calibration !== null) {
          return (
            <Dance
              nextStep={handleNext}
              previousStep={handleBack}
              classes={classes}
              calibration={calibration}
              danceName={danceName !== "" ? danceName : undefined}
              speed={danceName === "" ? speed : undefined}
            />
          );
        } else {
          return (
            <Typography variant="body1">
              Error! Calibration is not set. Please refresh the page and try
              again.
            </Typography>
          );
        }
      case 4:
        return (
          <ScoreScreen
            previousStep={handleBack}
            setPageKey={setPageKey}
            classes={classes}
          />
        );
      default:
        return (
          <ErrorPage
            setPageKey={setPageKey}
            setLoadingMessage={setLoadingMessage}
            setNotification={setNotification}
            handleLoadUserData={handleLoadUserData}
            currentUser={currentUser}
            currentUserProfile={currentUserProfile}
            classes={classes}
          />
        );
    }
  }

  const isStepOptional = (step: number) => {
    return step === 2;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      setNotification({
        type: "warning",
        message: "You can't skip a step that is not optional!",
        open: true,
      });
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleCalibration = (poses: Pose[]) => {
    const temp = getCalibration(poses);
    if (temp) {
      setCalibration(temp);
      handleNext();
    } else {
      setNotification({
        type: "error",
        message: "Calibration Failed. Please try again.",
        open: true,
      });
    }
  };

  return (
    <Fragment>
      <Container className={classes.pageTitle}>
        <Typography variant="h3">
          Let's get ready to play Dance Til You Drop!
        </Typography>
      </Container>
      <Stepper activeStep={activeStep} className={classes.themeBackgroundColor}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: { optional?: React.ReactNode } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {getStepContent(activeStep)}
    </Fragment>
  );
};

export default PlayPage;
