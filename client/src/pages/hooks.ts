import { useState, useRef, useCallback } from 'react';

export const useLazyLoading = (isLoadingPostData: boolean) => {
  const [pageToFetch, setPageToFetch] = useState(1);

  const observer = useRef<IntersectionObserver>();

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingPostData) return;

      if (observer.current) {
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageToFetch((pageToFetch) => pageToFetch + 1);
        }
      });

      if (node) {
        observer.current.observe(node);
      }
    },
    [isLoadingPostData]
  );

  return { pageToFetch, lastElementRef };
};
