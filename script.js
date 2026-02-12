const video = document.getElementById("video");

async function startCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: "user" },
    audio: false
  });
  video.srcObject = stream;
}

document.getElementById("start").addEventListener("click", () => {
  startCamera();
});

let shots = [];

navigator.mediaDevices.getUserMedia({
  video: { facingMode: "user" }
}).then(stream => {
  video.srcObject = stream;
});

video.onloadedmetadata = () => {
  capture.width = video.videoWidth;
  capture.height = video.videoHeight;
};

document.getElementById("frameSelect").onchange = e => {
  frame.src = `assets/frames/${e.target.value}`;
};

function doCountdown(number) {
  return new Promise(resolve => {
    countdown.textContent = number;
    setTimeout(() => {
      countdown.textContent = "";
      resolve();
    }, 700);
  });
}

async function takePhoto() {
  ctx.drawImage(video, 0, 0, capture.width, capture.height);
  ctx.drawImage(frame, 0, 0, capture.width, capture.height);
  ctx.drawImage(grain, 0, 0, capture.width, capture.height);
  shots.push(capture.toDataURL("image/png"));
}

document.getElementById("start").onclick = async () => {
  shots = [];
  for (let i = 0; i < 4; i++) {
    await doCountdown(3);
    await takePhoto();
    await new Promise(r => setTimeout(r, 300));
  }

  const w = capture.width;
  const h = capture.height;
  strip.width = w;
  strip.height = h * 4;

  shots.forEach((src, i) => {
    const img = new Image();
    img.onload = () => {
      stripCtx.drawImage(img, 0, h * i, w, h);
    };
    img.src = src;
  });
};

document.getElementById("download").onclick = () => {
  const a = document.createElement("a");
  a.href = strip.toDataURL("image/png");
  a.download = "beautiful-stranger-strip.png";
  a.click();

  // reset after save
  stripCtx.clearRect(0,0,strip.width,strip.height);
};
const video = document.getElementById("video");
const capture = document.getElementById("capture");
const strip = document.getElementById("strip");
const frame = document.getElementById("frame");
const countdownImg = document.getElementById("countdownImg");

const ctx = capture.getContext("2d");
const stripCtx = strip.getContext("2d");

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

document.getElementById("frameSelect").onchange = e => {
  frame.src = "frames/" + e.target.value;
};

document.getElementById("start").onclick = async () => {
  strip.width = capture.width = video.videoWidth;
  capture.height = video.videoHeight;
  strip.height = capture.height * 4;

  for (let i = 0; i < 4; i++) {
    await countdown(i + 1);
    ctx.drawImage(video, 0, 0, capture.width, capture.height);
    stripCtx.drawImage(capture, 0, capture.height * i);
  }

  autoDownload();
};

async function countdown(n) {
  countdownImg.src = `countdown/${n}.png`;
  countdownImg.style.display = "block";
  await new Promise(r => setTimeout(r, 900));
  countdownImg.style.display = "none";
}

function autoDownload() {
  const link = document.createElement("a");
  link.download = "beautiful-stranger-strip.png";
  link.href = strip.toDataURL("image/png");
  link.click();
}

};

