import { Box, Fab } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Pose } from "@tensorflow-models/posenet";
import React, { Fragment } from "react";
import {
  createPoseProcessor,
  getLastPoses,
  removePoseProcessor,
} from "../../Scripts/posenetProcessPose";
import { renderPosesOnCanvas } from "../../Scripts/posenetRender";
import {
  getCalibrationNumber,
  setCalibrationNumber,
  Calibration,
} from "../../Scripts/danceCalibration";
import {
  createDanceGenerator,
  removeDanceGenerator,
} from "../../Scripts/danceGeneration";

declare interface FullScreenWebcamOverlayProps {
  onClose: () => void;
  classes: any;
  setCalibration?: (poses: Pose[]) => void;
  calibration?: Calibration;
  danceName?: string;
  speed?: number;
}

const FullScreenWebcamOverlay: React.FunctionComponent<FullScreenWebcamOverlayProps> = ({
  onClose,
  classes,
  setCalibration,
  calibration,
  danceName,
  speed,
}) => {
  const [maxWidth, setMaxWidth] = React.useState<number>(0);
  const [maxHeight, setMaxHeight] = React.useState<number>(0);
  const [poses, setPoses] = React.useState<Pose[]>([]);
  const [matchMe, setMatchMe] = React.useState<Pose | undefined>(undefined);
  const screenWidth = React.useRef<HTMLDivElement>(null);
  const screenHeight = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const computeWidthAndHeight = () => {
    if (
      screenWidth.current &&
      screenHeight.current &&
      (screenWidth.current.clientWidth !== maxWidth ||
        screenHeight.current.clientHeight !== maxHeight)
    ) {
      setMaxHeight(screenHeight.current.clientHeight);
      setMaxWidth(screenWidth.current.clientWidth);
      {
        createPoseProcessor(
          screenWidth.current.clientWidth,
          screenHeight.current.clientHeight,
          Math.floor(Math.random() * 1000000000) + 1,
          handleUpdatePoses
        );
        if (setCalibration && getCalibrationNumber() === 0) {
          const calNumber = Math.floor(Math.random() * 1000000000) + 1;
          setCalibrationNumber(calNumber);
          ((calNumber: number) =>
            setTimeout(() => {
              const tempPoses = getLastPoses();
              if (getCalibrationNumber() === calNumber) {
                if (tempPoses.length > 0) {
                  setCalibration(tempPoses);
                  setCalibrationNumber(0);
                  removePoseProcessor();
                }
              }
            }, 10000))(calNumber);
        }
        console.log(calibration);
        console.log(speed);
        if (calibration && speed) {
          createDanceGenerator(
            calibration,
            speed,
            Math.floor(Math.random() * 1000000000) + 1,
            handleUpdateMatchMe
          );
        }
      }
    }
  };

  const initializeSize = () => {
    computeWidthAndHeight();
    window.addEventListener("resize", () => {
      setTimeout(computeWidthAndHeight, 1);
    });
  };

  const handleUpdatePoses = (poses: Pose[]) => {
    setPoses(poses);
  };

  const handleUpdateMatchMe = (pose: Pose) => {
    setMatchMe(pose);
  };

  return (
    <Box className={classes.playBox}>
      <div
        ref={screenWidth}
        style={{
          width: "100%",
          height: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <div
        ref={screenHeight}
        style={{
          width: 0,
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      {setTimeout(initializeSize, 1) && <Fragment />}
      <canvas ref={canvasRef}></canvas>
      {(() => {
        if (canvasRef.current) {
          renderPosesOnCanvas(canvasRef.current, poses, matchMe);
        }
      })()}
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={() => {
          removePoseProcessor();
          removeDanceGenerator();
          onClose();
        }}
      >
        <CloseIcon />
      </Fab>
    </Box>
  );
};

export default FullScreenWebcamOverlay;
