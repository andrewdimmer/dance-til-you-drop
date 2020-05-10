import { Box, Fab } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { Fragment } from "react";
import Webcam from "react-webcam";
import {
  createPoseProcessor,
  removePoseProcessor,
} from "../../Scripts/posenetProcessPose";

declare interface FullScreenWebcamOverlayProps {
  onClose: () => void;
  classes: any;
}

const FullScreenWebcamOverlay: React.FunctionComponent<FullScreenWebcamOverlayProps> = ({
  onClose,
  classes,
}) => {
  const [maxWidth, setMaxWidth] = React.useState<number>(0);
  const [maxHeight, setMaxHeight] = React.useState<number>(0);
  const [accessingCamera, setAccessingCamera] = React.useState<boolean>(true);
  const screenWidth = React.useRef<HTMLDivElement>(null);
  const screenHeight = React.useRef<HTMLDivElement>(null);
  const webcamRef = React.useRef<any>(null);

  const computeWidthAndHeight = () => {
    if (screenWidth.current && screenHeight.current) {
      setMaxHeight(screenHeight.current.clientHeight);
      setMaxWidth(screenWidth.current.clientWidth);
      removePoseProcessor();
    }
  };

  const initializeSize = () => {
    computeWidthAndHeight();
    window.addEventListener("resize", () => {
      setTimeout(computeWidthAndHeight, 1);
    });
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
      {accessingCamera && (
        <Webcam
          audio={false}
          mirrored={true}
          onUserMedia={() => {
            setTimeout(() => {
              createPoseProcessor(
                webcamRef.current.video,
                Math.floor(Math.random() * 1000000000) + 1
              );
            }, 2000);
          }}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={{ width: maxWidth, height: maxHeight }}
          className={classes.fullSize}
        />
      )}
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={() => {
          setAccessingCamera(false);
          console.log("Camera Closed:" + accessingCamera);
          removePoseProcessor();
          setTimeout(() => {
            onClose();
          }, 500);
        }}
      >
        <CloseIcon />
      </Fab>
    </Box>
  );
};

export default FullScreenWebcamOverlay;
