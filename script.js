const video = document.getElementById("video");
const capture = document.getElementById("capture");
const ctx = capture.getContext("2d");

const strip = document.getElementById("strip");
const stripCtx = strip.getContext("2d");

const frame = document.getElementById("frame");
const grain = document.getElementById("grain");
const countdown = document.getElementById("countdown");

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

};

