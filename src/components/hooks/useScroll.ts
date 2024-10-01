import { useCallback } from 'react';
import { scroller } from 'react-scroll';

interface UseScrollOptions {
  scrollOptions?: object;
}

function useScroll({ scrollOptions }: UseScrollOptions) {
  const scrollTo = useCallback(
    (elem: string) => {
      scroller.scrollTo(elem, {
        duration: 800,
        delay: 0,
        smooth: 'easeInOutQuart',
        ...scrollOptions,
      });
    },
    [scrollOptions]
  );

  return scrollTo;
}

export default useScroll;
