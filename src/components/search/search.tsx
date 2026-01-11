"use client";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  Activity,
  useCallback,
} from "react";
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from "@headlessui/react";
import { useRouter } from "next/navigation";
import SpeechRecognition, {
  useSpeechRecognition as useSpeechRecognitionLib,
} from "react-speech-recognition";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { MagnifyingGlassIcon, MicrophoneIcon } from "@heroicons/react/20/solid";

import styles from "./search.module.css";
import { useCssProperty } from "./use-css-property";
import { useRecentlyViewed, RecentlyViewedRecipe } from "@/lib/use-recently-viewed";

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

interface Props {
  query: string;
  onChange: (value: string) => void;
  onSelected: (value: string, recipe: RecentlyViewedRecipe) => void;
  loading?: boolean;
  error?: string;
  results?: { id: string; label: string; url: string; recipe: RecentlyViewedRecipe }[];
}

const useSpeechRecognition = ({
  handleAudioLevel,
}: {
  handleAudioLevel: (level: number) => void;
}) => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognitionLib();

  const startRecordingFn = useCallback(() => {
    resetTranscript();
    SpeechRecognition.startListening({
      continuous: false,
      language: "pl-PL",
    });
  }, [resetTranscript]);

  const loadModelsFn = useCallback(() => {}, []);

  return {
    startRecording: startRecordingFn,
    loadModels: loadModelsFn,
    status: listening ? "listening" : "idle",
    text: transcript,
    browserSupportsSpeechRecognition: true,
  };
};

function SearchForm({
  query,
  onChange,
  onSelected,
  loading,
  error,
  results = [],
}: Props) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { ref: volumeBarRef, setProperty: setVolumeBarProperty } =
    useCssProperty();
  const [isTranscriptionInProgress, setIsTranscriptionInProgress] =
    useState(false);

  const handleAudioLevel = useCallback(
    (level: number) => {
      setVolumeBarProperty("--audio-level", `${(level * 100).toFixed(0)}%`);
    },
    [setVolumeBarProperty],
  );

  const { startRecording, loadModels, status, text } = useSpeechRecognition({
    handleAudioLevel,
  });

  const handleChange = (input: { value: string; recipe: RecentlyViewedRecipe } | null) => {
    if (input) {
      searchInputRef.current?.blur();
      onSelected(input.value, input.recipe);
    }
  };

  const trimmed = text.trim().replace(/\./g, "");

  if (trimmed.length === 0 && isTranscriptionInProgress) {
    setIsTranscriptionInProgress(false);
  }

  useEffect(() => {
    if (trimmed.length > 0) {
      searchInputRef.current?.focus();
      onChange(trimmed);
    }
  }, [trimmed, onChange]);

  const handleTranscribe = () => {
    setIsTranscriptionInProgress(true);
    startRecording();

    if (status === null) {
      loadModels();
    }
  };

  return (
    <div className="top-16 w-full">
      <div className="w-full flex" suppressHydrationWarning>
        <div className="flex-grow">
          <Combobox<null | { value: string; recipe: RecentlyViewedRecipe }>
            value={{ value: query, recipe: {} as RecentlyViewedRecipe }}
            onChange={handleChange}
            immediate
          >
            <div className="relative mt-1">
              <div className="relative w-full cursor-default bg-white text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-sky-300 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                <Activity mode="visible">
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
                </Activity>

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

function SearchWidget({ onSelected }: { onSelected: (value: string, recipe: RecentlyViewedRecipe) => void }) {
  const [query, setQuery] = useState("");

  const { status, data, error, isFetching } = useSearch({ query });

  const handleChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return (
    <SearchForm
      query={query}
      onChange={handleChange}
      onSelected={onSelected}
      loading={isFetching}
      results={data?.data ?? []}
    />
  );
}

export function Search() {
  const router = useRouter();
  const { addRecipe } = useRecentlyViewed();

  return (
    <QueryClientProvider client={queryClient}>
      <SearchWidget onSelected={(url, recipe) => {
        addRecipe(recipe);
        router.push(url);
      }} />
    </QueryClientProvider>
  );
}
