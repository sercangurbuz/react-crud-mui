import useHotKeysSingleScope from '../../hooks/useHotKeysSingleScope';
import useDetailPageHotKeys, { UseDetailPageHotKeysProps } from '../hooks/useDetailPageHotKeys';

type DetailPageShortCutsProps = UseDetailPageHotKeysProps;

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
