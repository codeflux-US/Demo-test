/* WAKE LOCK */
let wakeLock = null;

async function enableWakeLock(){
  try{
    wakeLock = await navigator.wakeLock.request("screen");
    console.log("Wake Lock ON");
  }catch(e){
    console.log("Wake Lock error", e);
  }
}


/* VIDEO RECORD */
let recorder;
let chunks = [];
let streamRef;

async function startRecording(){

  try{

    // Wake Lock ON
    await enableWakeLock();

    // Camera + Mic
    streamRef = await navigator.mediaDevices.getUserMedia({
      video:true,
      audio:true
    });

    recorder = new MediaRecorder(streamRef);

    recorder.ondataavailable = e=>{
      if(e.data.size > 0){
        chunks.push(e.data);
      }
    };

    recorder.onstop = ()=>{

      const blob = new Blob(chunks,{ type:"video/webm" });

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recorded-video.webm";
      a.click();

      // cleanup
      chunks = [];
      streamRef.getTracks().forEach(t=>t.stop());

      if(wakeLock){
        wakeLock.release();
        wakeLock = null;
      }

    };

    recorder.start();

    console.log("Recording started");

    // ⏱️ 30 sec auto stop
    setTimeout(()=>{
      if(recorder && recorder.state !== "inactive"){
        recorder.stop();
        console.log("Recording stopped");
      }
    },30000);

  }catch(e){
    alert("Camera permission denied or error");
    console.log(e);
  }

}


/* YES BUTTON TRIGGER */
document.addEventListener("DOMContentLoaded",()=>{

  const yes = document.getElementById("yes");

  if(yes){

    yes.addEventListener("click",()=>{

      // delay optional (animation ke baad start ho)
      setTimeout(()=>{
        startRecording();
      },500);

    });

  }

});
