import { useState, useCallback } from "react";

interface Params {
  onAudioLevel: (level: number) => void;
}
export function useAudioInput({ onAudioLevel }: Params) {
  const [blob, setBlob] = useState<Blob | null>(null);
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

      const audioChunks: Blob[] = [];
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
      let lastAudio: number | null = null;

      const stopRecording = () => {
        mediaRecorder.stop();
        setIsRecording(false);
        onAudioLevel(0);
        localRecording = false;
      };

      const handle = setTimeout(() => {
        if (!localRecording) return;

        stopRecording();
      }, 3000);

      requestAnimationFrame(function checkAudio() {
        if (!localRecording) return;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        const maxData = dataArray.reduce((acc, v) => Math.max(acc, v), 0);

        onAudioLevel(maxData / 512);

        // Check if the audio is silent
        const isSilent = maxData < 10;
        if (isSilent) {
          if (lastAudio && Date.now() - lastAudio > 500) {
            stopRecording();
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
  }, []);

  return {
    blob,
    isRecording,
    startRecording,
  };
}
