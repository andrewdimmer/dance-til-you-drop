import { Box, Fab } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { Pose } from "@tensorflow-models/posenet";
import React, { Fragment } from "react";
import {
  createPoseProcessor,
  removePoseProcessor,
} from "../../Scripts/posenetProcessPose";
import { renderPosesOnCanvas } from "../../Scripts/posenetRender";

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
  const [poses, setPoses] = React.useState<Pose[]>([]);
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
          renderPosesOnCanvas(canvasRef.current, poses);
        }
      })()}
      <Fab
        color="primary"
        aria-label="add"
        className={classes.fab}
        onClick={() => {
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
