import { load as loadPoseNet, PoseNet } from "@tensorflow-models/posenet";

export const removePoseProcessor = () => {
  poseProcessorNumber = 0;
  console.log("Remove Old PoseNet");
  const video = document.getElementById("video") as HTMLVideoElement;
  const srcObject = video.srcObject as MediaStream | null;
  srcObject?.getTracks().forEach((track) => track.stop());
};

let poseProcessorNumber = 0;

export const getPoseProcessorNumber = () => poseProcessorNumber;

export const createPoseProcessor = (
  videoWidth: number,
  videoHeight: number,
  instanceNumber: number
) => {
  poseProcessorNumber = instanceNumber;

  try {
    loadVideo(videoWidth, videoHeight)
      .then((video) => {
        createInitialPoseNet()
          .then((analyzer) => {
            console.log("PoseNet Loaded.");
            console.log(analyzer.baseModel);
            detectPoseInRealTime(video, analyzer, instanceNumber);
          })
          .catch((err) => {
            console.log("PoseNet Failed to Load.");
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    console.log(err);
  }
};

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isiOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isMobile() {
  return isAndroid() || isiOS();
}

/**
 * Loads a the camera to be used in the demo
 *
 */
async function setupCamera(videoWidth: number, videoHeight: number) {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      "Browser API navigator.mediaDevices.getUserMedia not available"
    );
  }

  const video = document.getElementById("video") as HTMLVideoElement;
  video.width = videoWidth;
  video.height = videoHeight;

  const mobile = isMobile();
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      facingMode: "user",
      width: mobile ? undefined : videoWidth,
      height: mobile ? undefined : videoHeight,
    },
  });
  video.srcObject = stream;

  return new Promise<HTMLVideoElement>((resolve) => {
    video.onloadedmetadata = () => {
      resolve(video);
    };
  });
}

export async function loadVideo(videoWidth: number, videoHeight: number) {
  const video = await setupCamera(videoWidth, videoHeight);
  video.play();

  return video;
}

const defaultQuantBytes: any = 2;

const defaultMobileNetMultiplier: any = isMobile() ? 0.5 : 0.75;
const defaultMobileNetStride: any = 16;
const defaultMobileNetInputResolution: any = {
  width: 600, //videoWidth,
  height: 500, //videoHeight,
};

const guiState = {
  input: {
    architecture: "MobileNetV1",
    outputStride: defaultMobileNetStride,
    inputResolution: defaultMobileNetInputResolution,
    multiplier: defaultMobileNetMultiplier,
    quantBytes: defaultQuantBytes,
  },
  multiPoseDetection: {
    maxPoseDetections: 5,
    minPoseConfidence: 0.15,
    minPartConfidence: 0.1,
    nmsRadius: 30.0,
  },
  output: {
    showVideo: true,
    showSkeleton: true,
    showPoints: true,
    showBoundingBox: false,
  },
  net: null,
};

/**
 * Feeds an image to posenet to estimate poses - this is where the magic
 * happens. This function loops with a requestAnimationFrame method.
 */
function detectPoseInRealTime(
  video: HTMLVideoElement,
  net: PoseNet,
  instanceNumber: number
) {
  /* const canvas = document.getElementById("output");
  const ctx = canvas.getContext("2d");

  // since images are being fed from a webcam, we want to feed in the
  // original image and then just flip the keypoints' x coordinates. If instead
  // we flip the image, then correcting left-right keypoint pairs requires a
  // permutation on all the keypoints.

  canvas.width = videoWidth;
  canvas.height = videoHeight; */

  const flipPoseHorizontal = true;

  async function poseDetectionFrame() {
    if (instanceNumber === getPoseProcessorNumber()) {
      let allPoses = await net.estimatePoses(video, {
        flipHorizontal: flipPoseHorizontal,
        decodingMethod: "multi-person",
        maxDetections: guiState.multiPoseDetection.maxPoseDetections,
        scoreThreshold: guiState.multiPoseDetection.minPartConfidence,
        nmsRadius: guiState.multiPoseDetection.nmsRadius,
      });

      console.log(allPoses);
    }

    // Used to draw results; will likely be handled by React in a callback
    /* let poses = [].concat(allPoses);
    let minPoseConfidence = +guiState.multiPoseDetection.minPoseConfidence;
    let minPartConfidence = +guiState.multiPoseDetection.minPartConfidence;

    
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (guiState.output.showVideo) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.translate(-videoWidth, 0);
      ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
      ctx.restore();
    }

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
        if (guiState.output.showPoints) {
          drawKeypoints(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showSkeleton) {
          drawSkeleton(keypoints, minPartConfidence, ctx);
        }
        if (guiState.output.showBoundingBox) {
          drawBoundingBox(keypoints, ctx);
        }
      }
    });*/

    requestAnimationFrame(poseDetectionFrame);
  }

  poseDetectionFrame();
}

async function createInitialPoseNet() {
  return loadPoseNet({
    architecture: guiState.input.architecture as any,
    outputStride: guiState.input.outputStride,
    inputResolution: guiState.input.inputResolution,
    multiplier: guiState.input.multiplier,
    quantBytes: guiState.input.quantBytes,
  });
}
