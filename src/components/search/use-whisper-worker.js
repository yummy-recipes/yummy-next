import { useRef, useEffect, useState } from "react";

const WHISPER_SAMPLING_RATE = 16_000;
const MAX_AUDIO_LENGTH = 30; // seconds
const MAX_SAMPLES = WHISPER_SAMPLING_RATE * MAX_AUDIO_LENGTH;

export function useWhisperWorker() {
  const worker = useRef(null);
  const modelsLoaded = useRef(false);

  // Model loading and progress
  const [status, setStatus] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [text, setText] = useState("");
  const [tps, setTps] = useState(null);
  const [language, setLanguage] = useState("pl");

  // Processing
  const [isProcessing, setIsProcessing] = useState(false);
  const audioContextRef = useRef(null);

  // We use the `useEffect` hook to setup the worker as soon as the `App` component is mounted.
  useEffect(() => {
    if (!worker.current) {
      // Create the worker if it does not yet exist.
      worker.current = new Worker(new URL("./worker.js", import.meta.url), {
        type: "module",
      });
    }

    // Create a callback function for messages from the worker thread.
    const onMessageReceived = (e) => {
      switch (e.data.status) {
        case "loading":
          // Model file start load: add a new progress item to the list.
          setStatus("loading");
          setLoadingMessage(e.data.data);
          break;

        case "initiate":
          setProgressItems((prev) => [...prev, e.data]);
          break;

        case "progress":
          // Model file progress: update one of the progress items.
          setProgressItems((prev) =>
            prev.map((item) => {
              if (item.file === e.data.file) {
                return { ...item, ...e.data };
              }
              return item;
            }),
          );
          break;

        case "done":
          // Model file loaded: remove the progress item from the list.
          setProgressItems((prev) =>
            prev.filter((item) => item.file !== e.data.file),
          );
          break;

        case "ready":
          // Pipeline ready: the worker is ready to accept messages.
          setStatus("ready");
          // recorderRef.current?.start();
          break;

        case "start":
          {
            // Start generation
            setIsProcessing(true);

            // Request new data from the recorder
            // if (recorderRef.current.state === "recording") {
            //   recorderRef.current?.requestData();
            // }
          }
          break;

        case "update":
          {
            // Generation update: update the output text.
            const { tps } = e.data;
            setTps(tps);
          }
          break;

        case "complete":
          // Generation complete: re-enable the "Generate" button
          setIsProcessing(false);
          setText(e.data.output[0]);
          break;
      }
    };

    // Attach the callback function as an event listener.
    worker.current.addEventListener("message", onMessageReceived);

    // Define a cleanup function for when the component is unmounted.
    return () => {
      worker.current.removeEventListener("message", onMessageReceived);
    };
  }, []);

  const processAudio = async (blob, audioContext) => {
    const fileReader = new FileReader();

    fileReader.onloadend = async () => {
      const arrayBuffer = fileReader.result;
      const decoded = await audioContext.decodeAudioData(arrayBuffer);
      let audio = decoded.getChannelData(0);
      if (audio.length > MAX_SAMPLES) {
        // Get last MAX_SAMPLES
        audio = audio.slice(-MAX_SAMPLES);
      }

      worker.current.postMessage({
        type: "generate",
        data: { audio, language },
      });
    };
    fileReader.readAsArrayBuffer(blob);
  };

  // useEffect(() => {
  //   if (!recorderRef.current) return;
  //   if (!recording) return;
  //   if (isProcessing) return;
  //   if (status !== "ready") return;

  //   if (chunks.length > 0) {
  //     // Generate from data

  //     const fileReader = new FileReader();

  //     fileReader.onloadend = async () => {
  //       const arrayBuffer = fileReader.result;
  //       const decoded =
  //         await audioContextRef.current.decodeAudioData(arrayBuffer);
  //       let audio = decoded.getChannelData(0);
  //       if (audio.length > MAX_SAMPLES) {
  //         // Get last MAX_SAMPLES
  //         audio = audio.slice(-MAX_SAMPLES);
  //       }

  //       worker.current.postMessage({
  //         type: "generate",
  //         data: { audio, language },
  //       });
  //     };
  //     fileReader.readAsArrayBuffer(blob);
  //   } else {
  //     recorderRef.current?.requestData();
  //   }
  // }, [status, recording, isProcessing, chunks, language]);

  const loadModels = () => {
    if (modelsLoaded.current) return;

    console.log("Load models");
    modelsLoaded.current = true;
    worker.current.postMessage({ type: "load" });
  };

  return {
    status,
    loadingMessage,
    progressItems,
    text,
    tps,
    isProcessing,
    loadModels,
    processAudio,
  };
}
