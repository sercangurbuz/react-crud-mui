import { useLayoutEffect } from 'react';

/**
 * Scrolls the window to top whenever `key` changes (e.g. on route change).
 * Fixes react-router-dom keeping the previous page's scroll position when
 * navigating to a new route (browser doesn't reset scroll on pushState).
 */
function useScrollToTop(key: unknown) {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [key]);
}

export default useScrollToTop;
