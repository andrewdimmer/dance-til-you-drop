import { Pose } from "@tensorflow-models/posenet";
import { Calibration } from "./danceCalibration";

let danceGeneratorNumber = 0;

export const getDanceGeneratorNumber = () => danceGeneratorNumber;

export const removeDanceGenerator = () => {
  danceGeneratorNumber = 0;
};

export const createDanceGenerator = (
  calibration: Calibration,
  speed: number,
  instanceNumber: number,
  setDance: (pose: Pose) => void
) => {
  danceGeneratorNumber = instanceNumber;
  generateDancePose(calibration, speed, instanceNumber, setDance);
};

const generateDancePose = (
  calibration: Calibration,
  speed: number,
  instanceNumber: number,
  setDance: (pose: Pose) => void
) => {
  if (instanceNumber === getDanceGeneratorNumber()) {
    const leftShoulderXY = { x: 0, y: 0 };
    const rightShoulderDegLen = {
      rad: (Math.random() * 30 - 15) * (Math.PI / 180),
      len: (Math.random() * 0.3 + 0.7) * calibration.shoulderLength,
    };
    const rightShoulderXY = {
      x:
        leftShoulderXY.x +
        rightShoulderDegLen.len * Math.cos(rightShoulderDegLen.rad),
      y:
        leftShoulderXY.y +
        rightShoulderDegLen.len * Math.sin(rightShoulderDegLen.rad),
    };
    const leftElbowDegLen = {
      rad: (Math.random() * 360 - 180) * (Math.PI / 180),
      len: (Math.random() * 0.7 + 0.3) * calibration.upperArmLength,
    };
    const leftElbowXY = {
      x: leftShoulderXY.x - leftElbowDegLen.len * Math.cos(leftElbowDegLen.rad),
      y: leftShoulderXY.y + leftElbowDegLen.len * Math.sin(leftElbowDegLen.rad),
    };
    const rightElbowDegLen = {
      rad: (Math.random() * 360 - 180) * (Math.PI / 180),
      len: (Math.random() * 0.7 + 0.3) * calibration.upperArmLength,
    };
    const rightElbowXY = {
      x:
        rightShoulderXY.x +
        rightElbowDegLen.len * Math.cos(rightElbowDegLen.rad),
      y:
        rightShoulderXY.y +
        rightElbowDegLen.len * Math.sin(rightElbowDegLen.rad),
    };
    const leftWristDegLen = {
      rad: (Math.random() * 300 - 150) * (Math.PI / 180),
      len: (Math.random() * 0.7 + 0.3) * calibration.foreArmLength,
    };
    const leftWristXY = {
      x:
        leftElbowXY.x -
        leftWristDegLen.len *
          Math.cos(-leftWristDegLen.rad + leftElbowDegLen.rad),
      y:
        leftElbowXY.y +
        leftWristDegLen.len *
          Math.sin(-leftWristDegLen.rad + leftElbowDegLen.rad),
    };
    const rightWristDegLen = {
      rad: (Math.random() * 300 - 150) * (Math.PI / 180),
      len: (Math.random() * 0.7 + 0.3) * calibration.foreArmLength,
    };
    const rightWristXY = {
      x:
        rightElbowXY.x +
        rightWristDegLen.len *
          Math.cos(rightWristDegLen.rad + rightElbowDegLen.rad),
      y:
        rightElbowXY.y +
        rightWristDegLen.len *
          Math.sin(rightWristDegLen.rad + rightElbowDegLen.rad),
    };
    const leftHipDegLen = {
      rad: (Math.random() * 45 - 15) * (Math.PI / 180),
      len: (Math.random() * 0.2 + 0.8) * calibration.torsoLength,
    };
    const leftHipXY = {
      x: leftShoulderXY.x + leftHipDegLen.len * Math.sin(leftHipDegLen.rad),
      y: leftShoulderXY.y - leftHipDegLen.len * Math.cos(leftHipDegLen.rad),
    };
    const rightHipDegLen = {
      rad: (Math.random() * 45 - 30) * (Math.PI / 180),
      len: (Math.random() * 0.2 + 0.8) * calibration.torsoLength,
    };
    const rightHipXY = {
      x: rightShoulderXY.x + rightHipDegLen.len * Math.sin(rightHipDegLen.rad),
      y: rightShoulderXY.y - rightHipDegLen.len * Math.cos(rightHipDegLen.rad),
    };
    const leftKneeDegLen = {
      rad: (Math.random() * 120 - 30) * (Math.PI / 180),
      len: (Math.random() * 0.3 + 0.7) * calibration.upperLegLength,
    };
    const leftKneeXY = {
      x: leftHipXY.x + leftKneeDegLen.len * Math.sin(leftKneeDegLen.rad),
      y: leftHipXY.y - leftKneeDegLen.len * Math.cos(leftKneeDegLen.rad),
    };
    const rightKneeDegLen = {
      rad: (Math.random() * 120 - 90) * (Math.PI / 180),
      len: (Math.random() * 0.3 + 0.7) * calibration.upperLegLength,
    };
    const rightKneeXY = {
      x: rightHipXY.x + rightKneeDegLen.len * Math.sin(rightKneeDegLen.rad),
      y: rightHipXY.y - rightKneeDegLen.len * Math.cos(rightKneeDegLen.rad),
    };
    const leftAnkleDegLen = {
      rad: (Math.random() * 360 - 180) * (Math.PI / 180),
      len: (Math.random() * 0.3 + 0.7) * calibration.lowerLegLength,
    };
    const leftAnkleXY = {
      x:
        leftKneeXY.x -
        leftAnkleDegLen.len *
          Math.cos(-leftAnkleDegLen.rad + leftKneeDegLen.rad),
      y:
        leftKneeXY.y +
        leftAnkleDegLen.len *
          Math.sin(-leftAnkleDegLen.rad + leftKneeDegLen.rad),
    };
    const rightAnkleDegLen = {
      rad: (Math.random() * 360 - 180) * (Math.PI / 180),
      len: (Math.random() * 0.3 + 0.7) * calibration.lowerLegLength,
    };
    const rightAnkleXY = {
      x:
        rightKneeXY.x +
        rightAnkleDegLen.len *
          Math.cos(rightAnkleDegLen.rad + rightKneeDegLen.rad),
      y:
        rightKneeXY.y +
        rightAnkleDegLen.len *
          Math.sin(rightAnkleDegLen.rad + rightKneeDegLen.rad),
    };
    setDance({
      keypoints: [
        { score: 0, position: { x: 0, y: 0 }, part: "nose" },
        { score: 0, position: { x: 0, y: 0 }, part: "leftEye" },
        { score: 0, position: { x: 0, y: 0 }, part: "rightEye" },
        { score: 0, position: { x: 0, y: 0 }, part: "leftEar" },
        { score: 0, position: { x: 0, y: 0 }, part: "rightEar" },
        { score: 1, position: leftShoulderXY, part: "leftShoulder" },
        { score: 1, position: rightShoulderXY, part: "rightShoulder" },
        { score: 1, position: leftElbowXY, part: "leftElbow" },
        { score: 1, position: rightElbowXY, part: "rightElbow" },
        { score: 1, position: leftWristXY, part: "leftWrist" },
        { score: 1, position: rightWristXY, part: "rightWrist" },
        { score: 1, position: leftHipXY, part: "leftHip" },
        { score: 1, position: rightHipXY, part: "rightHip" },
        { score: 1, position: leftKneeXY, part: "leftKnee" },
        { score: 1, position: rightKneeXY, part: "rightKnee" },
        { score: 1, position: leftAnkleXY, part: "leftAnkle" },
        { score: 1, position: rightAnkleXY, part: "rightAnkle" },
      ],
      score: 1,
    });

    setTimeout(
      () => generateDancePose(calibration, speed, instanceNumber, setDance),
      speed
    );
  }
};
