import { useCallback, useRef } from "react";

export function useCssProperty() {
  const ref = useRef<HTMLElement>(null);

  const setProperty = useCallback((propertyName: string, value: string) => {
    ref.current?.style.setProperty(propertyName, value);
  }, []);

  return { setProperty, ref };
}
