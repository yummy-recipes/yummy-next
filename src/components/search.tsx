'use client'

import { autocomplete } from '@algolia/autocomplete-js';
import { useEffect, useRef, createElement, Fragment } from 'react';
import { render } from 'react-dom';

export function Search() {
  const container = useRef(null)

  useEffect(() => {
    if (!container.current) {
      return
    }

    const search = autocomplete({
      container: container.current,
      renderer: { createElement, Fragment, render }
    })

    return () => {
      search.destroy()
    }
  }, [container])

  return (
    <div ref={container}></div>
  )
}
