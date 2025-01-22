"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { MagnifyingGlassIcon, MicrophoneIcon } from "@heroicons/react/20/solid";

import { useWhisperWorker } from "./use-whisper-worker";
import { useAudioInput } from "./use-audio-input";
import styles from "./search.module.css";

const queryClient = new QueryClient();

function useSearch({ query }: { query: string }) {
  return useQuery({
    queryKey: ["search", query],
    enabled: query !== "",
    placeholderData: query !== "" ? [] : undefined,
    queryFn: async () => {
      const res = await fetch("/api/search?query=" + encodeURIComponent(query));
      return res.json();
    },
  });
}

const WHISPER_SAMPLING_RATE = 16_000;

async function isWebGPUSupported() {
  if (!("gpu" in navigator)) {
    return {
      supported: false,
      reason: "WebGPU is not supported on this browser.",
    };
  }

  try {
    // Attempt to request an adapter for WebGPU
    const adapter = await (navigator as any).gpu.requestAdapter();
    if (!adapter) {
      return {
        supported: false,
        reason:
          "WebGPU is not available due to platform restrictions or lack of hardware support.",
      };
    }

    // If we get an adapter, return success
    return { supported: true, reason: "WebGPU is supported and enabled." };
  } catch (error) {
    // If any error occurs, handle it gracefully
    return {
      supported: false,
      reason: `WebGPU initialization failed: ${(error as Error).message}`,
    };
  }
}

interface Props {
  query: string;
  onChange: (value: string) => void;
  onSelected: (value: string) => void;
  loading?: boolean;
  error?: string;
  results?: { id: string; label: string; url: string }[];
}

function SearchForm({
  query,
  onChange,
  onSelected,
  loading,
  error,
  results = [],
}: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const volumeBarRef = useRef<HTMLSpanElement>(null);
  const [isTranscriptionInProgress, setIsTranscriptionInProgress] =
    useState(false);
  const [isWebGPUAvailable, setIsWebGPUAvailable] = useState<boolean | null>(
    null,
  );

  const handleAudioLevel = (level: number) => {
    volumeBarRef.current?.style.setProperty(
      "--audio-level",
      `${(level * 100).toFixed(0)}%`,
    );
  };

  const { startRecording, blob } = useAudioInput({
    onAudioLevel: handleAudioLevel,
  });

  const { processAudio, loadModels, status, text } = useWhisperWorker();

  useEffect(() => {
    if (status === null) {
      loadModels();
    }
  }, [status]);

  useEffect(() => {
    if (blob && status === "ready" && isWebGPUAvailable !== null) {
      const audioContext = new AudioContext({
        sampleRate: WHISPER_SAMPLING_RATE,
      });

      processAudio(
        blob,
        audioContext,
        isWebGPUAvailable ? "webgpu" : undefined,
      );
    }
  }, [blob, status, isWebGPUAvailable]);

  const handleChange = (input: { value: string }) => {
    if (input) {
      searchInputRef.current?.blur();
      onSelected(input.value);
    }
  };

  useEffect(() => {
    isWebGPUSupported().then(({ supported }) => {
      setIsWebGPUAvailable(supported);
    });
  }, []);

  useEffect(() => {
    const trimmed = text.trim().replace(/\./g, "");
    if (trimmed.length > 0) {
      setIsTranscriptionInProgress(false);
      searchInputRef.current?.focus();
      onChange(trimmed);
    }
  }, [text]);

  const handleTranscribe = () => {
    setIsTranscriptionInProgress(true);
    startRecording();
  };

  return (
    <div className="top-16 w-full">
      <div className="w-full flex" suppressHydrationWarning>
        <div className="flex-grow">
          <Combobox<null | { value: string }>
            value={{ value: query }}
            onChange={handleChange}
            immediate
          >
            <div className="relative mt-1">
              <div className="relative w-full cursor-default bg-white text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-sky-300 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <button
                  onClick={() => handleTranscribe()}
                  className="absolute inset-y-0 left-0 flex items-center pl-2 pr-2"
                >
                  <span
                    ref={volumeBarRef}
                    className={[
                      "rounded-full overflow-hidden border border-transparent",
                      isTranscriptionInProgress
                        ? styles["border-animation"]
                        : null,
                      styles.volume,
                    ].join(" ")}
                  >
                    <MicrophoneIcon
                      className="h-5 w-5 text-inherit border border-transparent rounded-full relative z-10"
                      aria-label="Use microphone to dictate search query"
                    />
                  </span>
                </button>

                <ComboboxInput
                  ref={searchInputRef}
                  className="w-full rounded-full border border-solid border-gray-200 py-2 pl-10 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(person: { name: string } | null) =>
                    person ? person.name : ""
                  }
                  onChange={(event) => onChange(event.target.value)}
                  autoComplete="off"
                  placeholder="Szukaj"
                />
                <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </ComboboxButton>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => onChange("")}
              >
                <ComboboxOptions className="empty:hidden absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {results?.length === 0 && query.length > 2 && !loading ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Brak wyników
                    </div>
                  ) : (
                    (results ?? []).map((recipe) => (
                      <ComboboxOption
                        key={recipe.id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 px-4 ${
                            active ? "bg-teal-600 text-white" : "text-gray-900"
                          }`
                        }
                        value={recipe}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {recipe.label}
                            </span>
                          </>
                        )}
                      </ComboboxOption>
                    ))
                  )}
                </ComboboxOptions>
              </Transition>
            </div>
          </Combobox>
        </div>
      </div>
    </div>
  );
}

function SearchWidget({ onSelected }: { onSelected: (value: string) => void }) {
  const [query, setQuery] = useState("");

  const { status, data, error, isFetching } = useSearch({ query });

  return (
    <SearchForm
      query={query}
      onChange={(value) => setQuery(value)}
      onSelected={onSelected}
      loading={isFetching}
      results={data?.data ?? []}
    />
  );
}

export function Search() {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <SearchWidget onSelected={(url) => router.push(url)} />
    </QueryClientProvider>
  );
}
