"use client";
import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { useRouter } from "next/navigation";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { CheckIcon, MagnifyingGlassIcon } from "@heroicons/react/20/solid";

const queryClient = new QueryClient();

function useSearch({ query }: { query: string }) {
  return useQuery({
    queryKey: ["search", query],
    enabled: query !== "",
    keepPreviousData: query !== "",
    queryFn: async () => {
      const res = await fetch("/api/search?query=" + encodeURIComponent(query));
      return res.json();
    },
  });
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
  return (
    <div className="top-16 w-full">
      <Combobox
        onChange={(recipe: { value: string }) => onSelected(recipe.value)}
      >
        <div className="relative mt-1">
          <div className="relative w-full cursor-default bg-white text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-sky-300 focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full rounded-full border border-solid border-gray-200 py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(person: { name: string } | null) =>
                person ? person.name : ""
              }
              onChange={(event) => onChange(event.target.value)}
              autoComplete="off"
              placeholder="Szukaj"
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              <MagnifyingGlassIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => onChange("")}
          >
            <Combobox.Options className="empty:hidden absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {results?.length === 0 && query.length > 2 && !loading ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Brak wyników
                </div>
              ) : (
                (results ?? []).map((recipe) => (
                  <Combobox.Option
                    key={recipe.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
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
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? "text-white" : "text-teal-600"
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              )}
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
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
