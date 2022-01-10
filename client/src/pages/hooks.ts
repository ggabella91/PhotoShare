import { useState, useRef, useCallback, useEffect } from 'react';

export const useLazyLoading = (isLoadingPostData: boolean) => {
  const [intersectionCounter, setIntersectionCounter] = useState(1);

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingPostData) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setIntersectionCounter(
            (intersectionCounter) => intersectionCounter + 1
          );
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingPostData]
  );

  return { intersectionCounter, lastElementRef };
};

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
