import { useLocation } from 'react-router-dom';

import { match, MatchResult } from 'path-to-regexp';

export type SegmentModel = {
  key: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
};

function useMatchedSegmentIndex() {
  const { pathname } = useLocation();

  return (paths: string[]) => {
    const segments = paths.join('|');
    const urlMatch = match(`/:start*/:id/:tab(${segments})/:end*`);
    const matchResult = urlMatch(pathname) as MatchResult<{ tab: string }>;
    return paths.indexOf(matchResult.params?.tab);
  };
}

export default useMatchedSegmentIndex;
