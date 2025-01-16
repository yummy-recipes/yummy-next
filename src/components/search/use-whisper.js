import { useRef, useEffect, useState } from "react";

const WHISPER_SAMPLING_RATE = 16_000;
const MAX_AUDIO_LENGTH = 30; // seconds
const MAX_SAMPLES = WHISPER_SAMPLING_RATE * MAX_AUDIO_LENGTH;

export function useWhisper() {
  const worker = useRef(null);
  const modelsLoaded = useRef(false);

  const recorderRef = useRef(null);

  const [enabled, setEnabled] = useState(false);

  // Model loading and progress
  const [status, setStatus] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [progressItems, setProgressItems] = useState([]);

  // Inputs and outputs
  const [text, setText] = useState("");
  const [tps, setTps] = useState(null);
  const [language, setLanguage] = useState("pl");

  // Processing
  const [recording, setRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [chunks, setChunks] = useState([]);
  const [stream, setStream] = useState(null);
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
          recorderRef.current?.start();
          break;

        case "start":
          {
            // Start generation
            setIsProcessing(true);

            // Request new data from the recorder
            if (recorderRef.current.state === "recording") {
              recorderRef.current?.requestData();
            }
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
          setText(e.data.output);
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

  useEffect(() => {
    if (!enabled) return;
    if (recorderRef.current) return; // Already set

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setStream(stream);

          recorderRef.current = new MediaRecorder(stream);
          audioContextRef.current = new AudioContext({
            sampleRate: WHISPER_SAMPLING_RATE,
          });

          recorderRef.current.onstart = () => {
            setRecording(true);
            setChunks([]);
          };
          recorderRef.current.ondataavailable = (e) => {
            if (e.data.size > 0) {
              setChunks((prev) => [...prev, e.data]);
            } else {
              // Empty chunk received, so we request new data after a short timeout
              setTimeout(() => {
                recorderRef.current.requestData();
              }, 25);
            }
          };

          recorderRef.current.onstop = () => {
            setRecording(false);
            const track = stream.getTracks()[0];
            track.stop();
          };

          recorderRef.current.start();
        })
        .catch((err) => console.error("The following error occurred: ", err));
    } else {
      console.error("getUserMedia not supported on your browser!");
    }

    return () => {
      recorderRef.current?.stop();
      recorderRef.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (!recorderRef.current) return;
    if (!recording) return;
    if (isProcessing) return;
    if (status !== "ready") return;

    if (chunks.length > 0) {
      // Generate from data
      const blob = new Blob(chunks, { type: recorderRef.current.mimeType });

      const fileReader = new FileReader();

      fileReader.onloadend = async () => {
        const arrayBuffer = fileReader.result;
        const decoded =
          await audioContextRef.current.decodeAudioData(arrayBuffer);
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
    } else {
      recorderRef.current?.requestData();
    }
  }, [status, recording, isProcessing, chunks, language]);

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
    language,
    setLanguage,
    isProcessing,
    loadModels,
    startRecording: () => {
      recorderRef.current?.stop();
      setEnabled(true);
    },
    stopRecording: () => recorderRef.current?.stop(),
  };
}
