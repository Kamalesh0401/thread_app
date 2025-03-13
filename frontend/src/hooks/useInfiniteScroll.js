import { useEffect, useRef } from "react";

export const useInfiniteScroll = (loadMore) => {
  const observerTarget = useRef(null);

  useEffect(() => {

    const currentTarget = observerTarget.current;
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const targetEntry = entries[0];
        if (targetEntry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(currentTarget);
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
        observer.disconnect();
      }
    };
  }, [loadMore]);

  return [observerTarget];
};
