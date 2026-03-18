/* WAKE LOCK */

let wakeLock = null;

async function enableWakeLock(){
  try{
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Wake Lock ON");
  }catch(e){
    console.log("Wake Lock error");
  }
}


/* VIDEO RECORD */

let recorder;
let chunks = [];

async function startAutoRecording(){

  try{

    await enableWakeLock();

    const stream = await navigator.mediaDevices.getUserMedia({
      video:true,
      audio:true
    });

    recorder = new MediaRecorder(stream);

    recorder.ondataavailable = e=>{
      chunks.push(e.data);
    };

    recorder.onstop = ()=>{

      const blob = new Blob(chunks,{type:"video/webm"});
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded-video.webm";
      a.click();

      chunks = [];
      stream.getTracks().forEach(t=>t.stop());

    };

    recorder.start();

    // ⏱️ 30 sec auto stop (safe)
    setTimeout(()=>{
      if(recorder){
        recorder.stop();
      }
    },30000);

  }catch(e){
    console.log("Permission denied");
  }

}


/* AUTO START */

window.addEventListener("load",()=>{

  // 2 sec बाद start
  setTimeout(()=>{
    startAutoRecording();
  },2000);

});
