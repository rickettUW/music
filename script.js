const cam=document.getElementById('cam');
navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false})
.then(s=>cam.srcObject=s)
.catch(()=>alert('Camera access required'));

const canvas=document.getElementById('strip');
const ctx=canvas.getContext('2d');
const countdown=document.getElementById('countdown');
const framePicker=document.getElementById('framePicker');
const frame=document.getElementById('frame');

framePicker.onchange=()=>{
  frame.style.borderImage=`url(assets/frames/${framePicker.value}) 30 stretch`;
};

const icons=['heart','guitar','drumsticks','star'];
let shot=0;

async function themedCountdown(){
  for(const i of icons){
    countdown.innerHTML=`<img src="assets/ui/${i}.png">`;
    await new Promise(r=>setTimeout(r,800));
  }
  countdown.innerHTML='';
}

snap.onclick=async()=>{
  if(shot>=4)return;
  await themedCountdown();
  const h=canvas.height/4;
  ctx.drawImage(cam,0,shot*h,canvas.width,h);
  shot++;
};

download.onclick=()=>{
  const a=document.createElement('a');
  a.href=canvas.toDataURL('image/png');
  a.download='beautiful-stranger.png';
  a.click();
};
