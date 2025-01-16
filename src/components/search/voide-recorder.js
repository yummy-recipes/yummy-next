import { useEffect, useState } from "react";

import { useWhisper } from "./use-whisper";

export function VoiceRecorder({ enabled, onText, onReady }) {
  const [storedText, setStoredText] = useState("");
  const { status, text, startRecording, stopRecording, loadModels } =
    useWhisper();

  useEffect(() => {
    if (!text) {
      return;
    }

    const trimmedText = text.join("").trim();
    if (trimmedText.startsWith("[")) {
      return;
    }

    stopRecording();
    onText(text);
  }, [text]);

  useEffect(() => {
    if (enabled) {
      startRecording();
    }
  }, [enabled]);

  useEffect(() => {
    if (status === "ready") {
      onReady();
    }

    if (status === null) {
      loadModels();
    }
  }, [status, loadModels]);

  return null;
}
