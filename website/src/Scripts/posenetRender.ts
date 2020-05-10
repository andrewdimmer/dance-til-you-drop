import {
  Pose,
  Keypoint,
  getAdjacentKeyPoints,
} from "@tensorflow-models/posenet";

const lineWidth = 2;

export function renderPosesOnCanvas(
  canvas: HTMLCanvasElement,
  poses: Pose[],
  matchMe?: Pose
) {
  const ctx = canvas.getContext("2d");
  const video = document.getElementById("video") as HTMLVideoElement;

  if (ctx) {
    // since images are being fed from a webcam, we want to feed in the
    // original image and then just flip the keypoints' x coordinates. If instead
    // we flip the image, then correcting left-right keypoint pairs requires a
    // permutation on all the keypoints.
    const flipPoseHorizontal = true;

    canvas.width = video.width;
    canvas.height = video.height;

    const minPoseConfidence = 0.15;
    const minPartConfidence = 0.1;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-canvas.width, 0);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.restore();

    // For each pose (i.e. person) detected in an image, loop through the poses
    // and draw the resulting skeleton and keypoints if over certain confidence
    // scores
    poses.forEach(({ score, keypoints }) => {
      if (score >= minPoseConfidence) {
        drawKeypoints(keypoints, minPartConfidence, ctx);
        drawSkeleton(keypoints, minPartConfidence, ctx);
        if (matchMe) {
          const matchMeKeypoints = matchMe.keypoints.map((keypoint) => {
            return {
              part: keypoint.part,
              position: {
                x: keypoint.position.x + keypoints[5].position.x,
                y: keypoint.position.y + keypoints[5].position.y,
              },
              score: keypoint.score,
            };
          });
          drawKeypoints(matchMeKeypoints, minPartConfidence, ctx, "white");
          drawSkeleton(matchMeKeypoints, minPartConfidence, ctx, "white");
        }
      }
    });
  }
}

function toTuple({ y, x }: { y: number; x: number }) {
  return [y, x];
}

export function drawPoint(
  ctx: CanvasRenderingContext2D,
  y: number,
  x: number,
  r: number,
  color: string
) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

/**
 * Draws a line on a canvas, i.e. a joint
 */
export function drawSegment(
  [ay, ax]: number[],
  [by, bx]: number[],
  color: string,
  scale: number,
  ctx: CanvasRenderingContext2D
) {
  ctx.beginPath();
  ctx.moveTo(ax * scale, ay * scale);
  ctx.lineTo(bx * scale, by * scale);
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;
  ctx.stroke();
}

/**
 * Draws a pose skeleton by looking up all adjacent keypoints/joints
 */
export function drawSkeleton(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  color = "aqua",
  scale = 1
) {
  const adjacentKeyPoints = getAdjacentKeyPoints(keypoints, minConfidence);

  adjacentKeyPoints.forEach((keypoints) => {
    drawSegment(
      toTuple(keypoints[0].position),
      toTuple(keypoints[1].position),
      color,
      scale,
      ctx
    );
  });
}

/**
 * Draw pose keypoints onto a canvas
 */
export function drawKeypoints(
  keypoints: Keypoint[],
  minConfidence: number,
  ctx: CanvasRenderingContext2D,
  color = "aqua",
  scale = 1
) {
  for (let i = 0; i < keypoints.length; i++) {
    const keypoint = keypoints[i];

    if (keypoint.score < minConfidence) {
      continue;
    }

    const { y, x } = keypoint.position;
    drawPoint(ctx, y * scale, x * scale, 3, color);
  }
}
