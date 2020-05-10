import { Pose } from "@tensorflow-models/posenet";

let calibrationNumber = 0;
export const getCalibrationNumber = () => calibrationNumber;
export const setCalibrationNumber = (calNumber: number) => {
  calibrationNumber = calNumber;
};

const minPartConfidence = 0.1;
const minPoseConfidence = 0.15;

export declare interface Calibration {
  upperArmLength: number;
  foreArmLength: number;
  upperLegLength: number;
  lowerLegLength: number;
  wasitLength: number;
  shoulderLength: number;
  torsoLength: number;
}

const getCalibrationHelper = (pose: Pose): Calibration | null => {
  //TODO: Add Error Checking if pose does not have all points.
  let valid = true;
  const keypoints = pose.keypoints;
  for (let i = 5; i < 17; i++) {
    if (keypoints[i].score < minPartConfidence) {
      valid = false;
    }
  }

  if (valid) {
    return {
      upperArmLength: Math.max(
        Math.sqrt(
          Math.pow(keypoints[5].position.x - keypoints[7].position.x, 2) +
            Math.pow(keypoints[5].position.y - keypoints[7].position.y, 2)
        ),
        Math.sqrt(
          Math.pow(keypoints[6].position.x - keypoints[8].position.x, 2) +
            Math.pow(keypoints[6].position.y - keypoints[8].position.y, 2)
        )
      ),
      foreArmLength: Math.max(
        Math.sqrt(
          Math.pow(keypoints[7].position.x - keypoints[9].position.x, 2) +
            Math.pow(keypoints[7].position.y - keypoints[9].position.y, 2)
        ),
        Math.sqrt(
          Math.pow(keypoints[8].position.x - keypoints[10].position.x, 2) +
            Math.pow(keypoints[8].position.y - keypoints[10].position.y, 2)
        )
      ),
      upperLegLength: Math.max(
        Math.sqrt(
          Math.pow(keypoints[11].position.x - keypoints[13].position.x, 2) +
            Math.pow(keypoints[11].position.y - keypoints[13].position.y, 2)
        ),
        Math.sqrt(
          Math.pow(keypoints[12].position.x - keypoints[14].position.x, 2) +
            Math.pow(keypoints[12].position.y - keypoints[14].position.y, 2)
        )
      ),
      lowerLegLength: Math.max(
        Math.sqrt(
          Math.pow(keypoints[13].position.x - keypoints[15].position.x, 2) +
            Math.pow(keypoints[13].position.y - keypoints[15].position.y, 2)
        ),
        Math.sqrt(
          Math.pow(keypoints[14].position.x - keypoints[16].position.x, 2) +
            Math.pow(keypoints[14].position.y - keypoints[16].position.y, 2)
        )
      ),
      wasitLength: Math.sqrt(
        Math.pow(keypoints[11].position.x - keypoints[12].position.x, 2) +
          Math.pow(keypoints[11].position.y - keypoints[12].position.y, 2)
      ),
      shoulderLength: Math.sqrt(
        Math.pow(keypoints[5].position.x - keypoints[6].position.x, 2) +
          Math.pow(keypoints[5].position.y - keypoints[6].position.y, 2)
      ),
      torsoLength: Math.max(
        Math.sqrt(
          Math.pow(keypoints[5].position.x - keypoints[11].position.x, 2) +
            Math.pow(keypoints[5].position.y - keypoints[11].position.y, 2)
        ),
        Math.sqrt(
          Math.pow(keypoints[6].position.x - keypoints[12].position.x, 2) +
            Math.pow(keypoints[6].position.y - keypoints[12].position.y, 2)
        )
      ),
    };
  } else {
    return null;
  }
};

export const getCalibration = (poses: Pose[]): Calibration | null => {
  for (let i = 0; i < poses.length; i++) {
    const temp = getCalibrationHelper(poses[i]);
    if (minPoseConfidence < poses[i].score && temp) {
      return temp;
    }
  }
  return null;
};
