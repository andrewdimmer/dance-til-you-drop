import { load as loadPoseNet, PoseNet } from "@tensorflow-models/posenet";

let poseAnalyzer: PoseNet | null = null;

export const initializePoseNet = (width: number, height: number) => {
  console.log("Initializing PoseNet...");
  if (!poseAnalyzer) {
    loadPoseNet({
      architecture: "MobileNetV1",
      outputStride: 16,
      inputResolution: { width, height },
      multiplier: 0.75,
    })
      .then((analyzer) => {
        console.log("PoseNet Loaded.");
        poseAnalyzer = analyzer;
      })
      .catch((err) => {
        console.log("PoseNet Failed to Load.");
        console.log(err);
      });
  }
};

export const removePoseNet = () => {
  poseAnalyzer = null;
  poseProcessorNumber = 0;
};

let poseProcessorNumber = 0;

const getPoseProcessorNumber = () => poseProcessorNumber;
const getPoseAnalyzer = () => poseAnalyzer;

export const createPoseProcessor = (
  image: HTMLVideoElement,
  instanceNumber: number
) => {
  poseProcessorNumber = instanceNumber;
  poseProcessor(image, instanceNumber);
};

const poseProcessor = (image: HTMLVideoElement, instanceNumber: number) => {
  // Note: Then instance number check verifies that even if more than one call is made,
  // Only one continues to return data recursively.
  if (image && instanceNumber === getPoseProcessorNumber()) {
    getPoseAnalyzer()
      ?.estimateMultiplePoses(image)
      .then((pose) => {
        console.log(pose);
        poseProcessor(image, instanceNumber);
      })
      .catch((err) => {
        console.log(err);
        poseProcessor(image, instanceNumber);
      });
  }
};
