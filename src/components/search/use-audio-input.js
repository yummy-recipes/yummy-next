import { useState, useCallback } from "react";

export function useAudioInput({ onAudioLevel }) {
  const [blob, setBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const analyser = audioCtx.createAnalyser();

      // Connect stream with analyzer
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const audioChunks = [];
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, {
          type: mediaRecorder.mimeType,
        });
        setBlob(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      let localRecording = true;
      let lastAudio = null;

      const handle = setTimeout(() => {
        if (!localRecording) return;

        mediaRecorder.stop();
        setIsRecording(false);
        localRecording = false;
      }, 5000);

      requestAnimationFrame(function checkAudio() {
        if (!localRecording) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        const averageData =
          dataArray.reduce((a, b) => a + b) / dataArray.length;

        onAudioLevel(Math.min(1, (2 * averageData) / 256));

        // Check if the audio is silent
        const isSilent = averageData < 10;
        if (isSilent) {
          if (lastAudio && Date.now() - lastAudio > 500) {
            localRecording = false;
            mediaRecorder.stop();
            setIsRecording(false);
            clearTimeout(handle);
            return;
          }
        } else {
          lastAudio = Date.now();
        }

        requestAnimationFrame(checkAudio);
      });
    } catch (err) {
      console.error("Error accessing audio device:", err);
      alert("Could not start audio recording.");
    }
  });

  return {
    blob,
    isRecording,
    startRecording,
  };
}
