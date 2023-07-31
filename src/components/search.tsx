'use client'
import { Fragment, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import {
  useQuery,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
// import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

const queryClient = new QueryClient()

function useSearch({ query }: { query: string }) {
  return useQuery({
    queryKey: ['search', query],
    enabled: query !== '',
    queryFn: async () => {
      const res = await fetch('/api/search?query=' + encodeURIComponent(query));
      return res.json();
    },
  })
}

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
]

interface Props {
  query: string
  onChange: (value: string) => void
  loading?: boolean
  error?: string
  results?: { id: string, label: string, url: string }[]
}


function SearchForm({ query, onChange, loading, error, results = [] }: Props) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="top-16 w-72">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
            <Combobox.Input
              className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
              displayValue={(person: { name: string } | null) => person ? person.name : ''}
              onChange={(event) => onChange(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
              {/* <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              /> */}
              V
            </Combobox.Button>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => onChange('')}
          >
            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {results?.length === 0 && query !== '' ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nothing found.
                </div>
              ) : (
                (results ?? []).map((recipe) => (
                  <Combobox.Option
                    key={recipe.id}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-teal-600 text-white' : 'text-gray-900'
                      }`
                    }
                    value={recipe}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${selected ? 'font-medium' : 'font-normal'
                            }`}
                        >
                          {recipe.label}
                        </span>
                        {selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${active ? 'text-white' : 'text-teal-600'
                              }`}
                          >
                            {/* <CheckIcon className="h-5 w-5" aria-hidden="true" /> */}
                            V
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
  )
}

function SearchWidget() {
  const [query, setQuery] = useState('')

  const { status, data, error, isFetching } = useSearch({ query })

  return (
    <SearchForm
      query={query}
      onChange={(value) => setQuery(value)}
      loading={isFetching}
      results={data?.data ?? []}
    />
  )
}

export function Search() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchWidget />
    </QueryClientProvider>
  )
}
