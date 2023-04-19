var WORKER_PATH = 'recorderWorker.js';

let video=document.querySelector("#video");

document.querySelector("#iniciar_grabacion").addEventListener("click",function(ev){
    navigator.mediaDevices.getUserMedia({audio:true,video:false})
    .then(record)
    .catch(err=> console.log(err));
})



let chunks=[];
function record(stream){
    //video.srcObject =stream;

    let options={
        Type:'audio/webm'
    };

    // if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')){
    //     options={
    //         mimeType:'video/webm;codecs=vp8'
    //     }

    // }

    let mediaRecorder=new MediaRecorder(stream,options); //creamos un objeto el cual graba el audio resivido 
    mediaRecorder.start(); //iniciar grabación 

    mediaRecorder.ondataavailable=function(e){
        //console.log(e.data)
        chunks.push(e.data) //cada vez se se tenga información disponible se guarda en el arreglo chunks 
    }

    mediaRecorder.onstop=function(){
        alert("finalizó la grabación");
        console.log(chunks)
        let blob=new Blob(chunks,{'type':"audio/mp3; codecs=0"});//indicamos el tipo de archivo que se va a crear 
        chunks=[];
        download(blob);
    }

    //setTimeout(()=>mediaRecorder.stop(),5000);
    document.querySelector("#detener_grabacion").addEventListener("click",function(ev){
        mediaRecorder.stop()
    })
}

function download(blob){
    let link = document.createElement("a");
    link.href=window.URL.createObjectURL(blob);
    link.setAttribute("download","audio.mp3");
    link.style.display="none";
    document.body.appendChild(link);
    
    link.click();
    link.remove();

}


    

