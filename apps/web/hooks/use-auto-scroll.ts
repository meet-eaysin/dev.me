import React, { useEffect, useRef, useState } from 'react';

// How many pixels from the bottom of the container to enable auto-scroll
const ACTIVATION_THRESHOLD = 50;
// Minimum pixels of scroll-up movement required to disable auto-scroll
const MIN_SCROLL_UP_THRESHOLD = 10;

export function useAutoScroll(
  dependencies: React.DependencyList,
  externalRef?: React.RefObject<HTMLDivElement | null>,
) {
  const internalRef = useRef<HTMLDivElement | null>(null);
  const containerRef = externalRef || internalRef;
  const previousScrollTop = useRef<number | null>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  const scrollToBottom = React.useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef]);

  const handleScroll = React.useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

      const distanceFromBottom = Math.abs(
        scrollHeight - scrollTop - clientHeight,
      );

      const isScrollingUp = previousScrollTop.current
        ? scrollTop < previousScrollTop.current
        : false;

      const scrollUpDistance = previousScrollTop.current
        ? previousScrollTop.current - scrollTop
        : 0;

      const isDeliberateScrollUp =
        isScrollingUp && scrollUpDistance > MIN_SCROLL_UP_THRESHOLD;

      if (isDeliberateScrollUp) {
        setShouldAutoScroll(false);
      } else {
        const isScrolledToBottom = distanceFromBottom < ACTIVATION_THRESHOLD;
        setShouldAutoScroll(isScrolledToBottom);
      }

      previousScrollTop.current = scrollTop;
    }
  }, [containerRef]);

  const handleTouchStart = React.useCallback(() => {
    setShouldAutoScroll(false);
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      previousScrollTop.current = containerRef.current.scrollTop;
    }
  }, [containerRef]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [shouldAutoScroll, scrollToBottom, dependencies]);

  return {
    containerRef,
    scrollToBottom,
    handleScroll,
    shouldAutoScroll,
    handleTouchStart,
  };
}
