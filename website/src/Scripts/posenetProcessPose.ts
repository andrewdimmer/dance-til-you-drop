import { load as loadPoseNet, PoseNet } from "@tensorflow-models/posenet";

export const removePoseProcessor = () => {
  poseProcessorNumber = 0;
  console.log("Remove Old PoseNet");
};

let poseProcessorNumber = 0;

const getPoseProcessorNumber = () => poseProcessorNumber;

export const createPoseProcessor = (
  image: HTMLVideoElement,
  instanceNumber: number
) => {
  console.log(image);
  if (image) {
    poseProcessorNumber = instanceNumber;
    console.log(image.videoWidth + ", " + image.videoHeight);
    if (image.videoWidth === 0 || image.videoWidth === 0) {
      image.addEventListener("loadedmetadata", function (event) {
        console.log(this.videoWidth + ", " + this.videoHeight);
        createPoseNet(this, instanceNumber);
      });
    } else {
      createPoseNet(image, instanceNumber);
    }
  }
};

const createPoseNet = (image: HTMLVideoElement, instanceNumber: number) => {
  loadPoseNet({
    architecture: "MobileNetV1",
    outputStride: 16,
    inputResolution: { width: image.videoWidth, height: image.videoHeight },
    multiplier: 0.75,
  })
    .then((analyzer) => {
      console.log("PoseNet Loaded.");
      console.log(analyzer.baseModel);
      poseProcessor(image, analyzer, instanceNumber);
    })
    .catch((err) => {
      console.log("PoseNet Failed to Load.");
      console.log(err);
    });
};

const poseProcessor = (
  image: HTMLVideoElement,
  poseAnalyzer: PoseNet,
  instanceNumber: number
) => {
  // Note: Then instance number check verifies that even if more than one call is made,
  // Only one continues to return data recursively.
  if (image && instanceNumber === getPoseProcessorNumber()) {
    poseAnalyzer
      .estimateSinglePose(image)
      .then((pose) => {
        console.log(pose);
        poseProcessor(image, poseAnalyzer, instanceNumber);
      })
      .catch((err) => {
        console.log(err);
        poseProcessor(image, poseAnalyzer, instanceNumber);
      });
  }
};
