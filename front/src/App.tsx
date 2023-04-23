import { useWhisper } from '@chengsokdara/use-whisper'

const App = () => {
    const {
      recording,
      speaking,
      transcribing,
      transcript,
      pauseRecording,
      startRecording,
      stopRecording,
    } = useWhisper({
      apiKey: "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",  // YOUR_OPEN_AI_TOKEN
      streaming: true,
      timeSlice: 1_000, // 1 second
      whisperConfig: {
        language: 'es',
      },
    })
  
    return (
      <div>
        <p>Recording: {recording}</p>
        <p>Speaking: {speaking}</p>
        <p>Transcribing: {transcribing}</p>
        <p>Transcribed Text: {transcript.text}</p>
        <button onClick={() => startRecording()}>Start</button>
        <button onClick={() => pauseRecording()}>Pause</button>
        <button onClick={() => stopRecording()}>Stop</button>
      </div>
    )
}

export default App