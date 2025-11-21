'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): [React.RefObject<Element>, IntersectionObserverEntry | undefined] {
  const { threshold = 0, root = null, rootMargin = '0%', freezeOnceVisible = false } = options;

  const elementRef = useRef<Element>(null);
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
  };

  useEffect(() => {
    const element = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !element) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, JSON.stringify(threshold), root, rootMargin, frozen]);

  return [elementRef, entry];
}