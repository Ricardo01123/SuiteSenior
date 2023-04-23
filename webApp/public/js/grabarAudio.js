const startBtn = document.getElementById("btn")
    const pauseBtn = document.getElementById("btn_pause")
    const stopBtn = document.getElementById("btn_stop")
    let chunks = []
    let localtext = ''
    let fullText = ''
    const apiKey = "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"
    const whisperApiEndpoint = 'https://api.openai.com/v1/audio/'
    const mode = 'transcriptions'

    let recorder;
    const encoder = new lamejs.Mp3Encoder(1, 44100, 96)
    let stream;

    const toWhisper = async (file) => {
        // Whisper only accept multipart/form-data currently
        const body = new FormData()
        body.append('file', file)
        body.append('model', 'whisper-1')
        body.append('language', 'es')
        const headers = {}
        headers['Content-Type'] = 'multipart/form-data'
        if (apiKey) {
          headers['Authorization'] = `Bearer ${apiKey}`
        }
        const response = await axios.post(whisperApiEndpoint + mode, body, {
          headers,
        })
        return response.data.text
    }

    const onDataAvailable = async (data) => {
      try {
        const buffer = await data.arrayBuffer()
        const mp3chunk = encoder.encodeBuffer(new Int16Array(buffer))
        chunks.push(mp3chunk)
        const file = new File(chunks, 'speech.mp3', {
          type: 'audio/mpeg',
        })
        const text = await toWhisper(file)
        console.log('onInterim', { text })
        localtext = text
        if (chunks.length > 30) {
            chunks = []
            fullText += " " + localtext
            console.log(fullText)
            localtext = ''
        }
      } catch (err) {
        console.error(err)
      }
    }

  const onStartStreaming = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      })
      const recorderConfig = {
        mimeType: 'audio/wav',
        numberOfAudioChannels: 1, // mono
        recorderType: StereoAudioRecorder,
        sampleRate: 44100, // Sample rate = 44.1khz
        timeSlice: 1000, // 1000 milisegundos
        type: 'audio',
        ondataavailable: onDataAvailable
      }
      recorder = new RecordRTC(
        stream,
        recorderConfig
      )
      recorder.startRecording()
    } catch (err) {
      console.error(err)
    }
  }

  async function onPauseResumeStreaming() {
    let state = await recorder.getState()
    if (state === "recording") {
        pauseBtn.innerHTML = "Reanudar"
        try {
            recorder.pauseRecording()
        } catch (err) {
            console.error(err)
        }
    } else if(state === "paused") {
        pauseBtn.innerHTML = "Pausa"
        try {
            recorder.resumeRecording()
        } catch (err) {
          console.error(err)
        }
    }
  }

  async function onStopStreaming() {
    let state = await recorder.getState()
    if (state === "recording" || state === "paused") {
        pauseBtn.innerHTML = "Pausa"
        try {
            recorder.stopRecording(async function() {
                let handle = await window.showSaveFilePicker({
                    suggestedName: 'audio',
                    types: [
                        {
                            description: "Web Media File",
                            accept: { "audio/webm": [".webm"] },
                        },
                    ]
                });
                const writable = await handle.createWritable();
                await writable.write(this.getBlob());
                await writable.close();
            });
            stream.stop()
            await new Promise(resolve => setTimeout(resolve, 5000));
        } catch (err) {
          console.error(err)
        }
    }
    if (localtext.length > 0) {
        fullText += " " + localtext
    }
    console.log(fullText)
    // Si van a querer guardar el fullText, debe ser aquí
    fullText = ""
    chunks = []
  }

  startBtn.addEventListener("click", onStartStreaming)
  pauseBtn.addEventListener("click", onPauseResumeStreaming)
  stopBtn.addEventListener("click", onStopStreaming)