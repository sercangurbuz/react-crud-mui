import useHotKeysSingleScope from '../../../hooks/useHotKeysSingleScope';
import useDetailPageHotKeys, { UseDetailPageHotKeysProps } from '../../hooks/useDetailPageHotKeys';

interface DetailPageShortCutsProps extends UseDetailPageHotKeysProps {}

/**
 * Dummy wrapper component for shortcut hook
 */
function DetailPageShortCuts(props: DetailPageShortCutsProps) {
  useDetailPageHotKeys({
    ...props,
  });
  useHotKeysSingleScope({ targetScope: props.scopes as string });
  return null;
}

export default DetailPageShortCuts;
